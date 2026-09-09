import type { Account, Invoice, Order, Product, Quote, Shipment } from "@/shared/types/portal";

export const accounts: Account[] = [
  { id: 1001, name: "Örnek Bayi A.Ş.", code: "CR-1001", balance: 184_250, availableCredit: 315_750, overdueAmount: 0, currency: "TRY", brandColor: "#315b8a" },
  { id: 1002, name: "Marmara Endüstri Ltd.", code: "CR-1002", balance: 92_800, availableCredit: 107_200, overdueAmount: 14_350, currency: "TRY", brandColor: "#18785f" },
];

export const products: Product[] = [
  { id: 1, code: "MTR-001", name: "Trifaze Elektrik Motoru 2.2 kW", category: "Motorlar", brand: "Voltix", unit: "Adet", description: "Yüksek verimli, IP55 koruma sınıflı endüstriyel motor.", price: 12_450, stock: 125, image: "⚙️", featured: true },
  { id: 2, code: "MTR-002", name: "Trifaze Elektrik Motoru 4 kW", category: "Motorlar", brand: "Voltix", unit: "Adet", description: "Ağır çalışma koşullarına uygun 1500 devir motor.", price: 18_900, stock: 34, image: "⚙️", featured: true },
  { id: 3, code: "PMP-010", name: "Paslanmaz Santrifüj Pompa", category: "Pompalar", brand: "AquaPro", unit: "Adet", description: "Gıda ve kimya uygulamaları için paslanmaz gövdeli pompa.", price: 28_750, stock: 8, image: "💧" },
  { id: 4, code: "RDM-025", name: "Sonsuz Vidalı Redüktör", category: "Redüktörler", brand: "DriveMax", unit: "Adet", description: "Kompakt gövde, yüksek çevrim oranı ve sessiz çalışma.", price: 9_680, stock: 52, image: "🔩", featured: true },
  { id: 5, code: "SNS-100", name: "Endüktif Yaklaşım Sensörü", category: "Otomasyon", brand: "Sense", unit: "Adet", description: "M18 gövde, 8 mm algılama mesafesi, PNP çıkış.", price: 1_245, stock: 240, image: "📡" },
  { id: 6, code: "DRV-220", name: "Motor Sürücü 2.2 kW", category: "Otomasyon", brand: "DriveMax", unit: "Adet", description: "Vektör kontrollü kompakt hız kontrol cihazı.", price: 14_320, stock: 19, image: "🎛️" },
  { id: 7, code: "BRG-6205", name: "Rulman 6205 2RS", category: "Rulmanlar", brand: "Rota", unit: "Adet", description: "Çift tarafı keçeli, uzun ömürlü sabit bilyalı rulman.", price: 385, stock: 520, image: "⭕" },
  { id: 8, code: "VLV-050", name: "Paslanmaz Küresel Vana 2 inç", category: "Vanalar", brand: "FlowPro", unit: "Adet", description: "Tam geçişli, üç parçalı paslanmaz küresel vana.", price: 3_940, stock: 0, image: "🔧" },
  { id: 9, code: "CBL-4X4", name: "Kumanda Kablosu 4x4 mm²", category: "Elektrik", brand: "Enercab", unit: "Metre", description: "Esnek bakır iletkenli endüstriyel kumanda kablosu.", price: 142.5, stock: 2_400, image: "🔌" },
  { id: 10, code: "PNL-060", name: "Elektrik Panosu 60x80", category: "Elektrik", brand: "PanelPro", unit: "Adet", description: "IP65 korumalı, montaj plakalı metal pano.", price: 6_750, stock: 11, image: "🗄️" },
  { id: 11, code: "FLT-025", name: "Hat Tipi Basınç Filtresi", category: "Hidrolik", brand: "Hydra", unit: "Adet", description: "25 mikron filtreleme, 250 bar çalışma basıncı.", price: 5_480, stock: 26, image: "🧰" },
  { id: 12, code: "CYL-080", name: "Hidrolik Silindir 80/45", category: "Hidrolik", brand: "Hydra", unit: "Adet", description: "Çift etkili, honlanmış borulu standart hidrolik silindir.", price: 16_850, stock: 6, image: "↔️" },
];

export const quotes: Quote[] = [
  { id: "TKL-2026-0142", accountId: 1001, title: "Motor ve sürücü paketi", validUntil: "2026-09-30", status: "Geçerli", lines: [{ productId: 1, quantity: 5 }, { productId: 6, quantity: 5 }], total: 127_400 },
  { id: "TKL-2026-0118", accountId: 1001, title: "Bakım dönemi rulmanları", validUntil: "2026-08-31", status: "Süresi Doldu", lines: [{ productId: 7, quantity: 100 }], total: 36_500 },
  { id: "TKL-2026-0204", accountId: 1002, title: "Pompa yenileme teklifi", validUntil: "2026-10-15", status: "Geçerli", lines: [{ productId: 3, quantity: 2 }], total: 58_900 },
];

export const seedOrders: Order[] = [
  { id: "B2B-2026-1002", accountId: 1001, createdAt: "2026-09-08T09:30:00Z", status: "Hazırlanıyor", lines: [{ productId: 1, quantity: 3 }, { productId: 7, quantity: 20 }], total: 45_050, deliveryAddress: "Merkez Mah. Sanayi Cad. No:12 İstanbul", paymentMethod: "30 Gün Vadeli" },
  { id: "B2B-2026-1001", accountId: 1001, createdAt: "2026-09-04T12:15:00Z", status: "Sevk Edildi", lines: [{ productId: 4, quantity: 2 }], total: 19_360, deliveryAddress: "Merkez Mah. Sanayi Cad. No:12 İstanbul", paymentMethod: "Havale / EFT" },
  { id: "B2B-2026-2001", accountId: 1002, createdAt: "2026-09-06T08:20:00Z", status: "Onaylandı", lines: [{ productId: 3, quantity: 1 }], total: 30_475, deliveryAddress: "Organize Sanayi Bölgesi 4. Cad. Bursa", paymentMethod: "Peşin" },
];

export const shipments: Shipment[] = [
  { id: "SVK-2026-0088", accountId: 1001, orderId: "B2B-2026-1002", date: "2026-09-08", status: "Yolda", carrier: "Netsim Lojistik" },
  { id: "SVK-2026-0081", accountId: 1001, orderId: "B2B-2026-1001", date: "2026-09-04", status: "Teslim Edildi", carrier: "Müşteri Aracı" },
  { id: "SVK-2026-0094", accountId: 1002, orderId: "B2B-2026-2001", date: "2026-09-09", status: "Hazırlanıyor", carrier: "Netsim Lojistik" },
];

export const invoices: Invoice[] = [
  { id: "FTR-2026-1482", accountId: 1001, date: "2026-09-05", dueDate: "2026-10-05", total: 74_700, status: "Açık" },
  { id: "FTR-2026-1431", accountId: 1001, date: "2026-08-24", dueDate: "2026-09-07", total: 28_750, status: "Vadesi Geçti" },
  { id: "FTR-2026-1398", accountId: 1001, date: "2026-08-12", dueDate: "2026-09-11", total: 19_360, status: "Ödendi" },
  { id: "FTR-2026-1520", accountId: 1002, date: "2026-09-07", dueDate: "2026-10-07", total: 30_475, status: "Açık" },
];
