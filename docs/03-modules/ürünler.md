Products

Bu dosya Netsim B2B Ürünler modülünün fonksiyonel ve kullanıcı deneyimi tasarımını tanımlar.

Ürünler modülü kullanıcının aktif firmasına göre satın alabileceği ürünleri görüntülediği, aradığı, filtrelediği, ürün detaylarını incelediği ve sepete eklediği temel katalog alanıdır.

Temel prensip:

Ürün ekranı yalnızca “hangi ürünler var?” sorusunu değil, “ben bunu hangi fiyatla ve hangi koşullarda satın alabilirim?” sorusunu cevaplamalıdır.

Bu nedenle B2B ürün deneyiminde ürün görseli kadar aşağıdaki bilgiler önemlidir:

ürün kimliği,
fiyat,
stok / satılabilirlik,
varyant,
birim,
teslimat durumu,
sipariş miktarı.
1. Amaç

Ürünler modülü kullanıcının:

ürün kataloğunu görüntülemesini,
ürün adına veya koduna göre arama yapmasını,
kategori üzerinden ürün bulmasını,
ürünleri filtrelemesini,
ürün detayını incelemesini,
varyant seçmesini,
aktif carisine özel fiyatı görmesini,
stok durumunu görmesini,
sipariş miktarını belirlemesini,
favoriye eklemesini,
sepete eklemesini

sağlamalıdır.

Ana kullanıcı soruları:

Aradığım ürün var mı?

Ürün kodu nedir?

Benim fiyatım nedir?

Stokta var mı?

Kaç adet sipariş verebilirim?

Hangi varyantları var?

Hangi birim üzerinden satılıyor?

Ne zaman teslim edilebilir?

Sepete nasıl eklerim?
2. Modül Yapısı

Ürünler alanı temel olarak şu yapılardan oluşur:

Ürünler
│
├── Ürün Listesi
│   ├── Arama
│   ├── Kategoriler
│   ├── Filtreler
│   ├── Sıralama
│   └── Ürün Kartları / Liste
│
└── Ürün Detayı
    ├── Ürün Bilgileri
    ├── Varyantlar
    ├── Fiyat
    ├── Stok
    ├── Miktar
    ├── Sepete Ekle
    ├── Açıklama
    └── Teknik / Ek Bilgiler

Ürün listesi ürün bulmaya;

Ürün detayı ise satın alma kararına odaklanmalıdır.

3. Ürünler Ekranı Genel Yapısı

Desktop için önerilen ana yapı:

Ürünler

Ürünleri keşfedin ve size özel fiyatlarla siparişinizi oluşturun.

[ Ürün adı veya stok kodu ara... ]              [Hızlı Sipariş]


Kategoriler / Filtreler                   Sırala: Önerilen ▼

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Ürün         │ │ Ürün         │ │ Ürün         │
│              │ │              │ │              │
│ Fiyat        │ │ Fiyat        │ │ Fiyat        │
│ Stok         │ │ Stok         │ │ Stok         │
│              │ │              │ │              │
│ Miktar       │ │ Miktar       │ │ Miktar       │
│ Sepete Ekle  │ │ Sepete Ekle  │ │ Sepete Ekle  │
└──────────────┘ └──────────────┘ └──────────────┘

Ekranın ana odağı ürünler olmalıdır.

Filtreler ve diğer kontroller ürünlerin önüne geçmemelidir.

4. B2B Ürün Ekranı ile Klasik E-Ticaret Arasındaki Fark

Klasik tüketici e-ticaretinde çoğu zaman:

Görsel
↓
Ürün Adı
↓
Fiyat

ön plandadır.

B2B'de ise bilgi önceliği daha çok:

Ürün

Stok Kodu

Fiyat

Stok / Satılabilirlik

Varyant

Miktar

Birim

Sepete Ekle

şeklindedir.

Ürün görseli önemlidir ancak ekranın ana amacı dekoratif ürün keşfi değildir.

Temel amaç:

Doğru ticari ürünü hızlı şekilde bulup siparişe dönüştürmek.

5. Sayfa Başlığı

Önerilen:

Ürünler

Ürünleri görüntüleyin, stok ve fiyat bilgilerini kontrol ederek
siparişinizi oluşturun.

Sağ tarafta:

[Hızlı Sipariş]

secondary aksiyonu bulunabilir.

Kullanıcının ürün kodlarını bildiği senaryolarda katalog ile Quick Order arasında hızlı geçiş değerli olacaktır.

6. Ürün Arama

Ürün arama ekranın en görünür fonksiyonlarından biri olmalıdır.

Minimum arama alanları:

stok kodu,
ürün adı.

İleride:

barkod,
müşteri ürün kodu,
marka,
varyant,
açıklama

da dahil edilebilir.

Placeholder:

Ürün adı veya stok kodu ara...
7. Arama Davranışı

Kullanıcı yazmaya başladığında autocomplete kullanılabilir.

Örneğin:

STK-001
Espresso Çekirdeği 1 kg

STK-001-P
Premium Espresso Çekirdeği

Sonuçlarda ayırt edici bilgiler gösterilebilir:

STK-001
Espresso Çekirdeği 1 kg

Stokta · 125,00 TL

Fiyat sorgusu performans açısından pahalıysa autocomplete içerisinde fiyat gösterilmek zorunda değildir.

8. Arama UX'i

Arama:

case insensitive,
Türkçe karakter uyumlu,
stok kodlarında hızlı,
ürün adında kısmi eşleşme destekleyen

bir yapıda olmalıdır.

Örneğin kullanıcı:

espresso

yazdığında:

Espresso Çekirdeği
Espresso Premium
Espresso Blend

