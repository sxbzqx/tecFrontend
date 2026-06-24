interface ApiErrorPayload {
  message?: string;
  Message?: string;
  errors?: Record<string, string[]>;
}

interface ErrorWithResponse {
  response?: {
    data?: ApiErrorPayload;
  };
}

function hasResponseData(err: unknown): err is ErrorWithResponse {
  return typeof err === "object" && err !== null && "response" in err;
}

export function getApiErrorMessage(
  err: unknown,
  fallback = "Произошла ошибка. Попробуйте ещё раз.",
): string {
  if (hasResponseData(err)) {
    const data = err.response?.data;

    if (data?.message) return data.message;
    if (data?.Message) return data.Message;

    const firstFieldErrors = data?.errors && Object.values(data.errors)[0];
    if (firstFieldErrors?.[0]) return firstFieldErrors[0];
  }

  return fallback;
}