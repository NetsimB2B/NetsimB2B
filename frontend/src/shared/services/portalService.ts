import { accountTransactions, accounts, invoices, products, quotes, seedOrders, shipments } from "@/mocks/portalData";
import { useCompanyContext } from "@/features/company-context/store";
import type { Account, AccountTransaction, Invoice, Order, Product, Quote, Shipment } from "@/shared/types/portal";

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
const accountPriceMultiplier = (accountId: number) => accountId === 1002 ? 1.06 : 1;

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
    await delay();
    const search = query.search?.trim().toLocaleLowerCase("tr-TR") ?? "";
    const result = products
      .filter((product) => !search
        || `${product.name} ${product.code} ${product.brand}`.toLocaleLowerCase("tr-TR").includes(search))
      .filter((product) => !query.category || product.category === query.category)
      .filter((product) => !query.brand || product.brand === query.brand)
      .filter((product) => !query.inStock || product.stock > 0)
      .map((product) => ({
        ...product,
        price: Math.round(product.price * accountPriceMultiplier(accountId) * 100) / 100,
      }));

    return result.sort((a, b) => {
      if (query.sort === "price-asc") return a.price - b.price;
      if (query.sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name, "tr");
    });
  },

  async getProduct(accountId: number, productId: number): Promise<Product | undefined> {
    const list = await this.getProducts(accountId);
    return list.find((product) => product.id === productId);
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
