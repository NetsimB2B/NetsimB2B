Application Architecture

Bu dosya Netsim B2B uygulamasının ürün seviyesindeki genel mimarisini tanımlar.

Amaç;

uygulamanın hangi ana alanlardan oluştuğunu,
kullanıcının hangi modüller arasında hareket ettiğini,
modüllerin birbirleriyle nasıl ilişkili olduğunu,
hangi verinin Netsim ERP'den geldiğini,
hangi verinin B2B uygulamasına ait olduğunu,
ERP ve B2B arasındaki sorumluluk sınırlarını

netleştirmektir.

Bu dosya teknik database şeması veya API endpoint dokümantasyonu değildir.

Detaylı veri modeli ve entegrasyon yapıları ayrı dokümanlarda tutulacaktır.

1. Uygulama Türü

Netsim B2B:

Web tabanlı bir B2B müşteri / bayi portalıdır.
Desktop öncelikli tasarlanır.
Tablet ve mobil cihazlarda responsive çalışır.
Netsim ERP ile entegredir.
Netsim ERP'deki ticari verileri müşteriye sadeleştirerek sunar.
Müşterinin yaptığı işlemleri gerektiğinde Netsim ERP'ye aktarır.
ERP kullanıcı ekranlarının web kopyası değildir.
Müşteri / bayi kullanımına özel ayrı bir ürün deneyimidir.

Ana kullanım senaryosu:

Bir Netsim müşterisinin kendi bayilerine veya kurumsal müşterilerine ürünlerini, fiyatlarını, stoklarını, siparişlerini, tekliflerini, sevkiyatlarını ve finansal durumlarını web üzerinden sunabilmesi.

2. Sistem Konumu

Netsim B2B, Netsim ERP ile son kullanıcı arasında bulunan bir uygulama katmanıdır.

Genel yapı:

B2B Kullanıcısı
      ↓
Netsim B2B Web Uygulaması
      ↓
B2B Backend / Application Layer
      ↓
Netsim Integration Layer
      ↓
Netsim ERP
      ↓
Netsim Database

Temel prensip:

B2B frontend hiçbir zaman Netsim database yapısını doğrudan bilmemelidir.

Örneğin frontend:

GET /products

mantığında çalışmalıdır.

Frontend'in:

STOKKART
STOKKADE
ALISSATIS
CARI

gibi Netsim tablo yapılarını bilmesi beklenmez.

Bu dönüşüm entegrasyon katmanının sorumluluğundadır.

3. Temel Mimari Prensip

Uygulamada aşağıdaki ayrım korunmalıdır:

Netsim ERP
=
Ticari gerçeklik

B2B
=
Kullanıcı deneyimi

Netsim;

ürün,
stok,
fiyat,
cari,
sipariş,
irsaliye,
fatura,
ödeme

gibi ticari verilerin ana kaynağıdır.

B2B ise bu veriyi:

daha anlaşılır,
aranabilir,
filtrelenebilir,
hızlı kullanılabilir

hale getirir.

4. Ana Kullanıcı Alanları

Ürün uzun vadede üç farklı kullanıcı alanına sahip olabilir.

4.1 Bayi / Müşteri Portalı

İlk geliştirme kapsamının ana alanıdır.

Kullanıcılar:

ürünleri görüntüler,
fiyatlarını görür,
stok durumunu kontrol eder,
sepete ürün ekler,
teklif oluşturur,
sipariş oluşturur,
siparişlerini takip eder,
irsaliyelerini görüntüler,
faturalarını görüntüler,
cari durumunu kontrol eder,
ödeme bilgilerine ulaşır.

Ana hedef kullanıcı:

Bayi
Kurumsal müşteri
Yetkili müşteri kullanıcısı
Satın alma personeli
4.2 Yönetim Paneli

İlk sürümün dışında tutulabilir.

Firma içi kullanıcıların B2B sistemini yönetmesi için kullanılabilir.

Örneğin:

B2B kullanıcılarını yönetmek,
müşteri erişimlerini yönetmek,
banner / duyuru yayınlamak,
ürün görünürlüğü belirlemek,
B2B ayarlarını değiştirmek,
kampanya içerikleri yönetmek,
entegrasyon durumunu takip etmek.

Bu alan Netsim ERP yönetiminin yerine geçmez.

