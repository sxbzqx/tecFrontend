interface DecodedToken {
  role: string | null;
  loginName: string | null;
}

export function decodeAccessToken(token: string | undefined): DecodedToken {
  if (!token) return { role: null, loginName: null };
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = new TextDecoder().decode(
      Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
    );
    const payload = JSON.parse(jsonPayload);

    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role ||
      null;

    const loginName =
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      payload.unique_name ||
      payload.loginName ||
      null;

    return { role, loginName };
  } catch {
    return { role: null, loginName: null };
  }
}