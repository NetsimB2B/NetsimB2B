Quick Order

Bu dosya Netsim B2B Hızlı Sipariş ekranının fonksiyonel ve kullanıcı deneyimi tasarımını tanımlar.

Hızlı Sipariş'in amacı, kullanıcının ürün kataloğunda tek tek gezinmeden çok sayıda ürünü mümkün olan en kısa sürede siparişe hazırlayabilmesini sağlamaktır.

Bu ekran özellikle:

ürün kodlarını bilen,
düzenli olarak benzer ürünleri sipariş eden,
çok satırlı sipariş oluşturan,
Excel veya başka bir sistemden ürün listesiyle çalışan

profesyonel B2B kullanıcılarına yöneliktir.

Temel ürün prensibi:

Ürünü bilen kullanıcıyı katalog gezmeye zorlamadan, ürün kodu + miktar seviyesinde hızlı sipariş hazırlayabilmek.

Hızlı Sipariş doğrudan Netsim siparişi oluşturmaz.

Önerilen ana akış:

Ürünleri Gir
↓
Kontrol Et
↓
Fiyat + Stok Önizle
↓
Sepete Aktar
↓
Sepet
↓
Sipariş
1. Ekranın Temel Amacı

Kullanıcı Hızlı Sipariş ekranına geldiğinde şu işlemleri hızlı şekilde yapabilmelidir:

stok koduyla ürün bulmak,
ürün adıyla ürün bulmak,
barkod okutmak veya yazmak,
miktar girmek,
varyant seçmek,
çok sayıda ürünü toplu eklemek,
Excel'den veri aktarmak,
Excel benzeri satırları copy/paste yapmak,
hatalı ürünleri görmek,
fiyatları önceden görmek,
stok durumunu kontrol etmek,
geçerli satırları topluca sepete aktarmak.
2. Hızlı Sipariş ile Ürün Kataloğu Arasındaki Fark

Ürün kataloğu:

Ürün keşfetmeye

odaklanır.

Hızlı Sipariş:

Bilinen ürünleri hızlı girmeye

odaklanır.

Ürün kataloğunda:

Kategori
↓
Ürün
↓
Ürün Detayı
↓
Sepete Ekle

akışı olabilir.

Hızlı Sipariş'te ise:

STK-001    5 adet
STK-017   10 adet
STK-082    2 adet

gibi giriş yeterli olmalıdır.

3. Hedef Kullanıcılar

Hızlı Sipariş özellikle aşağıdaki kullanıcılar için değerlidir:

bayi satın alma personeli,
kurumsal satın alma kullanıcısı,
düzenli sipariş veren müşteri,
ürün kodlarıyla çalışan operasyon personeli,
çok satırlı sipariş hazırlayan kullanıcı.

Hızlı Sipariş bütün kullanıcıların zorunlu olarak kullanacağı ana yöntem değildir.

Katalog ve Hızlı Sipariş birbirini tamamlayan iki farklı sipariş giriş yöntemidir.

4. Ekran Genel Yapısı

Desktop ekran için önerilen ana yapı:

Hızlı Sipariş

Ürün kodu, ürün adı veya barkod ile ürünleri hızlıca ekleyin.

[ Ürün Ekle ]   [ Excel Yükle ]   [ Copy / Paste ]   [ Şablonlar ]


┌─────────────────────────────────────────────────────────────────────────────┐
│ Kod     │ Ürün │ Varyant │ Stok │ Miktar │ Birim │ Fiyat │ Toplam │ İşlem │
├─────────────────────────────────────────────────────────────────────────────┤
│ ...                                                                     │
│ ...                                                                     │
│ ...                                                                     │
└─────────────────────────────────────────────────────────────────────────────┘

+ Yeni Satır


                                            Ara Toplam     12.450,00 TL
                                            ---------------------------
                                            [ Sepete Aktar ]

Ekranın ana odağı grid olmalıdır.

Çok sayıda kart ve yan widget kullanılmamalıdır.

5. Tasarım Karakteri

Hızlı Sipariş ekranı Dashboard'dan daha operasyonel ve veri yoğun olabilir.

Ancak klasik ERP grid'i kadar karmaşık görünmemelidir.

Amaç:

ERP verimliliği
+
modern web sadeliği

dengesini korumaktır.

Ekranda:

tek ana grid,
az sayıda güçlü aksiyon,
satır bazlı validation,
görünür toplam,
açık hata mesajları

kullanılmalıdır.

6. Ana Sipariş Giriş Yöntemleri

Sistem aşağıdaki giriş yöntemlerini destekleyecek şekilde tasarlanabilir:

1. Stok kodu ile giriş
2. Ürün adı ile arama
3. Barkod
4. Excel upload
5. Copy / Paste
6. Önceki siparişten kopyalama
7. Sipariş şablonu

İlk sürümde hepsinin bulunması zorunlu değildir.

7. MVP Giriş Yöntemleri

MVP için önerilen:

Stok kodu / ürün adı arama

Grid üzerinden satır ekleme

Copy / Paste

Excel import da erken aşamada ciddi B2B değeri sağlayabileceği için müşteri ihtiyacına göre MVP'ye alınabilir.

8. Manuel Ürün Ekleme

Kullanıcı grid içerisindeki ilk boş satırdan ürün girebilmelidir.

Örneğin:

