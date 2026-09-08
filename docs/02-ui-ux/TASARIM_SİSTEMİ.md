Design System

Bu dosya Netsim B2B uygulamasının ortak görsel dilini, UI standartlarını ve temel tasarım kurallarını tanımlar.

Amaç; Dashboard, ürün listeleme, ürün detay, kategori, sepet, sipariş, teklif, cari hesap, ödeme, irsaliye, rapor ve diğer tüm ekranlarda aynı görsel dilin korunmasını sağlamaktır.

Bu dosya belirli bir ekranın yerleşimini tarif etmez. Bunun yerine bütün uygulamada tekrar kullanılacak:

renkleri,
tipografiyi,
boşluk sistemini,
yüzeyleri,
kartları,
butonları,
form elemanlarını,
tabloları,
durum göstergelerini,
ikonları,
responsive davranışları,
etkileşim kurallarını

tanımlar.

Uygulamada footer kullanılmayacaktır.

1. Tasarım Karakteri

Netsim B2B'nin görsel karakteri şu kavramlar üzerine kurulmalıdır:

Modern
Minimal
Kurumsal
Güvenilir
Ferah
Hızlı
Kullanıcı dostu
Modüler
Veri odaklı
Ticari
Profesyonel
Sade ama boş görünmeyen
ERP kadar bilgi sunabilen fakat klasik ERP arayüzleri kadar karmaşık olmayan

Ana tasarım yaklaşımı:

ERP'nin sahip olduğu veri yoğunluğu ve operasyonel gücü, modern bir B2B web uygulamasının sadeliğiyle sunmak.

Arayüz son kullanıcıya bir ERP programı kullanıyormuş hissi vermemelidir.

Kullanıcı tarafında amaç:

ürün bulmak,
fiyat görmek,
sipariş oluşturmak,
teklif incelemek,
cari durumunu kontrol etmek,
ödeme durumunu görmek,
sevkiyat takip etmek,
geçmiş işlemlere ulaşmak

gibi ticari işlemleri hızlı ve anlaşılır hale getirmektir.

2. Genel Görsel Yaklaşım

Arayüz ağırlıklı olarak:

beyaz,
çok açık gri,
açık sıcak gri

zeminlerden oluşmalıdır.

Netsim turuncusu ana vurgu rengidir ancak ekranın ana rengi gibi kullanılmamalıdır.

Turuncu daha çok:

ana aksiyon,
aktif durum,
seçili navigasyon,
ikon vurgusu,
link,
önemli CTA,
bazı grafik elemanları

için kullanılmalıdır.

Bu sayede turuncu dikkat çekmeye devam eder.

Çok fazla turuncu kullanılması tasarımın kurumsal niteliğini zayıflatır.

3. Uygulama Shell Yapısı

Tüm uygulama ortak bir App Shell kullanmalıdır.

Temel yapı:

Application
│
├── Navigation
│
├── Top Bar
│
└── Page Content

Bu iskelet uygulamanın tüm ekranlarında korunmalıdır.

Navigation ve Top Bar uygulamanın global parçalarıdır.

Page Content ise görüntülenen modüle göre değişir.

Örneğin:

Ürünler
Siparişler
Teklifler
İrsaliyeler
Cari Hesap
Ödemeler
Raporlar

aynı global shell içerisinde gösterilir.

Footer kullanılmaz.

4. Navigation Sistemi

Ana navigasyon masaüstünde sol sidebar şeklinde kullanılmalıdır.

Sidebar:

sade,
açık renkli,
sürekli erişilebilir,
kolay taranabilir

olmalıdır.

Navigasyonda:

Icon + Label

yapısı kullanılmalıdır.

Menü öğelerinin normal durumda güçlü background renkleri olmamalıdır.

Aktif sayfa:

açık turuncu background,
turuncu icon,
turuncu veya koyu metin

ile belirginleştirilebilir.

Navigation içerisinde gerekli durumlarda bölümler oluşturulabilir.

Örneğin:

Alışveriş

Ürünler
Kategoriler
Favoriler

