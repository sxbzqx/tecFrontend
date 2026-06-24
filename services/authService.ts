import { $api } from "@/app/api/api";

interface CurrentUser {
  role: string;
  loginName: string;
  department: string;
}

interface ApiErrorPayload {
  message?: string;
  Message?: string;
  errors?: Record<string, string[]>;
}

function throwAsResponseError(data: ApiErrorPayload | null, status: number, fallback: string): never {
  throw Object.assign(new Error(data?.message || data?.Message || fallback), {
    response: { data: data ?? { message: fallback }, status },
  });
}

export const authService = {
  async login(loginStr: string, passwordStr: string): Promise<void> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: loginStr, password: passwordStr }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throwAsResponseError(data, response.status, "Неверный логин или пароль");
    }
  },

  async register(
    loginStr: string,
    passwordStr: string,
    mailStr: string,
    otdelId: string | number,
  ): Promise<void> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: loginStr,
        password: passwordStr,
        mail: mailStr,
        otdelId: Number(otdelId),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throwAsResponseError(data, response.status, "Произошла ошибка при регистрации");
    }

    await this.login(loginStr, passwordStr);
  },

  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Ошибка при логауте:", err);
    } finally {
      if (typeof window !== "undefined") window.location.href = "/";
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
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throwAsResponseError(data, response.status, "Не удалось изменить пароль");
    }
  },

  async changeLogin(newLogin: string, currentPassword: string): Promise<void> {
    const response = await fetch("/api/auth/change-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newLogin, currentPassword }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throwAsResponseError(data, response.status, "Не удалось изменить логин");
    }
  },
};