Yalnızca B2B'ye özgü fonksiyonları yönetir.

4.3 Satış Temsilcisi Paneli

İleride eklenebilecek ayrı çalışma alanıdır.

Satış temsilcisi:

sorumlu olduğu müşterileri görüntüleyebilir,
müşteri adına ürün inceleyebilir,
teklif hazırlayabilir,
sipariş durumlarını takip edebilir,
müşteri finans durumunu görebilir.

Yetki modeli müşteri portalından farklı olacaktır.

5. İlk Sürümün Ana Kapsamı

İlk sürümde odak:

Bayi / Müşteri Portalı

olmalıdır.

Yönetim paneli ve satış temsilcisi paneli gelecekte aynı sistem üzerinde genişleyebilmelidir ancak mevcut kullanıcı deneyimini karmaşıklaştırmamalıdır.

Bu nedenle mimari genişlemeye açık fakat ilk sürüm sade tutulmalıdır.

6. Kullanıcı ve Firma Bağlamı

Bir B2B kullanıcısı bir veya birden fazla firmaya bağlı olabilir.

Örneğin:

Umut Yılmaz
│
├── Umut Ticaret A.Ş.
├── Ankara Bayi A.Ş.
└── İstanbul Dağıtım Ltd.

Kullanıcı sisteme girdikten sonra aktif firma belirlenir.

Bütün ticari işlemler aktif firma bağlamında çalışır.

Örneğin:

Fiyat
Stok yetkisi
Cari bakiye
Sipariş
Teklif
İrsaliye
Fatura
Ödeme

aktif firmaya göre hesaplanmalıdır.

7. Global Firma Context

Aktif firma uygulamanın global context'lerinden biri olmalıdır.

Örneğin:

CurrentCompany

değiştiğinde aşağıdaki veriler yeniden değerlendirilmelidir:

Products
Prices
Cart
Orders
Quotes
Finance
Invoices
Shipments

Firma değişiminin yan etkileri açık şekilde yönetilmelidir.

Özellikle:

Cart

firma bağımlı olmalıdır.

Bir firmaya ait sepet başka firmanın siparişine dönüşmemelidir.

8. Authentication

Authentication B2B uygulamasının ortak servislerinden biridir.

Desteklenebilecek yöntemler:

E-posta + şifre

E-posta doğrulaması

SMS doğrulaması

OTP

İleride:

SSO

eklenebilir.

Authentication ile ERP cari kaydı aynı şey değildir.

Kullanıcı:

B2B User

olarak sisteme giriş yapar.

Daha sonra bu kullanıcı:

Company / Cari

ilişkisine bağlanır.

9. Authorization

Bir kullanıcının sisteme giriş yapabilmesi bütün işlemleri yapabileceği anlamına gelmez.

Örneğin firma içerisinde:

Satın Alma Kullanıcısı
Finans Kullanıcısı
Yönetici
Görüntüleme Kullanıcısı

gibi roller olabilir.

Yetkiler örneğin:

Ürün görüntüleme

Fiyat görüntüleme

Sipariş oluşturma

Sipariş onaylama

Cari görüntüleme

Fatura görüntüleme

Ödeme görüntüleme

seviyesinde tanımlanabilir.

10. Ana Navigasyon Mimarisi

Ana navigasyon mümkün olduğunca iş odaklı olmalıdır.

Önerilen ana yapı:

Dashboard

Alışveriş
├── Ürünler
├── Kategoriler
├── Hızlı Sipariş
└── Favorilerim

Ticari İşlemler
├── Tekliflerim
├── Siparişlerim
├── İrsaliyelerim
└── Faturalarım

Finans
├── Cari Hesap
└── Ödemeler

Diğer
├── Duyurular / Kampanyalar
├── Destek
└── Hesabım

Sepet klasik navigation öğesinden ziyade uygulamanın global aksiyonlarından biri olarak düşünülebilir.

Örneğin topbar içerisinde:

🛒 Sepet (3)

şeklinde sürekli erişilebilir olabilir.

11. Dashboard
Amaç

Kullanıcıya sistemin genel durumunu hızlıca göstermek.

Dashboard herhangi bir işlemin detay ekranı değildir.

Bir yönlendirme ve özet alanıdır.

İlişkili modüller:

