User Types

Bu dosya Netsim B2B içerisinde bulunacak kullanıcı türlerini, rollerini, erişim kapsamlarını ve temel yetkilendirme prensiplerini tanımlar.

Amaç, farklı kullanıcıların sistem içerisinde:

hangi firmalara erişebildiğini,
hangi ticari verileri görebildiğini,
hangi işlemleri gerçekleştirebildiğini,
hangi Netsim kayıtlarıyla ilişkilendirildiğini

açık şekilde belirlemektir.

Temel yaklaşım:

Kullanıcı kimliği B2B tarafında, ticari yetki ve veri kapsamı ise kullanıcı–firma/cari ilişkisi üzerinden yönetilmelidir.

1. Kullanıcı Modeli

Netsim B2B kullanıcısı doğrudan bir Netsim CARI kaydı değildir.

Aşağıdaki kavramlar birbirinden ayrılmalıdır:

B2B User
≠
Cari
≠
Netsim Kullanıcısı
≠
Personel

Bunlar gerektiğinde birbirleriyle ilişkilendirilebilir.

Temel model:

B2B User
│
├── Identity
│   ├── Ad
│   ├── Soyad
│   ├── E-posta
│   ├── Telefon
│   └── Authentication
│
├── Role / Permissions
│
└── Company / Cari Memberships
    ├── Cari A
    ├── Cari B
    └── Cari C
2. B2B'nin Kendi Kullanıcı Sistemi Olmalı mı?

Önerilen yaklaşım:

Evet. B2B'nin kendi kullanıcı kimlik sistemi olmalıdır.

Çünkü B2B kullanıcısı ERP kullanıcısından farklı bir kavramdır.

Bir bayi çalışanının Netsim ERP'ye giriş yapması gerekmez.

Örneğin:

mehmet@bayi.com

adresine sahip müşteri kullanıcısının Netsim içerisinde bir Nuke kullanıcısı olması zorunlu olmamalıdır.

B2B aşağıdaki bilgileri kendi tarafında tutabilir:

kullanıcı ID,
ad / soyad,
e-posta,
telefon,
authentication bilgileri,
aktif / pasif durumu,
kullanıcı tercihleri,
roller,
izinler,
firma/cari bağlantıları.
3. Kullanıcı Cari'ye Bağlı mıdır?

Müşteri tarafındaki kullanıcılar ticari işlem yapabilmek için en az bir Netsim cari hesabıyla ilişkilendirilmelidir.

Örneğin:

B2B User
U123

↓

Cari
CARI_NO = 1245

Bu ilişki sayesinde kullanıcı:

fiyat,
bakiye,
sipariş,
teklif,
irsaliye,
fatura

gibi cari bazlı verilere erişebilir.

Ancak:

Kullanıcının kendisi cari değildir.

Cari bir ticari hesaptır.

Kullanıcı ise o ticari hesaba erişim hakkı olan gerçek kişidir.

4. Bir Kullanıcı Birden Fazla Cariye Bağlı Olabilir mi?

Evet.

Mimari bunu desteklemelidir.

Örneğin:

Umut Yılmaz
│
├── CARI 1001
│   └── Ankara Ticaret A.Ş.
│
├── CARI 1038
│   └── Ankara Ticaret İstanbul Şubesi
│
└── CARI 2094
    └── Ankara Ticaret İzmir Şubesi

Kullanıcı sisteme girdikten sonra aktif çalışma hesabını seçebilir.

Aktif Firma:
Ankara Ticaret A.Ş. ▼

Uygulamadaki ticari işlemler aktif cari bağlamında çalışır.

5. Company / Cari Membership

Kullanıcı ile cari arasındaki ilişki doğrudan kullanıcı tablosuna:

CARI_NO

koyularak çözülmemelidir.

Çünkü ilişki:

Many-to-Many

olabilir.

Önerilen kavram:

UserCompanyMembership

veya:

UserCariMembership

Örneğin:

User
  ↓
UserCompanyMembership
  ↓
Cari

Membership içerisinde şunlar tutulabilir:

userId
cariNo
role
permissions
isDefault
isActive

Bu yapı gelecekte çok daha esnek olur.

6. Aktif Firma / Cari Context

Kullanıcı birden fazla firmaya bağlıysa uygulamada aynı anda bir aktif çalışma bağlamı bulunur.

