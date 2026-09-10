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
  { id: "TKL-2026-0142", accountId: 1001, title: "Motor ve sürücü paketi", reference: "RFQ-2026-0087", createdAt: "2026-09-05", validUntil: "2026-09-30", status: "Geçerli", salesRepresentative: "Selin Yılmaz", paymentTerm: "30 Gün Vadeli", deliveryTerm: "Stoktan 2–3 iş günü", note: "Fiyatlara KDV dahil değildir. Sevkiyat tek parti olarak planlanmıştır.", lines: [{ productId: 1, quantity: 5, listPrice: 12_450, unitPrice: 12_000, deliveryTime: "Stoktan teslim" }, { productId: 6, quantity: 5, listPrice: 14_320, unitPrice: 13_480, deliveryTime: "2–3 iş günü" }], total: 127_400 },
  { id: "TKL-2026-0118", accountId: 1001, title: "Bakım dönemi rulmanları", reference: "RFQ-2026-0061", createdAt: "2026-08-18", validUntil: "2026-08-31", status: "Süresi Doldu", salesRepresentative: "Selin Yılmaz", paymentTerm: "Havale / EFT", deliveryTerm: "Stoktan 1–2 iş günü", note: "Toplu alım fiyatıdır.", lines: [{ productId: 7, quantity: 100, listPrice: 385, unitPrice: 365, deliveryTime: "Stoktan teslim" }], total: 36_500 },
  { id: "TKL-2026-0204", accountId: 1002, title: "Pompa yenileme teklifi", reference: "RFQ-2026-0129", createdAt: "2026-09-07", validUntil: "2026-10-15", status: "Geçerli", salesRepresentative: "Emre Kaya", paymentTerm: "Peşin", deliveryTerm: "3–5 iş günü", lines: [{ productId: 3, quantity: 2, listPrice: 30_475, unitPrice: 29_450, deliveryTime: "3–5 iş günü" }], total: 58_900 },
];

export const seedOrders: Order[] = [
  { id: "B2B-2026-1002", accountId: 1001, createdAt: "2026-09-08T09:30:00Z", status: "Hazırlanıyor", lines: [{ productId: 1, quantity: 3 }, { productId: 7, quantity: 20 }], total: 45_050, customerOrderNo: "SAS-2026-184", expectedDeliveryDate: "2026-09-11", salesRepresentative: "Selin Yılmaz", shippingMethod: "Netsim Lojistik", shipmentId: "SVK-2026-0088", invoiceId: "FTR-2026-1482", deliveryAddress: "Merkez Mah. Sanayi Cad. No:12 İstanbul", paymentMethod: "30 Gün Vadeli", note: "Mal kabul hafta içi 09.00–16.00 arasındadır." },
  { id: "B2B-2026-1001", accountId: 1001, createdAt: "2026-09-04T12:15:00Z", status: "Sevk Edildi", lines: [{ productId: 4, quantity: 2 }], total: 19_360, customerOrderNo: "SAS-2026-172", expectedDeliveryDate: "2026-09-07", salesRepresentative: "Selin Yılmaz", shippingMethod: "Müşteri Aracı", shipmentId: "SVK-2026-0081", invoiceId: "FTR-2026-1398", deliveryAddress: "Merkez Mah. Sanayi Cad. No:12 İstanbul", paymentMethod: "Havale / EFT" },
  { id: "B2B-2026-2001", accountId: 1002, createdAt: "2026-09-06T08:20:00Z", status: "Onaylandı", lines: [{ productId: 3, quantity: 1 }], total: 30_475, customerOrderNo: "PO-45871", expectedDeliveryDate: "2026-09-12", salesRepresentative: "Emre Kaya", shippingMethod: "Netsim Lojistik", shipmentId: "SVK-2026-0094", invoiceId: "FTR-2026-1520", deliveryAddress: "Organize Sanayi Bölgesi 4. Cad. Bursa", paymentMethod: "Peşin" },
];

