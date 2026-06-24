import { NextRequest, NextResponse } from "next/server";
import { apiBaseUrl } from "@/utils/config";
import { extractTokens } from "@/utils/tokens";
import { setAuthCookies, getAccessTokenCookie } from "@/utils/authCookies";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.newLogin || !body?.currentPassword) {
    return NextResponse.json({ message: "Заполнены не все поля" }, { status: 400 });
  }

  const accessToken = await getAccessTokenCookie();

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${apiBaseUrl}/auth/change-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        newLogin: body.newLogin,
        currentPassword: body.currentPassword,
      }),
    });
  } catch (error) {
    console.error("[api/auth/change-login] Не удалось связаться с backend:", error);
    return NextResponse.json({ message: "Сервер недоступен" }, { status: 502 });
  }

  const data = await backendResponse.json().catch(() => ({}));

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  const tokens = extractTokens(data);
  if (tokens) {
    await setAuthCookies(tokens.accessToken, tokens.refreshToken);
  }

  return NextResponse.json({ success: true });
}