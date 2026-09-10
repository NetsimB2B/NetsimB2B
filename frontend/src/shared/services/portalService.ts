import { accountTransactions, accounts, invoices, quotes, seedOrders, shipments } from "@/mocks/portalData";
import { useCompanyContext } from "@/features/company-context/store";
import { fetchProduct, fetchProducts, type ApiProduct } from "@/shared/api/productsApi";
import { ApiError } from "@/shared/api/httpClient";
import type { Account, AccountTransaction, Invoice, Order, Product, Quote, Shipment } from "@/shared/types/portal";

// Netsim'de ürün görseli için güvenilir bir kaynak yok (bkz. docs/03-modules/ürünler.md
// madde 85); ürün hattına (kategoriye) göre sade bir yer tutucu simge gösterilir.
const categoryIcons: Record<string, string> = {
  Motorlar: "⚙️",
  Pompalar: "💧",
  Redüktörler: "🔩",
  Otomasyon: "📡",
  Rulmanlar: "⭕",
  Vanalar: "🔧",
  Elektrik: "🔌",
  Hidrolik: "🧰",
};

// Netsim satış birimi kodları (STOKBIRI.BIRIM) kullanıcıya kısaltma yerine tam adla
// gösterilir; listede olmayan kodlar olduğu gibi gösterilir.
const unitLabels: Record<string, string> = {
  AD: "Adet",
  MT: "Metre",
  KG: "Kilogram",
  LT: "Litre",
  PK: "Paket",
  KUTU: "Kutu",
};

function toProduct(item: ApiProduct): Product {
  const category = item.category ?? "Diğer";
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    category,
    brand: item.brand ?? "Diğer",
    unit: unitLabels[item.unit] ?? item.unit,
    description: item.description ?? "",
    price: item.price ?? 0,
    stock: item.stock,
    image: categoryIcons[category] ?? "📦",
  };
}

export type ProductQuery = {
  search?: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
  sort?: "name" | "price-asc" | "price-desc";
};

export type CheckoutInput = {
  deliveryAddress: string;
  paymentMethod: string;
  note?: string;
};

const delay = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms));

export const portalService = {
  async getAccounts(): Promise<Account[]> {
    await delay();
    return accounts;
  },

  async getAccountTransactions(accountId: number): Promise<AccountTransaction[]> {
    await delay();
    return accountTransactions
      .filter((item) => item.accountId === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getProducts(accountId: number, query: ProductQuery = {}): Promise<Product[]> {
    const items = await fetchProducts(accountId, query);
    return items.map(toProduct);
  },

  async getProduct(accountId: number, productId: number): Promise<Product | undefined> {
    try {
      const item = await fetchProduct(accountId, productId);
      return toProduct(item);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return undefined;
      throw error;
    }
  },

  async getOrders(accountId: number): Promise<Order[]> {
    await delay();
    return [...useCompanyContext.getState().orders, ...seedOrders]
      .filter((order) => order.accountId === accountId);
  },

  async createOrder(accountId: number, input: CheckoutInput): Promise<Order> {
    await delay(450);
    const state = useCompanyContext.getState();
    const lines = state.cartByAccount[accountId] ?? [];
    if (!lines.length) throw new Error("Sepetiniz boş.");

    const pricedProducts = await this.getProducts(accountId);
    const total = lines.reduce((sum, line) => {
      const product = pricedProducts.find((item) => item.id === line.productId);
      if (!product || product.stock < line.quantity) throw new Error("Sepette stok doğrulaması gereken ürün var.");
      const unitPrice = line.unitPrice ?? product.price;
      return sum + unitPrice * line.quantity;
    }, 0);
    const account = accounts.find((item) => item.id === accountId);
    if (!account || total > account.availableCredit) {
      throw new Error("Kullanılabilir cari limit bu sipariş için yeterli değil.");
    }
    const quoteId = lines.find((line) => line.quoteId)?.quoteId;

    const order: Order = {
      id: `B2B-2026-${String(3001 + state.orders.length).padStart(4, "0")}`,
      accountId,
      createdAt: new Date().toISOString(),
      status: "Alındı",
      lines,
      total,
      customerOrderNo: `WEB-${Date.now().toString().slice(-6)}`,
      expectedDeliveryDate: new Date(Date.now() + 3 * 86_400_000).toISOString(),
      salesRepresentative: "Selin Yılmaz",
      shippingMethod: "Netsim Lojistik",
      ...(quoteId ? { quoteId } : {}),
      deliveryAddress: input.deliveryAddress,
      paymentMethod: input.paymentMethod,
      note: input.note,
    };
    state.createOrder(order);
    state.clearCart(accountId);
    return order;
  },

  async getQuotes(accountId: number): Promise<Quote[]> {
    await delay();
    return quotes.filter((quote) => quote.accountId === accountId);
  },

  async getShipments(accountId: number): Promise<Shipment[]> {
    await delay();
    return shipments.filter((shipment) => shipment.accountId === accountId);
  },

  async getInvoices(accountId: number): Promise<Invoice[]> {
    await delay();
    return invoices.filter((invoice) => invoice.accountId === accountId);
  },
};
