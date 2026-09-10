import { apiRequest } from "@/shared/api/httpClient";

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
};

export type SessionAccount = {
  cariNo: number;
  cariKodu: string;
  cariAdi: string;
  isDefault: boolean;
};

export type UserSession = {
  user: SessionUser;
  accounts: SessionAccount[];
  defaultCariNo: number;
};

export function login(email: string, password: string): Promise<UserSession> {
  return apiRequest<UserSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout(): Promise<void> {
  return apiRequest<void>("/auth/logout", { method: "POST" });
}

export function fetchMe(): Promise<UserSession> {
  return apiRequest<UserSession>("/auth/me");
}
