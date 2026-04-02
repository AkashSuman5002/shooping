import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const CURRENT_USER_STORAGE_KEY = 'shopperCurrentUser';
const AUTH_TOKEN_STORAGE_KEY = 'shopperAuthToken';
const API_BASE_URL = '/api';

const readStorageJSON = (key, fallback) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => readStorageJSON(CURRENT_USER_STORAGE_KEY, null));
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authToken);
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  }, [authToken]);

  const register = async ({ name, email, password }) => {
    const data = await requestJson(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    setAuthError('');
    return data;
  };

  const verifyEmail = async ({ email, code }) => {
    const data = await requestJson(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });

    setCurrentUser(data.user);
    setAuthToken(data.token);
    setAuthError('');
    return data.user;
  };

  const login = async ({ email, password }) => {
    const data = await requestJson(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setCurrentUser(data.user);
    setAuthToken(data.token);
    setAuthError('');
    return data.user;
  };

  const logout = async () => {
    if (authToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } catch {
        // Clear local state even if the network request fails.
      }
    }

    setCurrentUser(null);
    setAuthToken('');
    setAuthError('');
  };

  const value = {
    currentUser,
    authToken,
    isAuthenticated: Boolean(currentUser && authToken),
    authError,
    setAuthError,
    register,
    verifyEmail,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
