import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      return res.data.user;
    } catch (err: any) {
      console.error(err);
      throw err.response?.data?.error || 'Login failed';
    }
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    try {
      const res = await api.post('/auth/signup', { name, email, password, role });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      return res.data.user;
    } catch (err: any) {
      console.error(err);
      throw err.response?.data?.error || 'Signup failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
