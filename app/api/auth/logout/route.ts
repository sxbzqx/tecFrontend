import { NextResponse } from "next/server";
import { apiBaseUrl } from "@/utils/config";
import { clearAuthCookies, getRefreshTokenCookie } from "@/utils/authCookies";

export async function POST() {
  const refreshToken = await getRefreshTokenCookie();

  if (refreshToken) {
    try {
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshToken.trim() }),
      });
    } catch (error) {
      console.error(
        "[api/auth/logout] Не удалось оповестить backend о логауте:",
        error,
      );
    }
  }

  await clearAuthCookies();
  return NextResponse.json({ success: true });
}