Products
Orders
Finance
Shipments
Cart
Announcements

Dashboard veri üretmez.

Diğer modüllerde bulunan verilerin özetini gösterir.

12. Ürünler
Amaç

Kullanıcının satın alabileceği ürünleri keşfetmesini ve sipariş sürecini başlatmasını sağlar.

Ana fonksiyonlar:

ürün listeleme,
ürün arama,
kategori filtreleme,
ürün detayına gitme,
fiyat görüntüleme,
stok durumu görüntüleme,
varyant seçme,
miktar belirleme,
favoriye ekleme,
sepete ekleme.

İlişkili modüller:

Products
Categories
Pricing
Inventory
Favorites
Cart
13. Kategoriler

Kategoriler ayrı bir domain olmakla beraber ürünlere erişim yollarından biridir.

Amaç:

Çok sayıda ürün içerisinde ürün keşfini kolaylaştırmak.

Akış:

Kategori
↓
Alt Kategori
↓
Ürün Listesi
↓
Ürün

Kategori verisinin ana kaynağı Netsim veya B2B ürün katalog yapılandırması olabilir.

Bu karar veri mimarisinde kesinleştirilmelidir.

14. Hızlı Sipariş

Hızlı Sipariş özellikle ürünü zaten bilen profesyonel B2B müşterilerine yöneliktir.

Amaç:

Ürün kartları arasında dolaşmadan hızlı şekilde sipariş hazırlamak.

Örnek yapı:

Ürün kodu / ürün adı
Miktar

+
Ürün kodu / ürün adı
Miktar

+
Ürün kodu / ürün adı
Miktar

Sonuç:

Sepete Ekle
15. Favoriler

Favoriler B2B tarafına ait kullanıcı kolaylığı özelliğidir.

Amaç:

sık satın alınan ürünlere hızlı ulaşmak,
tekrar siparişi hızlandırmak.

Akış:

Product
→ Favorite

Favorites
→ Cart

Favori bilgisi ERP'nin ticari gerçeğinin parçası değildir.

Bu nedenle B2B tarafında tutulmalıdır.

16. Sepet

Sepet sipariş öncesindeki geçici çalışma alanıdır.

Ana fonksiyonlar:

ürün ekleme,
miktar değiştirme,
ürün kaldırma,
fiyatların yeniden hesaplanması,
stok kontrolü,
sepet toplamı,
siparişe dönüştürme.

Bağımlılıklar:

Cart
├── Products
├── Pricing
├── Inventory
├── Company
└── User

Sepet B2B source of truth'tur.

Henüz ERP siparişi değildir.

17. Teklifler

Teklif modülü kullanıcının:

teklif talebi oluşturmasını,
mevcut teklifleri görüntülemesini,
teklif detayını incelemesini,
uygun tekliften sipariş oluşturmasını

sağlar.

Temel akış:

Ürünler
↓
Teklif Talebi
↓
Teklif
↓
Teklif Onayı
↓
Sipariş

Teklif Netsim tarafındaki teklif yapısıyla entegre edilmelidir.

18. Siparişler

Siparişler B2B uygulamasının temel ticari modüllerinden biridir.

Ana fonksiyonlar:

sipariş listeleme,
sipariş detayına ulaşma,
sipariş durumunu görüntüleme,
ürün satırlarını görüntüleme,
sevkiyat durumunu görüntüleme,
siparişi tekrar etme,
uygun koşullarda iptal talebi.

Bağımlılıklar:

Orders
├── Customers
├── Products
├── Pricing
├── Shipments
├── Dispatch Notes
└── Invoices

Sipariş oluşturulduktan sonra Netsim ERP ana source of truth olmalıdır.

19. Sipariş Yaşam Döngüsü

B2B kullanıcıya teknik Netsim workflow'ları yerine sade bir yaşam döngüsü göstermelidir.

Örneğin:

Sipariş Verildi
      ↓
Onaylandı
      ↓
Hazırlanıyor
      ↓
Kısmi Sevk
      ↓
Sevk Edildi
      ↓
Tamamlandı

ERP içerisinde daha fazla ara durum olabilir.

B2B bunları kullanıcı açısından anlamlı durumlara map etmelidir.

20. Sevkiyat

