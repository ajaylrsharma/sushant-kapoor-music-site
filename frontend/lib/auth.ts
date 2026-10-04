import backend from "~backend/client";

const TOKEN_KEY = "sk_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  try {
    const res = await backend.auth.login({ username, password });
    setToken(res.token);
    return true;
  } catch {
    return false;
  }
}

export function authedBackend() {
  const token = getToken();
  if (!token) return backend;
  return backend.with({ auth: { authorization: `Bearer ${token}` } });
}
