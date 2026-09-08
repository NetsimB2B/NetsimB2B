# Netsim Integration Architecture

<!--
Bu dosya B2B uygulamasının Netsim ERP ile nasıl iletişim kuracağını açıklayan ana entegrasyon dokümanıdır.

Bu dosya proje için kritik mimari dokümanlardan biridir.

## Entegrasyonun Amacı

B2B uygulaması:
- ürün
- stok
- fiyat
- cari
- teklif
- sipariş
- sevkiyat
- finans

gibi ERP verilerini Netsim'den kullanacaktır.

## Ana Mimari

Mantıksal yapı:

Frontend
↓
B2B Backend API
↓
Netsim Integration Layer
↓
Netsim ERP / Firebird

Frontend Netsim veritabanına hiçbir zaman doğrudan erişmemelidir.

## Integration Layer

Netsim'e özgü tablo ve alan isimleri uygulamanın domain katmanına yayılmamalıdır.

Örneğin:

OrderService

IErpOrderProvider

NetsimOrderProvider

Bu sayede ileride başka ERP adapterları eklenebilir.

## Read Strategy

Okuma işlemleri için kullanılabilecek yöntemler:

- Firebird direct SELECT
- Netsim view
- Stored procedure
- Netsim servis/API
- Cache/read model

Her veri türü için uygun yöntem ayrı değerlendirilmelidir.

Örneğin:

Ürün master:
doğrudan okunabilir.

Sipariş:
doğrudan okunabilir.

Stok bakiyesi:
yüksek hacimli hareket tablolarından sürekli SUM yapılmamalı;
hazır bakiye tablosu veya cache kullanılabilir.

## Write Strategy

Transactional Netsim tablolarına doğrudan INSERT/UPDATE varsayılan yöntem olmamalıdır.

Örneğin:
- ALSAASIL
- ALSADETA
- STOKASIL
- STOKISLM
- CARIISLM

tablolarında Netsim tarafından çalıştırılan business logic olabilir.

Dikkate alınması gerekenler:
- triggerlar
- işlem kodları
- session alanları
- security alanları
- cari hareket yaratımı
- stok hareket yaratımı
- otomatik kapanmalar
- onay yolları
- muhasebe bağlantıları

## Sipariş Yazma

İdeal akış:

B2B Cart
↓
Checkout Validation
↓
Netsim Order Integration
↓
Netsim business logic
↓
ALSAASIL + ALSADETA

Doğrudan tablo INSERT ancak Netsim davranışı tamamen doğrulanırsa değerlendirilmelidir.

## Source of Truth

Örneğin:

Netsim:
- Cari
- Ürün
- Fiyat
- Stok
- Sipariş
- Teklif
- Fatura
- Sevkiyat

B2B DB:
- User
- Cart
- Favorite
- Support
- B2B workflow talepleri
- UI preferences

## Configuration

Netsim'e özgü bazı değerler hard-code edilmemelidir.

Örneğin:
- ORDER_OPERATION_CODE
- QUOTE_OPERATION_CODE
- INVOICE_OPERATION_CODE
- SHIPMENT_OPERATION_CODE

Firma bazında değişebilir.

## Netsim Database Connection

İleride şu konular açıklanmalıdır:

- Firebird bağlantısı
- Connection pooling
- Read-only user
- Write user
- Timeout
- Transaction isolation
- network erişimi

## Performance

Özellikle ağır tablolar:
- STOKISLM
- CARIISLM
- ALSADETA

için:
- doğru index
- filtre
- pagination
- cache
- aggregation

gereksinimleri değerlendirilmelidir.

## Security

- DB credentials frontend'e gitmez.
- SQL parametreli çalıştırılır.
- Kullanıcının gönderdiği CARI_NO'ya güvenilmez.
- Backend authenticated user's cari mapping'ini kullanır.

## Multi-Company

Netsim'de birden fazla firma/database varsa:
- connection resolution
- firma seçimi
- tenant izolasyonu
konuları açıklanmalıdır.

## Error Handling

Firebird/Netsim hataları uygulama hata modeline dönüştürülmelidir.

Örneğin:
ERP_CONNECTION_ERROR
ERP_VALIDATION_ERROR
ERP_ORDER_CREATION_FAILED

## Logging

Her ERP isteğinde mümkünse:
- correlation id
- user
- cari
- operation
- duration
- success/failure

loglanmalıdır.

## Open Questions

Bu bölüm sürekli güncel tutulmalıdır.

Örneğin:
- Netsim resmi servis katmanı var mı?
- Sipariş oluşturmak için hangi procedure kullanılmalı?
- Cari fiyat motoru nasıl çağrılıyor?
- Güncel stok bakiye tablosu hangisi?
- Transactional write sırasında hangi triggerlar çalışıyor?
- Nuke ile authentication entegrasyonu gerekli mi?

## Gelecekte ERP Bağımsızlık

Uzun vadede mimari:

B2B Domain
↓
ERP Interface
├── Netsim Adapter
├── Logo Adapter
├── Mikro Adapter
└── SAP Adapter

şeklinde genişleyebilir.

Bu hedef gerçek bir ürün gereksinimi haline gelmedikçe gereksiz abstraction yapılmamalıdır.
-->