Örneğin:

CurrentCompany

veya:

ActiveCari

Kullanıcı firma değiştirdiğinde:

ürün fiyatları,
cari bakiye,
kredi limiti,
siparişler,
teklifler,
faturalar,
irsaliyeler,
sepet

yeniden ilgili firma bağlamında değerlendirilmelidir.

7. Firma Değiştirme

Birden fazla firması bulunan kullanıcı giriş yaptıktan sonra varsayılan firmasıyla sisteme girebilir.

Topbar içerisinden firma değiştirilebilir.

Örneğin:

Ankara Ticaret A.Ş. ▼

Ankara Ticaret A.Ş.
İstanbul Bayi Ltd.
İzmir Dağıtım A.Ş.

Firma değişimi yalnızca kullanıcının yetkili olduğu firmalar arasında yapılabilir.

8. Sepet ve Firma İlişkisi

Sepet mutlaka firma/cari bağlamına bağlı olmalıdır.

Örneğin:

Cart
├── User
└── Cari

Şu durum oluşmamalıdır:

Firma A fiyatlarıyla oluşturulan sepet

↓

Firma B adına sipariş

Bu nedenle firma değiştirildiğinde:

firma bazlı ayrı sepet tutulabilir

veya

aktif sepet değiştirilebilir.

Önerilen yaklaşım:

Her cari için bağımsız sepet tutulması.

Böylece kullanıcı firma değiştirip geri döndüğünde sepeti kaybolmaz.

9. Role ve Permission Ayrımı

Yetkilendirme iki seviyede düşünülmelidir.

Role
↓
Permission Set

Örneğin:

Bayi Finans Kullanıcısı

rolü şu permission'ları içerebilir:

finance.view
invoice.view
payment.view
accountStatement.view

Ancak:

order.create

yetkisine sahip olmayabilir.

Bu yapı klasik RBAC yaklaşımına uygundur.

10. Kullanıcı Alanları

Sistemde iki temel kullanıcı ailesi bulunmalıdır.

External Users
Internal Users
11. External Users

B2B müşterileri ve bayi kullanıcılarıdır.

Ana kullanıcı tipleri:

Bayi Kullanıcısı
Bayi Yöneticisi
Finans Kullanıcısı
Sipariş Onay Kullanıcısı
Salt Okuma Kullanıcısı
12. Internal Users

Netsim B2B'yi kullanan satıcı firma çalışanlarıdır.

Ana kullanıcı tipleri:

Satış Temsilcisi
Firma B2B Admin
Sistem Admin

Bu roller müşteri portalına göre daha geniş veri kapsamına sahip olabilir.

13. Bayi Kullanıcısı
Amaç

Standart B2B satın alma işlemlerini gerçekleştirmek.

Bu sistemin varsayılan müşteri kullanıcı tipidir.

Görebildiği Modüller
Dashboard
Ürünler
Kategoriler
Hızlı Sipariş
Favoriler
Sepet
Teklifler
Siparişler
Sevkiyatlar
İrsaliyeler
Faturalar

Finans alanları firmanın politikasına göre açılabilir veya kapatılabilir.

Yapabildiği İşlemler
ürün arama,
ürün görüntüleme,
fiyat görüntüleme,
stok görüntüleme,
favoriye ekleme,
sepete ekleme,
miktar değiştirme,
teklif talebi oluşturma,
sipariş oluşturma,
geçmiş siparişleri görüntüleme,
siparişi tekrar etme,
sevkiyat görüntüleme,
irsaliye görüntüleme,
fatura görüntüleme.
Veri Sınırı

Yalnızca bağlı olduğu cari veya carilere erişebilir.

Örneğin:

User → Cari 1005

ise:

Cari 1006
Cari 1007

verilerine erişemez.

14. Bayi Yöneticisi

Bayi içerisindeki yönetici kullanıcıdır.

Standart Bayi Kullanıcısının bütün fonksiyonlarına sahip olabilir.

Ek olarak kendi firma kullanıcılarını yönetebilir.

Ek Yetkiler

Örneğin:

firma kullanıcılarını görüntüleme,
kullanıcı davet etme,
kullanıcı pasife alma,
kullanıcı rollerini belirleme,
sipariş onaylama,
firma tercihlerini yönetme.

