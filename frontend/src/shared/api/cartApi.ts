import { apiRequest } from "@/shared/api/httpClient";
import type { CartLine } from "@/shared/types/portal";

type ApiCartLine = {
  stokNo: number;
  quantity: number;
  unitPrice: number | null;
  quoteId: string | null;
};

type AddCartLineInput = {
  stokNo: number;
  quantity: number;
  unitPrice?: number;
  quoteId?: string;
};

function toCartLine(item: ApiCartLine): CartLine {
  return {
    productId: item.stokNo,
    quantity: item.quantity,
    ...(item.unitPrice != null ? { unitPrice: item.unitPrice } : {}),
    ...(item.quoteId ? { quoteId: item.quoteId } : {}),
  };
}

function cariHeaders(cariNo: number): HeadersInit {
  return { "X-Cari-No": String(cariNo) };
}

export async function fetchCartLines(cariNo: number): Promise<CartLine[]> {
  const items = await apiRequest<ApiCartLine[]>("/cart", { headers: cariHeaders(cariNo) });
  return items.map(toCartLine);
}

export async function addCartLine(cariNo: number, input: AddCartLineInput): Promise<CartLine> {
  const item = await apiRequest<ApiCartLine>("/cart/lines", {
    method: "POST",
    headers: cariHeaders(cariNo),
    body: JSON.stringify(input),
  });
  return toCartLine(item);
}

export function updateCartLineQuantity(cariNo: number, stokNo: number, quantity: number): Promise<void> {
  return apiRequest<void>(`/cart/lines/${stokNo}`, {
    method: "PUT",
    headers: cariHeaders(cariNo),
    body: JSON.stringify({ quantity }),
  });
}

export function deleteCartLine(cariNo: number, stokNo: number): Promise<void> {
  return apiRequest<void>(`/cart/lines/${stokNo}`, { method: "DELETE", headers: cariHeaders(cariNo) });
}

export function clearServerCart(cariNo: number): Promise<void> {
  return apiRequest<void>("/cart", { method: "DELETE", headers: cariHeaders(cariNo) });
}
