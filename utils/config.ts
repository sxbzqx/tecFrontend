const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export const apiBaseUrl = rawApiUrl?.trim().replace(/\/$/, "") || "http://10.0.4.37:5281/api";

export const backendUrl = (path: string) => `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
