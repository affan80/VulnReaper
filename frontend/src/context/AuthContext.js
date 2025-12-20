'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '../lib/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // You can optionally verify the token with the backend
      setUser({ token });
    }
    setLoading(false);
  };

  // Enhanced logout function with better error handling
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Function to handle authentication errors
  const handleAuthError = (error) => {
    console.error('Authentication error:', error);
    logout();
  };

  // Auto-logout on token expiration
  useEffect(() => {
    // Listen for storage events to handle logout from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token' && e.newValue === null) {
        setUser(null);
        router.push('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  const login = async (email, password) => {
    const data = await API.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await API.register(name, email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, isAuthenticated, handleAuthError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