Ancak Bayi Yöneticisi:

Netsim ERP içerisindeki cari kartını yönetmez.

Yalnızca B2B tarafındaki firma kullanıcı ilişkilerini yönetir.

15. Sipariş Veren Kullanıcı

Bazı müşterilerde satın alma kullanıcısını standart Bayi Kullanıcısından daha dar yetkili tanımlamak gerekebilir.

Amaç:

Ürün bulup sipariş hazırlamak.

Yetkileri:

product.view
price.view
stock.view
cart.manage
favorite.manage
order.create
order.view
quote.view

Finansal verilere erişimi olmayabilir.

Örneğin:

Cari bakiye
Kredi limiti
Vadesi geçen borç

bu kullanıcıya kapatılabilir.

Bu rol özellikle orta ve büyük müşteri firmalarında faydalıdır.

16. Sipariş Onay Kullanıcısı

Bazı B2B müşterilerinde sipariş veren kişi ile siparişi onaylayan kişi farklı olabilir.

Örneğin:

Satın Alma Personeli
↓
Sipariş Taslağı
↓
Satın Alma Müdürü
↓
Onay
↓
Netsim Siparişi

Bu senaryo desteklenecekse ayrı rol oluşturulabilir.

Yetkiler
bekleyen siparişleri görüntüleme,
sipariş detayını görüntüleme,
sipariş onaylama,
sipariş reddetme.

Bu rol ilk MVP'de gerekli olmayabilir ancak mimari desteklemelidir.

17. Finans Kullanıcısı
Amaç

Firmanın finansal işlemlerini takip etmek.

Görebildiği Modüller
Dashboard finans özetleri
Cari Hesap
Cari Ekstre
Faturalar
Ödemeler
Açık İşlemler
Yapabildiği İşlemler
cari bakiye görüntüleme,
cari hareket görüntüleme,
fatura görüntüleme,
açık işlem görüntüleme,
vade görüntüleme,
ödeme geçmişi görüntüleme,
belge indirme.

Online ödeme fonksiyonu eklenirse ayrıca:

payment.create

permission'ı gerektirmelidir.

Göremeyebileceği Alanlar

İsteğe göre:

ürünler,
sepet,
hızlı sipariş.

Ancak siparişleri görüntülemesi gerekebilir.

Bu nedenle roller hard-coded ekran listelerine değil permission sistemine dayanmalıdır.

18. Salt Okuma Kullanıcısı

Firma içerisindeki bazı kişilerin işlem yapmadan sistemi görüntülemesi gerekebilir.

Örneğin:

yönetici,
denetçi,
gözlemci.

Bu kullanıcı:

view

yetkilerine sahiptir ancak:

create
update
delete
approve

yetkilerine sahip değildir.

Örneğin:

Siparişleri görebilir.
Sipariş oluşturamaz.
Sipariş iptal edemez.
19. Satış Temsilcisi

Satıcı firma içerisindeki kullanıcıdır.

Müşteri kullanıcısından önemli farkı:

Birden fazla müşteriye/cariye erişebilir.

Örneğin:

Ahmet — Satış Temsilcisi
│
├── Cari 1001
├── Cari 1002
├── Cari 1003
├── Cari 1018
└── Cari 1027
Amaç

Sorumlu olduğu müşterileri B2B üzerinden takip etmek.

Görebildiği Alanlar

Yetkisine bağlı olarak:

müşteriler,
ürünler,
teklifler,
siparişler,
sevkiyat,
cari durum,
müşteri aktiviteleri.
İşlemler

İleride:

müşteri adına teklif hazırlama,
müşteri adına sepet hazırlama,
müşteri adına sipariş oluşturma

desteklenebilir.

Bu tür işlemlerde audit zorunludur.

Sistem:

Siparişi oluşturan:
Ahmet / Satış Temsilcisi

Sipariş verilen cari:
ABC Bayi A.Ş.

ayrımını korumalıdır.

20. Firma B2B Admin

Netsim B2B'yi müşterilerine sunan firmanın yetkili kullanıcısıdır.

Müşteri carilerinden farklı bir kullanıcı kapsamına sahiptir.

Amaç

B2B uygulamasına özgü yönetim işlemlerini gerçekleştirmek.

Örneğin:

