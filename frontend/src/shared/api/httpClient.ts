const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5080/api";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.text();
    // Backend doğrulama hataları { message: "..." } şeklinde JSON döner (bkz.
    // OrderEndpoints/CartEndpoints → Results.BadRequest); okunabilir mesajı çıkar,
    // JSON değilse (örn. framework'ün ürettiği ham 500 body'si) olduğu gibi kullan.
    let message = body;
    try {
      const parsed = JSON.parse(body);
      if (typeof parsed?.message === "string") message = parsed.message;
    } catch {
      // JSON değil, body olduğu gibi kullanılır.
    }
    throw new ApiError(response.status, message);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

