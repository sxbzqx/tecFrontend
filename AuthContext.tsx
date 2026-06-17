"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { authService } from "@/services/authService";

interface AuthState {
  role: string;
  loginName: string;
}

interface AuthContextType {
  auth: AuthState;
  isMounted: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ role: "Guest", loginName: "" });
  const [isMounted, setIsMounted] = useState(false);

  const refreshAuth = useCallback(async () => {
    if (Cookies.get("accessToken")) {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setAuth(userData);
      } else {
        setAuth({ role: "Guest", loginName: "" });
      }
    } else {
      setAuth({ role: "Guest", loginName: "" });
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ auth, isMounted, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};