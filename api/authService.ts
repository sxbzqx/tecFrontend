import { $api } from "@/api/api";
import Cookies from "js-cookie";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

const isProd = process.env.NODE_ENV === "production";

export const authService = {
  async login(loginStr: string, passwordStr: string): Promise<TokenResponse> {
    const response = await $api.post<TokenResponse>("/auth/login", {
      login: loginStr,
      password: passwordStr,
    });

    const { accessToken, refreshToken } = response.data; 

    if (accessToken && refreshToken) {
      Cookies.set("accessToken", accessToken, { expires: 1, secure: isProd, sameSite: "strict", path: "/" });
      Cookies.set("refreshToken", refreshToken, { expires: 7, secure: isProd, sameSite: "strict", path: "/" });
    }
    return response.data;
  },

  async register(loginStr: string, passwordStr: string, mailStr: string): Promise<TokenResponse> {
    await $api.post("/auth/register", { login: loginStr, password: passwordStr, mail: mailStr });
    return this.login(loginStr, passwordStr);
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) await $api.post("/auth/logout", { refreshToken: refreshToken.trim() });
    } catch (err) {
      console.error("Ошибка при логауте:", err);
    } finally {
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      if (typeof window !== "undefined") window.location.href = "/login";
    }
  },

  async getCurrentUser(): Promise<{ role: string; loginName: string } | null> {
    try {
      const { data } = await $api.get("/auth/me");
      return { 
        role: data.role || data.Role || "Worker", 
        loginName: data.loginName || data.LoginName || "Сотрудник" 
      };
    } catch {
      return null;
    }
  }
};