export const shipments: Shipment[] = [
  { id: "SVK-2026-0088", accountId: 1001, orderId: "B2B-2026-1002", date: "2026-09-08T13:40:00Z", status: "Yolda", carrier: "Netsim Lojistik", trackingNo: "NTS2609080088", estimatedDelivery: "2026-09-11T14:00:00Z", origin: "Netsim İstanbul Merkez Depo", destination: "Merkez Mah. Sanayi Cad. No:12 İstanbul", packageCount: 3, totalWeight: 96.5, vehiclePlate: "34 NTS 088", driverName: "Murat Demir", events: [{ date: "2026-09-08T10:15:00Z", title: "Sevkiyat emri oluşturuldu", location: "İstanbul Merkez Depo", completed: true }, { date: "2026-09-08T13:40:00Z", title: "Araç yüklemesi tamamlandı", location: "İstanbul Merkez Depo", completed: true }, { date: "2026-09-09T08:20:00Z", title: "Dağıtım merkezinden çıktı", location: "İstanbul Avrupa Yakası", completed: true }, { date: "2026-09-11T14:00:00Z", title: "Planlanan teslimat", location: "Müşteri teslimat adresi", completed: false }] },
  { id: "SVK-2026-0081", accountId: 1001, orderId: "B2B-2026-1001", date: "2026-09-04T09:10:00Z", status: "Teslim Edildi", carrier: "Müşteri Aracı", trackingNo: "NTS2609040081", estimatedDelivery: "2026-09-04T15:00:00Z", deliveredAt: "2026-09-04T14:28:00Z", origin: "Netsim İstanbul Merkez Depo", destination: "Merkez Mah. Sanayi Cad. No:12 İstanbul", packageCount: 2, totalWeight: 28, vehiclePlate: "34 BAY 142", driverName: "Ahmet Kaya", events: [{ date: "2026-09-04T08:30:00Z", title: "Sipariş sevkiyata hazırlandı", location: "İstanbul Merkez Depo", completed: true }, { date: "2026-09-04T09:10:00Z", title: "Müşteri aracına teslim edildi", location: "İstanbul Merkez Depo", completed: true }, { date: "2026-09-04T14:28:00Z", title: "Teslimat tamamlandı", location: "Müşteri teslimat adresi", completed: true }] },
  { id: "SVK-2026-0094", accountId: 1002, orderId: "B2B-2026-2001", date: "2026-09-09T11:00:00Z", status: "Hazırlanıyor", carrier: "Netsim Lojistik", trackingNo: "NTS2609090094", estimatedDelivery: "2026-09-12T16:00:00Z", origin: "Netsim İstanbul Merkez Depo", destination: "Organize Sanayi Bölgesi 4. Cad. Bursa", packageCount: 1, totalWeight: 42, events: [{ date: "2026-09-09T11:00:00Z", title: "Sevkiyat emri oluşturuldu", location: "İstanbul Merkez Depo", completed: true }, { date: "2026-09-10T09:00:00Z", title: "Araç yükleme planı", location: "İstanbul Merkez Depo", completed: false }, { date: "2026-09-12T16:00:00Z", title: "Planlanan teslimat", location: "Bursa OSB", completed: false }] },
];

export const invoices: Invoice[] = [
  { id: "FTR-2026-1482", accountId: 1001, date: "2026-09-05", dueDate: "2026-10-05", total: 74_700, status: "Açık" },
  { id: "FTR-2026-1431", accountId: 1001, date: "2026-08-24", dueDate: "2026-09-07", total: 28_750, status: "Vadesi Geçti" },
  { id: "FTR-2026-1398", accountId: 1001, date: "2026-08-12", dueDate: "2026-09-11", total: 19_360, status: "Ödendi" },
  { id: "FTR-2026-1520", accountId: 1002, date: "2026-09-07", dueDate: "2026-10-07", total: 30_475, status: "Açık" },
];
