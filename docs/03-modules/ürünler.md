# Products

<!--
Bu dosya Ürünler sekmesinin liste ve detay davranışlarını tanımlar.

## Amaç

Kullanıcının:
- ürünü bulması
- stok durumunu görmesi
- kendi fiyatını görmesi
- varyant seçmesi
- sepete eklemesi

## Ürün Listeleme

Gösterilebilecek alanlar:

- Ürün görseli
- Stok kodu
- Ürün adı
- Marka
- Kategori
- Varyant
- Bayi fiyatı
- Liste fiyatı
- Stok
- Teslimat tahmini

## Search

Aranabilecek alanlar:

- STOK_KODU
- STOK_ADI
- URETICI_KODU
- Barkod

## Filtreler

Örneğin:
- Stok tipi
- Kategori
- Marka
- Ürün hattı
- Stokta olanlar
- Fiyat aralığı

## Ürün Detayı

Gösterilebilecek bilgiler:
- Ürün adı
- Görseller
- Açıklama
- Teknik bilgiler
- Varyantlar
- Depo bazlı stok
- Bayi fiyatı
- Son satın alma
- Teslim tarihi

## Web'de Gösterilebilirlik

STOKKART içerisinde bulunan:
- WEB_AKTIF
- SATILABILIRLIK
- BLOKE
- KAYIT_DURUMU
gibi alanların davranışları burada tanımlanmalıdır.

## Netsim Kaynakları

Kesinleşmiş:
- STOKKART

Araştırılacak:
- fiyat master tabloları
- stok varyant tabloları
- marka master
- ürün hattı master
- barkod master
- stok bakiye tablosu

## Stok Hesabı

Fiziksel stok ile B2B'de gösterilecek satılabilir stok arasındaki fark açıklanmalıdır.

## Fiyat Hesabı

Frontend'in fiyat hesaplamaması gerektiği belirtilmelidir.

Fiyat:
Cari + Ürün + Varyant + Miktar + Ödeme + Kampanya
gibi değişkenlere bağlı olabilir.

## B2B Özel Verileri

ERP'de tutulmayacak bilgiler:
- Favoriler
- Karşılaştırma
- Web'e özel görsel/içerik gerekiyorsa

## API

Ürün liste
ürün detay
stok
fiyat
varyant
endpoint ihtiyaçları tanımlanmalıdır.

## Açık Sorular

Henüz SQL ile doğrulanmamış Netsim yapıları listelenmelidir.
-->