sonuçları bulunabilmelidir.

9. Aramada Netsim Teknik Alanları

Kullanıcı Netsim'in gerçek tablo veya alan yapısını bilmek zorunda değildir.

Örneğin:

STOK_NO

teknik olarak kullanılabilir ancak UI'da:

Stok Kodu

veya:

Ürün Kodu

olarak gösterilir.

10. Kategoriler

Kategori sistemi ürün keşfini kolaylaştırmalıdır.

Örneğin:

Tüm Ürünler

Kahve
├── Espresso
├── Filtre Kahve
└── Çekirdek Kahve

Ekipman
├── Makineler
├── Öğütücüler
└── Aksesuarlar

Kategori yapısı çok derin olmamalıdır.

Mümkün olduğunca:

2–3 seviye

içerisinde tutulmalıdır.

11. Kategori Navigasyonu

Desktop'ta kategori:

sol sidebar,
üst kategori barı,
dropdown

şeklinde uygulanabilir.

Çok kategori varsa sol filtre alanı daha uygun olabilir.

Az kategori varsa üst yatay yapı daha sade olabilir.

Bu ürün katalog yapısına göre belirlenmelidir.

12. Breadcrumb

Derin kategori yapısında:

Ürünler / Kahve / Espresso

breadcrumb kullanılabilir.

Ürün detayında:

Ürünler / Kahve / Espresso / Espresso Çekirdeği 1 kg

gibi devam edebilir.

13. Temel Filtreler

Filtreler ürün tipine göre değişebilir.

Genel filtreler:

Kategori

Stok Durumu

Fiyat Aralığı

Ürün yapısına göre:

Marka

Renk

Boyut

Model

Ürün Tipi

eklenebilir.

14. Filtrelerin Yoğunluğu

Bütün filtreler aynı anda ekrana açılmamalıdır.

Önerilen:

Sık Kullanılan Filtreler
+
Daha Fazla Filtre

yaklaşımıdır.

Özellikle B2B kullanıcıyı:

12 dropdown
+
8 checkbox grubu

ile karşılamak doğru değildir.

15. Aktif Filtreler

Kullanıcının uyguladığı filtreler görünür olmalıdır.

Örneğin:

Kategori: Espresso ×

Stok: Stokta ×

Fiyat: 100–500 TL ×

[Tüm Filtreleri Temizle]

Kullanıcı hangi filtre nedeniyle ürün göremediğini anlayabilmelidir.

16. Stok Filtresi

Kullanışlı filtrelerden biri:

Stokta Olanlar

olabilir.

Opsiyonel:

Sipariş Üzerine Ürünler

Stokta Olmayanları Göster

seçenekleri eklenebilir.

17. Sıralama

Önerilen sıralamalar:

Önerilen

Ürün Adı A-Z

Ürün Adı Z-A

Fiyat Artan

Fiyat Azalan

Yeni Eklenen

İleride:

En Çok Sipariş Verilen

Daha Önce Aldıklarım

gibi B2B'ye özel sorting düşünülebilir.

18. Liste / Grid Görünümü

Desktop'ta kullanıcı:

Grid View

List View

arasında geçiş yapabilir.

Ancak ilk sürümde iki farklı görünüm zorunlu değildir.

Ürün çeşitliliği görsel ağırlıklıysa:

Grid

ürünler teknik ve veri ağırlıklıysa:

List

daha uygun olabilir.

19. B2B İçin Önerilen Varsayılan Görünüm

Ürün görselleri mevcutsa:

Orta yoğunlukta Product Card Grid

iyi başlangıçtır.

Ancak kartlar klasik büyük e-ticaret kartları kadar yüksek olmamalıdır.

Ürün başına gerekli ticari bilgi kart içerisinde erişilebilir olmalıdır.

20. Product Card Yapısı

Önerilen içerik:

Ürün Görseli

Ürün Adı

Stok Kodu

Varyant / Kısa Özellik

Fiyat

Stok Durumu

Miktar

Sepete Ekle

Opsiyonel:

Favori
Kampanya
İndirim
Teslimat
21. Ürün Görseli

Ürün görseli:

sade,
tutarlı oranlarda,
mümkünse beyaz/açık arka planlı

olmalıdır.

Görsel bulunmuyorsa tasarım bozulmamalıdır.

Placeholder kullanılabilir.

B2B ürün ekranının çalışması ürün görsellerinin eksiksiz olmasına bağlı olmamalıdır.

22. Ürün Adı

Kart içerisindeki en güçlü metinsel alanlardan biridir.

Örneğin:

Espresso Çekirdeği Premium 1 kg

İki satırdan fazla uzuyorsa kontrollü truncate kullanılabilir.

Hover tooltip veya detay sayfasında tam isim görünür.

23. Stok Kodu

Ürün adının altında daha düşük görsel ağırlıkla:

STK-001245

gösterilebilir.

B2B kullanıcıları ürün kodlarını sık kullanabileceğinden tamamen gizlenmemelidir.

24. Favori

Ürün kartının köşesinde:

♡

kullanılabilir.

Tıklandığında:

Favorilere eklendi.

feedback gösterilir.

Tekrar tıklanırsa ürün favoriden kaldırılır.

Bu işlem confirmation gerektirmez.

25. Favori Davranışı

Favoriler kullanıcı bazlı B2B verisidir.

User
+
Product
=
Favorite

mantığıyla tutulabilir.

Firma bazlı ürün erişimleri değiştiğinde favori ürün artık kullanılamıyorsa kullanıcıya gösterim kuralı ayrıca belirlenmelidir.

26. Fiyat

Ürün kartının en önemli ticari bilgilerinden biridir.

