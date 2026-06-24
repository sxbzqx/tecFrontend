export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24; // 1 день
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 дней
export const isProd = process.env.NODE_ENV === "production";