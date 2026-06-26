const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function clearToken(): void {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

async function authRequest(path: string, body: { username: string; password: string }) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail ?? `HTTP ${res.status}`);
  return data as { access_token: string; token_type: string };
}

export async function loginRequest(username: string, password: string): Promise<string> {
  const data = await authRequest("/auth/login", { username, password });
  return data.access_token;
}

export async function registerRequest(username: string, password: string): Promise<string> {
  const data = await authRequest("/auth/register", { username, password });
  return data.access_token;
}