Örnek:

125,00 TL

veya:

125,00 TL / Adet

Tercihen birimle birlikte gösterilmelidir.

27. Fiyatın Anlamı

Gösterilen fiyat:

Aktif cari için geçerli B2B satış fiyatı

olmalıdır.

Genel liste fiyatı kullanıcıya otomatik olarak gösterilmemelidir.

Müşterinin asıl ihtiyacı:

Benim fiyatım nedir?

sorusunun cevabıdır.

28. Fiyatın Hesaplanması

Fiyat aşağıdaki bağlama göre değişebilir:

Cari

Ürün

Varyant

Miktar

Birim

Fiyat Listesi

İskonto

Kampanya

Tarih

Bu nedenle frontend fiyatı kendi başına hesaplamamalıdır.

Backend/Netsim fiyat sonucunun source of truth'u olmalıdır.

29. Fiyat Yetkisi

Kullanıcının:

prices.view

yetkisi yoksa fiyat:

—

olarak gösterilmek yerine tamamen kaldırılabilir.

Backend de fiyat bilgisini response içerisinde göndermemelidir.

30. İndirim Gösterimi

Gerçekten anlamlıysa:

Liste: 150 TL

Size Özel:
125 TL

veya:

%10 indirim

gibi bilgiler kullanılabilir.

Ancak sürekli yüksek indirim rozetleri kullanılarak klasik tüketici e-ticaret görünümü yaratılmamalıdır.

Kurumsal B2B karakteri korunmalıdır.

31. Stok Durumu

Ürün kartında satın alma kararını etkileyen temel stok bilgisi bulunmalıdır.

Örneğin:

● Stokta
● Son 4 adet
● Sipariş üzerine
● Stokta yok
32. Kesin Stok Miktarı

Firma politikasına göre:

Stokta · 42 adet

gösterilebilir.

Alternatif olarak yalnızca:

Stokta

gösterilebilir.

Bu davranış müşteri/firma bazında konfigüre edilebilir olmalıdır.

33. Satılabilir Stok

B2B kullanıcıya gösterilecek stok mümkünse:

satın alma açısından anlamlı stok

olmalıdır.

ERP tarafında:

Fiziki Stok
Rezerv
Bloke
Depo
Stok Yeri

gibi birçok kavram olabilir.

Kullanıcının ihtiyacı çoğunlukla:

Satılabilir: 20 adet

sonucudur.

34. ATP

İleride fiziksel stoktan daha gelişmiş:

20 adet hemen teslim

30 adet 15 Eylül'de

gibi ATP bilgisi gösterilebilir.

Bu Future Scope'tur.

35. Stokta Olmayan Ürün

Stokta olmayan ürünün tamamen katalogdan gizlenmesi zorunlu değildir.

Firma politikasına göre:

Stokta yok

olarak gösterilebilir.

Backorder varsa:

Sipariş üzerine

şeklinde siparişe açık tutulabilir.

36. Sepete Ekle

Ürün kartının ana aksiyonu:

Sepete Ekle

olmalıdır.

Primary orange kullanılabilir.

Ancak sayfada onlarca ürün kartındaki bütün butonların aşırı görsel baskı yaratmaması gerekir.

Boyut kontrollü olmalıdır.

37. Miktar Seçimi

Sepete eklemeden önce miktar kart üzerinden belirlenebilir.

Örneğin:

[-] 1 [+]

veya:

[ 1 ] Adet

B2B kullanıcıların yüksek miktar yazabilmesi için doğrudan number input faydalıdır.

38. Hızlı Sepete Ekleme

Standart, varyantsız ürünlerde:

Miktar
+
Sepete Ekle

kart üzerinden yapılabilmelidir.

Kullanıcı her ürün için detay ekranına girmek zorunda bırakılmamalıdır.

39. Varyantlı Ürün

Ürün varyant zorunluysa karttan doğrudan sepete ekleme davranışı değişir.

Örneğin:

Varyant Seç

aksiyonu kullanılabilir.

Tıklanınca:

küçük popover,
quick view,
ürün detayı

açılabilir.

Çok karmaşık varyant yapısı varsa doğrudan ürün detayına gitmek daha doğru olur.

40. Variant Selection

Ürün detayında varyantlar kullanıcı dostu olarak gösterilmelidir.

Örneğin:

Renk

[ Siyah ] [ Gri ] [ Beyaz ]

ve:

Boyut

[ S ] [ M ] [ L ] [ XL ]

veya select kullanılabilir.

Varyant teknik kodları kullanıcıya öncelikli bilgi olarak gösterilmemelidir.

41. Varyant Seçildiğinde

Varyant değişimi:

Variant
↓
Price
↓
Stock
↓
Image
↓
Barcode
↓
Unit

gibi bilgileri etkileyebilir.

Etkilenen bilgiler yeniden yüklenmelidir.

42. Geçersiz Varyant Kombinasyonu

Örneğin:

Siyah + XL

satışa açık değilse kullanıcı bu kombinasyonu seçtikten sonra hata almak yerine mümkünse seçim baştan disabled gösterilmelidir.

Prensip:

Hata oluşmadan önce engelle.

43. Ürün Detayı

Ürün detayının ana amacı:

Kullanıcının ürünü satın almadan önce ihtiyacı olan bütün bilgileri görmesini sağlamak.

Ana yapı:

Ürün Detayı
│
├── Görsel
├── Ürün Kimliği
├── Fiyat
├── Stok
├── Varyant
├── Miktar
├── Sepete Ekle
├── Ürün Açıklaması
├── Özellikler
└── Belgeler / Ek Bilgiler
44. Ürün Detay Header