Stok Kodu / Ürün Ara

[ STK-001                           ]

Kullanıcı yazmaya başladığında autocomplete açılır.

Örneğin:

STK-001
Espresso Çekirdeği 1 kg

STK-001-B
Espresso Çekirdeği Premium 1 kg

Kullanıcı seçim yaptığında satır otomatik doldurulur.

9. Arama Davranışı

Arama aşağıdaki alanlarla çalışabilir:

Stok kodu
Ürün adı
Barkod

İleride:

Alternatif kod
Müşteri ürün kodu

eklenebilir.

Arama sonuçları kullanıcının aktif firması için satışa açık ürünlerle sınırlandırılmalıdır.

10. Search Result İçeriği

Autocomplete sonucu mümkün olduğunca kısa ama ayırt edici olmalıdır.

Örneğin:

STK-001
Espresso Çekirdeği 1 kg
Stokta

veya:

STK-208
Filtre Kahve 500 g
12 adet

Fiyatın autocomplete içerisinde gösterilip gösterilmeyeceği performans ve fiyat hesaplama yapısına bağlıdır.

11. Klavye Odaklı Kullanım

Hızlı Sipariş ekranında klavye kullanımı özellikle desteklenmelidir.

Profesyonel kullanıcı:

ürün kodunu yaz
↓
Enter
↓
miktarı yaz
↓
Enter
↓
yeni satıra geç

akışıyla sipariş oluşturabilmelidir.

Mümkün olduğunca mouse kullanmak zorunda bırakılmamalıdır.

12. Grid Kolonları

Önerilen ana kolonlar:

Stok Kodu

Ürün

Varyant

Stok

Miktar

Birim

Birim Fiyat

İndirim

Satır Toplamı

İşlemler

Ancak her kolon zorunlu değildir.

13. MVP Grid Kolonları

İlk sürüm için daha sade yapı:

Ürün

Stok Durumu

Miktar

Birim

Birim Fiyat

Satır Toplamı

İşlem

Stok Kodu ürün adının yanında ikinci bilgi olarak gösterilebilir.

İndirim sadece gerçekten kullanıcı kararını etkiliyorsa ayrı kolon olmalıdır.

14. Ürün Kolonu

Örnek:

STK-001
Espresso Çekirdeği 1 kg

İki satırlı sunum grid'i fazla genişletmeden hem ürün kodunu hem adını gösterir.

Ürün detayına erişim gerekiyorsa ürün adı tıklanabilir olabilir.

15. Varyant Kolonu

Ürün varyantlıysa kullanıcı gerekli varyantı seçmelidir.

Örneğin:

Renk
[ Siyah ▼ ]

veya:

Beden
[ XL ▼ ]

Varyant gerekmeyen üründe bu alan:

—

gibi gösterilebilir.

Ancak mümkünse varyant kolonu yalnızca gereken ürünlerde aktif olmalıdır.

16. Varyant Zorunluluğu

Netsim tarafında ürün için varyant zorunluluğu bulunuyorsa kullanıcı miktar girmiş olsa bile satır geçerli kabul edilmemelidir.

Örneğin:

STK-055
Tişört

Varyant seçilmedi

durumunda:

Lütfen varyant seçin.

mesajı gösterilmelidir.

Satır sepete aktarılamaz.

17. Varyant Seçimi ve Ürün Kimliği

Varyant seçildikten sonra:

fiyat,
stok,
barkod,
birim

değişebiliyorsa bu bilgiler yeniden hesaplanmalıdır.

Dolayısıyla:

Product
+
Variant

birlikte satırın gerçek ticari kimliğini belirleyebilir.

18. Stok Kolonu

Stok bilgisi mümkün olduğunca kullanıcı dostu olmalıdır.

Örneğin:

Stokta
24 adet
Son 3 adet
Stokta yok
Sipariş üzerine

Backend'deki bütün stok bileşenleri grid'e taşınmamalıdır.

19. Miktar Alanı

Miktar kullanıcının en sık düzenleyeceği alandır.

Component:

[-]  5  [+]

veya hızlı veri girişi için:

[ 5 ]

olabilir.

Desktop Quick Order ekranında doğrudan sayı input'u daha hızlı olabilir.

20. Miktar Validation

Miktar için minimum kontroller:

> 0 olmalı

Geçerli sayı olmalı

Ürünün izin verdiği hassasiyete uymalı

Gerekirse minimum sipariş miktarına uymalı

Gerekirse paket katsayısına uymalı

Örneğin sadece 12'li koli satılıyorsa:

Bu ürün 12'nin katları şeklinde sipariş edilebilir.

mesajı gösterilebilir.

21. Birim

Ürün hangi birim üzerinden satılıyorsa gösterilir.

Örneğin:

Adet

Kg

Metre

Koli

Paket

Birden fazla satış birimi varsa kullanıcı seçim yapabilir.

Birim değişimi:

fiyatı,
minimum miktarı,
toplamı

yeniden hesaplatabilir.

22. Fiyat Preview

Ürün ve gerekli varyant seçildikten sonra fiyat backend üzerinden alınmalıdır.

Kullanıcıya gösterilecek fiyat:

Aktif cari için geçerli ticari fiyat

olmalıdır.

Örneğin:

Birim Fiyat

125,00 TL
23. Fiyatın Backend'den Hesaplanması

