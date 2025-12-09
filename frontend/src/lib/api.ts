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
      
      // Check for expired JWT token
      if (message.includes("JWT expired") || message.includes("ExpiredJwtException")) {
        // Clear the stored session
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("rideshare-session");
          window.location.reload();
        }
        throw new Error("Your session has expired. Please login again.");
      }
    } else if (typeof payload?.error === "string") {
      message = payload.error;
    }
  } catch (error) {
    // If it's our custom error, re-throw it
    if (error instanceof Error && error.message === "Your session has expired. Please login again.") {
      throw error;
    }
    // Otherwise ignore JSON parse errors
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

  try {
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
  } catch (error) {
    // Handle network errors or JSON parsing issues
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error occurred");
  }
}

export { API_BASE_URL };
