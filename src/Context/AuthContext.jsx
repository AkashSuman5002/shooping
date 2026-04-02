import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const USERS_STORAGE_KEY = 'shopperUsers';
const CURRENT_USER_STORAGE_KEY = 'shopperCurrentUser';

const readStorageJSON = (key, fallback) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

const getRandomId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => readStorageJSON(USERS_STORAGE_KEY, []));
  const [currentUser, setCurrentUser] = useState(() => readStorageJSON(CURRENT_USER_STORAGE_KEY, null));
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, [currentUser]);

  const register = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!name.trim() || !normalizedEmail || !password) {
      throw new Error('All fields are required.');
    }

    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error('An account already exists for this email.');
    }

    const newUser = {
      id: getRandomId(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    setAuthError('');
    return newUser;
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = users.find((user) => user.email === normalizedEmail && user.password === password);

    if (!matchedUser) {
      throw new Error('Invalid email or password.');
    }

    setCurrentUser({ id: matchedUser.id, name: matchedUser.name, email: matchedUser.email });
    setAuthError('');
    return matchedUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    authError,
    setAuthError,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;