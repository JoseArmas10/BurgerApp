import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          // First set user from localStorage immediately
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          
          // Then try to verify token with backend
          try {
            const userData = await userService.getProfile();
            
            // Handle different response structures
            let verifiedUser = null;
            if (userData.user) {
              verifiedUser = userData.user;
            } else if (userData.data && userData.data.user) {
              verifiedUser = userData.data.user;
            } else if (userData.data) {
              verifiedUser = userData.data;
            } else {
              verifiedUser = userData;
            }
            
            if (verifiedUser && verifiedUser.email) {
              setCurrentUser(verifiedUser);
              localStorage.setItem('user', JSON.stringify(verifiedUser));
            }
          } catch (error) {
            // If verification fails but we have a saved user, keep them logged in
            // Only logout if the error is specifically about invalid token
            if (error.status === 401 || error.response?.status === 401) {
              authService.logout();
              setCurrentUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      setCurrentUser(response.user);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // If registration is successful, try to log in automatically
      if (response.user) {
        setCurrentUser(response.user);
      }
      
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const response = await userService.updateProfile(userData);
      setCurrentUser(response.user);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await userService.changePassword(passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await authService.resetPassword(token, password);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated() && currentUser !== null;
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