Frontend fiyatı kendi içinde hesaplamamalıdır.

Backend gerekli:

cari,
ürün,
varyant,
birim,
miktar,
fiyat listesi,
iskonto,
kampanya

bilgilerini değerlendirerek sonuç dönmelidir.

Frontend sadece sonucu gösterir.

24. Fiyat Loading

Fiyat hesaplanırken satır:

Fiyat hesaplanıyor...

durumuna geçebilir.

Bütün grid bloke edilmemelidir.

Satır bazlı loading tercih edilmelidir.

25. Fiyat Alınamazsa

Örneğin:

Fiyat alınamadı

gösterilir.

Kullanıcının bütün siparişi kaybolmamalıdır.

Satır geçersiz işaretlenebilir ve:

Tekrar Dene

aksiyonu verilebilir.

26. İndirim

Gerçekten kullanıcıya gösterilmesi gerekiyorsa:

%10

gibi gösterilebilir.

Ancak Netsim fiyat sistemi sonucunda sadece net fiyat önemliyse grid'e ayrıca indirim kolonu eklemek zorunlu değildir.

Panelin boğuk olmaması için:

Kullanıcı kararını etkilemeyen fiyat hesap detayları satırda gösterilmemelidir.

27. Satır Toplamı

Kavramsal olarak:

Miktar
×
Net Birim Fiyat
=
Satır Toplamı

Örneğin:

5 × 125 TL
=
625,00 TL

Verginin satır toplamına dahil olup olmaması sistem genelindeki fiyat gösterim kuralıyla aynı olmalıdır.

28. Satır İşlemleri

Her satır için minimum:

Sil

aksiyonu bulunmalıdır.

Opsiyonel:

Kopyala

Ürün Detayı

eklenebilir.

Ancak grid'in sağ tarafını icon butonlarla doldurmamak gerekir.

29. Yeni Satır

Grid altında:

+ Yeni Satır

aksiyonu bulunabilir.

Ayrıca son satır doldurulduğunda sistem otomatik yeni boş satır oluşturabilir.

Bu özellikle klavye kullanıcıları için daha hızlıdır.

30. Duplicate Ürün Davranışı

Kullanıcı aynı ürün + varyant kombinasyonunu ikinci kez eklerse sistemin davranışı net olmalıdır.

Önerilen yaklaşım:

Bu ürün zaten listede bulunuyor.

Mevcut miktar: 5
Eklenen miktar: 3

[Yeni Satır Olarak Tut] [Miktarı 8 Yap]

Ancak gereksiz modal kullanmamak için varsayılan olarak miktarlar birleştirilebilir.

Bu karar firma konfigürasyonuna göre değişebilir.

31. Barkod ile Ürün Ekleme

Barkod kullanımında kullanıcı:

barkod okuyucu ile barkod tarar,
veya barkod numarasını yazar.

Akış:

Barkod
↓
Ürün eşleşmesi
↓
Satır oluşur
↓
Miktar

Barkod okuyucular çoğu zaman klavye gibi çalıştığı için input focus davranışı buna uygun olmalıdır.

32. Barkod Eşleşmesi

Barkod kaynağı Netsim tarafında doğrulandıktan sonra:

barcode
→ product
→ variant
→ unit

eşleşmesi yapılmalıdır.

Bir barkod belirli varyantı temsil ediyorsa kullanıcı tekrar varyant seçmek zorunda kalmamalıdır.

33. Copy / Paste

Hızlı Sipariş'in güçlü özelliklerinden biri Excel benzeri veriyi doğrudan yapıştırabilmektir.

Kullanıcı örneğin:

STK-001    5
STK-005    12
STK-008    3

verisini Excel'den kopyalayabilir.

34. Copy / Paste Arayüzü

Copy / Paste seçildiğinde küçük bir modal veya drawer açılabilir.

Örneğin:

Toplu Ürün Ekle

Excel'den veya başka bir tablodan
ürün kodu ve miktar kolonlarını buraya yapıştırabilirsiniz.

┌──────────────────────────────┐
│ STK-001    5                 │
│ STK-005    12                │
│ STK-008    3                 │
│                              │
└──────────────────────────────┘

Beklenen format:
Stok Kodu | Miktar

[Vazgeç] [Kontrol Et]
35. Copy / Paste Parsing

Sistem mümkün olduğunca:

Tab
Comma
Semicolon

gibi yaygın ayraçları anlayabilir.

Ancak parsing aşırı belirsiz hale gelmemelidir.

Kullanıcıya algılanan kolonlar gösterilmelidir.

Örneğin:

Stok Kodu        Miktar

STK-001          5
STK-005          12
36. Copy / Paste Önizleme

Toplu veri doğrudan sepete aktarılmamalıdır.

Önce grid'e dönüştürülmelidir.

Akış:

Paste
↓
Parse
↓
Ürünleri Eşleştir
↓
Validation
↓
Quick Order Grid

Böylece kullanıcı hataları düzeltebilir.

37. Excel Import

Excel upload çok sayıda ürünle çalışan B2B müşterileri için önemli bir özelliktir.

Aksiyon:

Excel Yükle

seçildiğinde import modalı açılır.

38. Excel Şablonu

Kullanıcıya örnek dosya formatı sunulmalıdır.

Temel kolonlar:

Stok Kodu

