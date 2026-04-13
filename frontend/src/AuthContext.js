import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('railseva_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('railseva_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('railseva_token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('railseva_user');
    localStorage.removeItem('railseva_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
