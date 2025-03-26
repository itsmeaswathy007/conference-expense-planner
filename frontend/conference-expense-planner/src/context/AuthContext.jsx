import React, { createContext, useState, useEffect } from "react";
import { fetchData } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (credentials) => {
    const response = await fetchData("auth/login", "POST", credentials);
    if (response.success) {
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