Örnek:

← Ürünler

Espresso Çekirdeği Premium 1 kg

STK-001245

♡ Favorilere Ekle

Breadcrumb varsa geri butonu yerine kullanılabilir.

45. Ürün Detayının Üst Bölümü

Desktop için ideal olarak iki ana kolon:

┌────────────────────────────┬─────────────────────────────┐
│                            │ Ürün Adı                    │
│                            │ Stok Kodu                   │
│       Ürün Görseli         │                             │
│                            │ Fiyat                       │
│                            │ Stok                        │
│                            │ Varyant                     │
│                            │ Miktar                      │
│                            │                             │
│                            │ [Sepete Ekle]               │
└────────────────────────────┴─────────────────────────────┘

Kullanıcının satın alma için gerekli bütün bilgiler ekranın ilk bölümünde bulunmalıdır.

46. Ürün Detayında Bilgi Önceliği

İdeal sıralama:

1. Ürün adı

2. Stok kodu

3. Fiyat

4. Stok / satılabilirlik

5. Varyant

6. Miktar / birim

7. Sepete Ekle

8. Teslimat

9. Açıklama

10. Teknik özellikler

ERP stok kartındaki alan sırası takip edilmemelidir.

47. Ürün Açıklaması

ERP ürün adı tek başına web için yeterli olmayabilir.

B2B tarafında ek:

Kısa Açıklama

Uzun Açıklama

tutulabilir.

Bu nedenle ürün modeli hibrit olabilir:

Netsim Product Master
+
B2B Presentation Content
48. Teknik Özellikler

Ürün tipi gerektiriyorsa:

Teknik Özellikler

alanı bulunabilir.

Örneğin:

Ağırlık        1 kg
Menşei         Brezilya
Kavrum         Orta
Paket Tipi     Valfli

Ana satın alma alanından sonra gösterilmelidir.

49. ERP Teknik Bilgileri

Aşağıdaki gibi Netsim internal bilgileri varsayılan olarak kullanıcıya gösterilmemelidir:

MRP Grubu

Muhasebe Kodu

Stok Tip No

İşlem Noktası ID

Kayıt Durumu Kodları

Teknik Database Alanları

B2B ürün detayına yalnızca müşterinin kararını etkileyen bilgiler taşınmalıdır.

50. Ürün Belgeleri

Ürünlere bağlı:

katalog,
teknik föy,
kullanım kılavuzu,
sertifika,
güvenlik belgesi

varsa:

Dokümanlar

alanında gösterilebilir.

Özellikle endüstriyel B2B ürünlerinde değerli olacaktır.

51. Teslimat Bilgisi

Güvenilir veri varsa:

Tahmini Teslimat

1–2 iş günü

veya:

Sipariş üzerine

Tahmini 7 iş günü

gösterilebilir.

Güvenilir olmayan tahmini teslim tarihi gösterilmemelidir.

52. Ürün Satış Uygunluğu

Bir ürün Netsim'de bulunması nedeniyle otomatik olarak B2B'de satılabilir kabul edilmemelidir.

Kavramsal kontroller:

Ürün aktif mi?

Satışa açık mı?

B2B'de görünür mü?

Aktif cari bu ürünü alabilir mi?

Uygun satış birimi var mı?

Fiyat bulunabiliyor mu?
53. Müşteri Bazlı Ürün Görünürlüğü

Bazı ürünler yalnızca belirli müşteri gruplarına açık olabilir.

Bu durumda:

Company A
→ Product X erişebilir

Company B
→ Product X erişemez

gibi yapı desteklenebilmelidir.

Backend ürün arama/listesine yalnızca kullanıcının erişebildiği ürünleri dahil etmelidir.

54. Firma Değişimi

Aktif firma değiştiğinde:

Fiyat

Ürün Görünürlüğü

Stok Politikası

Favoriler

Sepet

yeniden değerlendirilmelidir.

Aynı ürün farklı cariler için farklı fiyatla gösterilebilir.

55. Favoriler ve Firma

Favori kullanıcı bazlı tutulabilir ancak ürünün aktif firmada satılabilirliği ayrıca kontrol edilmelidir.

Örneğin kullanıcı ürünü başka firma context'inde favoriye eklemiş olabilir.

Aktif firmada ürün kullanılamıyorsa:

Bu ürün mevcut firma için satışa açık değil.

gibi davranış uygulanabilir.

56. Ürün Kartında Loading

Fiyat ve stok farklı kaynaklardan geliyorsa bütün ürün kartının görünmesi bekletilmemelidir.

Örneğin:

Ürün adı        ✓

Görsel          ✓

Fiyat           loading

Stok            loading

şeklinde lokal skeleton kullanılabilir.

57. Partial Failure

Fiyat alınamazsa ürün tamamen kaybolmamalıdır.

Örneğin:

Espresso Çekirdeği

Fiyat bilgisi şu anda alınamıyor.

[Tekrar Dene]

Stok alınamıyorsa:

Stok bilgisi alınamadı.

gösterilebilir.

Ancak firma kuralına göre sepete ekleme bloke edilebilir.

58. Sepete Ekle Feedback

Kullanıcı ürünü sepete eklediğinde:

Ürün sepete eklendi.

toast gösterilebilir.

Opsiyonel:

[Sepete Git]

aksiyonu olabilir.

Her sepete ekleme işleminde modal açılmamalıdır.

59. Aynı Ürün Sepetteyse

Ürün zaten sepette bulunuyorsa kartta:

Sepette · 5 adet

gibi küçük bilgi gösterilebilir.

Kullanıcı tekrar eklerse mevcut miktarın artırılması global Cart davranışıyla uyumlu olmalıdır.