Miktar

Opsiyonel:

Varyant

Birim

Barkod

İlk sürümde mümkün olduğunca az zorunlu kolon kullanılmalıdır.

39. Excel Dosya Örneği
STOK_KODU    MIKTAR

STK-001      5
STK-005      12
STK-008      3

Varyant gerekiyorsa:

STOK_KODU    VARYANT    MIKTAR

TSHIRT01     SIYAH-L    5
TSHIRT01     BEYAZ-M    3
40. Excel Upload Akışı
Excel Dosyası Seç
↓
Dosyayı Parse Et
↓
Kolonları Kontrol Et
↓
Ürünleri Netsim'de Eşleştir
↓
Varyant Kontrolü
↓
Fiyat + Stok Kontrolü
↓
Önizleme
↓
Quick Order Grid

Excel upload hiçbir zaman doğrudan sipariş oluşturmamalıdır.

41. Excel Hata Raporlama

Dosyada hatalı satırlar varsa kullanıcıya yalnızca:

Dosya hatalı.

denmemelidir.

Örneğin:

42 satır işlendi.

38 satır başarılı.
4 satırda işlem gerekli.

şeklinde özet gösterilmelidir.

42. Satır Bazlı Import Hatası

Örnek:

Satır 7
STK-999
Ürün bulunamadı.
Satır 14
TSHIRT01
Varyant zorunlu.
Satır 21
STK-150
Geçersiz miktar.

Kullanıcı mümkünse sorunları ekran üzerinde düzeltebilmelidir.

43. Kısmi Import

Dosyada 100 satırdan 3 tanesi hatalıysa 97 geçerli satırı tamamen kaybetmek iyi UX değildir.

Önerilen davranış:

97 geçerli satır grid'e eklenir.

3 hatalı satır ayrıca işaretlenir.

Kullanıcı hatalı satırları düzeltir veya kaldırır.

44. Önceki Siparişten Kopyalama

Kullanıcı geçmiş siparişlerden ürünleri Quick Order ekranına aktarabilir.

Akış:

Önceki Siparişten Ekle
↓
Sipariş Seç
↓
Ürün Satırlarını Getir
↓
Güncel Fiyat
↓
Güncel Stok
↓
Quick Order Grid

Eski fiyatlar kullanılmamalıdır.

45. Sipariş Şablonları

Yoğun tekrar sipariş veren kullanıcılar belirli ürün gruplarını şablon olarak kaydedebilir.

Örneğin:

Haftalık Ankara Siparişi

STK-001
STK-005
STK-082
STK-124

Şablonda ürünler ve opsiyonel varsayılan miktarlar bulunabilir.

46. Şablondan Sipariş

Akış:

Şablonlar
↓
Haftalık Sipariş
↓
Grid'e Aktar
↓
Miktarları Düzenle
↓
Fiyat + Stok Kontrolü
↓
Sepete Aktar

Şablon Netsim siparişi değildir.

B2B kullanıcı kolaylığı verisidir.

47. Şablonu Kaydet

Kullanıcı mevcut Quick Order grid'ini:

Şablon Olarak Kaydet

aksiyonuyla kaydedebilir.

Örneğin:

Şablon Adı

[ Haftalık Standart Sipariş ]

Bu özellik MVP sonrası eklenebilir.

48. Validation Katmanları

Quick Order satırı sepete aktarılmadan önce birden fazla validation uygulanmalıdır.

Temel kontroller:

Ürün mevcut mu?

Ürün aktif mi?

B2B satışına açık mı?

Aktif cari ürünü satın alabilir mi?

Varyant gerekli mi?

Varyant geçerli mi?

Birim geçerli mi?

Miktar geçerli mi?

Stok yeterli mi?

Fiyat hesaplanabiliyor mu?
49. Ürün Mevcut mu?

Stok kodu Netsim'de bulunmuyorsa:

Ürün bulunamadı.

Satır error durumuna geçer.

Sepete aktarılamaz.

50. Ürün Satılabilir mi?

Ürün Netsim'de mevcut olabilir ancak:

pasif,
satışa kapalı,
B2B'de görünmez,
ilgili müşteriye kapalı

olabilir.

Bu durumda:

Bu ürün şu anda siparişe açık değil.

gibi kullanıcı dostu mesaj gösterilmelidir.

51. Stok Validation

Satır için satılabilir miktar kontrol edilir.

Örneğin:

Talep: 15

Satılabilir: 10

Bu durumda sistem davranışı firma kuralına bağlıdır.

52. Backorder Kapalıysa

Backorder desteklenmiyorsa:

Bu üründen en fazla 10 adet sipariş verebilirsiniz.

gösterilir.

Miktar düzeltilmeden satır sepete aktarılamaz.

53. Backorder Açıksa

Backorder destekleniyorsa:

10 adet stokta.

Kalan 5 adet sipariş üzerine temin edilecektir.

gibi açıklama gösterilebilir.

Satır warning durumunda olabilir ancak sepete aktarılabilir.

Bu davranış kesin Netsim/işletme kuralına göre belirlenmelidir.

54. Stok Yeniden Kontrolü

Quick Order ekranında görülen stok bilgisi ile sepete aktarım anı arasında değişiklik olabilir.

Bu nedenle:

Sepete Aktar

işleminden önce kritik validation yeniden çalıştırılmalıdır.

