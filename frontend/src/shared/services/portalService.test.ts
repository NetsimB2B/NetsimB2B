import { describe, expect, it, vi } from "vitest";
import { portalService } from "./portalService";
import * as productsApi from "@/shared/api/productsApi";
import { ApiError } from "@/shared/api/httpClient";
import type { ApiProduct } from "@/shared/api/productsApi";

const motor: ApiProduct = {
  id: 1,
  code: "MTR-001",
  name: "Trifaze Elektrik Motoru 2.2 kW",
  unit: "AD",
  category: "Motorlar",
  brand: "Voltix",
  description: "Yüksek verimli, IP55 koruma sınıflı endüstriyel motor.",
  price: 12_450,
  stock: 125,
};

describe("portal service - products adapter", () => {
  it("forwards the query to the products API and maps the response to the portal Product shape", async () => {
    const fetchProductsSpy = vi.spyOn(productsApi, "fetchProducts").mockResolvedValue([motor]);

    const result = await portalService.getProducts(1001, { search: "motor", inStock: true });

    expect(fetchProductsSpy).toHaveBeenCalledWith(1001, { search: "motor", inStock: true });
    expect(result).toEqual([{
      id: 1,
      code: "MTR-001",
      name: "Trifaze Elektrik Motoru 2.2 kW",
      category: "Motorlar",
      brand: "Voltix",
      unit: "Adet",
      description: motor.description,
      price: 12_450,
      stock: 125,
      image: "⚙️",
    }]);
  });

  it("resolves a single product by id via the account's active cari", async () => {
    const fetchProductSpy = vi.spyOn(productsApi, "fetchProduct").mockResolvedValue(motor);

    const result = await portalService.getProduct(1001, 1);

    expect(fetchProductSpy).toHaveBeenCalledWith(1001, 1);
    expect(result?.code).toBe("MTR-001");
  });

  it("returns undefined when the product does not exist (404)", async () => {
    vi.spyOn(productsApi, "fetchProduct").mockRejectedValue(new ApiError(404, "not found"));

    const result = await portalService.getProduct(1001, 999);

    expect(result).toBeUndefined();
  });
});