B2B müşterilerini görüntüleme,
B2B kullanıcılarını görüntüleme,
müşteri erişimlerini yönetme,
duyuru yönetme,
ürün web içeriği yönetme,
kampanya içeriği yönetme,
B2B konfigurasyonu yönetme,
entegrasyon durumlarını görüntüleme.

Bu rol ERP admin ile aynı değildir.

21. Sistem Admin

En yüksek seviyeli teknik B2B kullanıcısıdır.

Normal ticari kullanıcı değildir.

Amaç:

sistem konfigurasyonu,
integration ayarları,
sistem kullanıcı yönetimi,
hata/log inceleme,
güvenlik yönetimi

gibi teknik işlemleri gerçekleştirmektir.

Bu kullanıcı tipi mümkün olduğunca sınırlı sayıda bulunmalıdır.

22. Önerilen Temel Roller

İlk sürüm için sistemi gereksiz karmaşıklaştırmamak adına şu roller yeterlidir:

1. Bayi Kullanıcısı
2. Bayi Yöneticisi
3. Finans Kullanıcısı
4. Salt Okuma Kullanıcısı

Internal taraf gerekiyorsa:

5. Satış Temsilcisi
6. B2B Admin

Sipariş onay rolü gibi daha gelişmiş roller sonraki aşamada devreye alınabilir.

23. Permission Model

Permission isimleri domain bazlı oluşturulmalıdır.

Örneğin:

products.view
prices.view
inventory.view

cart.view
cart.manage

favorites.view
favorites.manage

quotes.view
quotes.create
quotes.approve

orders.view
orders.create
orders.cancel
orders.approve

shipments.view

dispatchNotes.view

invoices.view

finance.view
accountStatement.view

payments.view
payments.create

users.view
users.invite
users.manage

companySettings.view
companySettings.manage

Bu yaklaşım yeni roller oluşturmayı kolaylaştırır.

24. Permission Seviyeleri

Genel olarak dört temel işlem seviyesi kullanılabilir:

view

create

manage

approve

Gerekli domainlerde:

cancel
delete
export

gibi özel permission'lar eklenebilir.

25. Role-Permission Matrisi

Başlangıç matrisi şu şekilde olabilir:

Permission	Bayi Kullanıcısı	Bayi Yöneticisi	Finans	Salt Okuma	Satış Temsilcisi	B2B Admin
Ürün görüntüleme	✓	✓	Ops.	✓	✓	✓
Fiyat görüntüleme	✓	✓	Ops.	✓	✓	✓
Stok görüntüleme	✓	✓	Ops.	✓	✓	✓
Sepet yönetme	✓	✓	—	—	Ops.	✓
Favori yönetme	✓	✓	—	—	Ops.	✓
Sipariş görüntüleme	✓	✓	✓	✓	✓	✓
Sipariş oluşturma	✓	✓	—	—	Ops.	✓
Sipariş onaylama	—	Ops.	—	—	Ops.	✓
Teklif görüntüleme	✓	✓	Ops.	✓	✓	✓
Teklif oluşturma	✓	✓	—	—	Ops.	✓
Sevkiyat görüntüleme	✓	✓	Ops.	✓	✓	✓
İrsaliye görüntüleme	✓	✓	✓	✓	✓	✓
Fatura görüntüleme	Ops.	✓	✓	✓	Ops.	✓
Cari bakiye görüntüleme	Ops.	✓	✓	✓	Ops.	✓
Cari ekstre görüntüleme	—/Ops.	✓	✓	✓	Ops.	✓
Ödeme görüntüleme	—/Ops.	✓	✓	✓	Ops.	✓
Ödeme oluşturma	—	Ops.	Ops.	—	—	✓
Firma kullanıcılarını yönetme	—	✓	—	—	—	✓
B2B ayarlarını yönetme	—	—	—	—	—	✓

Ops.:

Firma konfigurasyonuna göre açılabilir.

26. Role + Permission + Data Scope

Yetkilendirme sadece:

Role

ile çözülmemelidir.

Asıl erişim kontrolü üç parçadan oluşmalıdır:

Role
+
Permission
+
Data Scope

Örneğin:

Role:
Finans Kullanıcısı

Permission:
invoice.view

Scope:
CARI_NO = 1458

Bu kullanıcı başka carinin faturasına erişemez.

