import { describe, expect, it } from "vitest";
import { portalService } from "./portalService";

describe("portal service", () => {
  it("filters products by search and stock", async () => {
    const result = await portalService.getProducts(1001, { search: "motor", inStock: true });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((product) => product.stock > 0)).toBe(true);
    expect(result.some((product) => product.code === "MTR-001")).toBe(true);
  });

  it("returns account-specific prices", async () => {
    const accountA = await portalService.getProduct(1001, 1);
    const accountB = await portalService.getProduct(1002, 1);

    expect(accountA).toBeDefined();
    expect(accountB?.price).toBeGreaterThan(accountA?.price ?? 0);
  });
});