Sipariş oluşturma anında da tekrar kontrol yapılmalıdır.

55. Fiyat Yeniden Kontrolü

Benzer şekilde fiyat:

Grid'e Ekleme

Sepete Aktarma

Sipariş Onayı

aşamalarında gerektiğinde yeniden doğrulanmalıdır.

B2B müşterisine eski veya client-side fiyat güvenilir kabul edilmemelidir.

56. Satır Durumları

Her satır aşağıdaki state'lerden birine sahip olabilir:

Empty

Searching

Validating

Ready

Warning

Error
57. Ready

Örneğin:

✓ Hazır

Ürün, varyant, miktar, fiyat ve diğer gerekli validation'lar geçerlidir.

58. Warning

Sipariş oluşturmayı engellemeyen fakat kullanıcıya bilgi verilmesi gereken durum.

Örneğin:

⚠ Talep edilen miktarın bir bölümü sipariş üzerine temin edilecek.
59. Error

Sepete aktarımı engelleyen sorun.

Örneğin:

Ürün bulunamadı.

veya:

Varyant seçilmelidir.
60. Validation Özeti

Grid üzerinde çok sayıda satır varsa üst veya alt bölümde özet gösterilebilir.

Örneğin:

24 Satır

21 Hazır
2 Uyarı
1 Hatalı

Bu özellikle Excel import sonrası faydalıdır.

61. Hatalı Satırlara Git

Özet içerisindeki:

1 Hatalı

seçildiğinde ekran doğrudan ilk hatalı satıra scroll edebilir.

Çok satırlı siparişlerde kullanışlıdır.

62. Toplam Alanı

Grid altında sipariş önizleme özeti bulunmalıdır.

Örneğin:

24 ürün satırı

Toplam miktar
138 adet

Ara Toplam
42.750,00 TL

Vergi ve diğer ticari hesapların nerede gösterileceği genel sipariş fiyat politikasına göre belirlenmelidir.

Quick Order ekranı tam checkout özeti olmak zorunda değildir.

63. Sabit Aksiyon Alanı

Çok uzun gridlerde kullanıcı aşağı kaydığında ana aksiyonu kaybetmemelidir.

Desktop'ta alt bölüm:

24 ürün    42.750,00 TL             [Sepete Aktar]

şeklinde sticky olabilir.

Sticky alan fazla yüksek olmamalıdır.

64. Sepete Aktarma

Quick Order ekranının ana aksiyonu:

Sepete Aktar

olmalıdır.

Bu işlem doğrudan Netsim siparişi oluşturmaz.

Akış:

Quick Order
↓
Validation
↓
B2B Cart
↓
Cart Review
↓
Order
65. Sepete Aktarma Davranışı

Kullanıcı:

Sepete Aktar

dediğinde sistem:

Satırları doğrular.
Güncel fiyatları kontrol eder.
Güncel stok durumunu kontrol eder.
Geçerli satırları B2B sepetine aktarır.
Kullanıcıya sonuç gösterir.

Örneğin:

24 ürün sepete eklendi.

[Sepete Git]
66. Hatalı Satır Varken Sepete Aktarma

İki yaklaşım mümkündür.

Strict

Tek bir hata varsa hiçbir satır aktarılmaz.

Partial

Geçerli satırlar aktarılır, hatalı satırlar Quick Order ekranında kalır.

B2B kullanımında önerilen:

Partial aktarım + açık sonuç özeti

olabilir.

Örneğin:

21 satır sepete eklendi.

3 satır hatalar nedeniyle eklenemedi.

Ancak bunun ticari süreç açısından uygunluğu doğrulanmalıdır.

67. Mevcut Sepet ile Birleşme

Kullanıcının sepetinde zaten ürünler varsa Quick Order satırları mevcut sepete eklenmelidir.

Aynı ürün mevcutsa:

mevcut miktar + yeni miktar

mantığı kullanılabilir.

Örneğin:

Sepette: 5

Quick Order: 3

Yeni Miktar: 8

Bu davranış kullanıcıya gerekirse bildirilebilir.

68. Firma Bağlamı

Quick Order aktif firma/cari bağlamında çalışmalıdır.

Firma değiştirildiğinde:

ürün yetkisi,
fiyat,
stok görünürlüğü,
sepet

yeniden değerlendirilmelidir.

Bir firmada hazırlanmış Quick Order listesi başka firma adına sessizce kullanılamamalıdır.

69. Firma Değişiminde Taslak

Kullanıcının Quick Order ekranında henüz sepete aktarmadığı satırlar varsa firma değişiminde uyarı verilebilir.

Örneğin:

Firma değiştirdiğinizde mevcut hızlı sipariş listeniz temizlenecek.

Devam etmek istiyor musunuz?

Alternatif olarak taslak firma bazlı saklanabilir.

İlk sürüm için temiz ve öngörülebilir davranış tercih edilmelidir.

70. Quick Order Taslağı

Uzun siparişlerde kullanıcının yaptığı çalışma kaybolmamalıdır.

İleride otomatik taslak desteği düşünülebilir.

Örneğin:

Taslak kaydedildi
16:42

Kullanıcı geri geldiğinde kaldığı yerden devam edebilir.

Bu özellik B2B DB tarafında tutulur.

71. Yetkilendirme

Quick Order yalnızca:

