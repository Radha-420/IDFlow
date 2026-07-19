import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  // Let Vite proxy handle local API calls, and let Vercel handle production API calls natively
  axios.defaults.baseURL = import.meta.env.PROD ? '' : 'http://localhost:5000';
  
  useEffect(() => {
    // Check if user info is in localStorage on load
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Axios interceptor for 401 Unauthorized responses
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or role mismatch -> Force logout
          setUser(null);
          localStorage.removeItem('userInfo');
          // We don't want to spam toasts if they just load the page and fail auth silently
          if (window.location.pathname !== '/') {
            toast.error('Session expired or invalid. Please log in again.');
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const loginStudent = async (collegeId, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { collegeId, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/admin-login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Admin Logged in successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      localStorage.removeItem('userInfo');
      toast.info('Logged out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginStudent, loginAdmin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
