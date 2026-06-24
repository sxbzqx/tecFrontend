import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiBaseUrl } from "@/utils/config";
import { decodeAccessToken } from "@/utils/jwt";
import { extractTokens, type TokenPair } from "@/utils/tokens";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE, isProd } from "@/utils/authCookieConfig";

const ROUTE_PERMISSIONS: { [key: string]: string[] } = {
  "/admin": ["SuperAdmin", "Admin"],
  "/biznesplan": ["SuperAdmin", "Admin"],
  "/workers": ["SuperAdmin", "Admin"],
  "/otdels": ["SuperAdmin", "Admin", "Worker"],
  "/chat": ["SuperAdmin", "Admin", "Worker"],
  "/documents": ["SuperAdmin", "Admin", "Worker"],
  "/profile": ["SuperAdmin", "Admin", "Worker"],
  "/bids": ["SuperAdmin", "Admin"],
};

const API_URL = apiBaseUrl;

async function tryRefreshTokens(refreshToken: string): Promise<TokenPair | null> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshToken.trim() }),
    });

    if (!response.ok) {
      console.warn("[Middleware] Refresh ответ не OK:", response.status);
      return null;
    }

    const data = await response.json();
    const tokens = extractTokens(data);

    if (!tokens) {
      console.warn("[Middleware] В ответе refresh нет токенов");
      return null;
    }

    return tokens;
  } catch (error) {
    console.error("[Middleware] Ошибка refresh:", error);
    return null;
  }
}

function applyTokens(
  request: NextRequest,
  response: NextResponse,
  tokens: TokenPair,
): NextResponse {
  request.cookies.set("accessToken", tokens.accessToken);
  request.cookies.set("refreshToken", tokens.refreshToken);

  response.cookies.set("accessToken", tokens.accessToken, {
    path: "/",
    sameSite: "strict",
    secure: isProd,
    httpOnly: false, // нужен клиенту для заголовка Authorization к внешнему backend
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set("refreshToken", tokens.refreshToken, {
    path: "/",
    sameSite: "strict",
    secure: isProd,
    httpOnly: true, // ключевое изменение: JS (и XSS) больше не прочитает refreshToken
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  return response;
}

function redirectTo(request: NextRequest, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const targetRoute = Object.keys(ROUTE_PERMISSIONS).find((route) =>
    pathname.startsWith(route),
  );

  if (targetRoute) {
    const allowedRoles = ROUTE_PERMISSIONS[targetRoute];
    const decoded = decodeAccessToken(accessToken);

    if (!decoded.isExpired && decoded.role) {
      if (!allowedRoles.includes(decoded.role)) {
        console.log(
          `[Middleware] Пользователь ${decoded.role} не имеет доступа к ${pathname}. Редирект на 403`,
        );
        return redirectTo(request, "/403");
      }
      return NextResponse.next();
    }

    if (!refreshToken) {
      console.log(
        `[Middleware] Нет валидных токенов. Доступ к ${pathname} запрещён. На /login`,
      );
      return redirectTo(request, "/login");
    }

    console.log("[Middleware] accessToken недействителен. Пробуем обновить...");
    const refreshed = await tryRefreshTokens(refreshToken);
    if (!refreshed) {
      return redirectTo(request, "/login");
    }

    const refreshedDecoded = decodeAccessToken(refreshed.accessToken);
    if (!refreshedDecoded.role) {
      console.warn("[Middleware] Бэкенд вернул нерабочий accessToken при refresh");
      return redirectTo(request, "/login");
    }

    if (!allowedRoles.includes(refreshedDecoded.role)) {
      console.log(
        `[Middleware] Пользователь ${refreshedDecoded.role} не имеет доступа к ${pathname} (после refresh). Редирект на 403`,
      );
      return applyTokens(request, redirectTo(request, "/403"), refreshed);
    }

    return applyTokens(request, NextResponse.next({ request }), refreshed);
  }

  if (pathname === "/login" || pathname === "/register") {
    const decoded = decodeAccessToken(accessToken);

    if (!decoded.isExpired && decoded.role) {
      console.log(
        `[Middleware] Пользователь ${decoded.loginName || "Сотрудник"} уже авторизован. Редирект с ${pathname} на главную`,
      );
      return redirectTo(request, "/");
    }

    if (refreshToken) {
      const refreshed = await tryRefreshTokens(refreshToken);
      if (refreshed) {
        return applyTokens(request, redirectTo(request, "/"), refreshed);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
};