products.view

ve sipariş hazırlama yetkisine sahip kullanıcılara açılmalıdır.

Sepete aktarım için örneğin:

cart.manage

gerekebilir.

Sipariş verme yetkisi olmayan ancak sepet hazırlayabilen kullanıcı senaryosu desteklenebilir.

72. Fiyat Yetkisi

Kullanıcının:

prices.view

yetkisi yoksa grid fiyat kolonlarını göstermemelidir.

Örneğin grid:

Ürün
Stok
Miktar
Birim

şeklinde çalışabilir.

Backend de kullanıcıya fiyat bilgisini göndermemelidir.

73. Stok Yetkisi

Stok miktarını görme yetkisi ayrıca yönetiliyorsa:

inventory.viewQuantity

olmayan kullanıcıya:

Stokta

gösterilip:

142 adet

gösterilmeyebilir.

Bu politika uygulamanın genel ürün ekranıyla tutarlı olmalıdır.

74. Empty State

İlk açılışta boş grid yerine kullanıcıyı yönlendiren başlangıç alanı kullanılabilir.

Örneğin:

Hızlı siparişinizi oluşturmaya başlayın.

Ürün kodu veya ürün adı yazarak ilk ürünü ekleyin.

[+ Ürün Ekle]

veya

[Excel Yükle] [Copy / Paste]

İlk ürün eklendiğinde normal grid görünümüne geçilir.

75. Loading

Toplu validation sırasında bütün ekranı kör bir spinner ile kapatmamak tercih edilir.

Örneğin:

24 ürün kontrol ediliyor...

ilerleme göstergesi kullanılabilir.

Satırlar mümkünse aşamalı olarak sonuçlarını göstermelidir.

76. Büyük Excel Dosyaları

Çok büyük dosyalarda:

1000+

satırın tek seferde işlenmesi hem UX hem backend açısından problem oluşturabilir.

Import limiti tanımlanmalıdır.

Örneğin:

Bir dosyada maksimum 500 satır.

Kesin sınır performans testlerinden sonra belirlenmelidir.

77. Import Güvenliği

Excel import sırasında:

dosya tipi,
dosya boyutu,
satır sayısı,
beklenen kolonlar

kontrol edilmelidir.

Kullanıcı tarafından yüklenen Excel içerisindeki formüllerin çalıştırılması gibi riskli davranışlardan kaçınılmalıdır.

78. Responsive Davranış

Quick Order doğası gereği desktop-first bir fonksiyondur.

Çünkü çok kolonlu grid ve toplu veri girişi kullanılır.

Desktop'ta tam grid kullanılır.

Tablet'te bazı ikincil kolonlar gizlenebilir.

Mobilde klasik tabloyu sıkıştırmak yerine her satır küçük bir ürün entry card'a dönüşebilir.

Örneğin:

STK-001
Espresso Çekirdeği

Stokta

Miktar
[ 5 ]

125 TL / Adet

625 TL

Ancak Excel import ve yoğun toplu giriş deneyimi desktop'ta daha güçlü olacaktır.

79. Mobil Quick Order

Mobilde temel fonksiyonlar korunmalıdır:

Ürün ara
Barkod gir/oku
Miktar gir
Satır ekle
Sepete aktar

Excel yükleme mobilde desteklenebilir ancak ana kullanım senaryosu olarak düşünülmemelidir.

80. Quick Order ile Sepet Ayrımı

Quick Order ve Cart aynı şey değildir.

Quick Order:

Sipariş satırlarını hızlı hazırlama aracıdır.

Cart:

Sipariş öncesi ticari kontrol alanıdır.

Quick Order içerisinde:

teslimat adresi,
sipariş notu,
ödeme bilgisi,
nihai sipariş onayı

gibi checkout detayları bulunmamalıdır.

Bunlar Sepet / Sipariş oluşturma aşamasında ele alınmalıdır.

81. Netsim Veri Kaynakları

Quick Order temel olarak aşağıdaki Netsim veri gruplarına ihtiyaç duyar:

Ürün master

Ürün satış uygunluğu

Varyant

Birim

Barkod

Fiyat

Stok / satılabilir miktar

Cari ticari koşulları

Muhtemel ana kaynaklardan biri:

STOKKART

olacaktır.

Ancak:

barkod,
varyant,
fiyat,
bakiye/stok

yapılarının gerçek tablo ve alanları Netsim üzerinde doğrulanmalıdır.

82. STOKKART Rolü

STOKKART temel ürün kimliği için kullanılabilir.

Örneğin:

Stok No
Stok Adı
Stok Tipi
Birim
Aktif/Pasif
Varyant gereksinimi

gibi veriler bulunabilir.

Ancak gerçek alan adları ve iş anlamları database üzerinde doğrulanmadan kesin kabul edilmemelidir.

83. Varyant Kaynağı

Varyant sistemi için:

Product
↓
Available Variants

mapping'i gerekecektir.

Özellikle mevcut araştırmalarda STOKKART içerisinde varyantla ilgili bazı parametreler bulunabilse de gerçek varyant detay yapısı ayrıca keşfedilmelidir.

84. Fiyat Kaynağı

Fiyat yalnızca stok kartındaki sabit bir alan kabul edilmemelidir.

Müşteri bazlı:

fiyat listesi,
iskonto,
miktar,
tarih,
kampanya

