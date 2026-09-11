import { useCompanyContext } from "@/features/company-context/store";
import { fetchAccounts, fetchTransactions, type ApiAccount, type ApiCariTransaction } from "@/shared/api/financeApi";
import { fetchInvoices, type ApiInvoice } from "@/shared/api/invoicesApi";
import { createOrder as postOrder, fetchOrders, type ApiOrder } from "@/shared/api/ordersApi";
import { fetchProduct, fetchProducts, type ApiProduct } from "@/shared/api/productsApi";
import { fetchQuotes, type ApiQuote } from "@/shared/api/quotesApi";
import { fetchShipments, type ApiShipment } from "@/shared/api/shipmentsApi";
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

function toAccount(item: ApiAccount): Account {
  return {
    id: item.cariNo,
    name: item.cariAdi,
    code: item.cariKodu,
    balance: item.balance,
    availableCredit: item.availableCredit,
    overdueAmount: item.overdueAmount,
    currency: "TRY",
    taxNumber: item.taxNumber ?? undefined,
  };
}

function toTransaction(item: ApiCariTransaction): AccountTransaction {
  return {
    id: item.id,
    accountId: item.cariNo,
    date: item.date,
    dueDate: item.dueDate ?? undefined,
    document: item.document,
    documentType: item.documentType,
    description: item.description ?? "",
    debit: item.debit,
    credit: item.credit,
    balanceAfter: item.balanceAfter,
    status: item.status,
    relatedInvoiceId: item.relatedInvoiceId ?? undefined,
  };
}

function toQuote(item: ApiQuote): Quote {
  return {
    id: item.id,
    accountId: item.cariNo,
    title: item.title,
    reference: item.reference ?? "—",
    createdAt: item.createdAt,
    validUntil: item.validUntil,
    status: item.status,
    salesRepresentative: item.salesRepresentative ?? "Belirtilmemiş",
    paymentTerm: item.paymentTerm ?? "Belirtilmemiş",
    deliveryTerm: item.deliveryTerm ?? "Belirtilmemiş",
    note: item.note ?? undefined,
    total: item.total,
    lines: item.lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      listPrice: line.listPrice,
    })),
  };
}

function toOrder(item: ApiOrder): Order {
  return {
    id: item.id,
    accountId: item.cariNo,
    createdAt: item.createdAt,
    status: item.status,
    lines: item.lines.map((line) => ({ productId: line.productId, quantity: line.quantity, unitPrice: line.unitPrice })),
    total: item.total,
    customerOrderNo: item.customerOrderNo ?? undefined,
    expectedDeliveryDate: item.expectedDeliveryDate,
    salesRepresentative: item.salesRepresentative ?? "Belirtilmemiş",
    shippingMethod: item.shippingMethod ?? undefined,
    quoteId: item.quoteId ?? undefined,
    paymentMethod: item.paymentMethod ?? "Belirtilmemiş",
    note: item.note ?? undefined,
  };
}

function toInvoice(item: ApiInvoice): Invoice {
  return {
    id: item.id,
    accountId: item.cariNo,
    date: item.createdAt,
    dueDate: item.dueDate,
    total: item.total,
    status: item.status,
    orderId: item.orderId ?? undefined,
    paymentTerm: item.paymentTerm ?? "Belirtilmemiş",
    paidAmount: item.paidAmount,
    remainingAmount: item.remainingAmount,
    taxExcluded: item.taxExcluded,
    taxAmount: item.taxAmount,
    currency: "TRY",
    description: item.description ?? "—",
    lines: item.lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      taxRate: line.taxRate,
    })),
  };
}

function toShipment(item: ApiShipment): Shipment {
  return {
    id: item.id,
    accountId: item.cariNo,
    orderId: item.orderId ?? undefined,
    date: item.date,
    status: item.status,
    carrier: item.carrier ?? undefined,
    trackingNo: item.trackingNo ?? undefined,
    estimatedDelivery: item.estimatedDelivery,
    deliveredAt: item.deliveredAt ?? undefined,
    origin: item.origin ?? undefined,
    destination: item.destination ?? undefined,
    vehiclePlate: item.vehiclePlate ?? undefined,
    driverName: item.driverName ?? undefined,
    events: item.events.map((event) => ({
      date: event.date,
      title: event.title,
      location: event.location ?? undefined,
      completed: event.completed,
    })),
  };
}

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
  shippingMethod?: string;
  note?: string;
};

export const portalService = {
  async getAccounts(): Promise<Account[]> {
    const items = await fetchAccounts();
    return items.map(toAccount);
  },

  async getAccountTransactions(accountId: number): Promise<AccountTransaction[]> {
    const items = await fetchTransactions(accountId);
    return items.map(toTransaction);
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
    const items = await fetchOrders(accountId);
    return items.map(toOrder);
  },

  async createOrder(accountId: number, input: CheckoutInput): Promise<Order> {
    const item = await postOrder(accountId, {
      deliveryAddress: input.deliveryAddress,
      paymentMethod: input.paymentMethod,
      shippingMethod: input.shippingMethod,
      note: input.note,
    });
    useCompanyContext.getState().clearCart(accountId);
    return toOrder(item);
  },

  async getQuotes(accountId: number): Promise<Quote[]> {
    const items = await fetchQuotes(accountId);
    return items.map(toQuote);
  },

  async getShipments(accountId: number): Promise<Shipment[]> {
    const items = await fetchShipments(accountId);
    return items.map(toShipment);
  },

  async getInvoices(accountId: number): Promise<Invoice[]> {
    const items = await fetchInvoices(accountId);
    return items.map(toInvoice);
  },
};
