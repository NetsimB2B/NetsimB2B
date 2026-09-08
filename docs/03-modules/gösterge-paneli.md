# Dashboard

<!--
Bu dosya Dashboard ekranının tüm fonksiyonel tasarımını açıklar.

## Amaç

Kullanıcının sisteme giriş yaptığı anda:
- finans durumunu
- sipariş durumunu
- yaklaşan işlemleri
- hızlı işlemleri

tek ekranda görmesini sağlamak.

## Ana KPI'lar

Örneğin:

- Cari Bakiye
- Vadesi Geçen Tutar
- Kullanılabilir Limit
- Açık Sipariş
- Sevk Bekleyen Sipariş
- Yaklaşan Ödeme

Her KPI için aşağıdakiler daha sonra tanımlanmalıdır:

- kullanıcıya gösterilecek isim
- açıklama
- Netsim veri kaynağı
- hesaplama formülü
- cache süresi

## Hızlı İşlemler

Örneğin:
- Yeni Sipariş
- Hızlı Sipariş
- Sepete Git
- Cari Ekstre
- Faturalar

## Sipariş Özeti

- Onay bekleyen
- Hazırlanan
- Kısmi sevk edilen
- Tamamlanan

## Son Siparişler

Gösterilecek alanlar:
- sipariş no
- tarih
- toplam
- durum
- teslim tarihi

## Yaklaşan Teslimatlar

Teslim tarihi yaklaşan siparişler.

## Netsim Veri Kaynakları

Muhtemel tablolar:
- CARIKART
- CARIISLM
- ALSAASIL
- ALSADETA
- STOKASIL
- STOKISLM

Her dashboard bileşeninin hangi tablo/alanlardan beslendiği burada detaylandırılmalıdır.

## Hesaplanan Alanlar

Örneğin:
- Cari bakiye
- Vadesi geçen
- Kullanılabilir limit
- Sevk bekleyen

Hesapların nihai formülleri doğrulandıktan sonra yazılmalıdır.

## API İhtiyacı

Dashboard için tek aggregator endpoint kullanılıp kullanılmayacağı açıklanabilir.

Örneğin:
GET /api/v1/dashboard

## Performans

Dashboard her açıldığında ağır Netsim sorguları çalıştırılmamalıdır.
Cache/aggregation gerektiren veriler işaretlenmelidir.

## Yetkilendirme

Dashboard yalnızca kullanıcının bağlı olduğu CARI_NO verisini göstermelidir.

## Açık Sorular

Henüz kesinleşmeyen Netsim tabloları, alan anlamları ve hesaplamalar listelenmelidir.
-->