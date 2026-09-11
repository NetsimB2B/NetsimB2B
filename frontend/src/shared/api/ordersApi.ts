import { apiRequest } from "@/shared/api/httpClient";

export type ApiOrderLine = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

export type ApiOrder = {
  id: string;
  cariNo: number;
  createdAt: string;
  status: "Alındı" | "Onaylandı" | "Hazırlanıyor" | "Sevk Edildi";
  customerOrderNo: string | null;
  expectedDeliveryDate: string;
  salesRepresentative: string | null;
  shippingMethod: string | null;
  paymentMethod: string | null;
  note: string | null;
  quoteId: string | null;
  total: number;
  lines: ApiOrderLine[];
};

export function fetchOrders(cariNo: number): Promise<ApiOrder[]> {
  return apiRequest<ApiOrder[]>("/orders", { headers: { "X-Cari-No": String(cariNo) } });
}

export type CreateOrderPayload = {
  deliveryAddress?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  note?: string;
};

// Sepeti (B2B_CARTS) sunucu tarafında okuyup doğrulayarak gerçek bir SIPARIS yazar —
// satır/miktar/fiyat burada gönderilmez, backend zaten sunucudaki sepeti kullanır.
export function createOrder(cariNo: number, payload: CreateOrderPayload): Promise<ApiOrder> {
  return apiRequest<ApiOrder>("/orders", {
    method: "POST",
    headers: { "X-Cari-No": String(cariNo) },
    body: JSON.stringify(payload),
  });
}