gibi faktörler olabilir.

Bu nedenle Quick Order:

Product
+
Company
+
Quantity
+
Variant
+
Unit

bağlamıyla fiyat sorgulamalıdır.

85. Stok Kaynağı

Quick Order'da kullanılacak stok kavramı kesinleştirilmelidir.

Örneğin:

Fiziki Stok

Serbest Stok

Satılabilir Stok

ATP

arasından hangisinin kullanıcıya gösterileceği belirlenmelidir.

B2B için ideal olan çoğu durumda:

Satılabilir Stok

olacaktır.

86. B2B Veri Kaynakları

Quick Order'ın bazı verileri Netsim'e değil B2B sistemine aittir.

Örneğin:

Quick Order Draft

Order Template

Import History

User Preferences

Sepete aktarıldığında:

CART

CART_ITEM

gibi kavramsal B2B modellerine dönüşür.

Gerçek tablo isimleri veri mimarisinde belirlenmelidir.

87. Backend Fonksiyonları

Quick Order için backend seviyesinde temel yetenekler gerekir:

Product Search

Barcode Lookup

Variant Resolution

Stock Validation

Price Preview

Bulk Validation

Excel Import

Paste Parse

Cart Add

Frontend'in doğrudan Netsim tablolarını sorgulaması doğru değildir.

88. Search API İhtiyacı

Kavramsal:

Product Search

şu bilgileri alabilir:

Query
Active Company
Limit

ve yalnızca kullanıcıya satılabilir ürünleri döndürür.

89. Validate API

Bir veya daha fazla satırın ticari olarak geçerli olup olmadığını kontrol eder.

Örneğin request kavramsal olarak:

Product
Variant
Quantity
Unit
Company

bağlamını içerir.

Response:

Valid
Warnings
Errors
Available Quantity

gibi bilgiler içerebilir.

90. Price Preview API

Ürün satırının cari bazlı fiyatını getirir.

Fiyatın frontend tarafından türetilmemesi gerekir.

91. Bulk Validation

Excel ve copy/paste senaryoları için her satırı frontend'den ayrı ayrı yüzlerce request ile göndermek yerine bulk validation düşünülmelidir.

Kavramsal:

100 Quick Order Line
↓
Bulk Validation
↓
100 Validation Result

Bu performans açısından daha sağlıklıdır.

92. Cart Add

Quick Order'dan sepet aktarımı bulk çalışabilmelidir.

Örneğin:

24 Quick Order Line
↓
Bulk Add to Cart
↓
Cart

Backend tüm satırları yeniden validate eder.

93. Performans

Quick Order özellikle çok ürünlü siparişlerde performans açısından hassastır.

Aşağıdaki anti-pattern'den kaçınılmalıdır:

100 satır

× ürün sorgusu
× fiyat sorgusu
× stok sorgusu
× varyant sorgusu

=
yüzlerce ayrı database request

Backend toplu sorgulama ve aggregation yaklaşımı kullanmalıdır.

94. Debounce

Ürün adıyla arama sırasında her karakterde Netsim sorgusu gönderilmemelidir.

Search input:

debounce

kullanmalıdır.

Ayrıca minimum karakter sayısı düşünülebilir.

Örneğin:

2 veya 3 karakter
95. Cache

Ürün master ve benzeri daha stabil veriler cache edilebilir.

Ancak:

Price
Available Stock

daha güncel validation gerektirebilir.

Bu iki veri eski cache'e fazla bağımlı olmamalıdır.

96. Audit

Quick Order'ın kendisi henüz ticari belge değildir.

Ancak:

Excel import

Sepete aktarım

Sipariş oluşturma

gibi önemli adımlar gerektiğinde loglanabilir.

Nihai ticari audit Sipariş oluşturma aşamasında yapılmalıdır.

97. Hata Yönetimi

Backend teknik hataları kullanıcıya doğrudan gösterilmemelidir.

Örneğin:

Dynamic SQL Error

yerine:

Ürün bilgisi kontrol edilemedi.

Lütfen tekrar deneyin.

gösterilmelidir.

Toplu işlemde hangi satırların etkilendiği belirtilmelidir.

98. Quick Order'da Bilgi Yoğunluğu

Bu ekran Dashboard'a göre daha yoğun olabilir.

Ancak grid'e her mümkün Netsim alanı eklenmemelidir.

Ana karar:

Sipariş kararını etkileyen alan gösterilir; ERP işlemi için teknik olarak gerekli fakat kullanıcıya değer sunmayan alan arka planda tutulur.

Örneğin kullanıcı genellikle şunlara ihtiyaç duyar:

Hangi ürün?

Hangi varyant?

Stok var mı?

Kaç tane?

Hangi birim?

Fiyatı ne?

Toplam ne?

Bunun dışındaki ERP teknik alanları varsayılan grid'e eklenmemelidir.

99. Quick Order MVP

İlk sürüm için önerilen kapsam:

Ürün kodu / ürün adı arama

Satır ekleme

Ürün seçme

Varyant kontrolü

Miktar girişi

Stok önizleme

Fiyat önizleme

Satır toplamı

Validation

Toplu sepete aktarım

Opsiyonel güçlü MVP özelliği:

Copy / Paste
100. Phase 2

İkinci faz:

Excel Import

Barkod

