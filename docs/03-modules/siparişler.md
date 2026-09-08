# Orders

<!--
Bu dosya Siparişlerim ekranının tamamını tanımlar.

## Amaç

Kullanıcının:
- sipariş geçmişini görmesi
- sipariş durumunu takip etmesi
- ürün bazlı sevkiyat durumunu görmesi
- tekrar sipariş verebilmesi
- ilgili sevkiyat/fatura belgelerine erişebilmesi

## Sipariş Listesi

Gösterilecek alanlar:
- Sipariş no
- Tarih
- Teslim tarihi
- Genel toplam
- Döviz
- Durum
- Sevkiyat durumu

## Sipariş Detayı

Satır bazında:
- Ürün
- Varyant
- Sipariş miktarı
- Sevk edilen
- Kalan
- Fiyat
- Teslim tarihi
- Satır durumu

## Netsim Kaynakları

Sipariş:
- ALSAASIL
- ALSADETA

Sevkiyat:
- STOKASIL
- STOKISLM

## Temel İlişkiler

ALSAASIL.ALISSATIS_NO
→ ALSADETA.ALISSATIS_NO

ALSAASIL.ALISSATIS_NO
→ STOKASIL.ALISSATIS_NO

ALSADETA.ALISSATIS_DETAY_NO
→ STOKISLM.ALISSATIS_DETAY_NO

## Sipariş Durumu

B2B kullanıcıya gösterilecek durumlar:

- Onay Bekliyor
- Hazırlanıyor
- Kısmi Sevk Edildi
- Sevk Edildi
- Tamamlandı
- İptal

Bu durumlar yalnızca ALSAASIL.DURUM alanından değil;
ERP kayıt durumu + kapanma + stok/sevk hareketlerinden hesaplanabilir.

## Sevk Miktarı

Genel fikir:

Sipariş Miktarı
-
Gerçek Sevk Miktarı
=
Kalan Miktar

İade, rezerv ve ters hareketlerin hesaba etkisi doğrulanmalıdır.

## Sevkiyatlar

Siparişe bağlı STOKASIL kayıtları listelenebilir.

Gösterilebilecek:
- İrsaliye
- Tarih
- Kargo
- Araç
- Şoför
- Kargo referansı

## Fatura Bağlantısı

Sipariş/sevkiyat üzerinden ilgili fatura bilgileri gösterilebilir.

## Siparişi Tekrarla

Eski siparişten yalnızca:
- STOK_NO
- STOK_VARYANT_NO
- MIKTAR

yeni sepete aktarılmalıdır.

Eski fiyat kullanılmamalıdır.

## İptal Talebi

B2B kullanıcısı ERP siparişini doğrudan silemez.

B2B tarafında bir cancellation request oluşturulabilir.

## API

Order list
order detail
shipment detail
repeat order
cancel request

## Açık Sorular

- DURUM enumları
- KAYIT_DURUMU
- KAPANDI
- SKAPANDI
- AKAPANDI
- gerçek sevkiyat filtresi
-->