const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export const apiBaseUrl = rawApiUrl?.trim().replace(/\/$/, "");

export const backendUrl = (path: string) => `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
