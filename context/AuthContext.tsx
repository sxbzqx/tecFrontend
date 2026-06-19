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

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  initialAuth?: AuthState;
}> = ({ children, initialAuth }) => {
  const [auth, setAuth] = useState<AuthState>(initialAuth ?? { role: "Guest", loginName: "" });
  const [isMounted, setIsMounted] = useState(false);

  const refreshAuth = useCallback(async () => {
    if (Cookies.get("accessToken")) {
      const userData = await authService.getCurrentUser();
      setAuth(userData ?? { role: "Guest", loginName: "" });
    } else {
      setAuth({ role: "Guest", loginName: "" });
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    // Сервер уже знает роль из cookie — здесь только валидируем/синхронизируем
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
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};