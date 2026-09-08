# Cart

<!--
Bu dosya Sepetim ekranının veri ve iş kuralı tasarımını tanımlar.

## Temel Prensip

Sepet bir Netsim siparişi değildir.

Kullanıcı siparişi kesinleştirene kadar sepet B2B veritabanında tutulmalıdır.

## Sepet Fonksiyonları

- Ürün görüntüleme
- Miktar değiştirme
- Ürün silme
- Varyant değiştirme
- Kupon
- Ödeme biçimi
- Teslimat seçimi
- Sipariş notu
- Sepeti temizleme

## Sepet Satırı

Tutulabilecek temel veriler:
- STOK_NO
- STOK_VARYANT_NO
- QUANTITY

Fiyat ve stok cache amaçlı tutulabilir fakat source of truth değildir.

## B2B Veritabanı

Muhtemel yapılar:
- B2B_CART
- B2B_CART_ITEM

## Fiyat Yenileme

Miktar veya ödeme şekli değiştiğinde fiyatın tekrar hesaplanması gerekebilir.

## Stok Yenileme

Sepete ürün eklenmiş olması stok rezerv edildiği anlamına gelmeyebilir.

Checkout öncesi stok tekrar kontrol edilmelidir.

## Checkout Validation

Kontroller:
- ürün aktif mi?
- ürün satılabilir mi?
- stok yeterli mi?
- varyant geçerli mi?
- cari bloke mi?
- risk limiti yeterli mi?
- ödeme koşulu uygun mu?
- kampanya hâlâ geçerli mi?

## Sipariş Özeti

- Ara toplam
- İndirim
- Vergi
- Kargo
- Genel toplam

## Netsim Siparişine Dönüşüm

Checkout sonrasında:
ALSAASIL
+
ALSADETA

oluşturulacağı belirtilmelidir.

Ancak doğrudan INSERT yerine Netsim business layer/service yaklaşımı değerlendirilmelidir.

## Checkout Akışı

Cart
→ Validation
→ Price Refresh
→ Inventory Refresh
→ Credit Check
→ User Confirmation
→ Netsim Order

## API Gereksinimleri

Cart read/update
price preview
checkout
endpointleri.

## Açık Sorular
-->