İşlemler

Siparişler
Teklifler
İrsaliyeler

Finans

Cari Hesap
Ödemeler

Diğer

Raporlar
Destek

Ancak bölüm sayısı fazla olmamalıdır.

5. Top Bar

Top Bar uygulamanın global kontrol alanıdır.

Genellikle şu tür öğeleri barındırabilir:

Search
Firma seçimi
Bildirim
Kullanıcı profili

Top Bar:

beyaz,
ince border ile ayrılmış,
mümkün olduğunca sade

olmalıdır.

Top Bar içerisinde büyük CTA alanları kullanılmamalıdır.

Ana sayfa aksiyonları sayfa içeriğinin içerisinde gösterilmelidir.

6. Color System

Renk sistemi üç temel gruptan oluşmalıdır:

Brand Colors
Neutral Colors
Semantic Colors
Primary

Netsim markasını temsil eden ana vurgu rengidir.

Başlangıç önerisi:

Primary
#FF5A1F

Kullanım alanları:

Primary button
Aktif menu
CTA
Link
Selected state
Focus
Ana icon vurguları
Grafik highlight
Primary Hover
#E94D12

Mouse hover gibi etkileşimlerde kullanılabilir.

Primary Light
#FFF1EB

Kullanım:

aktif sidebar item,
icon background,
hafif vurgu,
selected state.
Secondary

Ana tasarımın sadece turuncu üzerine kurulmasını engellemek için ikinci bir destek rengi kullanılabilir.

Öneri:

Slate Blue

Örneğin:

#405574

Bu renk özellikle:

nötr ikon,
bazı grafik elemanları,
navigation,
information,
secondary accent

olarak kullanılabilir.

Secondary hiçbir zaman primary turuncuyla rekabet etmemelidir.

7. Neutral Color System

Ana uygulamanın büyük bölümü neutral renklerden oluşmalıdır.

Background
#F7F8FA

Ana uygulama zemini.

Surface
#FFFFFF

Kartlar, tablolar, modal ve diğer container'lar.

Surface Secondary
#FAFBFC

Alternatif hafif yüzey.

Border
#E6E9EE

Standart component border.

Border Strong
#D5DAE1

Daha güçlü ayrım gerektiğinde.

Text Primary
#111827

Başlıklar ve ana içerik.

Text Secondary
#667085

Açıklamalar ve ikincil bilgiler.

Text Tertiary
#98A2B3

Caption ve düşük öncelikli bilgiler.

Disabled
#B5BBC5

Disabled componentlerde kullanılabilir.

8. Semantic Colors

Semantic renkler yalnızca anlam taşıyan durumlarda kullanılmalıdır.

Renkler dekoratif amaçla kullanılmamalıdır.

Success
#16A36A

Background:

#E9F8F1

Kullanım:

tamamlandı,
başarılı,
ödendi,
sevk edildi,
pozitif değişim.
Warning
#E49A13

Background:

#FFF5DE

Kullanım:

bekliyor,
yaklaşan vade,
kısmi işlem,
dikkat gerektiren durum.
Error
#DC4C4C

Background:

#FDECEC

Kullanım:

hata,
reddedildi,
iptal,
gecikme,
başarısız işlem.
Information
#2F80ED

Background:

#EAF3FF

Kullanım:

hazırlanıyor,
bilgilendirme,
sistem mesajı,
nötr süreç durumu.
9. Typography

Ana font olarak:

Inter

kullanılması önerilir.

Alternatif olarak:

Manrope

kullanılabilir.

Ancak tek bir font ailesi tercih edilmeli ve bütün uygulamada tutarlı kullanılmalıdır.

Font seçiminde önemli kriterler:

Türkçe karakter desteği,
rakamlarda okunabilirlik,
tablolar içerisinde net görünüm,
modern web uygulaması karakteri,
farklı weight desteği.
10. Typography Scale

Önerilen temel sistem:

Display / Page Title
28px / 700

H1
24px / 700

H2
20px / 600

H3
18px / 600

H4
16px / 600

Body
14px / 400

