import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [impersonation, setImpersonation] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const savedImpersonation = localStorage.getItem('impersonation');

    if (savedImpersonation) {
      setImpersonation(JSON.parse(savedImpersonation));
    }

    if (token) {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.data);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('impersonation');
        setUser(null);
        setImpersonation(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data.data;
      localStorage.setItem('token', token);
      setUser(userData);
      // Clear any previous impersonation on fresh login
      localStorage.removeItem('impersonation');
      setImpersonation(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', { name, email, password });
      const { token, ...userData } = response.data.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('impersonation');
    setUser(null);
    setImpersonation(null);
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      setUser(response.data.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed';
      return { success: false, error: message };
    }
  };

  // Admin impersonation - login as another user
  const loginAsUser = async (userId) => {
    try {
      setError(null);
      const response = await api.post(`/admin/login-as/${userId}`);
      const { token, ...userData } = response.data.data;

      // Store impersonation info
      if (userData.impersonation) {
        const impInfo = {
          isAdmin: true,
          adminId: userData.impersonation.adminId,
          adminName: userData.impersonation.adminName,
          adminEmail: userData.impersonation.adminEmail,
          adminToken: localStorage.getItem('token') // Save admin token
        };
        localStorage.setItem('impersonation', JSON.stringify(impInfo));
        setImpersonation(impInfo);
      }

      // Set the target user's token
      localStorage.setItem('token', token);
      setUser(userData);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to login as user';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Restore admin access after impersonation
  const restoreAdminAccess = () => {
    if (impersonation && impersonation.adminToken) {
      // Restore admin token
      localStorage.setItem('token', impersonation.adminToken);
      localStorage.removeItem('impersonation');
      setImpersonation(null);

      // Fetch admin user data
      checkAuth();

      return { success: true };
    }
    return { success: false, error: 'No impersonation session found' };
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    loginAsUser,
    restoreAdminAccess,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isImpersonating: !!impersonation,
    impersonation
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;