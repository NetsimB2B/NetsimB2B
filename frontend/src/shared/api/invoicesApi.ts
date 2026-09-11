import { apiRequest } from "@/shared/api/httpClient";

export type ApiInvoiceLine = {
  productId: number;
  quantity: number;
  unitPrice: number;
  taxRate: number;
};

export type ApiInvoice = {
  id: string;
  cariNo: number;
  createdAt: string;
  dueDate: string;
  status: "Ödendi" | "Açık" | "Vadesi Geçti";
  orderId: string | null;
  paymentTerm: string | null;
  description: string | null;
  total: number;
  taxExcluded: number;
  taxAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  lines: ApiInvoiceLine[];
};

export function fetchInvoices(cariNo: number): Promise<ApiInvoice[]> {
  return apiRequest<ApiInvoice[]>("/invoices", { headers: { "X-Cari-No": String(cariNo) } });
}
