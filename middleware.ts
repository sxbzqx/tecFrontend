import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiBaseUrl } from "@/utils/config";

const ROUTE_PERMISSIONS: { [key: string]: string[] } = {
  "/admin": ["SuperAdmin"],
  "/biznesplan": ["SuperAdmin", "Admin"],
  "/workers": ["SuperAdmin", "Admin"],
  "/otdels": ["SuperAdmin", "Admin", "Worker"],
  "/chat": ["SuperAdmin", "Admin", "Worker"],
  "/documents": ["SuperAdmin", "Admin", "Worker"],
};

function getRoleFromToken(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    const payload = JSON.parse(jsonPayload);
    return (
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role ||
      null
    ); 
  } catch (error) {
    console.error("[Middleware] oшибка парсинга JWT токена:", error);
    return null;
  }
}

const API_URL = apiBaseUrl;
const isProd = process.env.NODE_ENV === "production";

async function tryRefreshTokens(refreshToken: string) {
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
    const accessToken = data.accessToken || data.AccessToken;
    const newRefreshToken = data.refreshToken || data.RefreshToken;

    if (!accessToken || !newRefreshToken) {
      console.warn("[Middleware] В ответе refresh нет токенов");
      return null;
    }

    const nextResponse = NextResponse.next();
    nextResponse.cookies.set("accessToken", accessToken, {
      path: "/",
      sameSite: "strict",
      secure: isProd,
      maxAge: 60 * 60 * 24,
    });
    nextResponse.cookies.set("refreshToken", newRefreshToken, {
      path: "/",
      sameSite: "strict",
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60,
    });

    return nextResponse;
  } catch (error) {
    console.error("[Middleware] Ошибка refresh:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const targetRoute = Object.keys(ROUTE_PERMISSIONS).find((route) =>
    pathname.startsWith(route),
  );

  if (targetRoute) {
    if (!accessToken && !refreshToken) {
      console.log(
        `[Middleware] Нет токенов. оступ к ${pathname} запрещен. На /login`,
      );
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!accessToken && refreshToken) {
      console.log(
        "[Middleware] Нет accessToken, есть refreshToken. Пробуем обновить...",
      );
      const refreshed = await tryRefreshTokens(refreshToken);
      if (refreshed) return refreshed;
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (accessToken) {
      const userRole = getRoleFromToken(accessToken);
      const allowedRoles = ROUTE_PERMISSIONS[targetRoute];

      if (!userRole) {
        console.log("[Middleware] AccessToken невалидный. Пробуем refresh...");
        if (refreshToken) {
          const refreshed = await tryRefreshTokens(refreshToken);
          if (refreshed) return refreshed;
        }
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (!allowedRoles.includes(userRole)) {
        console.log(
          `[Middleware] Пользователь ${userRole} не имеет доступа к ${pathname}.Перенаправляем на 403`,
        );
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }
  }

  if (accessToken && (pathname === "/login" || pathname === "/register")) {
    console.log(
      `[Middleware] Пользователь уже авторизован. еренаправляем с ${pathname} на /workers`,
    );
    const userRole = getRoleFromToken(accessToken);

    if (userRole === "Worker") {
      return NextResponse.redirect(new URL("/otdels", request.url));
    }
    return NextResponse.redirect(new URL("/workers", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
};
