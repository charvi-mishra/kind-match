import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Single source of truth for the API base path.
// In production: Nginx proxies /api → Node on port 5000 (same domain, no env var needed).
// In development: Vite dev server proxies /api → localhost:5000 (see vite.config.js).
// No VITE_API_URL env var required in either environment.
const API_BASE = '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken]     = useState(localStorage.getItem('kindmatch_token'));

  const fetchMe = async (currentToken) => {
    const t = currentToken ?? token;
    if (!t) { setLoading(false); return; }
    try {
      const res = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('kindmatch_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) { fetchMe(token); }
    else        { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const register = async (userData) => {
    const res = await axios.post(`${API_BASE}/auth/register`, userData);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('kindmatch_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  const login = async (credentials) => {
    const res = await axios.post(`${API_BASE}/auth/login`, credentials);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('kindmatch_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('kindmatch_token');
    setToken(null);
    setUser(null);
  };

  // Deep merge — nested objects like socialLinks are merged properly
  const updateUser = (updatedFields) => {
    setUser(prev => {
      if (!prev) return updatedFields;
      const merged = { ...prev };
      for (const key of Object.keys(updatedFields)) {
        if (
          updatedFields[key] !== null &&
          typeof updatedFields[key] === 'object' &&
          !Array.isArray(updatedFields[key]) &&
          typeof prev[key] === 'object' &&
          prev[key] !== null
        ) {
          merged[key] = { ...prev[key], ...updatedFields[key] };
        } else {
          merged[key] = updatedFields[key];
        }
      }
      return merged;
    });
  };

  const apiCall = async (method, endpoint, data = null) => {
    const currentToken = token || localStorage.getItem('kindmatch_token');
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: { Authorization: `Bearer ${currentToken}` },
    };
    if (data) config.data = data;
    const res = await axios(config);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{
      user, loading, token, register, login, logout, updateUser, apiCall, fetchMe,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