Sevkiyat fiziksel ürün hareketinin kullanıcı açısından takip edilmesini sağlar.

Eğer Netsim içerisinde yeterli sevkiyat verisi bulunuyorsa ayrı domain olarak modellenebilir.

Örneğin:

Sipariş

100 ürün

↓

Sevkiyat 1
60 ürün

↓

Sevkiyat 2
40 ürün

Bu nedenle:

Order ≠ Shipment

olduğu unutulmamalıdır.

21. İrsaliyeler

İrsaliye sevkiyatın ticari belgesidir.

Ana fonksiyonlar:

irsaliye listeleme,
irsaliye detayları,
ilgili sipariş,
ürün satırları,
sevk tarihi,
belge görüntüleme.

İlişki:

Order
↓
Shipment
↓
Dispatch Note

Ancak Netsim'deki gerçek belge modeli entegrasyon sırasında esas alınmalıdır.

22. Faturalar

Fatura modülü tamamlanan ticari işlemlerin finansal belgelerini gösterir.

Fonksiyonlar:

fatura listesi,
fatura detayı,
tutar,
tarih,
vade,
ödeme durumu,
ilişkili sipariş / irsaliye,
belge görüntüleme veya indirme.

Bağımlılıklar:

Invoices
├── Orders
├── Dispatch Notes
└── Finance
23. Cari Hesap

Cari hesap kullanıcının Netsim'deki ticari hesabının B2B temsilidir.

Ana fonksiyonlar:

Cari bakiye
Borç
Alacak
Açık işlemler
Hesap hareketleri
Vade bilgileri

B2B kullanıcısına gerekli Netsim cari alanları gösterilir.

Netsim cari kartının tamamı web'e taşınmaz.

24. Ödemeler

Ödemeler finans modülünün işlem alanıdır.

İlk sürümde:

geçmiş ödemeleri görüntüleme,
bekleyen ödeme,
vadesi geçen tutar

ile başlanabilir.

İleride online ödeme entegrasyonu eklenebilir.

Örneğin:

Cari
↓
Açık İşlem
↓
Ödeme
25. Kampanyalar ve Duyurular

Bu alan ticari iletişim için kullanılabilir.

Örnek:

yeni ürün,
fiyat kampanyası,
sezon kampanyası,
sistem duyurusu,
katalog güncellemesi.

Kampanyalar ürün fiyatlandırmasıyla ilişkilendirilebilir.

Ancak:

Campaign Content

ve:

ERP Pricing Rule

aynı şey olarak görülmemelidir.

26. Destek

Kullanıcının Netsim B2B üzerinden yardım almasını sağlar.

Örneğin:

Destek Talebi Oluştur
Talep Geçmişi
Talep Durumu

İleride Netsim destek sistemi ile entegre edilebilir.

27. Hesabım

Kullanıcı kendi hesap bilgilerini burada yönetebilir.

Örneğin:

Ad Soyad
E-posta
Telefon
Şifre
Bildirim tercihleri
Firma erişimleri

Cari kart bilgileri ile B2B kullanıcı bilgileri birbirinden ayrılmalıdır.

28. Ana İş Akışları

Uygulamanın temel kullanıcı akışları aşağıdaki şekilde modellenebilir.

Standart Sipariş
Ürünler
↓
Ürün Detayı
↓
Sepete Ekle
↓
Sepet
↓
Teslimat / Sipariş Bilgileri
↓
Sipariş Özeti
↓
Siparişi Onayla
↓
Netsim Siparişi
29. Hızlı Sipariş
Hızlı Sipariş
↓
Ürün + Miktar
↓
Sepet
↓
Sipariş
30. Favoriden Sipariş
Favoriler
↓
Sepete Ekle
↓
Sepet
↓
Sipariş
31. Tekliften Sipariş
Teklif
↓
Teklif Detayı
↓
Teklifi Kabul Et
↓
Sepet / Sipariş Özeti
↓
Sipariş

Netsim'deki gerçek teklif → sipariş dönüşüm kuralları entegrasyon sırasında uygulanmalıdır.

32. Tekrar Sipariş
Siparişler
↓
Eski Sipariş
↓
Siparişi Tekrarla
↓
Fiyat + Stok Yeniden Kontrol
↓
Sepet
↓
Sipariş

Eski fiyat ve stok doğrudan kopyalanmamalıdır.

