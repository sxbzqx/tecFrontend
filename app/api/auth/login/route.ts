import { NextRequest, NextResponse } from "next/server";
import { apiBaseUrl } from "@/utils/config";
import { extractTokens } from "@/utils/tokens";
import { setAuthCookies } from "@/utils/authCookies";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.login || !body?.password) {
    return NextResponse.json({ message: "Логин и пароль обязательны" }, { status: 400 });
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: body.login, password: body.password }),
    });
  } catch (error) {
    console.error("[api/auth/login] Не удалось связаться с backend:", error);
    return NextResponse.json({ message: "Сервер недоступен" }, { status: 502 });
  }

  const data = await backendResponse.json().catch(() => ({}));

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  const tokens = extractTokens(data);
  if (!tokens) {
    console.error("[api/auth/login] Backend не вернул токены:", data);
    return NextResponse.json({ message: "Backend не вернул токены" }, { status: 502 });
  }

  await setAuthCookies(tokens.accessToken, tokens.refreshToken);

  return NextResponse.json({ role: data.role ?? data.Role ?? null });
}