27. Veri Kapsamı

Kullanıcıların veri erişimi şu seviyelerde olabilir.

Own Cari
Yalnızca aktif cari

Standart müşteri kullanıcıları.

Assigned Caris
Yetkilendirilmiş birden fazla cari

Satış temsilcileri.

All Caris
Tüm B2B carileri

B2B Admin gibi internal kullanıcılar.

Bu veri kapsamı backend üzerinde uygulanmalıdır.

28. Nesne Seviyesi Yetkilendirme

Şu kontrol yeterli değildir:

Kullanıcı orders.view yetkisine sahip mi?

Ayrıca:

Bu sipariş kullanıcının erişebildiği cariye mi ait?

kontrol edilmelidir.

Örneğin:

GET /orders/15789

isteğinde backend:

1. Kullanıcı authenticated mı?
2. orders.view var mı?
3. Order hangi cariye ait?
4. Kullanıcı o cariye erişebiliyor mu?

kontrollerini yapmalıdır.

29. Netsim Nuke Kullanıcısı Eşleşmesi

Müşteri/Bayi kullanıcılarının Netsim Nuke kullanıcısıyla eşleşmesi zorunlu olmamalıdır.

Önerilen yaklaşım:

External B2B User
→ Nuke mapping zorunlu değil

Internal kullanıcılar için ise mapping gerekebilir.

Örneğin:

Satış Temsilcisi
↓
NUKE_USER_NO

veya:

PERSONEL_NO

üzerinden Netsim çalışanı ile ilişkilendirilebilir.

Kesin tablo ve alan eşleşmeleri Netsim veri mimarisi incelendikten sonra belirlenmelidir.

30. Personel Eşleşmesi

Özellikle:

Satış Temsilcisi
Firma B2B Admin

gibi internal kullanıcılar Netsim personel kayıtlarıyla ilişkilendirilebilir.

Örneğin:

B2B USER
↓
PERSONEL_NO

Bu ilişki sayesinde:

Sorumlu satış temsilcisi
Müşteri portföyü
Organizasyon

gibi bilgiler oluşturulabilir.

Ancak B2B authentication yine bağımsız tutulabilir.

31. Önerilen Identity Mapping

Kavramsal olarak:

B2B_USER
│
├── USER_ID
├── EMAIL
├── PHONE
├── NAME
├── STATUS
└── AUTHENTICATION

ilişki tablosu:

B2B_USER_COMPANY
│
├── USER_ID
├── CARI_NO
├── ROLE_ID
├── IS_DEFAULT
└── STATUS

internal mapping:

B2B_INTERNAL_MAPPING
│
├── USER_ID
├── NUKE_USER_NO
└── PERSONEL_NO

Bu isimler kavramsaldır; gerçek database isimleri daha sonra belirlenebilir.

32. Yetkinin Firma Bazlı Olabilmesi

Aynı kullanıcının farklı firmalarda farklı rolleri olabilir.

Örneğin:

Umut

ABC A.Ş.
→ Bayi Yöneticisi

XYZ Ltd.
→ Salt Okuma

Bu nedenle rol doğrudan:

User

üzerine değil mümkünse:

User ↔ Company Membership

üzerine bağlanmalıdır.

Bu önemli bir mimari karardır.

33. Kullanıcı Daveti

Bayi Yöneticisinin kullanıcı yönetmesine izin verilirse önerilen akış:

Bayi Yöneticisi

↓

Kullanıcı Davet Et

↓

E-posta

↓

Rol Seç

↓

Davet Gönder

↓

Kullanıcı Hesabını Oluşturur

↓

Firma Membership Aktifleşir

Bayi yöneticisi başka carilere kullanıcı ekleyememelidir.

34. Kullanıcı Pasifleştirme

Kullanıcı silmek yerine çoğunlukla:

Active
Inactive

durumu kullanılmalıdır.

Çünkü kullanıcının geçmişte yaptığı:

siparişler,
teklifler,
onaylar

audit açısından korunmalıdır.

35. Kullanıcı Audit Bilgileri

Kritik işlemlerde gerçek kullanıcı mutlaka kayıt altına alınmalıdır.

Örneğin:

Sipariş:
SP2026001234

Cari:
ABC A.Ş.

İşlemi yapan:
mehmet@abc.com