Önceki Siparişten Kopyala

Sipariş Şablonları

Taslak Otomatik Kaydetme
101. Future Scope

Daha ileri aşamada:

AI ile liste yorumlama

PDF sipariş formundan ürün çıkarma

Müşteri ürün kodu mapping

Otomatik muadil

ATP

Sipariş miktarı önerisi

Akıllı tekrar sipariş

gibi fonksiyonlar düşünülebilir.

102. Açık Sorular

Quick Order implementasyonu öncesinde aşağıdaki konular Netsim tarafında doğrulanmalıdır.

Ürün
B2B satışına açık ürün nasıl belirleniyor?
Pasif stok kartı nasıl anlaşılır?
Satış birimleri nasıl tutuluyor?
Minimum sipariş miktarı mevcut mu?
Paket/koli katsayıları nerede tutuluyor?
Varyant
Varyant zorunluluğunu belirleyen kesin alan nedir?
Varyant seçenekleri hangi tablo/yapıdan geliyor?
Varyant stok ve fiyatı etkiliyor mu?
Varyantın kendi stok kodu bulunuyor mu?
Barkod
Barkod hangi tabloda tutuluyor?
Bir ürünün birden fazla barkodu olabilir mi?
Barkod varyanta veya birime bağlı olabilir mi?
Fiyat
Cari bazlı satış fiyatı nasıl hesaplanıyor?
Miktar fiyatı etkiliyor mu?
İskonto nereden geliyor?
Kampanyalar nasıl uygulanıyor?
Fiyatın geçerlilik tarihi var mı?
Stok
Fiziki stok ile satılabilir stok nasıl ayrılıyor?
Rezerv miktar nasıl bulunuyor?
Stok hangi depo/işlem noktaları üzerinden hesaplanmalı?
Backorder destekleniyor mu?
Negatif stokla siparişe izin veriliyor mu?
Sipariş
Quick Order'dan sepete geçen satır hangi Netsim alanlarına ihtiyaç duyacak?
Sipariş oluşturma sırasında hangi değerler yeniden hesaplanmalı?
103. Önerilen Ekran İskeleti

Tasarım açısından ilk versiyon şu yapıda olabilir:

Hızlı Sipariş                                      Sepet: 3 ürün

Ürün kodu veya adıyla hızlı sipariş oluşturun.

[ + Ürün Ekle ] [ Copy / Paste ] [ Excel Yükle ] [ Şablonlar ]


┌───────────────────────────────────────────────────────────────────────────────┐
│ Ürün                 │ Varyant │ Stok     │ Miktar │ Birim │ Fiyat │ Toplam │
├───────────────────────────────────────────────────────────────────────────────┤
│ STK-001               │   —     │ Stokta   │   5    │ Adet  │ 125   │ 625    │
│ Espresso Çekirdeği    │         │ 42 adet  │        │       │       │        │
├───────────────────────────────────────────────────────────────────────────────┤
│ STK-015               │ Siyah ▼ │ Stokta   │   3    │ Adet  │ 250   │ 750    │
│ Ürün Adı              │         │ 12 adet  │        │       │       │        │
├───────────────────────────────────────────────────────────────────────────────┤
│ [ Ürün ara... ]                                                            │
└───────────────────────────────────────────────────────────────────────────────┘

+ Yeni Satır


24 Satır                    21 Hazır · 2 Uyarı · 1 Hata

                                            Ara Toplam
                                            42.750,00 TL

                                            [ Sepete Aktar ]
104. Tasarımda Kaçınılması Gerekenler

Hızlı Sipariş ekranında şunlardan kaçınılmalıdır:

her satırda çok sayıda buton,
gereksiz ürün görselleri,
büyük kart yapıları,
sürekli açılan confirmation modalları,
çok fazla Netsim teknik kolonu,
her miktar değişiminde tüm ekran loading,
Excel import sonrası yalnızca genel hata mesajı,
geçersiz satırları kaybetmek,
fiyatı frontend'de hesaplamak,
doğrudan Quick Order'dan ERP siparişi oluşturmak.
105. Quick Order'ın Temel UX Prensibi

Ekran tasarlanırken şu soru ana filtre olmalıdır:

Kullanıcı 50 ürünlük bir siparişi mümkün olan en az mouse hareketi ve en az tekrar ile hazırlayabiliyor mu?

Hızlı Sipariş'in başarısı görsel olarak ne kadar gösterişli olduğu ile değil:

veri giriş hızının,
hata düzeltme kolaylığının,
stok/fiyat kontrolünün,
toplu sipariş hazırlama süresinin

ne kadar iyi olduğu ile ölçülmelidir.

106. Kısa Fonksiyon Tanımı

Hızlı Sipariş; B2B kullanıcısının ürün kodu, ürün adı, barkod veya toplu veri girişi kullanarak çok sayıda sipariş satırını hızlı biçimde oluşturduğu, Netsim üzerinden fiyat ve stok doğrulaması yaptığı ve geçerli satırları B2B sepetine topluca aktardığı operasyonel sipariş hazırlama ekranıdır.

Bu ekran için en kritik tasarım kararı bence şu:

Katalog gibi görsel değil, Excel kadar hızlı ama Excel'den daha kontrollü olmalı.

Bu tanım Quick Order'ın ürün içerisindeki rolünü çok iyi özetliyor.