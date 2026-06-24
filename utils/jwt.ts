interface JwtPayload {
  [key: string]: unknown;
  exp?: number;
}

export interface DecodedToken {
  /** null, если токена нет, он не парсится или просрочен */
  role: string | null;
  /** null, если токена нет, он не парсится или просрочен */
  loginName: string | null;
  /** true, если токена нет, он не парсится или его exp уже прошёл */
  isExpired: boolean;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = new TextDecoder().decode(
      Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)),
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * exp в JWT — это секунды (NumericDate), Date.now() — миллисекунды.
 * Если exp отсутствует или не число — считаем токен непригодным (fail-safe).
 */
function isExpired(payload: JwtPayload | null): boolean {
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp * 1000 <= Date.now();
}

export function decodeAccessToken(token: string | undefined): DecodedToken {
  if (!token) return { role: null, loginName: null, isExpired: true };

  const payload = decodeJwtPayload(token);
  const expired = isExpired(payload);

  if (!payload || expired) {
    return { role: null, loginName: null, isExpired: true };
  }

  const role =
    (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string) ||
    (payload.role as string) ||
    null;

  const loginName =
    (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string) ||
    (payload.unique_name as string) ||
    (payload.loginName as string) ||
    null;

  return { role, loginName, isExpired: false };
}