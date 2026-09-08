# Application Architecture

<!--
Bu dosya uygulamanın ürün seviyesindeki genel mimarisini tanımlar.

Bu dosya projenin ana haritası olacaktır.

## Uygulama Türü

- B2B müşteri / bayi portalı
- Web tabanlı
- Desktop öncelikli fakat responsive
- Netsim ERP ile entegre

## Ana Kullanıcı Alanları

Uygulamanın hangi ana çalışma alanlarına sahip olduğu belirtilmelidir.

Örneğin:

### Bayi / Müşteri Portalı
Müşterilerin ürün, teklif, sipariş, sevkiyat ve finans işlemlerini yönettiği alan.

### Yönetim Paneli
İleride firma içi kullanıcıların B2B'yi yönettiği alan olabilir.

### Satış Temsilcisi Paneli
İleride temsilcilerin müşterilerini yönettiği alan olabilir.

## Ana Navigasyon

Tüm ana sekmeler burada listelenmelidir.

Örneğin:

- Dashboard
- Ürünler
- Hızlı Sipariş
- Sepetim
- Tekliflerim
- Siparişlerim
- Sevkiyatlarım
- İrsaliyelerim
- Faturalarım
- Finans
- Ödemeler
- Kampanyalar
- Favoriler
- Destek
- Hesabım

Her sekme için:
- amacı
- hangi işlemleri kapsadığı
- hangi modüllerle ilişkili olduğu
kısa şekilde açıklanmalıdır.

## Ana İş Akışları

Örneğin:

Ürünler
→ Sepet
→ Sipariş

Hızlı Sipariş
→ Sepet
→ Sipariş

Teklif
→ Sipariş

Sipariş
→ Sevkiyat
→ İrsaliye
→ Fatura

Cari
→ Açık İşlem
→ Ödeme

## Modüller Arası Bağımlılıklar

Örneğin:

Products
→ Inventory
→ Pricing

Cart
→ Products
→ Pricing
→ Inventory

Orders
→ Shipments
→ Invoices

## Source of Truth Yaklaşımı

Hangi veri hangi sistemin sorumluluğundadır?

Örneğin:
- Ürün → Netsim
- Cari → Netsim
- Sipariş → Netsim
- Sepet → B2B
- Favori → B2B

Detaylı veri mimarisi data klasöründe tutulacaktır.

## Uygulama Prensipleri

Örneğin:
- ERP ekranları birebir web'e taşınmaz.
- B2B kullanıcıya iş odaklı sade arayüz sunulur.
- Netsim karmaşıklığı integration katmanında gizlenir.
-->