60. Hızlı Sipariş İlişkisi

Ürün kataloğu ile Hızlı Sipariş birbirinin alternatifi değil tamamlayıcısıdır.

Ürün Kataloğu
→ Ürünü keşfet

Hızlı Sipariş
→ Bildiğin ürünü hızlı ekle

Ürünler ekranında Hızlı Sipariş shortcut'ı bulunabilir.

61. Sık Alınan Ürünler

İleride kullanıcıya:

Sık Aldıklarınız

bölümü sunulabilir.

Bu alan kategori listesinin üzerinde küçük bir section olabilir.

Ancak ana ürün grid'ini geri plana itmemelidir.

62. Daha Önce Satın Aldığım Ürünler

B2B açısından değerli filtrelerden biri:

Daha Önce Aldıklarım

olabilir.

Kullanıcının geçmiş siparişlerindeki ürünleri gösterir.

Bu özellikle tekrar siparişi hızlandırır.

63. Yeni Ürünler

Firma yeni ürünleri öne çıkarmak istiyorsa:

Yeni

badge kullanılabilir.

Ancak bütün ürünleri rozetlerle doldurmak doğru değildir.

64. Kampanyalı Ürünler

Aktif kampanya varsa:

Kampanyalı

veya fiyat bilgisinin yanında kontrollü gösterim yapılabilir.

B2B arayüzünün indirim marketi görünümüne dönüşmemesi gerekir.

65. Ürün Bulunamadı Empty State

Arama sonucunda ürün yoksa:

Aramanızla eşleşen ürün bulunamadı.

Arama ifadenizi veya filtrelerinizi değiştirmeyi deneyin.

[Filtreleri Temizle]

gösterilmelidir.

66. Kategori Empty State

Kategori mevcut ancak satışa açık ürün yoksa:

Bu kategoride şu anda gösterilebilecek ürün bulunmuyor.

mesajı kullanılabilir.

67. Ürün Kataloğu Pagination

B2B kullanımında backend pagination kullanılması önerilir.

Örneğin:

24

48

96

ürün/sayfa seçenekleri olabilir.

Infinite scroll görsel kataloglarda kullanılabilir ancak:

geri dönme,
filtre,
sayfa konumu

gibi davranışları karmaşıklaştırabilir.

İlk sürüm için pagination daha öngörülebilirdir.

68. Context Koruma

Kullanıcı:

Kategori
+
Filtre
+
Sayfa 4

üzerinden ürün detayına girdikten sonra geri döndüğünde aynı liste context'ine dönmelidir.

Şunlar korunmalıdır:

Arama

Filtreler

Sıralama

Sayfa

Scroll pozisyonu
69. Liste / Kart Yoğunluğu

Desktop'ta ürün grid'i örneğin:

3 veya 4 kolon

olabilir.

Kart genişliği ürün adı, fiyat ve stok bilgisinin rahat okunacağı seviyede olmalıdır.

5–6 küçük ürün kartını yan yana sıkıştırmak önerilmez.

70. Panelin Boğuk Olmaması

Ürünler ekranında aynı anda:

kategori sidebar,
15 filtre,
büyük kampanya banner'ı,
ürün kartları,
öneriler,
son görüntülenenler,
favoriler

gibi bütün içerikler gösterilmemelidir.

Ana görünüm:

Arama

Kategori / Filtre

Ürünler

üçlüsüne odaklanmalıdır.

Diğer özellikler ikincil seviyede bulunmalıdır.

71. Ürün Kartı Yoğunluk Kuralı

Bir kartta temel olarak:

Görsel

Ürün

Kod

Fiyat

Stok

Miktar

Sepete Ekle

yeterlidir.

Ödeme koşulu, KDV detayları, bütün teknik özellikler, stok yeri gibi bilgiler karta taşınmamalıdır.

72. Responsive — Tablet

Tablet'te:

2–3 kolon

ürün grid'i kullanılabilir.

Filtre sidebar drawer'a dönüşebilir.

73. Responsive — Mobile

Mobilde:

1 veya 2 kolon

kullanılabilir.

B2B bilgi yoğunluğu nedeniyle tek kolon ürün kartı çoğu durumda daha okunabilir olabilir.

Örneğin:

Espresso Çekirdeği 1 kg
STK-001

125,00 TL / Adet

● Stokta · 42 adet

Miktar [ 5 ]

[Sepete Ekle]
74. Mobile Filter

Mobilde filtreler üst alanı doldurmamalıdır.

Tek:

[Filtrele]     [Sırala]

barı kullanılabilir.

Filtrele drawer açar.

75. Mobile Product Detail

Ürün detayında:

Görsel

Ürün Adı

Fiyat

Stok

Varyant

Miktar

dikey sırayla gösterilir.

Alt sticky alan:

125,00 TL

[Sepete Ekle]

şeklinde kullanılabilir.

76. Yetkilendirme

Ürün kataloğunu görüntülemek için:

products.view

yetkisi gerekir.

Fiyat:

prices.view

Stok:

inventory.view

veya miktar için daha detaylı:

inventory.viewQuantity

kullanılabilir.

Favori:

favorites.manage

Sepete ekleme:

cart.manage

ile korunabilir.

77. Frontend Yetkisi Güvenlik Değildir

Fiyat yetkisi olmayan kullanıcıda fiyat alanını CSS ile gizlemek yeterli değildir.

Backend fiyat bilgisini response içerisinde göndermemelidir.

Benzer şekilde kullanıcı erişemediği ürünleri API üzerinden sorgulayarak elde edememelidir.

78. Netsim Veri Kaynakları