Rol:
Bayi Kullanıcısı

Tarih:
08.09.2026 14:34

Sadece:

CARI_NO

tutmak yeterli değildir.

İşlemi yapan gerçek kullanıcı da bilinmelidir.

36. Impersonation

Satış temsilcisi veya admin'in müşteri adına işlem yapması gelecekte desteklenebilir.

Ancak bu durumda sistem iki kimliği birbirinden ayırmalıdır:

Acting User

ve:

Target Company

Örneğin:

İşlemi yapan:
Ahmet Yılmaz
Satış Temsilcisi

Müşteri:
ABC Bayi A.Ş.

Bu tür işlemler audit log'a kaydedilmelidir.

37. Authentication ve Authorization Ayrımı

Bu iki kavram birbirinden ayrılmalıdır.

Authentication
Sen kimsin?

Örneğin:

umut@example.com
Authorization
Ne yapabilirsin?

Örneğin:

Sipariş oluşturabilir.
Finans göremez.
Data Scope
Hangi veriler üzerinde yapabilirsin?

Örneğin:

Sadece CARI_NO 1458.

Sonuç:

Authentication
+
Authorization
+
Data Scope

birlikte güvenlik modelini oluşturur.

38. Frontend Yetkilendirme

Frontend kullanıcı yetkisine göre:

menüleri,
butonları,
aksiyonları,
finansal bilgileri

gizleyebilir.

Örneğin finans yetkisi olmayan kullanıcı:

Cari Hesap

menüsünü görmeyebilir.

Ancak:

Frontend'de gizlemek güvenlik değildir.

39. Backend Yetkilendirme

Her kritik API isteğinde backend:

User
↓
Role
↓
Permission
↓
Company Membership
↓
Data Scope
↓
Resource Ownership

kontrolü yapmalıdır.

Örneğin kullanıcı URL'yi manuel değiştirerek:

/orders/123

yerine:

/orders/999

yazdığında başka müşterinin siparişini görememelidir.

40. Finansal Veri Yetkisi

Finansal bilgiler ayrıca korunmalıdır.

Örneğin aşağıdaki permission'lar ayrı olabilir:

finance.balance.view
finance.statement.view
invoice.view
payment.view
creditLimit.view

Böylece kullanıcı:

Fatura görebilir

ama:

Toplam cari bakiye göremez

şeklinde yapılandırılabilir.

41. Fiyat Görüntüleme Yetkisi

Bazı B2B senaryolarında tüm kullanıcıların fiyat görmesi istenmeyebilir.

Bu nedenle:

price.view

ayrı permission olabilir.

Fiyat yetkisi yoksa ürün:

Ürün Adı
Stok

gibi bilgilerle gösterilebilir.

Fiyat alanı frontend'de gizlenirken backend de fiyatı response içerisinde göndermemelidir.

42. Sipariş Onay Sistemi

İleride firma bazında optional approval workflow desteklenebilir.

Örneğin:

Firma A
approvalRequired = false

Firma B
approvalRequired = true

Firma B için:

Sipariş Veren
↓
Taslak Sipariş
↓
Sipariş Onaylayan
↓
Netsim

akışı kullanılabilir.

Bu yapı ilk sürümde kapalı özellik olarak tasarlanabilir.

43. Kullanıcı Durumları

B2B kullanıcılarının minimum şu durumları olabilir:

Invited

Active

Inactive

Locked

Opsiyonel:

PendingVerification
Invited

Kullanıcı davet edilmiş ancak hesabını tamamlamamış.

Active

Normal şekilde sistemi kullanabilir.

Inactive

Firma veya admin tarafından erişimi kapatılmış.

Locked

Güvenlik nedeniyle geçici olarak kilitlenmiş.

44. Varsayılan Rol

Yeni kullanıcı oluşturulurken mümkün olan en düşük yetkili güvenli rol verilmelidir.

Örneğin:

Bayi Kullanıcısı

veya daha kısıtlı bir rol.

Kullanıcıya otomatik:

Bayi Yöneticisi

verilmemelidir.

Prensip:

Least Privilege

45. Role Explosion'dan Kaçınma

Şu tarz onlarca rol oluşturulmamalıdır:

