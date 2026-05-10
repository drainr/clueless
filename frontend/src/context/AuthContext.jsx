import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app load
  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (err) {
      // Token is invalid, clear it
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    try {
      const response = await authAPI.register(username, email, password);
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const loginAsGuest = async () => {
    setError(null);
    try {
      const response = await authAPI.guest();
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || 'Guest login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        loginAsGuest,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
