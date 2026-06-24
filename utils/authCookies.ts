import { cookies } from "next/headers";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE, isProd } from "@/utils/authCookieConfig";

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    path: "/",
    sameSite: "strict",
    secure: isProd,
    maxAge: ACCESS_TOKEN_MAX_AGE,
    httpOnly: false,
  });

  cookieStore.set("refreshToken", refreshToken, {
    path: "/",
    sameSite: "strict",
    secure: isProd,
    maxAge: REFRESH_TOKEN_MAX_AGE,
    httpOnly: true,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

export async function getAccessTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value;
}