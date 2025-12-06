const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

async function parseError(response: Response): Promise<never> {
  let message = `Request failed (${response.status})`;
  try {
    const payload = await response.json();
    if (typeof payload?.message === "string") {
      message = payload.message;
    } else if (typeof payload?.error === "string") {
      message = payload.error;
    }
  } catch {
    // ignore JSON parse errors
  }
  throw new Error(message);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    cache: "no-store",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    return parseError(response);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export { API_BASE_URL };
