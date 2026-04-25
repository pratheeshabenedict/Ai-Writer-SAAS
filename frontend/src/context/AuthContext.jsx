import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while checking session
  const [error, setError]     = useState(null);

  // On mount: silently try to refresh the access token
  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAPI.refreshToken();
        localStorage.setItem('accessToken', data.accessToken);
        // Fetch full user profile
        const { data: me } = await authAPI.getMe();
        setUser(me);
      } catch {
        setUser(null);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setError(null);
    const { data } = await authAPI.register({ name, email, password });
    return data; // { message: 'Registered! Check email.' }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setError(null);
    const { data } = await authAPI.forgotPassword(email);
    return data;
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    setError(null);
    const { data } = await authAPI.resetPassword(token, password);
    return data;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, setError, register, login, logout, forgotPassword, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};