Body Small
13px / 400

Label
13px / 500

Caption
12px / 400

Çok fazla farklı font-size oluşturulmamalıdır.

11. Sayısal ve Finansal Veriler

B2B uygulamasında finansal rakamların okunabilirliği önemlidir.

Örneğin:

125.430,50 TL
18.750,00 TL
3.420 adet

Ana finansal rakamlar:

18–24px
600–700 weight

kullanabilir.

Tablolardaki sayısal verilerde mümkünse:

font-variant-numeric: tabular-nums;

kullanılmalıdır.

Bu sayede sayı kolonları görsel olarak daha düzenli olur.

12. Spacing System

Bütün uygulama 4px tabanlı spacing sistemine sahip olmalıdır.

Temel scale:

4
8
12
16
20
24
32
40
48
64

En sık kullanılacak değerler:

8
12
16
24

Önerilen kullanımlar:

Component iç boşluk:
8–16px

Card padding:
16–24px

Component arası:
12–16px

Section arası:
24–32px

Page padding:
20–24px
13. Layout Grid

Uygulama 12 kolonlu responsive grid mantığıyla tasarlanabilir.

Grid yapısı component seviyesinde esnek olmalıdır.

Örneğin:

12
6 + 6
4 + 4 + 4
3 + 3 + 3 + 3
8 + 4

gibi yapılar kullanılabilir.

Ancak her ekran için aynı kolon düzeni zorunlu değildir.

Öncelik:

İçeriğin en okunabilir şekilde yerleştirilmesi.

14. Border Radius

Arayüz hafif yuvarlatılmış bir görünüme sahip olmalıdır.

Ancak aşırı yuvarlak, mobil uygulama benzeri veya oyunlaştırılmış bir görünümden kaçınılmalıdır.

Önerilen değerler:

Button
8px

Input
8px

Card
8–10px

Dropdown
8px

Modal
12px

Tooltip
6px

Badge
999px
15. Border System

Ana component border:

1px solid #E6E9EE

kullanmalıdır.

Border özellikle şu componentlerde önemlidir:

Input
Select
Card
Table
Dropdown
Modal
Secondary button

Tasarım yalnızca shadow ile ayrıştırılmamalıdır.

16. Shadows

Shadow kullanımı minimal tutulmalıdır.

Uygulamanın temel tasarımı:

Border + çok hafif shadow

olmalıdır.

Card
0 1px 3px rgba(16, 24, 40, 0.05)
Hover Card
0 4px 12px rgba(16, 24, 40, 0.07)
Dropdown
0 8px 24px rgba(16, 24, 40, 0.12)
Modal
0 16px 48px rgba(16, 24, 40, 0.18)
Sticky Element
0 2px 8px rgba(16, 24, 40, 0.06)
17. Surface Kullanımı

Surface temel olarak beyazdır.

Örneğin:

Card
Table
Form Container
Sidebar
Dropdown
Modal

white surface kullanabilir.

Ancak her içerik ayrı bir karta konulmamalıdır.

Kart yalnızca:

Mantıksal olarak bağımsız bir içerik grubunu ayırmak

için kullanılmalıdır.

18. Buttons

Standart button türleri:

Primary
Secondary
Ghost
Danger
Icon
Loading
Disabled
Primary Button

Sayfanın ana aksiyonu.

Örneğin:

Sipariş Oluştur
Sepete Git
Teklif İste
Kaydet

Style:

Orange background
White text
Orange border

Bir ekran içerisinde mümkünse yalnızca bir ana Primary CTA bulunmalıdır.

Secondary Button

İkincil aksiyonlarda kullanılır.

Örneğin:

Detay
Düzenle
Filtrele
Önizle

Style:

White background
Neutral border
Dark text
Ghost Button

Düşük öncelikli aksiyonlarda.

Örneğin:

Tümünü Gör
Vazgeç
Geri Dön

Background kullanılmayabilir.

Danger Button

Geri dönüşü zor veya kritik işlemler:

Sil
İptal Et
Kaldır

Error renginde gösterilir.

