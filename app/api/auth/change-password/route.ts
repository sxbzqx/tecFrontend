import { NextRequest, NextResponse } from "next/server";
import { apiBaseUrl } from "@/utils/config";
import {
  getAccessTokenCookie,
  getRefreshTokenCookie,
} from "@/utils/authCookies";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.currentPassword || !body?.newPassword) {
    return NextResponse.json(
      { message: "Заполнены не все поля" },
      { status: 400 },
    );
  }

  const [accessToken, refreshToken] = await Promise.all([
    getAccessTokenCookie(),
    getRefreshTokenCookie(),
  ]);

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${apiBaseUrl}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
        currentRefreshToken: refreshToken,
      }),
    });
  } catch (error) {
    console.error(
      "[api/auth/change-password] Не удалось связаться с backend:",
      error,
    );
    return NextResponse.json({ message: "Сервер недоступен" }, { status: 502 });
  }

  const data = await backendResponse.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendResponse.status });
}