33. Siparişten Sevkiyata
Sipariş
↓
Hazırlama
↓
Sevkiyat
↓
İrsaliye
↓
Teslim
34. Siparişten Faturaya
Sipariş
↓
Sevkiyat / İrsaliye
↓
Fatura
↓
Cari Hesap
35. Finans Akışı
Cari Hesap
↓
Açık İşlemler
↓
Fatura
↓
Vade
↓
Ödeme
36. Modüller Arası Bağımlılıklar

Ürün domaini:

Products
├── Categories
├── Inventory
├── Pricing
└── Product Content

Sepet:

Cart
├── Products
├── Inventory
├── Pricing
├── Company
└── User

Teklif:

Quotes
├── Customer
├── Products
├── Pricing
└── Orders

Sipariş:

Orders
├── Customer
├── Products
├── Pricing
├── Inventory
├── Shipments
├── Dispatch Notes
└── Invoices

Finans:

Finance
├── Customer Account
├── Invoices
├── Payments
└── Credit / Limit
37. Domain Yapısı

Uygulamanın mantıksal domainleri şu şekilde düşünülebilir:

Identity
Company
Catalog
Pricing
Inventory
Favorites
Cart
Quotes
Orders
Shipments
DispatchNotes
Invoices
Finance
Payments
Notifications
Support

Bu domain ayrımı ileride frontend/backend klasör mimarisinin de temelini oluşturabilir.

38. Source of Truth Yaklaşımı

En önemli mimari kararlarından biri hangi verinin kime ait olduğudur.

Temel yaklaşım:

Veri	Source of Truth
Ürün kartı	Netsim
Stok kodu	Netsim
Birim	Netsim
Kategori / ERP sınıflandırma	Netsim
Stok miktarı	Netsim
Satılabilir stok	Netsim
Fiyat	Netsim
Cari	Netsim
Cari bakiye	Netsim
Kredi limiti	Netsim
Teklif	Netsim
Sipariş	Netsim
Sipariş durumu	Netsim
İrsaliye	Netsim
Fatura	Netsim
Cari hareket	Netsim
Ödeme kaydı	Netsim
B2B Kullanıcısı	B2B
Login / Authentication	B2B
Kullanıcı-firma ilişkisi	B2B + Netsim mapping
Sepet	B2B
Favoriler	B2B
Kullanıcı tercihleri	B2B
Bildirim okundu bilgisi	B2B
UI tercihleri	B2B
39. Ürün İçeriği İçin Hibrit Model

Ürün konusunda ileride hibrit model gerekebilir.

Netsim:

Stok Kodu
Ürün Adı
Birim
Fiyat
Stok
ERP özellikleri

tutarken B2B:

Ürün görselleri
Web açıklaması
SEO metni
Öne çıkan özellikler
Dokümanlar
B2B sıralaması

gibi web'e özgü içerikler tutabilir.

Bu durumda:

Product
=
Netsim Product Data
+
B2B Product Presentation Data

olur.

Bu yaklaşım ERP'nin katalog yönetim sistemi gibi kullanılmasını engeller.

40. Integration Layer

Netsim ile B2B arasında ayrı bir integration katmanı bulunmalıdır.

Görevleri:

Netsim verisini okumak,
Netsim modellerini B2B modellerine çevirmek,
siparişleri Netsim'e göndermek,
hata yönetmek,
validation yapmak,
Netsim teknik detaylarını gizlemek.

Örneğin:

STOKKART
+
STOKKADE
+
fiyat tabloları

↓

Integration Layer

↓

ProductDto

Frontend'e Netsim tablo yapıları taşınmaz.

41. Anti-Corruption Layer Yaklaşımı

Entegrasyon katmanı bir çeşit:

Anti-Corruption Layer

gibi davranmalıdır.

Amaç Netsim'in:

tablo isimleri
kolon isimleri
ERP terminolojisi
teknik durum kodları

gibi detaylarının B2B domain modelini kirletmesini engellemektir.

Örneğin Netsim tarafında:

ALISSATIS_NO

olabilir.

B2B domaininde:

orderNumber

kullanılır.

42. Data Mapping

Mapping ayrı bir sorumluluk olmalıdır.

Örneğin:

Netsim Stock
↓
Product