Icon Button

Örneğin:

Bell
Favorite
More
Close
Search
Filter

Minimum click alanı:

36x36px

olmalıdır.

19. Button Sizes

Standart:

Small
32px

Default
40px

Large
44–48px

Ana uygulama için default:

40px

önerilir.

20. Forms

Standart form componentleri:

Input
Select
Search
Textarea
Checkbox
Radio
Switch
Date Picker
Date Range Picker
Quantity Input
Currency Input
File Upload

Form yapısı sade olmalıdır.

Genel input yüksekliği:

40px

Large form:

44px
21. Form Label

Label input'un üzerinde bulunmalıdır.

Örnek:

Teslimat Adresi

[ Adres seçiniz              ▼ ]

Label:

13px
500

olabilir.

Placeholder her zaman label yerine kullanılmamalıdır.

22. Input States

Componentler şu durumlara sahip olmalıdır:

Default
Hover
Focus
Filled
Error
Disabled
Read Only

Focus:

Orange border
Light orange focus ring

Error:

Red border
Error text below input

Disabled:

Light gray background
Muted text
No hover
23. Search Component

Search birçok ekranda kritik olacaktır.

Örneğin:

Ürün ara
Sipariş ara
Teklif ara
Cari hareket ara

Search yapısı:

Search Icon + Input + Optional Clear

şeklinde olmalıdır.

Geniş data ekranlarında filter bar ile birlikte kullanılabilir.

24. Tables

B2B/ERP uygulamasında tablo temel componentlerden biridir.

Tablolar:

okunabilir,
kompakt,
taranabilir,
filtrelenebilir

olmalıdır.

25. Table Header

Önerilen yapı:

Background:
#F7F8FA

Font:
12–13px

Weight:
500–600

Color:
Text Secondary

Row yüksekliği:

40–44px
26. Table Row

Standart row:

48–52px

Data-heavy tabloda:

44px

kullanılabilir.

Hover:

#FAFBFC
27. Table Alignment

Text:

Left

Numeric:

Right

Financial values:

Right

Action:

Right

Checkbox:

Center
28. Table Sorting

Sortable kolonlarda küçük bir sort indicator bulunmalıdır.

Örneğin:

Tarih ↕
Toplam Tutar ↕

Aktif sorting yönü görsel olarak belirginleştirilmelidir.

29. Table Selection

Bulk işlem gerektiren ekranlarda checkbox kullanılabilir.

Örneğin:

□ Tümünü seç
□ Sipariş
□ Sipariş

Selection row background'u çok açık primary rengi olabilir.

30. Table Pagination

Pagination standart component olmalıdır.

Örnek:

1 2 3 4 5 ... 10

veya:

‹ Önceki    1 / 10    Sonraki ›

Sayfa boyutu seçilebilir:

20
50
100
31. Table Empty State

Boş tablo yalnızca:

Kayıt bulunamadı

dememelidir.

Kullanıcıya sonraki adım gösterilmelidir.

Örneğin:

Henüz sipariş bulunmuyor.

İlk siparişinizi oluşturmak için ürünleri inceleyebilirsiniz.

[ Ürünlere Git ]
32. Table Loading

Tablo yüklenirken:

Skeleton Rows

kullanılmalıdır.

Layout yükleme sırasında değişmemelidir.

33. Cards

Standart card yapısı:

Background:
White

Border:
1px neutral

Radius:
8–10px

Padding:
16–24px

Shadow:
Very subtle

Card içerisindeki görsel hiyerarşi:

Title
Secondary information
Primary content
Optional action

şeklinde olmalıdır.

34. Card Türleri

Uygulama içerisinde aşağıdaki card patternleri kullanılabilir:

KPI Card
Product Card
Order Card
Finance Summary Card
Address Card
Quick Action Card
Announcement Card
Summary Card
Empty State Card

Ancak her kart tipi kendi özel componentine dönüştürülmeden önce gerçekten tekrar kullanılabilir olup olmadığı değerlendirilmelidir.

35. Product Card

Ürün kartı B2B uygulamasının önemli componentlerinden biridir.

