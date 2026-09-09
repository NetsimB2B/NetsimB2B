const mockSessionKey = "netsim-b2b:mock-session";

export const mockCredentials = {
  email: "demo@netsim.com",
  password: "Netsim123!",
  accountId: 1001,
} as const;

export function authenticateMockUser(email: string, password: string) {
  const isValid =
    email.trim().toLocaleLowerCase("tr-TR") === mockCredentials.email &&
    password === mockCredentials.password;

  if (isValid) {
    sessionStorage.setItem(mockSessionKey, "authenticated");
  }

  return isValid;
}

export function isMockAuthenticated() {
  return sessionStorage.getItem(mockSessionKey) === "authenticated";
}

export function clearMockSession() {
  sessionStorage.removeItem(mockSessionKey);
}
