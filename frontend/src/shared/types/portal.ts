export type Account = {
  id: number;
  name: string;
  code: string;
  balance: number;
  availableCredit: number;
  overdueAmount: number;
  currency: "TRY";
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
  featured?: boolean;
};

export type CartLine = {
  productId: number;
  quantity: number;
};

export type OrderStatus = "Alındı" | "Onaylandı" | "Hazırlanıyor" | "Sevk Edildi";

export type Order = {
  id: string;
  accountId: number;
  createdAt: string;
  status: OrderStatus;
  lines: CartLine[];
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  note?: string;
};

export type Quote = {
  id: string;
  accountId: number;
  title: string;
  validUntil: string;
  status: "Geçerli" | "Kabul Edildi" | "Süresi Doldu";
  lines: CartLine[];
  total: number;
};

export type Shipment = {
  id: string;
  accountId: number;
  orderId: string;
  date: string;
  status: string;
  carrier: string;
};

export type Invoice = {
  id: string;
  accountId: number;
  date: string;
  dueDate: string;
  total: number;
  status: "Ödendi" | "Açık" | "Vadesi Geçti";
};