Temel yapı:

Product Image

Product Name

Stock Code

Price

Stock Information

Quantity

Primary / Secondary Action

Opsiyonel:

Favorite
Campaign
Discount
Variant
Unit

Ürün kartının görselden çok ticari bilgiye odaklanması gerekir.

36. Status Badges

Status badge'leri ticari süreçleri hızlıca okumak için kullanılmalıdır.

Örnek durumlar:

Onay Bekliyor
Hazırlanıyor
Kısmi Sevk
Sevk Edildi
Tamamlandı
İptal Edildi
Ödendi
Vadesi Geçti

Badge yapısı:

● Status

şeklinde olabilir.

37. Status Color Mapping

Önerilen temel eşleşme:

Onay Bekliyor
Warning

Hazırlanıyor
Information

Kısmi Sevk
Warning

Sevk Edildi
Success

Tamamlandı
Success

İptal Edildi
Error

Ödendi
Success

Vadesi Geçti
Error

Aynı durum farklı ekranlarda farklı renk almamalıdır.

38. Icons

Ana icon library:

Lucide Icons

önerilir.

Neden:

sade line icon yapısı,
modern görünüm,
geniş icon seti,
React uyumu,
ERP/B2B kullanımına uygun olması.

Birden fazla icon library karıştırılmamalıdır.

39. Icon Sizes

Standart scale:

16px
18px
20px
24px
28px

Kullanım:

Input:
16–18px

Button:
16–18px

Sidebar:
18–20px

Card:
20–24px

Large shortcut:
24–28px
40. Icon Style

Temel icon stili:

Outline

olmalıdır.

Filled iconlar yalnızca belirli durumlarda kullanılabilir.

Aynı ekran içerisinde outline ve filled iconlar rastgele karıştırılmamalıdır.

41. Links

Standart link:

Primary Orange

olabilir.

Ancak bütün clickable alanlarda turuncu kullanılması gerekmez.

Örneğin:

Sipariş No
Teklif No
Tümünü Gör

turuncu olabilir.

Table içerisindeki her hücrenin link gibi görünmesi engellenmelidir.

42. Breadcrumb

Derin sayfa hiyerarşilerinde breadcrumb kullanılabilir.

Örneğin:

Ürünler / Kahve / Espresso

Breadcrumb:

küçük,
secondary text,
düşük görsel öncelikli

olmalıdır.

43. Page Header Standardı

Her ana içerik ekranında ortak bir page header pattern kullanılmalıdır.

Örneğin:

Page Title                     Primary Action
Description

Aksiyon yoksa sağ taraf boş bırakılabilir.

Bu yapı Dashboard dışındaki tüm modüllerde tutarlı kullanılmalıdır.

44. Filters

Liste ekranlarında ortak filter system kullanılmalıdır.

Örneğin:

Search
Category
Status
Date Range
Company
Sort

Filter sayısı arttığında:

Daha Fazla Filtre

veya filter drawer kullanılabilir.

Ekranın üst kısmı onlarca select ile doldurulmamalıdır.

45. Dropdown

Dropdown:

White surface
8px radius
Neutral border
Subtle shadow

kullanmalıdır.

Option hover:

Light neutral background

Selected:

Primary Light
46. Modal

Modal yalnızca kullanıcının mevcut bağlamdan geçici olarak ayrılması gereken durumlarda kullanılmalıdır.

Örnek:

Siparişi iptal et
Adres ekle
Teklif iste
Onayla

Modal içerisinde çok uzun workflow yapılmamalıdır.

Uzun işlemler ayrı sayfa veya drawer kullanmalıdır.

47. Drawer

Drawer özellikle şu durumlarda kullanılabilir:

Filter
Quick detail
Cart
Notification
Mobile navigation

Drawer:

Right side
White surface
Subtle shadow

kullanabilir.

48. Toast / Notification

Sistem geri bildirimleri toast ile verilebilir.

Örnek:

Siparişiniz başarıyla oluşturuldu.

Sepete eklendi.

