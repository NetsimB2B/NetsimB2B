import { describe, expect, it } from "vitest";
import { authenticateMockUser, clearMockSession, isMockAuthenticated } from "./mockAuth";

describe("mock authentication", () => {
  it("accepts only the demo credentials", () => {
    expect(authenticateMockUser("demo@netsim.com", "Netsim123!")).toBe(true);
    expect(isMockAuthenticated()).toBe(true);

    clearMockSession();
    expect(authenticateMockUser("demo@netsim.com", "wrong")).toBe(false);
    expect(isMockAuthenticated()).toBe(false);
  });
});
