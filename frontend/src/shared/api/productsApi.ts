import { apiRequest } from "@/shared/api/httpClient";

export type ApiProduct = {
  id: number;
  code: string;
  name: string;
  unit: string;
  category: string | null;
  brand: string | null;
  description: string | null;
  price: number | null;
  stock: number;
};

export type ApiProductQuery = {
  search?: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
  sort?: "name" | "price-asc" | "price-desc";
};

// Katalog küçük (netsim-dev'de 50 ürün) olduğu için MVP'de gerçek sayfalama yerine
// tek istekte geniş bir sayfa alınır; sayfalama halen frontend'de (client-side) yapılır.
const catalogPageSize = 500;

function buildQueryString(query: ApiProductQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.brand) params.set("brand", query.brand);
  if (query.inStock) params.set("inStock", "true");
  if (query.sort) params.set("sort", query.sort);
  params.set("pageSize", String(catalogPageSize));
  return params.toString();
}

export function fetchProducts(cariNo: number, query: ApiProductQuery = {}): Promise<ApiProduct[]> {
  return apiRequest<ApiProduct[]>(`/products?${buildQueryString(query)}`, {
    headers: { "X-Cari-No": String(cariNo) },
  });
}

export function fetchProduct(cariNo: number, id: number): Promise<ApiProduct> {
  return apiRequest<ApiProduct>(`/products/${id}`, {
    headers: { "X-Cari-No": String(cariNo) },
  });
}
