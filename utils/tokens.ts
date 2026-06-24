interface BackendTokenPayload {
  accessToken?: string;
  AccessToken?: string;
  refreshToken?: string;
  RefreshToken?: string;
  [key: string]: unknown;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function extractTokens(data: BackendTokenPayload | null | undefined): TokenPair | null {
  if (!data) return null;

  const accessToken = data.accessToken || data.AccessToken;
  const refreshToken = data.refreshToken || data.RefreshToken;

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}