Ürün modülünün en önemli temel kaynağı:

STOKKART

olacaktır.

Muhtemel olarak:

stok kimliği,
stok adı,
stok tipi,
birim,
aktiflik,
bazı stok parametreleri

buradan gelebilir.

Ancak gerçek alan mapping'i Netsim database üzerinde doğrulanmalıdır.

79. STOKKADE

Mevcut incelemelerde karşılaşılan:

STOKKADE

yapısının stok kartıyla ilişkili ek bilgi/parametre rolü ayrıca araştırılmalıdır.

Ürün kataloğunda hangi bilgilerin buradan geleceği kesin alan analizi yapılmadan varsayılmamalıdır.

80. Varyant Kaynakları

Ürün varyantları için:

Product
↓
Variants
↓
Variant Values

ilişkisini sağlayan Netsim tabloları ayrıca keşfedilmelidir.

Özellikle:

varyant zorunluluğu,
varyant kimliği,
stok,
fiyat,
barkod

ilişkileri doğrulanmalıdır.

81. Birim Kaynakları

Ürünün:

ana birimi,
satış birimi,
alternatif birimleri,
dönüşüm oranları

Netsim tarafında doğrulanmalıdır.

B2B kullanıcıya yalnızca satış açısından geçerli birimler gösterilmelidir.

82. Fiyat Kaynakları

Fiyat yalnızca STOKKART içerisindeki bir alan olarak düşünülmemelidir.

Fiyatlandırma şu faktörlere bağlı olabilir:

Cari

Fiyat Listesi

Stok

Miktar

İskonto

Tarih

Para Birimi

Kampanya

Bu nedenle Price domain ayrı ele alınmalıdır.

83. Stok Kaynakları

Ürün listesinde gösterilecek stok:

STOKKART

üzerindeki master bilgiden değil, gerçek stok/bakiye yapılarından gelmelidir.

Mevcut Netsim yapısında:

STOKASIL

STOKISLM

gibi hareket tabloları stok hesaplamasında rol oynayabilir.

Ancak her ürün listelemede bütün stok hareketlerini toplamak performans açısından doğru olmayabilir.

Netsim'in mevcut bakiye yapısı ayrıca araştırılmalıdır.

84. B2B Ürün İçeriği

ERP ürün master datası web kataloğu için her zaman yeterli olmayabilir.

B2B tarafında tutulabilecek bilgiler:

Product Image

Web Description

Short Description

Featured Attributes

Documents

Display Order

Featured Product

B2B Visibility

olabilir.

Bu yaklaşım:

Product
=
Netsim Commercial Data
+
B2B Presentation Data

şeklindedir.

85. Ürün Görsellerinin Kaynağı

Görseller:

Netsim'den,
mevcut dosya sisteminden,
B2B medya alanından

gelebilir.

İlk sürüm öncesinde Netsim içerisinde güvenilir ürün görsel altyapısı olup olmadığı araştırılmalıdır.

Yoksa görsellerin B2B'de tutulması daha mantıklı olabilir.

86. Product API İhtiyaçları

Kavramsal backend yetenekleri:

Product List

Product Search

Product Detail

Category List

Product Filters

Variant Options

Price Preview

Inventory Availability

Favorite Add/Remove

Cart Add
87. Product List API

Temel parametreler:

Company

Search

Category

Filters

Sort

Page

Page Size

Ancak aktif cari frontend'in gönderdiği bir ID'ye kör şekilde güvenilerek kullanılmamalıdır.

Backend user membership üzerinden doğrulamalıdır.

88. Ürün Liste Response'u

Liste için yalnızca gerekli özet bilgi getirilmelidir.

Örneğin:

productId

code

name

image

priceSummary

stockSummary

unit

favorite

Uzun açıklamalar ve teknik detaylar her kart için taşınmamalıdır.

89. Product Detail API

Detayda daha kapsamlı:

Product Identity

Images

Description

Variants

Units

Commercial Information

Documents

Attributes

getirilebilir.

Fiyat ve stok dinamikse ayrı servislerden aggregate edilebilir.

90. Search Index

Ürün sayısı çok yükseldiğinde her aramada Netsim Firebird üzerinde karmaşık sorgu çalıştırmak yeterli olmayabilir.

Uzun vadede:

Netsim Product
↓
B2B Product Projection
↓
Search Index
↓
Product Search

kullanılabilir.

Ancak Netsim ürün master'ının source of truth olma durumu değişmez.

91. Performance

Ürün katalog ekranında aşağıdaki anti-pattern'den kaçınılmalıdır:

24 ürün

Her ürün için:
× ürün sorgusu
× fiyat sorgusu
× stok sorgusu
× görsel sorgusu

Liste için backend batch/aggregation yaklaşımı kullanmalıdır.

92. Fiyat ve Stok Bulk Resolution

Örneğin:

24 Product ID
↓
Bulk Price Resolution
+
Bulk Inventory Resolution
↓
24 Product Card

şeklinde çalışmak performans açısından daha uygundur.

93. Search Debounce

Ürün aramasında her klavye tuşunda backend request gönderilmemelidir.

Kısa:

debounce

uygulanabilir.

Minimum karakter sayısı ürün kodu kullanımını bozmayacak şekilde belirlenmelidir.

94. Cache

Daha uzun cache edilebilecek bilgiler:

Ürün adı

Kategori

Görseller

Web açıklaması

Teknik özellikler

Daha güncel olması gereken bilgiler:

Fiyat

Satılabilir stok

Kampanya

Müşteri özel koşulları
95. Ürün Detayından Sepete Ekleme Validation

Kullanıcı:

Sepete Ekle

dediğinde en az:

