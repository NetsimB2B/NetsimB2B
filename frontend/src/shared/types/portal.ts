export type Account = {
  id: number;
  name: string;
  code: string;
  balance: number;
  availableCredit: number;
  overdueAmount: number;
  currency: "TRY";
  logoUrl?: string;
  brandColor?: string;
  paymentTerm?: string;
  riskGroup?: string;
  accountManager?: string;
  taxNumber?: string;
  address?: string;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
};

export type AccountTransaction = {
  id: string;
  accountId: number;
  date: string;
  dueDate?: string;
  document: string;
  documentType: "Fatura" | "Tahsilat" | "İade" | "Dekont" | "Çek";
  description: string;
  debit: number;
  credit: number;
  balanceAfter: number;
  status: "Açık" | "Kapalı" | "Vadesi Geçti" | "Kısmi";
  relatedInvoiceId?: string;
};

export type Product = {
  id: number;
  code: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  description: string;
  price: number;
  stock: number;
  image: string;
};

export type CartLine = {
  productId: number;
  quantity: number;
  /** Teklif kabulünde aktarılan anlaşmalı birim fiyat (KDV hariç) */
  unitPrice?: number;
  quoteId?: string;
};

export type OrderStatus = "Alındı" | "Onaylandı" | "Hazırlanıyor" | "Sevk Edildi";

export type Order = {
  id: string;
  accountId: number;
  createdAt: string;
  status: OrderStatus;
  lines: CartLine[];
  total: number;
  customerOrderNo?: string;
  expectedDeliveryDate?: string;
  salesRepresentative?: string;
  shippingMethod?: string;
  shipmentId?: string;
  invoiceId?: string;
  quoteId?: string;
  deliveryAddress: string;
  paymentMethod: string;
  note?: string;
};

export type Quote = {
  id: string;
  accountId: number;
  title: string;
  reference: string;
  createdAt: string;
  validUntil: string;
  status: "Geçerli" | "Kabul Edildi" | "Süresi Doldu";
  salesRepresentative: string;
  paymentTerm: string;
  deliveryTerm: string;
  note?: string;
  lines: Array<CartLine & {
    unitPrice: number;
    listPrice: number;
    deliveryTime: string;
  }>;
  total: number;
};

export type Shipment = {
  id: string;
  accountId: number;
  orderId: string;
  date: string;
  status: "Hazırlanıyor" | "Yolda" | "Teslim Edildi";
  carrier: string;
  trackingNo: string;
  estimatedDelivery: string;
  deliveredAt?: string;
  origin: string;
  destination: string;
  packageCount: number;
  totalWeight: number;
  vehiclePlate?: string;
  driverName?: string;
  events: Array<{
    date: string;
    title: string;
    location: string;
    completed: boolean;
  }>;
};

export type Invoice = {
  id: string;
  accountId: number;
  date: string;
  dueDate: string;
  total: number;
  status: "Ödendi" | "Açık" | "Vadesi Geçti";
  orderId?: string;
  eInvoiceUuid?: string;
  paymentTerm: string;
  paidAmount: number;
  remainingAmount: number;
  taxExcluded: number;
  taxAmount: number;
  currency: "TRY";
  description: string;
  lines: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
    taxRate: number;
  }>;
};
