import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import { randomBytes, randomUUID, pbkdf2Sync, timingSafeEqual } from 'crypto';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();
const dbFilePath = path.join(__dirname, 'data', 'db.json');

const port = process.env.PORT || 4000;
const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;

const app = express();
app.use(cors());
app.use(express.json());

async function readDb() {
  const raw = await fs.readFile(dbFilePath, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(db) {
  await fs.writeFile(dbFilePath, JSON.stringify(db, null, 2));
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  if (!storedPassword || !storedPassword.includes(':')) {
    return false;
  }

  const [salt, storedHash] = storedPassword.split(':');
  const hashBuffer = Buffer.from(pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex'), 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (hashBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashBuffer, storedBuffer);
}

function getPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified !== false,
  };
}

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendVerificationEmail({ email, name, code }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('SMTP is not configured. Email code delivery skipped.');
    return {
      delivered: false,
      reason: 'SMTP_NOT_CONFIGURED',
    };
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true';

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to: email,
      subject: 'Your Shopper verification code',
      text: `Hi ${name}, your verification code is ${code}. It expires in 10 minutes.`,
      html: `<p>Hi ${name},</p><p>Your verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
    });
  } catch (error) {
    console.warn('SMTP send failed:', error.message);
    return {
      delivered: false,
      reason: 'SMTP_SEND_FAILED',
    };
  }

  return {
    delivered: true,
    reason: null,
  };
}

async function findUserByToken(token) {
  const db = await readDb();
  return db.users.find((user) => user.token === token) || null;
}

async function requireAuth(request, response, next) {
  const authHeader = request.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return response.status(401).json({ message: 'Missing authorization token.' });
  }

  const user = await findUserByToken(token);
  if (!user) {
    return response.status(401).json({ message: 'Invalid or expired token.' });
  }

  request.authUser = user;
  next();
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.post('/api/auth/register', async (request, response) => {
  const { name, email, password } = request.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const trimmedName = String(name || '').trim();
  const plainPassword = String(password || '');

  if (!trimmedName || !normalizedEmail || !plainPassword) {
    return response.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const db = await readDb();
  const existingUser = db.users.find((user) => user.email === normalizedEmail);

  if (existingUser && existingUser.emailVerified !== false) {
    return response.status(409).json({ message: 'An account already exists for this email.' });
  }

  const hasActiveVerificationCode = Boolean(
    existingUser &&
    existingUser.emailVerified === false &&
    existingUser.verificationCode &&
    existingUser.verificationExpiresAt &&
    new Date(existingUser.verificationExpiresAt).getTime() > Date.now()
  );

  const verificationCode = hasActiveVerificationCode
    ? existingUser.verificationCode
    : generateVerificationCode();
  const verificationExpiresAt = hasActiveVerificationCode
    ? existingUser.verificationExpiresAt
    : new Date(Date.now() + VERIFICATION_CODE_TTL_MS).toISOString();

  let targetUser = existingUser;

  if (targetUser) {
    targetUser.name = trimmedName;
    targetUser.passwordHash = hashPassword(plainPassword);
    targetUser.verificationCode = verificationCode;
    targetUser.verificationExpiresAt = verificationExpiresAt;
    targetUser.emailVerified = false;
    targetUser.token = null;
  } else {
    targetUser = {
      id: randomUUID(),
      name: trimmedName,
      email: normalizedEmail,
      passwordHash: hashPassword(plainPassword),
      token: null,
      emailVerified: false,
      verificationCode,
      verificationExpiresAt,
      createdAt: new Date().toISOString(),
    };

    db.users.push(targetUser);
  }

  await writeDb(db);

  const emailResult = await sendVerificationEmail({
    email: normalizedEmail,
    name: trimmedName,
    code: verificationCode,
  });

  const isProduction = String(process.env.NODE_ENV || '').toLowerCase() === 'production';

  const payload = {
    requiresVerification: true,
    email: normalizedEmail,
    message: emailResult.delivered
      ? 'Verification code sent to your email.'
      : 'Email service is not configured on server. Contact admin to enable SMTP.',
  };

  if (!isProduction) {
    payload.devVerificationCode = verificationCode;
  }

  return response.status(201).json(payload);
});

app.post('/api/auth/verify-email', async (request, response) => {
  const { email, code } = request.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const verificationCode = String(code || '').trim();

  if (!normalizedEmail || !verificationCode) {
    return response.status(400).json({ message: 'Email and verification code are required.' });
  }

  const db = await readDb();
  const user = db.users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    return response.status(404).json({ message: 'No account found for this email.' });
  }

  if (user.emailVerified !== false) {
    return response.status(409).json({ message: 'Email is already verified. Please login.' });
  }

  if (!user.verificationCode || !user.verificationExpiresAt) {
    return response.status(400).json({ message: 'No verification code found. Please register again.' });
  }

  if (new Date(user.verificationExpiresAt).getTime() < Date.now()) {
    return response.status(400).json({ message: 'Verification code expired. Please sign up again.' });
  }

  if (user.verificationCode !== verificationCode) {
    return response.status(401).json({ message: 'Invalid verification code.' });
  }

  user.emailVerified = true;
  user.verificationCode = null;
  user.verificationExpiresAt = null;
  user.token = randomUUID();
  await writeDb(db);

  return response.json({
    user: getPublicUser(user),
    token: user.token,
  });
});

app.post('/api/auth/login', async (request, response) => {
  const { email, password } = request.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const plainPassword = String(password || '');

  if (!normalizedEmail || !plainPassword) {
    return response.status(400).json({ message: 'Email and password are required.' });
  }

  const db = await readDb();
  const user = db.users.find((entry) => entry.email === normalizedEmail);

  if (!user || !verifyPassword(plainPassword, user.passwordHash)) {
    return response.status(401).json({ message: 'Invalid email or password.' });
  }

  if (user.emailVerified === false) {
    return response.status(403).json({ message: 'Please verify your email before logging in.' });
  }

  user.token = randomUUID();
  await writeDb(db);

  return response.json({
    user: getPublicUser(user),
    token: user.token,
  });
});

app.get('/api/auth/me', requireAuth, (request, response) => {
  response.json({
    user: getPublicUser(request.authUser),
  });
});

app.post('/api/auth/logout', requireAuth, async (request, response) => {
  const db = await readDb();
  const user = db.users.find((entry) => entry.id === request.authUser.id);

  if (user) {
    user.token = null;
    await writeDb(db);
  }

  response.json({ message: 'Logged out.' });
});

app.post('/api/orders', requireAuth, async (request, response) => {
  const { customer, items, total, paymentMethod } = request.body;

  if (!customer || !Array.isArray(items) || typeof total !== 'number' || !paymentMethod) {
    return response.status(400).json({ message: 'Invalid order payload.' });
  }

  if (items.length === 0) {
    return response.status(400).json({ message: 'Order must include at least one item.' });
  }

  const db = await readDb();
  const order = {
    id: randomUUID(),
    userId: request.authUser.id,
    customer,
    items,
    total,
    paymentMethod,
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(order);
  await writeDb(db);

  response.status(201).json({ order });
});

app.get('/api/orders/me', requireAuth, async (request, response) => {
  const db = await readDb();
  const orders = db.orders.filter((order) => order.userId === request.authUser.id);
  response.json({ orders });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
