import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, userAPI } from '../services/api';
// Define the interface for the context value
export interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create and export the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create and export the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const response = await userAPI.getProfile();
          if (response.data.role === 'admin') {
            setIsAuthenticated(true);
            setUser(response.data);
            localStorage.setItem('admin_user', JSON.stringify(response.data));
          } else {
            throw new Error('Unauthorized: Admin access required');
          }
        } catch (e) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(email, password);
      
      if (response.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }
      
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));
      
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Login failed');
      setIsAuthenticated(false);
      setUser(null);
      throw err; // Re-throw the error so the component can catch it
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};