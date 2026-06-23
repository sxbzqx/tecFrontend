import { AxiosError } from "axios";

interface ApiErrorPayload {
  message?: string;
  Message?: string;
  errors?: Record<string, string[]>;
}

export function getApiErrorMessage(
  err: unknown,
  fallback = "Произошла ошибка. Попробуйте ещё раз.",
): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiErrorPayload | undefined;

    if (data?.message) return data.message;
    if (data?.Message) return data.Message;

    const firstFieldErrors = data?.errors && Object.values(data.errors)[0];
    if (firstFieldErrors?.[0]) return firstFieldErrors[0];
  }

  return fallback;
}