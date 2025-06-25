import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, passwordConfirm: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to validate token and auto-logout if invalid
  const validateToken = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      // Make a simple authenticated request to validate token
      await apiService.getUserRooms();
      return true;
    } catch (error) {
      console.log('Token validation failed, logging out...');
      await logout();
      return false;
    }
  };

  // Set up periodic token validation (every 5 minutes) - only for authenticated users
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        validateToken();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Validate token on app start
          const isValid = await validateToken();
          if (!isValid) {
            setUser(null);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.clear();
        }
      } else if (refreshToken) {
        try {
          const response = await apiService.refreshToken(refreshToken);
          if (response.data) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            if (response.data.user) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          localStorage.clear();
        }
      }
      
      // Always finish loading, even for anonymous users
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await apiService.login({ email, password });
      
      setUser(response.data.user);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response: AuthResponse = await apiService.register({ email, password, name });
      
      setUser(response.data.user);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      localStorage.clear();
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await apiService.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string, passwordConfirm: string) => {
    try {
      await apiService.resetPassword(token, { password, passwordConfirm });
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAnonymous: !user, // True when user is not logged in
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};