import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './Axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const refreshUserData = useCallback(async (silent = false) => {
    try {
      const { data } = await api.get('users/me/');
      const userData = {
        user_id: data.user_id,
        email: data.email,
        user_role: data.user_role,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      if(!silent){
      logout();
      }
      return false;
    }
  }, [logout]);

  const login = useCallback(async ({ access, refresh }) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    await refreshUserData();
  }, [refreshUserData]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await refreshUserData();
      }
      setLoading(false);
    };
    initializeAuth();
  }, [refreshUserData]);

 /* return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );*/

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
  
}

export function useAuth() {
  return useContext(AuthContext);
}
  