Netsim Cari
↓
Company

Netsim Alınan Sipariş
↓
Order

Netsim İrsaliye
↓
DispatchNote

Bu mapping'ler dokümante edilmelidir.

Detaylar data/ veya integration/ dokümanlarında tutulabilir.

43. Read ve Write Ayrımı

B2B'nin Netsim ile yaptığı işlemler iki temel gruba ayrılabilir.

Read
Ürün oku
Fiyat oku
Stok oku
Cari oku
Sipariş oku
İrsaliye oku
Fatura oku
Write
Sipariş oluştur
Teklif oluştur
Gerekirse ödeme işle

Write işlemleri Read işlemlerine göre daha sıkı validation gerektirir.

44. Cache Yaklaşımı

Bütün Netsim verilerinin her kullanıcı isteğinde yeniden database'den çekilmesi gerekli olmayabilir.

Örneğin:

Product Catalog
Categories
Product Images

cache edilebilir.

Ancak:

Stock
Price
Credit Limit
Current Balance

gibi kritik veriler daha güncel tutulmalıdır.

Bu karar daha sonra teknik mimaride detaylandırılmalıdır.

45. Search Architecture

Ürün sayısı yükseldiğinde doğrudan ERP sorguları üzerinden arama yeterli olmayabilir.

Uzun vadede:

Netsim
↓
Product Synchronization
↓
B2B Search Index
↓
Product Search

yaklaşımı kullanılabilir.

Ancak Netsim yine ürün verisinin ana kaynağı olmaya devam eder.

Search index türetilmiş veridir.

46. Notification Architecture

Bildirimler farklı domainlerden gelebilir.

Örneğin:

Orders
→ Siparişiniz onaylandı

Shipments
→ Siparişiniz sevk edildi

Finance
→ Ödemenizin vadesi yaklaşıyor

Campaign
→ Yeni kampanya başladı

Bütün bildirimler ortak:

Notification

domaininde kullanıcıya sunulabilir.

47. Audit ve İzlenebilirlik

B2B üzerinden ERP'ye gönderilen kritik işlemler izlenebilir olmalıdır.

Örneğin:

Kim?
Hangi firma?
Ne zaman?
Hangi işlem?
Hangi Netsim kaydı oluştu?
Başarılı mı?

bilgileri gerektiğinde bulunabilmelidir.

Özellikle:

Sipariş
Teklif
Ödeme

işlemlerinde önemlidir.

48. Error Boundary

Netsim tarafındaki hata tüm uygulamayı çökertmemelidir.

Örneğin fiyat servisi çalışmıyorsa:

Ürün kataloğu tamamen çalışmaz hale gelmek

yerine kullanıcıya uygun state gösterilmelidir.

Örneğin:

Fiyat bilgisi şu anda alınamıyor.
Lütfen kısa süre sonra tekrar deneyin.
49. Module Isolation

Bir modüldeki hata mümkün olduğunca diğer modülleri etkilememelidir.

Örneğin:

Announcements

çalışmıyor diye:

Orders

modülü çalışmaz hale gelmemelidir.

Bu prensip teknik mimaride de korunmalıdır.

50. Uygulama Seviyesi Ortak Servisler

Domain modüllerinin yanında bazı ortak sistemler bulunacaktır.

Authentication
Authorization
Company Context
Search
Notifications
Error Handling
Logging
Telemetry
Integration
Configuration

Bunlar tek bir iş modülüne ait değildir.

51. Modül Öncelikleri

İlk ürün geliştirmesinde bütün modülleri aynı anda yapmak gerekmemelidir.

Önerilen temel sıra:

Faz 1 — Ticari Çekirdek
Authentication
Company Selection
Products
Categories
Pricing
Inventory
Cart
Orders

Bunun sonunda gerçek bir:

Ürün → Sepet → Sipariş

akışı çalışır.

Faz 2 — Sipariş Sonrası
Order Tracking
Shipments
Dispatch Notes
Invoices
Faz 3 — Finans
Current Account
Open Transactions
Payments
Credit Limit
Faz 4 — B2B Kolaylıkları
Favorites
Quick Order
Repeat Order
Notifications
Campaigns
Faz 5 — Genişleme
Administration
Sales Representative
Advanced Reports
Online Payments
52. ERP ile B2B Sorumluluk Ayrımı

