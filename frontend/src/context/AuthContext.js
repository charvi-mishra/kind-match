import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('kindmatch_token'));

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem('kindmatch_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('kindmatch_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  const login = async (credentials) => {
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
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

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const apiCall = async (method, endpoint, data = null) => {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: { Authorization: `Bearer ${token}` }
    };
    if (data) config.data = data;
    const res = await axios(config);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{
      user, loading, token, register, login, logout, updateUser, apiCall
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
