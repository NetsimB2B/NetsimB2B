# Quotes

<!--
Bu dosya Tekliflerim ekranını tanımlar.

B2B müşteri portalı açısından temel Netsim karşılığı "Verilen Teklif" olmalıdır.

## Amaç

Müşterinin:
- kendisine verilen teklifleri görmesi
- teklif detayını incelemesi
- revizyon talep etmesi
- teklifi kabul/reddetmesi
- tekliften sipariş oluşturması

## Teklif Listesi

Alanlar:
- Teklif no
- Tarih
- Geçerlilik
- Genel toplam
- Para birimi
- Durum

## Teklif Detayı

- Ürün
- Varyant
- Miktar
- Teklif fiyatı
- İndirim
- Vergi
- Satır toplamı
- Ödeme şartları
- Teslim tarihi

## Netsim Kaynakları

- ALSAASIL
- ALSADETA

## Teklif İşlem Kodu

Verilen Teklif işlem kodunun müşteri Netsim kurulumuna göre konfigüre edilebilir olması gerektiği açıklanmalıdır.

## Fiyat Davranışı

Teklif ekranında güncel ürün fiyatı değil, teklif belgesinde kaydedilmiş fiyat gösterilmelidir.

## Teklif Durumları

Örneğin:
- Aktif
- Onay Bekliyor
- Siparişe Dönüştü
- Süresi Doldu
- Reddedildi
- İptal

Bu durumların hangi Netsim alanlarından ve hangi B2B verilerinden türetildiği tanımlanmalıdır.

## Geçerlilik

Teklif geçerlilik tarihinin hangi Netsim alanından geleceği doğrulanmalıdır.

## Revizyon

ALSAASIL.REVIZYON_NO
REFERANS_ALISSATIS_NO
gibi alanların gerçek davranışı araştırıldıktan sonra açıklanmalıdır.

## Teklif → Sipariş

Tekliften Alınan Sipariş oluşturma akışı.

Muhtemel bağlantılar:
- REFERANS_ALISSATIS_NO
- REFERANS_ALISSATIS_DETAY_NO

## B2B Özel Verileri

Örneğin:
- Revizyon talebi
- Teklif red nedeni
- Müşteri cevabı

## PDF

Teklif PDF'i Netsim rapor motorundan mı alınacak yoksa B2B tarafından mı üretilecek?

## API

Quote list/detail
revision request
reject
convert-to-order
pdf

## Açık Sorular
-->