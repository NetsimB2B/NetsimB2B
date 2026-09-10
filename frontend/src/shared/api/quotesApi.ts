import { apiRequest } from "@/shared/api/httpClient";

export type ApiQuoteLine = {
  productId: number;
  quantity: number;
  unitPrice: number;
  listPrice: number;
};

export type ApiQuote = {
  id: string;
  reference: string | null;
  title: string;
  cariNo: number;
  createdAt: string;
  validUntil: string;
  status: "Geçerli" | "Süresi Doldu";
  salesRepresentative: string | null;
  paymentTerm: string | null;
  deliveryTerm: string | null;
  note: string | null;
  total: number;
  lines: ApiQuoteLine[];
};

export function fetchQuotes(cariNo: number): Promise<ApiQuote[]> {
  return apiRequest<ApiQuote[]>("/quotes", { headers: { "X-Cari-No": String(cariNo) } });
}