İşlem sırasında hata oluştu.

Toast renkleri semantic system ile aynı olmalıdır.

49. Tooltips

Sadece icon kullanılan ve anlamı ilk bakışta net olmayan alanlarda tooltip bulunmalıdır.

Örneğin:

♡ → Favorilere Ekle
⋮ → Diğer İşlemler
50. Charts

Grafikler uygulamanın yardımcı componentidir.

Ana kullanım amacı:

trend
özet
karşılaştırma

olmalıdır.

Grafiklerin amacı analitik platform oluşturmak değil ticari veriyi hızlı yorumlatmaktır.

Ana grafik rengi:

Primary Orange

Secondary grafik rengi:

Slate Blue

olabilir.

Çok renkli chart palette kullanılmamalıdır.

51. Responsive Design

Uygulama desktop-first geliştirilebilir.

Ana kullanım B2B kullanıcılarının masaüstü ekranlarıdır.

Desktop
≥1280px

Tam sidebar ve geniş içerik alanı.

Tablet
768–1279px

Sidebar collapse edilebilir.

Bazı grid yapıları:

4 → 2 columns
3 → 2 columns

şeklinde kırılabilir.

Mobile
<768px

Sidebar drawer'a dönüşür.

Navigasyon hamburger üzerinden açılır.

Tables:

Horizontal Scroll

veya uygun durumlarda:

Card List

formatına dönüşebilir.

Primary aksiyonlar erişilebilir kalmalıdır.

52. Accessibility

Minimum accessibility kuralları uygulanmalıdır.

Özellikle:

yeterli renk kontrastı,
focus state,
keyboard navigation,
form label kullanımı,
icon-only button için aria-label,
yalnızca renkle durum anlatmama

kuralları dikkate alınmalıdır.

Örneğin hata durumu yalnızca kırmızı border ile değil:

Hatalı bilgi

metniyle de belirtilmelidir.

53. Hover States

Clickable componentlerin hover durumu olmalıdır.

Ancak hover animasyonları minimal tutulmalıdır.

Örneğin:

border color change
background change
very small shadow

kullanılabilir.

Aşırı:

scale
rotation
strong movement

kullanılmamalıdır.

54. Animation

Animation sadece etkileşimi desteklemek için kullanılmalıdır.

Önerilen süreler:

Fast
120ms

Default
160–200ms

Slow
250ms

Önerilen kullanım:

Dropdown
Modal
Tooltip
Sidebar
Hover
Toast
55. Loading

Loading sırasında mümkün olduğunca skeleton tercih edilmelidir.

Spinner daha çok:

Button loading
Small action

için kullanılabilir.

Örneğin:

[ Kaydediliyor... ]
56. Empty State

Empty state kullanıcıyı yönlendirmelidir.

Temel yapı:

Icon / Illustration

Title

Description

Optional CTA

Çok büyük dekoratif illüstrasyonlardan kaçınılmalıdır.

57. Error State

Sistem hatası durumunda:

Ne olduğunu açıkla
Kullanıcının yapabileceği işlemi göster
Tekrar dene seçeneği ver

Örneğin:

Siparişler yüklenemedi.

Bağlantınızı kontrol ederek tekrar deneyebilirsiniz.

[ Tekrar Dene ]
58. Content Density

Netsim B2B'nin önemli özelliklerinden biri orta seviyede bilgi yoğunluğudur.

Çok boş bir consumer uygulaması gibi görünmemelidir.

Aynı zamanda klasik ERP ekranlarında olduğu gibi:

küçük font
çok fazla kolon
çok fazla button
çok sıkışık layout

kullanılmamalıdır.

Hedef:

Medium Density

olmalıdır.

59. Bilgi Hiyerarşisi

Her component içerisinde üç seviye korunmalıdır.

Primary
Secondary
Tertiary

Örneğin:

Sipariş No        → Primary
Sipariş tarihi    → Secondary
Ek açıklama       → Tertiary

Bütün bilgiler aynı font ağırlığında gösterilmemelidir.

60. Primary Action Prensibi

