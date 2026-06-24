import { NextRequest, NextResponse } from "next/server";
import { apiBaseUrl } from "@/utils/config";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.login || !body?.password || !body?.mail || body?.otdelId == null) {
    return NextResponse.json({ message: "Заполнены не все поля" }, { status: 400 });
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${apiBaseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: body.login,
        password: body.password,
        mail: body.mail,
        otdelId: Number(body.otdelId),
      }),
    });
  } catch (error) {
    console.error("[api/auth/register] Не удалось связаться с backend:", error);
    return NextResponse.json({ message: "Сервер недоступен" }, { status: 502 });
  }

  const data = await backendResponse.json().catch(() => ({}));

  return NextResponse.json(data, { status: backendResponse.status });
}