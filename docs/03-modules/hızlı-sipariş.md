# Quick Order

<!--
Bu dosya Hızlı Sipariş ekranının tasarımını tanımlar.

## Amaç

Kullanıcının ürün kataloğunda gezinmeden çok sayıda ürünü hızlıca siparişe hazırlaması.

## Sipariş Giriş Yöntemleri

- Stok kodu
- Ürün adı
- Barkod
- Excel upload
- Copy/Paste
- Önceki siparişten kopyalama
- Sipariş şablonu

## Grid Yapısı

Kolonlar örneğin:
- Stok kodu
- Ürün
- Varyant
- Stok
- Miktar
- Birim
- Birim fiyat
- İndirim
- Satır toplamı

## Ürün Bulma

STOKKART üzerinden ürün arama mantığı.

## Barkod

Barkod master tablosu keşfedildiğinde eşleştirme burada anlatılacaktır.

## Varyant Kontrolü

STOKKART.VARYANT_ZORUNLU gibi kuralların hızlı sipariş davranışına etkisi.

## Stok Validation

- ürün mevcut mu?
- ürün satılabilir mi?
- miktar yeterli mi?
- backorder destekleniyor mu?

## Fiyat Preview

Ürün grid'e eklendiğinde fiyatın backend/Netsim tarafından hesaplanması.

## Excel Import

Dosyada beklenen kolonlar:
- stok kodu
- miktar
- varyant vb.

Hatalı satırların nasıl raporlanacağı.

## Copy/Paste

Excel benzeri verinin textarea/grid üzerinden parse edilmesi.

## Sepete Aktarma

Hızlı sipariş doğrudan Netsim siparişi oluşturmak yerine önce B2B sepetine aktarılabilir.

## Netsim Kaynakları

- STOKKART
- fiyat tabloları
- varyant tabloları
- stok bakiye yapısı

## B2B Kaynakları

- CART
- CART_ITEM

## API

Search
Validate
Price Preview
Bulk Import
Cart Add
gibi ihtiyaçlar.

## Açık Sorular
-->