Bir ekranın ana amacı kullanıcıya ilk birkaç saniyede anlaşılmalıdır.

Örneğin:

Ürünler
→ Sepete Ekle

Sepet
→ Siparişi Tamamla

Teklif
→ Teklif Oluştur

Sipariş
→ Sipariş Detayı

Primary action görsel olarak en güçlü aksiyon olmalıdır.

61. Destructive Action Prensibi

Silme veya iptal gibi işlemler primary CTA yanında doğrudan güçlü şekilde gösterilmemelidir.

Mümkünse:

More Menu

veya secondary action altında tutulmalıdır.

Kritik işlemden önce confirmation gösterilmelidir.

62. Design Tokens

UI değerleri frontend içerisinde tekrar tekrar hard-coded edilmemelidir.

Token sistemi kullanılmalıdır.

Örnek:

colors.primary
colors.primaryHover
colors.primaryLight

colors.background
colors.surface
colors.surfaceSecondary

colors.border
colors.borderStrong

colors.textPrimary
colors.textSecondary
colors.textTertiary

colors.success
colors.warning
colors.error
colors.info
Spacing Tokens
space.1 = 4px
space.2 = 8px
space.3 = 12px
space.4 = 16px
space.5 = 20px
space.6 = 24px
space.8 = 32px
space.10 = 40px
space.12 = 48px
Radius Tokens
radius.sm = 6px
radius.md = 8px
radius.lg = 10px
radius.xl = 12px
radius.full = 999px
Typography Tokens
text.caption
text.label
text.body
text.bodySmall
text.heading4
text.heading3
text.heading2
text.heading1
text.pageTitle
Shadow Tokens
shadow.card
shadow.cardHover
shadow.dropdown
shadow.modal
shadow.sticky
63. Component Naming Standardı

Frontend tarafında component isimleri genel ve yeniden kullanılabilir olmalıdır.

Örneğin:

Button
IconButton
Input
Select
SearchInput
Checkbox
Badge
StatusBadge
Card
Table
Pagination
Modal
Drawer
Tooltip
Toast
EmptyState
Skeleton

Domain-specific componentler daha sonra bunların üzerine kurulmalıdır.

Örneğin:

ProductCard
OrderStatusBadge
CartSummary
FinanceSummary
64. Genel Tasarım Kuralları

Uygulamanın bütün ekranlarında şu kurallar korunmalıdır:

Açık ve ferah background kullanılmalıdır.
Netsim turuncusu kontrollü vurgu rengidir.
Birincil aksiyon kolayca bulunmalıdır.
Componentler ortak design tokenlarını kullanmalıdır.
Gereksiz gradient kullanılmamalıdır.
Güçlü shadow kullanımından kaçınılmalıdır.
Border ve spacing tasarımın ana ayrıştırıcılarıdır.
Bilgi yoğunluğu orta seviyede tutulmalıdır.
Aynı durum her yerde aynı renkle temsil edilmelidir.
Aynı aksiyon her yerde benzer UI pattern kullanmalıdır.
Dekorasyon işlevselliğin önüne geçmemelidir.
Kullanıcı mümkün olduğunca az adımda hedef işleme ulaşmalıdır.
Desktop kullanım önceliklidir ancak responsive yapı korunmalıdır.
Finansal ve operasyonel bilgiler kolay taranabilir olmalıdır.
Footer kullanılmamalıdır.
65. Tasarımın Kısa Tanımı

Netsim B2B tasarım sistemi şu şekilde özetlenebilir:

Beyaz ve açık gri yüzeyler üzerine kurulan, Netsim turuncusunu kontrollü şekilde vurgu rengi olarak kullanan, orta yoğunlukta ticari veri sunan, modern SaaS sadeliğini ERP işlevselliğiyle birleştiren kurumsal ve modüler bir B2B arayüz sistemi.

Bu tanım artık Dashboard'a bağlı değil. Bundan sonra Dashboard, Ürünler, Siparişler, Teklifler veya Cari Hesap tasarlanırken her biri bu ortak sistemin üzerine kurulabilir.