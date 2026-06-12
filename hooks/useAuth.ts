import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { authService } from "@/api/authService";

export function useAuth() {
  const [auth, setAuth] = useState({ role: "Guest", loginName: "" });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkAuth = async () => {
      if (Cookies.get("accessToken")) {
        const userData = await authService.getCurrentUser();
        if (userData) setAuth(userData);
      }
    };
    checkAuth();
  }, []);

  return { auth, isMounted };
}