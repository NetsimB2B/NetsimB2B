import { apiRequest } from "@/shared/api/httpClient";

export type ApiAccount = {
  cariNo: number;
  cariKodu: string;
  cariAdi: string;
  taxNumber: string | null;
  balance: number;
  availableCredit: number;
  overdueAmount: number;
  currency: string;
};

export type ApiCariTransaction = {
  id: string;
  cariNo: number;
  date: string;
  dueDate: string | null;
  document: string;
  documentType: "Fatura" | "Tahsilat" | "İade" | "Dekont" | "Çek";
  description: string | null;
  debit: number;
  credit: number;
  balanceAfter: number;
  status: "Açık" | "Kapalı" | "Vadesi Geçti" | "Kısmi";
  relatedInvoiceId: string | null;
};

// Aktif firma seçicisi tüm erişilebilir carileri listeler; tek bir X-Cari-No'ya
// bağlı değildir (bkz. backend ICurrentCompanyContext.AllowedCariNos).
export function fetchAccounts(): Promise<ApiAccount[]> {
  return apiRequest<ApiAccount[]>("/finance/accounts");
}

export function fetchTransactions(cariNo: number): Promise<ApiCariTransaction[]> {
  return apiRequest<ApiCariTransaction[]>("/finance/transactions", { headers: { "X-Cari-No": String(cariNo) } });
}
