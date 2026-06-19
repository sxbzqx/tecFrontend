import { $api } from "@/api/api";
import Cookies from "js-cookie";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  role?: string;
}

interface CurrentUser {
  role: string;
  loginName: string;
  department: string;
}

const isProd = process.env.NODE_ENV === "production";

function setAuthCookies(accessToken: string, refreshToken: string) {
  Cookies.set("accessToken", accessToken, {
    expires: 1,
    secure: isProd,
    sameSite: "strict",
    path: "/",
  });
  Cookies.set("refreshToken", refreshToken, {
    expires: 7,
    secure: isProd,
    sameSite: "strict",
    path: "/",
  });
}

export const authService = {
  async login(loginStr: string, passwordStr: string): Promise<TokenResponse> {
    const response = await $api.post<TokenResponse>("/auth/login", {
      login: loginStr,
      password: passwordStr,
    });

    const { accessToken, refreshToken } = response.data;
    if (accessToken && refreshToken) {
      setAuthCookies(accessToken, refreshToken);
    }
    return response.data;
  },

  async register(
    loginStr: string,
    passwordStr: string,
    mailStr: string,
    otdelId: string | number,
  ): Promise<TokenResponse> {
    await $api.post("/auth/register", {
      login: loginStr,
      password: passwordStr,
      mail: mailStr,
      otdelId: Number(otdelId),
    });

    return this.login(loginStr, passwordStr);
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken)
        await $api.post("/auth/logout", { refreshToken: refreshToken.trim() });
    } catch (err) {
      console.error("Ошибка при логауте:", err);
    } finally {
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      if (typeof window !== "undefined") window.location.href = "/login";
    }
  },

  async getCurrentUser(): Promise<CurrentUser | null> {
    try {
      const { data } = await $api.get("/auth/me");
      return {
        role: data.role || data.Role || "Worker",
        loginName: data.loginName || data.LoginName || "Сотрудник",
        department: data.department || data.Department || "Не указан",
      };
    } catch {
      return null;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await $api.post("/auth/change-password", { currentPassword, newPassword });
  },

  async changeLogin(newLogin: string, currentPassword: string): Promise<TokenResponse> {
    const response = await $api.post<TokenResponse>("/auth/change-login", {
      newLogin,
      currentPassword,
    });

    const data = response.data as any;
    const accessToken = data.accessToken || data.AccessToken;
    const refreshToken = data.refreshToken || data.RefreshToken;

    if (accessToken && refreshToken) {
      setAuthCookies(accessToken, refreshToken);
    }

    return response.data;
  },
};