Netsim ERP şunları yönetmeye devam etmelidir:

Ürün ana verisi
Stok
Fiyat
Cari
Ticari belgeler
Sipariş
İrsaliye
Fatura
Finans
Muhasebe

B2B ise:

Web kullanıcı deneyimi
Kullanıcı hesabı
Sepet
Favoriler
Ürün sunumu
Kullanıcı tercihleri
Bildirim deneyimi
Kolaylaştırılmış workflow

üzerine odaklanmalıdır.

53. Uygulama Prensipleri

Tüm mimari aşağıdaki prensiplere uymalıdır.

1. ERP ekranları birebir web'e taşınmaz.

B2B ayrı bir kullanıcı deneyimidir.

2. ERP karmaşıklığı integration katmanında gizlenir.

Frontend Netsim'in database yapısını bilmez.

3. Domain terminolojisi kullanıcı odaklıdır.
STOKKART → Product
CARI → Company / Account
ALISSATIS → Order

gibi dönüşümler yapılır.

4. Netsim ticari verinin source of truth'udur.

B2B bu veriyi yeniden tanımlamaz.

5. B2B'ye özgü davranışların sahibi B2B'dir.

Örneğin:

Cart
Favorites
User Preferences
6. Modüller birbirinden mümkün olduğunca bağımsız tutulur.
7. Her modül açık bir sorumluluğa sahip olur.
8. Kullanıcı bağlamı firma üzerinden yönetilir.
9. Kritik işlemler Netsim tarafından doğrulanmadan tamamlanmış kabul edilmez.
10. Gelecekteki paneller mevcut müşteri portalını karmaşıklaştırmadan eklenebilmelidir.
54. Uygulamanın Genel Haritası

Ürünün tamamını tek şemada gösterirsek:

Netsim B2B
│
├── Identity
│   ├── Login
│   ├── Authentication
│   ├── Users
│   └── Authorization
│
├── Company Context
│   ├── Company Selection
│   └── Permissions
│
├── Catalog
│   ├── Products
│   ├── Categories
│   ├── Product Detail
│   ├── Inventory
│   └── Pricing
│
├── Shopping
│   ├── Favorites
│   ├── Quick Order
│   └── Cart
│
├── Sales
│   ├── Quotes
│   └── Orders
│
├── Logistics
│   ├── Shipments
│   └── Dispatch Notes
│
├── Finance
│   ├── Current Account
│   ├── Invoices
│   └── Payments
│
├── Communication
│   ├── Notifications
│   ├── Announcements
│   └── Campaigns
│
├── Support
│
└── Account

Bunun altında:

B2B Application
        ↓
Integration Layer
        ↓
Netsim ERP

bulunur.

55. Mimariyi Yöneten Ana Fikir

Bu projenin en önemli mimari ayrımı şu olmalı:

Netsim ERP
↓
Ne doğru?

B2B Domain
↓
Bu bilgi kullanıcı açısından ne anlama geliyor?

UX
↓
Kullanıcı bunu nasıl görmeli ve kullanmalı?

Örneğin Netsim bize:

fiziki stok = 100
rezerv = 80

diyebilir.

B2B domain:

availableQuantity = 20

üretir.

UI ise kullanıcıya:

Stokta
20 adet

gösterir.

Bu üç katmanın birbirinden ayrılması bence projenin en kritik mimari kararlarından biri.

56. Kısa Mimari Tanım

Netsim B2B'nin ürün mimarisi şu şekilde özetlenebilir:

Netsim ERP'yi ticari verilerin ana kaynağı olarak kullanan; ERP verilerini ayrı bir entegrasyon ve domain katmanında sadeleştiren; ürün, sipariş, lojistik ve finans süreçlerini müşteri odaklı modüller halinde sunan web tabanlı B2B portalı.

Bir sonraki dokümanda artık bundan çok daha teknik bir seviyeye geçmek mantıklı olur. Özellikle Data Architecture tarafında Product, Company, Cart, Order, Quote, Shipment, DispatchNote, Invoice gibi B2B modellerini oluşturup, “Netsim'deki hangi kavram → B2B'de hangi modele dönüşüyor?” haritasını çıkarmamız projenin backend ve SQL tarafını ciddi biçimde netleştirir.