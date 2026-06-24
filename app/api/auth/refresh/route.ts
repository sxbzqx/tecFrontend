import { NextResponse } from "next/server";
import { apiBaseUrl } from "@/utils/config";
import { extractTokens } from "@/utils/tokens";
import {
  setAuthCookies,
  clearAuthCookies,
  getRefreshTokenCookie,
} from "@/utils/authCookies";

export async function POST() {
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Нет refresh-токена" },
      { status: 401 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshToken.trim() }),
    });
  } catch (error) {
    console.error("[api/auth/refresh] Не удалось связаться с backend:", error);
    return NextResponse.json({ message: "Сервер недоступен" }, { status: 502 });
  }

  if (!backendResponse.ok) {
    console.warn(
      "[api/auth/refresh] Backend отверг refresh-токен:",
      backendResponse.status,
    );
    await clearAuthCookies();
    return NextResponse.json({ message: "Refresh не прошёл" }, { status: 401 });
  }

  const data = await backendResponse.json().catch(() => ({}));
  const tokens = extractTokens(data);

  if (!tokens) {
    console.error(
      "[api/auth/refresh] Backend не вернул токены при refresh:",
      data,
    );
    await clearAuthCookies();
    return NextResponse.json(
      { message: "Backend не вернул токены" },
      { status: 502 },
    );
  }

  await setAuthCookies(tokens.accessToken, tokens.refreshToken);

  return NextResponse.json({ accessToken: tokens.accessToken });
}