Sipariş Görebilen Finansçı
Sipariş Göremeyen Finansçı
Fatura Görebilen Satın Almacı
Fatura Göremeyen Satın Almacı
...

Bunun yerine:

Role
+
Permission

kullanılmalıdır.

Roller yaygın kullanım senaryoları için hazır şablonlardır.

46. Önerilen Kullanıcı Hiyerarşisi

Genel model:

B2B Users
│
├── External
│   │
│   ├── Bayi Kullanıcısı
│   ├── Bayi Yöneticisi
│   ├── Finans Kullanıcısı
│   ├── Sipariş Onay Kullanıcısı
│   └── Salt Okuma Kullanıcısı
│
└── Internal
    │
    ├── Satış Temsilcisi
    ├── B2B Admin
    └── Sistem Admin
47. MVP İçin Önerilen Kullanıcı Yapısı

İlk sürümde bütün rolleri aktif etmek yerine:

External

1. Bayi Kullanıcısı
2. Bayi Yöneticisi
3. Finans Kullanıcısı
4. Salt Okuma

ile başlanabilir.

Internal taraf için:

5. B2B Admin

yeterli olabilir.

Daha sonra:

Sipariş Onaylayan
Satış Temsilcisi

eklenebilir.

Bu, ilk sürümü gereksiz yetkilendirme karmaşıklığından korur.

48. Temel Veri Modeli

Kullanıcı yapısının kavramsal veri modeli:

User
│
├── id
├── name
├── email
├── phone
├── status
└── authentication
        │
        │
        ▼
UserCompanyMembership
│
├── userId
├── cariNo
├── roleId
├── isDefault
└── status
        │
        │
        ▼
Role
│
├── id
├── name
└── permissions
        │
        │
        ▼
Permission

Internal kullanıcılar için ek mapping:

User
│
└── NetsimIdentityMapping
    ├── nukeUserNo
    └── personelNo
49. Yetkilendirme Kontrolünün Genel Akışı

Her korumalı işlemde sistem şu mantığı izlemelidir:

Kullanıcı giriş yapmış mı?
        ↓
Aktif mi?
        ↓
Aktif firma seçilmiş mi?
        ↓
Bu firmaya erişimi var mı?
        ↓
İşlem için gerekli permission var mı?
        ↓
İstenen veri aktif firmaya ait mi?
        ↓
İşleme izin ver

Bu kontrol frontend'den bağımsız olarak backend tarafında uygulanmalıdır.

50. Ana Güvenlik Kuralları
Kullanıcı yalnızca bağlı olduğu carilere erişebilir.
Bir kullanıcının bir cariye erişmesi diğer carilere erişebileceği anlamına gelmez.
Frontend menüsünü gizlemek yetkilendirme değildir.
Backend her API isteğinde kullanıcı ve veri kapsamını doğrulamalıdır.
ID değiştirilerek başka müşterinin verisine erişim engellenmelidir.
Kritik işlemler audit edilmelidir.
Finansal bilgiler ayrı permission ile korunabilmelidir.
Admin yetkileri minimum kullanıcıya verilmelidir.
Firma değişimi kullanıcı membership'i üzerinden doğrulanmalıdır.
Netsim teknik kimlikleri doğrudan authentication modeli olarak kullanılmak zorunda değildir.
External B2B kullanıcıları Netsim ERP kullanıcı hesabına ihtiyaç duymamalıdır.
Kullanıcı silmek yerine mümkün olduğunda pasifleştirilmelidir.
51. Kullanıcı Modelinin Kısa Tanımı

Netsim B2B kullanıcı mimarisi şu şekilde özetlenebilir:

B2B içerisinde kendi kimliğine sahip olan kullanıcının, bir veya birden fazla Netsim cari hesabına membership üzerinden bağlandığı; rol ve permission'ların bu ilişki üzerinde tanımlandığı; tüm veri erişiminin aktif cari kapsamıyla sınırlandırıldığı RBAC tabanlı kullanıcı modeli.

Bence burada özellikle User → UserCompanyMembership → Cari kararını kilitlemek önemli. Çünkü User tablosuna doğrudan tek bir CARI_NO koyarsak, daha sonra bir kullanıcının birden fazla firmayı yönetmesi, farklı firmalarda farklı yetkilere sahip olması ve satış temsilcisi senaryoları gereksiz şekilde zorlaşır.