Ürün hâlâ satışta mı?

Varyant geçerli mi?

Miktar geçerli mi?

Birim geçerli mi?

Fiyat alınabiliyor mu?

Stok politikası uygun mu?

kontrol edilmelidir.

Kartta birkaç saniye önce gösterilen veriye koşulsuz güvenilmemelidir.

96. Ürün Durum Değişikliği

Kullanıcı ürün sayfasını uzun süre açık tutmuşken ürün satışa kapatılmış olabilir.

Sepete ekleme sırasında:

Bu ürün artık siparişe açık değil.

mesajı gösterilmelidir.

97. Ürün Fiyat Değişikliği

Ürün kartında:

125 TL

görülmüş ancak sepete ekleme sırasında:

130 TL

olmuşsa sepet güncel fiyatla çalışmalıdır.

Gerekirse:

Ürünün fiyatı güncellendi.

feedback verilebilir.

98. Accessibility

Ürün ekranında:

favori yalnızca kalp rengiyle anlatılmamalı,
stok yalnızca yeşil/kırmızı ile anlatılmamalı,
quantity input label/aria-label içermeli,
ürün kartları keyboard ile erişilebilir olmalı,
focus state görünür olmalıdır.
99. Product Card Click

Kartın tamamının tıklanabilir olması düşünülebilir.

Ancak kart içerisinde:

Favori
Miktar
Sepete Ekle

gibi bağımsız aksiyonlar olduğundan nested interaction karmaşası yaratılmamalıdır.

Önerilen:

Ürün adı / görsel → detay

Diğer componentler → kendi aksiyonları.

100. MVP Products Scope

İlk sürüm için önerilen çekirdek kapsam:

Ürün Listesi

Ürün Arama

Kategori

Temel Filtreleme

Ürün Detayı

Ürün Adı

Stok Kodu

Birim

Varyant

Cari Bazlı Fiyat

Stok Durumu

Miktar

Sepete Ekle

Pagination

Eğer ürün görsel altyapısı hazırsa:

Ürün Görselleri

de MVP'ye dahil edilmelidir.

101. Phase 2

İkinci faz:

Favoriler

Daha Önce Aldıklarım

Gelişmiş Filtreler

List / Grid Switch

Ürün Dokümanları

Teslimat Bilgisi

Kampanyalı Ürünler

Sık Alınanlar

Müşteri Ürün Kodları

eklenebilir.

102. Future Scope

İleride:

ATP

Akıllı Muadil

Tamamlayıcı Ürünler

AI Ürün Arama

Semantik Arama

Doğal Dil ile Ürün Bulma

AI Teknik Ürün Karşılaştırması

Kişiselleştirilmiş Ürün Önerileri

Akıllı Tekrar Sipariş

değerlendirilebilir.

103. Akıllı Muadil

Stokta olmayan üründe ileride:

Bu ürün stokta değil.

[Muadil Ürünleri Gör]

aksiyonu gösterilebilir.

Muadil önerileri yalnızca benzer ada göre yapılmamalıdır.

Mümkünse:

ürün sınıfı,
teknik özellik,
kullanım amacı,
fiyat,
mevcut stok

dikkate alınmalıdır.

104. AI Ürün Arama

İleride kullanıcı:

“Geçen ay aldığım espresso çekirdeğine benzer ama daha uygun fiyatlı ve stokta olan ürünleri göster.”

gibi arama yapabilir.

AI;

Search
+
Product Catalog
+
Customer Context
+
Order History
+
Stock
+
Pricing

üzerinden sonuç üretebilir.

Ancak ürün, fiyat ve stok gerçekliği her zaman ERP/backend tarafından doğrulanmalıdır.

105. Açık Sorular

Ürün modülü gerçek Netsim entegrasyonuna başlamadan önce aşağıdaki noktalar kesinleştirilmelidir.

STOKKART
B2B'de kullanılacak gerçek stok identifier hangisi?
Ürün adı hangi alan?
Aktif/pasif nasıl belirleniyor?
Satışa açık olma durumu nasıl belirleniyor?
Stok tipi B2B görünürlüğünü etkiliyor mu?
Ana birim hangi alan?
Varyant zorunluluk alanı hangisi?
B2B'de gösterilmemesi gereken stok tipleri var mı?
STOKKADE
STOKKADE tam olarak hangi ek stok bilgilerini içeriyor?
STOKKART ile bire bir mi, bire çok mu ilişkilidir?
Ürün liste/detail için gerekli alanlar buradan geliyor mu?
Kategoriler
Netsim'de web için kullanılabilir kategori/hiyerarşi mevcut mu?
Stok sınıfı B2B kategorisi olarak kullanılabilir mi?
Ayrı B2B kategori sistemi gerekecek mi?
Varyant
Varyant detayları hangi tablolarda?
Varyant kombinasyonu nasıl tanımlanıyor?
Varyant stok ve fiyatı etkiliyor mu?
Barkod varyant seviyesinde olabilir mi?
Birim
Satış birimleri hangi yapıdan geliyor?
Alternatif birimler nasıl tutuluyor?
Birim dönüşüm katsayıları nerede?
Cari bazında farklı satış birimi olabilir mi?
Fiyat
Aktif cari için satış fiyatının kesin hesaplama süreci nedir?
Fiyat listesi nerede?
Miktar fiyatı etkiliyor mu?
İskontolar nerede uygulanıyor?
Dövizli fiyat nasıl çalışıyor?
Kampanya fiyatı nasıl bulunuyor?
Stok
Ürün ekranında fiziksel stok mu gösterilecek?
Serbest stok mu?
Satılabilir stok mu?
Rezerv nasıl düşülüyor?
Hangi depolar B2B stok hesabına dahil?
Firma/şube bazında stok nasıl ayrılıyor?
Güncel bakiye için Netsim'de hazır bir yapı var mı?
Görseller
Netsim stok kartına bağlı görsel altyapısı var mı?
Bir ürünün birden fazla görseli olabilir mi?
Görseller B2B tarafında mı yönetilmeli?
106. Önerilen Desktop Liste Tasarımı
Ürünler                                           [Hızlı Sipariş]

Ürünleri keşfedin ve size özel fiyatlarla siparişinizi oluşturun.


[ Ürün adı veya stok kodu ara.............................. ]


┌───────────────────┐
│ Kategoriler       │
│                   │
│ Tüm Ürünler       │
│ Kahve             │
│   Espresso        │        128 Ürün                Sırala: Önerilen ▼
│   Filtre Kahve    │
│ Ekipman           │
│                   │
│ Stok Durumu       │
│ ☑ Stokta          │
│ ☐ Sipariş Üzerine │
│                   │
└───────────────────┘


        ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
        │                │ │                │ │                │
        │     Görsel     │ │     Görsel     │ │     Görsel     │
        │                │ │                │ │                │
        │ Espresso 1 kg  │ │ Filtre 500 g   │ │ Premium Blend  │
        │ STK-001        │ │ STK-002        │ │ STK-003        │
        │                │ │                │ │                │
        │ 125,00 TL      │ │ 90,00 TL       │ │ 165,00 TL      │
        │ ● Stokta       │ │ ● Son 4 adet   │ │ ● Stokta       │
        │                │ │                │ │                │
        │ Miktar [ 1 ]   │ │ Miktar [ 1 ]   │ │ Miktar [ 1 ]   │
        │                │ │                │ │                │
        │ [Sepete Ekle]  │ │ [Sepete Ekle]  │ │ [Sepete Ekle]  │
        └────────────────┘ └────────────────┘ └────────────────┘
107. Önerilen Ürün Detay Tasarımı
Ürünler / Kahve / Espresso


┌─────────────────────────────┬─────────────────────────────────────┐
│                             │ Espresso Çekirdeği Premium 1 kg    │
│                             │ STK-001245                          │
│                             │                                     │
│        Ürün Görseli         │ ♡ Favorilere Ekle                  │
│                             │                                     │
│                             │ 125,00 TL / Paket                   │
│                             │                                     │
│                             │ ● Stokta · 42 adet                  │
│                             │                                     │
│                             │ Kavrum                              │
│                             │ [ Orta ▼ ]                          │
│                             │                                     │
│                             │ Miktar                              │
│                             │ [-] 1 [+] Paket                     │
│                             │                                     │
│                             │ [        Sepete Ekle        ]       │
└─────────────────────────────┴─────────────────────────────────────┘


Ürün Açıklaması

Premium espresso karışımı...


Teknik Özellikler

Ağırlık          1 kg
Kavrum           Orta
Paket            Valfli


Dokümanlar

Ürün Teknik Föyü                                  [Görüntüle]
108. Ürünler Modülünün Ana UX Sorusu

Ürün ekranı tasarlanırken şu soru temel filtre olmalıdır:

Kullanıcı aradığı ürünü hızlıca bulabiliyor ve satın alma kararını vermek için gereken fiyat, stok, varyant ve miktar bilgisini başka ekranlara gitmeden anlayabiliyor mu?

Eğer kullanıcı ürün kartından sonra sürekli:

Fiyat için başka ekran

Stok için başka ekran

Varyant için başka ekran

gezmek zorunda kalıyorsa ürün deneyimi gereğinden fazla ERP mantığına yaklaşmış demektir.

109. En Kritik Ürün Kuralları
Netsim'de bulunan her stok kartı otomatik olarak B2B ürünü değildir.
Kullanıcı yalnızca aktif firması için erişebildiği ürünleri görür.
Gösterilen fiyat aktif carinin fiyatıdır.
Frontend fiyat hesaplamaz.
Gösterilen stok satın alma açısından anlamlı olmalıdır.
Varyant gerekiyorsa sepete eklemeden önce seçilmelidir.
Sepete eklerken fiyat ve stok yeniden doğrulanır.
Ürün görseli ticari bilgiden daha önemli hale gelmemelidir.
ERP teknik alanları kullanıcıya taşınmamalıdır.
Ürün master datasının sahibi Netsim olmaya devam eder.
Web'e özgü görsel ve açıklamalar B2B tarafında tutulabilir.
Ürün listesi hızlı ve toplu sorgulanabilir olmalıdır.
110. Kısa Fonksiyon Tanımı

Ürünler; kullanıcının aktif carisi için satışa açık ürünleri aradığı ve filtrelediği, ürün ve varyant detaylarını incelediği, müşteriye özel fiyat ile satılabilir stok bilgisini gördüğü ve uygun ürünleri miktar belirleyerek sepete eklediği temel B2B katalog modülüdür.

Bu ekranın tasarımını yönetecek en kısa cümle de şu olabilir:

Ürünü bul → fiyatını gör → stok durumunu anla → sepete ekle.

Bence Products, Quick Order ve Cart birlikte tasarlanırken bu üç ekranın rollerini özellikle sabit tutmalıyız:

PRODUCTS
Ürünü bul ve seç

QUICK ORDER
Bildiğin ürünleri hızlı gir

CART
Siparişten önce her şeyi kontrol et

Bu ayrım korunursa ileride birbirinin fonksiyonlarını tekrar eden üç karmaşık ekran yerine, birbirini tamamlayan çok net bir satın alma akışımız olur.