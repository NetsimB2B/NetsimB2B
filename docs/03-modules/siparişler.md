Orders

Bu dosya Netsim B2B Siparişlerim modülünün fonksiyonel ve kullanıcı deneyimi tasarımını tanımlar.

Siparişler modülü kullanıcının aktif firmasına ait geçmiş ve devam eden siparişlerini görüntüleyebildiği, sipariş durumunu takip edebildiği, ürün bazında sevk edilen ve kalan miktarları görebildiği ve ilgili ticari belgelere ulaşabildiği alandır.

Temel prensip:

Kullanıcı bir siparişi verdikten sonra “Siparişim ne durumda?” sorusunun cevabını satış temsilcisini aramadan bu ekran üzerinden alabilmelidir.

Siparişler modülü özellikle şu ihtiyaçları karşılamalıdır:

sipariş geçmişini görmek,
aktif siparişleri takip etmek,
sipariş durumunu anlamak,
ürün bazında sevkiyat durumunu görmek,
teslimat durumunu görmek,
ilgili irsaliye/sevkiyat bilgilerine ulaşmak,
ilgili faturalara ulaşmak,
geçmiş siparişi yeniden hazırlamak,
uygun durumlarda iptal talebinde bulunmak.
1. Modülün Temel Yapısı

Siparişler modülü iki ana ekrandan oluşur:

Siparişlerim
│
├── Sipariş Listesi
│
└── Sipariş Detayı
    │
    ├── Genel Bilgiler
    ├── Durum
    ├── Ürün Satırları
    ├── Sevkiyatlar
    ├── İrsaliyeler
    ├── Faturalar
    └── İşlemler

Sipariş listesi hızlı tarama ve arama içindir.

Sipariş detayı ise tek bir siparişin bütün ticari yaşam döngüsünü gösterir.

2. Sipariş Listesi Amacı

Liste ekranı kullanıcının:

geçmiş siparişlerini bulmasını,
aktif siparişleri görmesini,
durumlarına göre filtrelemesini,
toplamları karşılaştırmasını,
sorunlu veya gecikmiş siparişleri hızlı fark etmesini

sağlamalıdır.

Liste ekranı ERP kayıt ekranı gibi çok fazla kolon içermemelidir.

3. Sayfa Başlığı

Üst bölüm:

Siparişlerim

Siparişlerinizi görüntüleyin ve durumlarını takip edin.

Sağ tarafta sipariş oluşturma yetkisi varsa:

+ Yeni Sipariş

primary CTA bulunabilir.

Opsiyonel secondary aksiyon:

Hızlı Sipariş

olabilir.

4. Sipariş Arama

Liste üzerinde görünür bir arama alanı bulunmalıdır.

Kullanıcı en az:

sipariş numarası,
müşteri sipariş referansı

üzerinden arama yapabilmelidir.

İleride:

ürün kodu,
ürün adı

üzerinden sipariş bulma desteği de eklenebilir.

Örneğin:

[ Sipariş no veya referans ara... ]
5. Temel Filtreler

Varsayılan görünümde yalnızca sık kullanılan filtreler gösterilmelidir.

Önerilen:

Durum
Tarih Aralığı
Sevkiyat Durumu

Opsiyonel:

Teslim Tarihi
Tutar Aralığı
Siparişi Veren Kullanıcı

gibi filtreler Daha Fazla Filtre altında bulunabilir.

Ekran çok sayıda select ile doldurulmamalıdır.

6. Hızlı Durum Filtreleri

Sipariş ekranında kullanıcıların sık kullandığı durumlar hızlı filtre olarak sunulabilir.

Örneğin:

Tümü

Aktif

Onay Bekliyor

Hazırlanıyor

Kısmi Sevk

Tamamlandı

Bu yapı tab veya filter chip şeklinde olabilir.

Ancak aynı anda hem çok sayıda tab hem de ayrı status select kullanılması gereksiz olabilir.

7. Varsayılan Liste Davranışı

Liste varsayılan olarak:

En yeni sipariş
↓
En eski sipariş

şeklinde sıralanmalıdır.

Aktif ve problemli siparişlerin ayrıca üstte gösterilmesi düşünülebilir ancak sıralama davranışı kullanıcıya sürpriz yaratmamalıdır.

8. Sipariş Listesi Kolonları

Önerilen ana kolonlar:

Sipariş No

Tarih

Teslim Tarihi

Genel Toplam

Durum

Sevkiyat Durumu

İşlem

Opsiyonel:

Müşteri Referansı

Para Birimi

Siparişi Veren

Fatura Durumu

Ana tablo gereksiz kolonlarla büyütülmemelidir.

9. Sipariş No

Sipariş numarası satırdaki temel identifier'dır.

Örnek:

SP-2026001245

Clickable olmalıdır.

Tıklandığında:

Sipariş Detayı

açılır.

10. Sipariş Tarihi

Siparişin ERP'de oluştuğu tarih gösterilir.

Örnek:

08.09.2026

Gerekirse saat detay ekranında gösterilebilir.

Liste ekranında saat genellikle gerekli değildir.

11. Teslim Tarihi

Sipariş için güvenilir teslim tarihi bulunuyorsa gösterilebilir.

Bu değer:

talep edilen teslim tarihi,
planlanan teslim tarihi,
teyit edilen teslim tarihi

kavramlarından hangisini temsil ettiği net tanımlanmalıdır.

Kullanıcıya yalnızca:

Teslim Tarihi

yazıp farklı bir tarih türü gösterilmemelidir.

12. Genel Toplam

Örnek:

24.850,00 TL

Sağa hizalanmalıdır.

Para birimi ayrıca kolon olarak gösterilebilir veya tutarın yanında bulunabilir.

Örneğin:

24.850,00 TL

yerine ayrıca:

24.850,00
TRY

kolonu oluşturmak çoğu durumda gereksizdir.

13. Sipariş Durumu

Durum badge olarak gösterilmelidir.

Örneğin:

● Hazırlanıyor

Durum yalnızca renkle anlatılmamalıdır.

14. B2B Sipariş Durumları

Kullanıcıya gösterilecek temel statüler:

Onay Bekliyor

Sipariş Alındı

Hazırlanıyor

Kısmi Sevk Edildi

Sevk Edildi

Tamamlandı

İptal Edildi

İş modeline göre bazıları birleştirilebilir.

Örneğin Sipariş Alındı ve Onaylandı ayrı tutulmak zorunda değildir.

15. Durum Renkleri

Önerilen mapping:

Onay Bekliyor
→ Warning

Sipariş Alındı
→ Information

Hazırlanıyor
→ Information

Kısmi Sevk Edildi
→ Warning

Sevk Edildi
→ Success

Tamamlandı
→ Success

İptal Edildi
→ Error

Aynı durum uygulamanın bütün ekranlarında aynı renk sistemini kullanmalıdır.

16. ERP Durumu ile B2B Durumu Ayrımı

B2B status'u yalnızca tek bir Netsim DURUM alanının kullanıcıya gösterilmesi şeklinde düşünülmemelidir.

Gerçek durum gerektiğinde:

ERP kayıt durumu
+
onay
+
kapanma
+
sipariş miktarı
+
sevk miktarı
+
iptal durumu

gibi birden fazla sinyalden hesaplanabilir.

Temel prensip:

ERP teknik state'i B2B iş state'ine map edilmelidir.

17. Sevkiyat Durumu

Sipariş durumu ile sevkiyat durumu ayrı kavramlardır.

Örneğin sipariş:

Hazırlanıyor

olabilirken sevkiyat:

Henüz Sevk Edilmedi

olabilir.

Önerilen sevkiyat durumları:

Sevk Edilmedi

Kısmi Sevk

Tam Sevk

Opsiyonel:

Teslim Edildi

yalnızca gerçekten teslimat bilgisi bulunuyorsa kullanılmalıdır.

18. Sipariş Listesi Örneği
Sipariş No      Tarih       Teslim       Toplam          Durum           Sevkiyat

SP-10458        08.09.2026  12.09.2026   24.850,00 TL    Hazırlanıyor    Sevk Edilmedi

SP-10451        05.09.2026  10.09.2026   18.400,00 TL    Kısmi Sevk      %60 Sevk

SP-10438        01.09.2026  05.09.2026    8.750,00 TL    Tamamlandı      Tam Sevk
19. Sipariş Satırı Aksiyonları

Liste içerisinde temel aksiyon:

Detay

olmalıdır.

Opsiyonel:

Siparişi Tekrarla

hızlı aksiyon olarak gösterilebilir.

Ancak her satırı çok sayıda button ile doldurmamak gerekir.

Diğer işlemler:

⋮

menüsü altında toplanabilir.

20. Liste Pagination

Sipariş geçmişi büyüyebileceği için pagination kullanılmalıdır.

Örneğin:

20 / 50 / 100 kayıt

sayfa boyutları desteklenebilir.

Liste bütün sipariş geçmişini tek seferde frontend'e çekmemelidir.

21. Empty State

Hiç sipariş yoksa:

Henüz siparişiniz bulunmuyor.

Ürünleri inceleyerek ilk siparişinizi oluşturabilirsiniz.

[Ürünlere Git]

gösterilebilir.

Sipariş oluşturma yetkisi olmayan kullanıcı için CTA gösterilmez.

22. Filtre Sonucu Boşsa

Kullanıcının siparişi vardır ancak filtre sonucu yoksa farklı mesaj kullanılmalıdır.

Örneğin:

Bu filtrelere uygun sipariş bulunamadı.

[Filtreleri Temizle]
23. Sipariş Detayı

Sipariş detay ekranı kullanıcının tek bir siparişle ilgili bütün önemli ticari bilgileri görmesini sağlar.

Temel yapı:

Sipariş Detayı
│
├── Sipariş Özeti
├── Durum / Timeline
├── Ürünler
├── Sevkiyatlar
├── Belgeler
└── Aksiyonlar
24. Sipariş Detay Header

Üst bölüm örneği:

← Siparişlerim

Sipariş SP-2026001245

08 Eylül 2026

● Hazırlanıyor

Sağ tarafta uygun aksiyonlar:

Siparişi Tekrarla

⋮ Diğer İşlemler

olabilir.

25. Sipariş Genel Bilgileri

Sipariş detayında özet olarak:

Sipariş No

Sipariş Tarihi

Sipariş Durumu

Sevkiyat Durumu

Teslim Tarihi

Müşteri Referans No

Para Birimi

Genel Toplam

gösterilebilir.

Siparişi hangi kullanıcının oluşturduğu da gerekiyorsa gösterilebilir.

26. Sipariş Timeline

Sipariş durumunun yalnızca badge olarak değil süreç olarak gösterilmesi faydalıdır.

Örneğin:

Sipariş Alındı
      ✓

Onaylandı
      ✓

Hazırlanıyor
      ●

Sevk Edildi
      ○

Tamamlandı
      ○

Bu özellikle B2B kullanıcısının süreci anlamasını kolaylaştırır.

27. Timeline Gerçek Veriye Dayanmalıdır

Timeline dekoratif bir progress bar olmamalıdır.

Sistemin gerçekten bildiği aşamalar gösterilmelidir.

ERP yalnızca:

Sipariş
Sevk
Tamamlandı

bilgilerini güvenilir şekilde sağlayabiliyorsa araya hayali aşamalar eklenmemelidir.

28. Sipariş Satırları

Sipariş detayının ana bilgi alanıdır.

Önerilen kolonlar:

Ürün

Varyant

Sipariş Miktarı

Sevk Edilen

Kalan

Birim

Birim Fiyat

Satır Toplamı

Teslim Tarihi

Durum

Ancak tasarımın çok genişlememesi için bazı kolonlar gruplanabilir.

29. Ürün Bilgisi

Örneğin:

Espresso Çekirdeği 1 kg

STK-001

Ürün adı primary, stok kodu secondary gösterilir.

Varyant varsa:

Renk: Siyah
Boyut: L

altında gösterilebilir.

30. Sipariş Miktarı

Siparişin ilgili satırında talep edilen toplam miktardır.

Örneğin:

10 Adet
31. Sevk Edilen Miktar

Gerçek sevkiyatlardan türetilen toplam miktardır.

Örneğin:

6 Adet
32. Kalan Miktar

Temel fikir:

Sipariş Miktarı
-
Net Sevk Miktarı
=
Kalan Miktar

Örnek:

10 - 6 = 4 Adet

Ancak bu hesapta:

iade,
iptal,
ters hareket,
düzeltme,
farklı hareket türleri

etkili olabilir.

Bu nedenle gerçek sevk hareketlerinin nasıl filtreleneceği doğrulanmalıdır.

33. Satır Bazlı Sevkiyat Gösterimi

Örneğin:

Sipariş
10 adet

Sevk Edildi
6 adet

Kalan
4 adet

şeklinde açık gösterim yapılmalıdır.

Opsiyonel progress:

██████░░░░  %60

kullanılabilir.

Ancak sayıların kendisi her zaman görünür olmalıdır.

34. Satır Durumları

Sipariş satırı için kullanıcı dostu durumlar:

Bekliyor

Hazırlanıyor

Kısmi Sevk

Tam Sevk

İptal

Sipariş header durumu ile satır durumu aynı olmak zorunda değildir.

Örneğin bir sipariş:

Kısmi Sevk Edildi

iken bazı satırlar:

Tam Sevk

bazıları:

Bekliyor

olabilir.

35. Satır Teslim Tarihi

Farklı ürünlerin farklı teslim tarihleri varsa satır bazında gösterilebilir.

Bu özellikle parçalı teslimat yapan B2B senaryolarında değerlidir.

Tek bir sipariş teslim tarihi varsa her satırda tekrar edilmemelidir.

36. Sipariş Finans Özeti

Detay ekranında:

Ara Toplam

İndirim

Vergi

Genel Toplam

gibi bilgiler gösterilebilir.

Örneğin:

Sipariş Özeti

Ara Toplam          21.000,00 TL
İndirim             -1.000,00 TL
KDV                  3.600,00 TL
────────────────────────────────
Genel Toplam        23.600,00 TL

Ticari hesaplama Netsim'deki gerçek sipariş değerleriyle uyumlu olmalıdır.

37. Eski Siparişin Fiyatı

Sipariş detayında sipariş oluşturulduğu andaki ticari fiyat gösterilir.

Bu tarihsel sipariş kaydının parçasıdır.

Ancak:

Siparişi Tekrarla

işleminde bu fiyat yeni sepete kopyalanmaz.

38. Sevkiyatlar Bölümü

Siparişe bağlı bir veya birden fazla sevkiyat bulunabilir.

Örneğin:

Sipariş
100 adet

├── Sevkiyat 1
│   60 adet
│
└── Sevkiyat 2
    40 adet

Sipariş detayı bu ilişkiyi gösterebilmelidir.

39. Sevkiyat Kartı / Tablosu

Gösterilebilecek bilgiler:

Sevkiyat / İrsaliye No

Sevk Tarihi

Sevk Edilen Miktar

Durum

Kargo Firması

Takip No

Araç

Şoför

Ancak yalnızca Netsim'de güvenilir şekilde bulunan bilgiler gösterilmelidir.

40. Kargo Bilgisi

Kargo entegrasyonu veya Netsim'de kargo verisi varsa:

Kargo: ABC Lojistik

Takip No: 48201938

[Kargoyu Takip Et]

gibi bilgiler gösterilebilir.

Kargo entegrasyonu yoksa boş alanlar gösterilmemelidir.

41. Araç ve Şoför

Firma kendi araçlarıyla teslimat yapıyorsa ve kullanıcı açısından anlamlıysa:

Araç

Plaka

Şoför

bilgileri gösterilebilir.

Bu bilgiler herkes için zorunlu değildir.

42. İrsaliyeler

Siparişe bağlı irsaliye belgeleri listelenebilir.

Örnek:

İrsaliyeler

IRS-202600425
08.09.2026
12 ürün

[Detay]

İrsaliye detayı ayrı modülde bulunabilir.

43. Fatura Bağlantısı

Sipariş veya sevkiyata bağlı faturalar gösterilebilir.

Örneğin:

Faturalar

FAT-202600918

23.600,00 TL

Ödenmedi

[Detay]

Sipariş doğrudan tek faturaya bağlı olmak zorunda değildir.

Bir siparişin birden fazla sevkiyat/faturaya dönüşebilmesi desteklenmelidir.

44. Belge İlişkisi

Kullanıcı açısından mümkün olduğunca şu ilişki görünür olmalıdır:

Sipariş
↓
Sevkiyat
↓
İrsaliye
↓
Fatura

Ancak gerçek Netsim belge akışı farklıysa B2B bunu doğru şekilde map etmelidir.

45. Siparişi Tekrarla

Sipariş detayının değerli aksiyonlarından biridir.

Kullanıcının aynı veya benzer siparişi hızlı şekilde tekrar hazırlamasını sağlar.

Akış:

Eski Sipariş
↓
Siparişi Tekrarla
↓
Ürünleri Al
↓
Güncel Ürün Kontrolü
↓
Güncel Fiyat
↓
Güncel Stok
↓
Sepet
46. Tekrar Siparişte Kopyalanacak Bilgiler

Temel olarak:

STOK_NO

STOK_VARYANT_NO

MIKTAR

BIRIM

gibi ürün kimliğini ve miktarı ifade eden bilgiler kullanılabilir.

Kesin alanlar Netsim yapısına göre doğrulanmalıdır.

47. Tekrar Siparişte Kopyalanmayacak Bilgiler

Eski siparişten doğrudan kopyalanmaması gerekenler:

Eski birim fiyat

Eski iskonto

Eski stok bilgisi

Eski kampanya

Eski toplam

Eski kredi/limit sonucu

Eski sevkiyat durumu

Yeni sepet mevcut ticari koşullarla yeniden hesaplanmalıdır.

48. Tekrar Sipariş Sonuçları

Bazı eski ürünler artık kullanılamıyor olabilir.

Örneğin:

12 ürün kontrol edildi.

10 ürün sepete eklendi.

1 ürün artık satışta değil.

1 ürün için varyant seçimi gerekiyor.

Kullanıcı bütün işlem başarısız olmuş gibi karşılanmamalıdır.

49. Sipariş İptali

B2B kullanıcısı ERP siparişini doğrudan:

DELETE

etmemelidir.

Siparişler geçmiş ve ticari kayıt niteliğindedir.

Önerilen model:

İptal Talebi

50. İptal Talebi

Sipariş uygun durumdaysa kullanıcı:

Sipariş İptal Talebi

oluşturabilir.

Örneğin:

Siparişi iptal etmek istediğinize emin misiniz?

SP-2026001245 numaralı sipariş için iptal talebi oluşturulacaktır.

İptal nedeni:

[ Yanlış ürün seçildi ▼ ]

Açıklama:
[                             ]

[Vazgeç] [İptal Talebi Gönder]
51. İptal Talebi ile İptal Ayrımı

Kullanıcıya süreç açık şekilde anlatılmalıdır.

Örneğin:

İptal talebiniz alındı.

demek gerekir.

Eğer sipariş henüz gerçekten ERP'de iptal edilmemişse:

Sipariş iptal edildi.

denmemelidir.

52. İptal Edilebilirlik

Siparişin iptal talebi verilebilir olması şu tür faktörlere bağlı olabilir:

Sipariş durumu

Sevkiyat başlamış mı?

Fatura oluşmuş mu?

ERP kuralı

Firma politikası

Örneğin tam sevk edilmiş siparişte:

Sipariş İptal Et

aksiyonu gösterilmemelidir.

53. İptal Talebi Durumu

B2B tarafında:

Talep Alındı

Değerlendiriliyor

Onaylandı

Reddedildi

gibi request state'leri tutulabilir.

Bunlar sipariş status'undan ayrı bir kavramdır.

54. Sipariş Onay Workflow'u

Bazı müşterilerde B2B siparişi ERP'ye gitmeden önce firma içi onaya ihtiyaç duyabilir.

Örneğin:

Satın Alma Kullanıcısı
↓
Sipariş Taslağı
↓
Bayi Yöneticisi
↓
Onay
↓
Netsim

Bu durumda listede:

Onay Bekliyor

durumu önemli hale gelir.

Bu özellik firma bazlı opsiyonel workflow olarak düşünülmelidir.

55. Sipariş Referansı

Kurumsal müşterilerin kendi satın alma sistemlerindeki PO numarası tutulabilir.

Örneğin:

Müşteri Referansı

PO-2026-4821

Liste üzerinde opsiyonel kolon veya arama kriteri olabilir.

Detay ekranında açıkça gösterilmelidir.

56. Sipariş Notu

Sipariş oluşturulurken kullanıcı tarafından girilen not:

Sipariş Notu

detay ekranında gösterilebilir.

Ancak uzun teknik ERP açıklama alanlarının tamamı kullanıcıya gösterilmemelidir.

57. Teslimat Adresi

Sipariş hangi teslimat adresine verildiyse detay ekranında gösterilebilir.

Örneğin:

Teslimat Adresi

Ankara Sincan Deposu
...

Adres sipariş tarihindeki snapshot olarak değerlendirilebilir.

Cari kartın güncel adresi sonradan değişse bile tarihsel sipariş farklı olabilir.

58. Sipariş Veren Kullanıcı

Aynı cari altında birden fazla B2B kullanıcısı varsa Bayi Yöneticisi gibi yetkili kullanıcılar için:

Siparişi Veren

Mehmet Kaya

bilgisi gösterilebilir.

Standart kullanıcı için zorunlu değildir.

59. Tarihsel Veri Prensibi

Sipariş detayındaki bazı bilgiler tarihsel sipariş kaydıdır:

Sipariş fiyatı

Sipariş miktarı

Sipariş tarihi

Teslimat adresi

Sipariş referansı

Bunların güncel ürün veya cari master datasıyla üzerine yazılması doğru değildir.

60. Netsim Kaynakları

Mevcut çalışma varsayımıyla sipariş tarafındaki muhtemel temel Netsim kaynakları:

ALSAASIL

sipariş header / ana belge,

ALSADETA

sipariş satırları

olarak değerlendirilebilir.

Sevkiyat tarafında muhtemel:

STOKASIL

STOKISLM

yapıları kullanılabilir.

Ancak gerçek tablo rolleri mevcut Netsim kurulumu üzerinden doğrulanmalıdır.

61. Temel Sipariş İlişkisi

Doğrulanması gereken muhtemel ilişki:

ALSAASIL.ALISSATIS_NO

↓

ALSADETA.ALISSATIS_NO

Bu ilişki sipariş header'ı ile satırları birbirine bağlayabilir.

62. Sipariş–Sevkiyat İlişkisi

Muhtemel ilişki:

ALSAASIL.ALISSATIS_NO

↓

STOKASIL.ALISSATIS_NO

Siparişten oluşan stok/sevk belgelerini bağlamak için kullanılabilir.

Kesin anlamı Netsim üzerinde doğrulanmalıdır.

63. Satır–Stok Hareketi İlişkisi

Muhtemel ilişki:

ALSADETA.ALISSATIS_DETAY_NO

↓

STOKISLM.ALISSATIS_DETAY_NO

Bu ilişki sipariş satırının hangi stok hareketleriyle gerçekleştiğini belirlemek için güçlü adaydır.

Ancak:

hangi stok hareketlerinin gerçek sevkiyat olduğu,
iadelerin nasıl temsil edildiği,
ters hareketlerin nasıl tutulduğu

ayrıca araştırılmalıdır.

64. Sevk Miktarı Hesabı

Kavramsal hesap:

Net Sevk Miktarı
=
Gerçek Sevk Hareketleri
-
İade / Ters Hareketler

daha sonra:

Kalan
=
Sipariş Miktarı
-
Net Sevk Miktarı

kullanılabilir.

Basitçe tüm STOKISLM miktarlarını toplamak güvenli kabul edilmemelidir.

65. Gerçek Sevkiyat Filtresi

Aşağıdaki konular doğrulanmalıdır:

hareket tipi,
giriş/çıkış yönü,
iptal durumu,
kayıt durumu,
belge türü,
iade hareketi,
ters kayıt,
depo transferi.

B2B sevk miktarı yalnızca gerçekten müşteriye yapılan sevkiyatları içermelidir.

66. Kapanma Alanları

Aşağıdaki alanların iş anlamı araştırılmalıdır:

KAPANDI

SKAPANDI

AKAPANDI

Bu alanların:

sipariş kapanması,
satış kapanması,
alış kapanması,
satır kapanması

gibi hangi anlamlarda kullanıldığı doğrulanmadan status hesabına dahil edilmemelidir.

67. DURUM Alanı

DURUM değerleri enum olarak çıkarılmalıdır.

Her değer için:

Netsim değeri

Netsim anlamı

B2B karşılığı

Siparişe etkisi

dokümante edilmelidir.

Örnek mapping tablosu ileride:

Netsim DURUM	ERP Anlamı	B2B Status
?	?	Onay Bekliyor
?	?	Hazırlanıyor
?	?	İptal

şeklinde doldurulmalıdır.

68. KAYIT_DURUMU

KAYIT_DURUMU gibi alanların:

aktif,
onaylı,
silinmiş,
iptal,
taslak

anlamlarından hangisini taşıdığı araştırılmalıdır.

B2B liste sorguları teknik olarak silinmiş veya geçersiz belgeleri yanlışlıkla göstermemelidir.

69. Sipariş Status Hesaplama Servisi

B2B backend tarafında kavramsal:

Order Status Resolver

bulunması faydalı olabilir.

Örneğin:

Order Header
+
Order Lines
+
Shipment Quantities
+
Record State
+
Cancellation State
↓
B2B Order Status

Frontend bu hesaplamayı yapmamalıdır.

70. Sipariş Detay Aggregation

Sipariş detayı birçok farklı domain'den veri gerektirebilir.

Kavramsal yapı:

Order Detail
│
├── Order Header
├── Order Lines
├── Shipment Summary
├── Dispatch Notes
├── Invoice Links
└── B2B Actions

Backend bunları kullanıcı dostu tek modelde birleştirebilir.

71. API İhtiyaçları

Kavramsal API yetenekleri:

Order List

Order Detail

Order Line Shipment Status

Order Shipments

Order Documents

Repeat Order

Cancellation Request

Kesin endpoint yapısı API dokümantasyonunda tanımlanmalıdır.

72. Order List API

Desteklemesi gereken kavramsal parametreler:

Company

Page

Page Size

Search

Status

Shipment Status

Date From

Date To

Sort

Cari bilgisi frontend tarafından güvenilir kaynak olarak gönderilip sorgu kapsamı bununla belirlenmemelidir.

Backend kullanıcı membership'inden yetkili cari kapsamını doğrulamalıdır.

73. Order Detail API

Sipariş ID veya güvenli identifier üzerinden erişilir.

Backend:

User
↓
Company Membership
↓
Order Cari

ilişkisini doğrulamadan sipariş bilgisini döndürmemelidir.

74. Repeat Order API

Repeat Order:

Order
↓
Order Lines
↓
Current Products
↓
Current Variants
↓
Current Prices
↓
Current Inventory
↓
Cart

akışını yönetmelidir.

İşlem idempotency açısından dikkatli tasarlanmalıdır.

Kullanıcının aynı butona iki kez basması ürünleri iki kez eklememelidir veya sonuç açık olmalıdır.

75. Cancellation Request API

İptal işlemi B2B request'i oluşturuyorsa:

Order

User

Reason

Description

Created At

Request Status

gibi bilgiler tutulabilir.

B2B request ile ERP sipariş kaydı birbirinden ayrılmalıdır.

76. Yetkilendirme

Sipariş modülünde en az:

orders.view

gereklidir.

Sipariş oluşturma:

orders.create

Siparişi tekrar etme için:

cart.manage

ve ilgili ürün erişimleri gerekir.

İptal talebi:

orders.cancelRequest

gibi ayrı permission olabilir.

77. Veri Kapsamı

External kullanıcı yalnızca bağlı olduğu cari siparişlerini görebilmelidir.

Temel kontrol:

Authenticated User
↓
Active Company Membership
↓
CARI_NO
↓
Orders

URL değiştirerek başka cariye ait sipariş görüntülenememelidir.

78. Bayi Yöneticisi

Aynı cari içerisindeki diğer kullanıcıların oluşturduğu siparişleri görebilir.

Örneğin:

ABC A.Ş.

Mehmet → Sipariş 1
Ayşe   → Sipariş 2

Bayi Yöneticisi her ikisini görebilir.

Standart kullanıcıların yalnızca kendi oluşturduğu siparişleri mi yoksa carinin bütün siparişlerini mi göreceği firma politikasıyla belirlenmelidir.

Önerilen B2B yaklaşımı çoğu durumda:

Cari seviyesinde ortak ticari görünürlük.

Ancak bu yapı permission ile sınırlandırılabilmelidir.

79. Finans Yetkisi

Sipariş tutarının görünürlüğü price/finance politikalarıyla uyumlu olmalıdır.

Fiyat göremeyen kullanıcıya:

Genel Toplam
Birim Fiyat
Satır Toplamı

gönderilmemesi gerekebilir.

Sipariş operasyonel olarak yine görüntülenebilir.

80. Belge Yetkisi

Fatura veya irsaliye görüntüleme ayrı permission olabilir.

Örneğin:

dispatchNotes.view

invoices.view

yetkisi olmayan kullanıcı Sipariş Detayı içerisinde ilgili belge section'ını görmez.

81. Loading

Sipariş listesinde:

Table Skeleton

kullanılmalıdır.

Sipariş detayında bütün ekran tek spinner ile bloke olmak zorunda değildir.

Örneğin:

Sipariş Header    ✓
Ürünler           ✓
Sevkiyatlar       loading
Faturalar         loading

şeklinde parçalı yükleme yapılabilir.

82. Partial Failure

Örneğin sipariş detay bilgisi alınırken fatura entegrasyonu başarısız olursa:

Sipariş Bilgileri
✓

Ürünler
✓

Sevkiyat
✓

Faturalar

Fatura bilgileri şu anda alınamıyor.
[Tekrar Dene]

gösterilebilir.

Sipariş detayının tamamı çökmemelidir.

83. Performans

Sipariş listesinde şu anti-pattern'den kaçınılmalıdır:

50 sipariş listelendi

Her sipariş için
× ayrı sevkiyat sorgusu
× ayrı fatura sorgusu
× ayrı cari sorgusu

Bu yüzlerce sorguya dönüşebilir.

Liste için gerekli:

Order Summary

backend tarafından toplu hazırlanmalıdır.

84. Liste ve Detay Veri Ayrımı

Sipariş listesi yalnızca ihtiyaç duyduğu özet bilgileri almalıdır.

Örneğin:

orderNumber
orderDate
deliveryDate
total
status
shipmentStatus

Sipariş satırları ve belgeler liste request'inde gereksiz yere getirilmemelidir.

Detay ekranında yüklenmelidir.

85. Pagination

Netsim'deki bütün siparişlerin tek sorguda çekilip frontend'de filtrelenmesi doğru değildir.

Filtering, sorting ve pagination mümkün olduğunca backend/database seviyesinde yapılmalıdır.

86. Cache

Sipariş verisi ürün kataloğuna göre daha dinamik olabilir.

Örneğin:

Tamamlanmış eski sipariş
→ daha uzun cache

Aktif sipariş
→ kısa cache

Sevkiyat bekleyen
→ kısa cache

Kesin süreler kullanım ve altyapıya göre belirlenmelidir.

87. Refresh

Aktif sipariş detayında:

Son güncelleme: 16:42

ve opsiyonel:

↻ Yenile

bulunabilir.

Ancak kullanıcı sürekli manuel refresh yapmak zorunda kalmamalıdır.

88. Responsive Liste

Desktop:

Table

kullanılabilir.

Tablet'te bazı düşük öncelikli kolonlar gizlenebilir.

Mobilde siparişler kart listesine dönüşmelidir.

Örneğin:

SP-2026001245

08 Eylül 2026

24.850,00 TL

● Hazırlanıyor

Sevkiyat
Henüz sevk edilmedi

[Detay]
89. Mobile Sipariş Detayı

Mobilde bilgi dikey olarak gruplanmalıdır.

Örneğin:

Sipariş SP-10458

● Hazırlanıyor

Sipariş Tarihi
08.09.2026

Teslim Tarihi
12.09.2026

Toplam
24.850 TL

ardından:

Ürünler

Sevkiyatlar

Belgeler

section'ları gelir.

90. Panelin Boğuk Olmaması

Sipariş detayında bütün bilgilerin aynı anda büyük kartlarda gösterilmesi ekranı ağırlaştırabilir.

Önerilen hiyerarşi:

Sipariş Özeti
↓
Ürünler
↓
Sevkiyat
↓
Belgeler

İkincil bilgiler collapsible section veya tab yapısında olabilir.

Ancak kullanıcı en önemli bilgiyi görmek için tab değiştirmek zorunda bırakılmamalıdır.

91. Sipariş Detayı İçin Tab Kullanımı

Sipariş çok fazla alt bilgiye sahipse:

Genel

Sevkiyatlar

Belgeler

gibi üç basit tab düşünülebilir.

Ancak:

Genel
Satırlar
Fiyatlar
Sevkiyat
İrsaliye
Fatura
Notlar
Tarihçe
...

gibi aşırı tab yapısı kullanılmamalıdır.

92. Sipariş Aktivite Geçmişi

İleride siparişin önemli olayları timeline olarak gösterilebilir.

Örneğin:

08 Eyl 10:42
Sipariş oluşturuldu.

08 Eyl 11:15
Sipariş onaylandı.

09 Eyl 14:20
4 ürün sevk edildi.

10 Eyl 09:10
İrsaliye oluşturuldu.

Bu yalnızca güvenilir event datası varsa kullanılmalıdır.

93. Bildirim Entegrasyonu

Sipariş durum değişiklikleri Notification domainine event üretebilir.

Örneğin:

Order Status
Hazırlanıyor
→
Sevk Edildi

sonucunda:

Siparişiniz sevk edildi.

bildirimi oluşturulabilir.

94. Sipariş Liste KPI'ları

Siparişler ekranının üst bölümünde çok sınırlı sayıda küçük özet kullanılabilir.

Örneğin:

Açık Sipariş 7

Sevk Bekleyen 4

Ancak Dashboard KPI'larının tamamı Siparişler ekranında tekrarlanmamalıdır.

Ana odak liste olmalıdır.

95. Sipariş Export

İleride kullanıcı sipariş listesini:

Excel

CSV

olarak dışa aktarabilir.

Bu özellikle kurumsal B2B kullanıcılarında yararlı olabilir.

Export yalnızca kullanıcının erişebildiği veri kapsamını içermelidir.

96. Sipariş Belgesi

Netsim uygun çıktı sağlıyorsa kullanıcı:

Sipariş Belgesini Görüntüle

veya:

PDF İndir

aksiyonuna sahip olabilir.

B2B kendi başına resmi belge üretmemeli; belgenin kaynağı ve statüsü açık olmalıdır.

97. Sipariş Değiştirme

Sipariş Netsim'e aktarıldıktan sonra B2B kullanıcısının doğrudan satır değiştirmesi varsayılan davranış olmamalıdır.

Örneğin:

Miktar değiştir
Ürün ekle
Ürün çıkar

ticari belge üzerinde doğrudan mutation anlamına gelebilir.

Böyle bir ihtiyaç varsa ayrı:

Sipariş Değişiklik Talebi

workflow'u tasarlanmalıdır.

98. Sipariş Geçmişinin Değişmezliği

Tamamlanmış siparişler tarihsel kayıt olarak görüntülenmelidir.

Geçmiş sipariş:

güncel ürün adından,
güncel fiyattan,
güncel müşteri adresinden

etkilenerek anlam değiştirmemelidir.

Mümkün olduğunca sipariş anındaki kayıt değerleri kullanılmalıdır.

99. MVP Siparişler Kapsamı

İlk sürüm için yeterli kapsam:

Sipariş Listesi

Sipariş Arama

Durum Filtresi

Tarih Filtresi

Sipariş No

Sipariş Tarihi

Genel Toplam

Sipariş Durumu

Sevkiyat Durumu

Sipariş Detayı

Ürün Satırları

Sipariş Miktarı

Sevk Edilen

Kalan

Birim Fiyat

Satır Toplamı

Siparişi Tekrarla

Mümkünse:

İrsaliye bağlantısı

da erken fazda değerli olur.

100. Phase 2

İkinci fazda:

Detaylı sevkiyat listesi

Yaklaşan teslimatlar

Fatura bağlantıları

Sipariş Timeline

Sipariş İptal Talebi

Müşteri Referans No

Belge indirme

Sipariş veren kullanıcı

Excel export

eklenebilir.

101. Future Scope

İleride:

Kargo takip entegrasyonu

Sipariş değişiklik talebi

Bayi içi sipariş onayı

Proaktif gecikme bildirimi

ATP bazlı teslim tahmini

AI sipariş özeti

AI tekrar sipariş önerisi

gibi özellikler değerlendirilebilir.

102. Açık Sorular

Sipariş modülünün gerçek Netsim entegrasyonu başlamadan önce aşağıdaki konular kesin şekilde araştırılmalıdır.

ALSAASIL
ALISSATIS_NO kesin sipariş identifier'ı mı?
Hangi işlem tipleri B2B siparişlerini temsil ediyor?
Cari bağlantısı hangi alan?
Sipariş tarihi hangi alan?
Talep edilen teslim tarihi hangi alan?
DURUM enum değerleri neler?
KAYIT_DURUMU ne ifade ediyor?
KAPANDI, SKAPANDI, AKAPANDI ne anlama geliyor?
İptal edilen kayıt nasıl anlaşılır?
ALSADETA
Sipariş miktarının kesin alanı nedir?
Birim nerede tutuluyor?
Net fiyat hangi alan?
Satır toplamı nasıl belirleniyor?
Varyant bağlantısı nasıl tutuluyor?
Satır teslim tarihi var mı?
Satırın kapandığı nasıl anlaşılır?
STOKASIL / STOKISLM
Gerçek sevkiyat hareketleri nasıl ayırt edilir?
İrsaliye ana belge ve detay yapısı nasıl çalışıyor?
ALISSATIS_NO ilişkisi her durumda güvenilir mi?
ALISSATIS_DETAY_NO gerçek sipariş satırına bağlanıyor mu?
İade hareketleri nasıl tutuluyor?
İptal/ters hareketler nasıl bulunuyor?
Sevk miktarı hangi alan üzerinden hesaplanmalı?
Fatura
Sipariş doğrudan faturaya bağlanabiliyor mu?
Fatura daha çok irsaliye üzerinden mi ilişkilendiriliyor?
Bir siparişten birden fazla fatura oluşabiliyor mu?
Faturanın ödeme durumu nasıl hesaplanıyor?
103. Önerilen Desktop Tasarım İskeleti

Liste ekranı:

Siparişlerim                                      [+ Yeni Sipariş]

Siparişlerinizi görüntüleyin ve durumlarını takip edin.


[ Sipariş ara... ]   [Durum ▼]   [Tarih Aralığı ▼]   [Sevkiyat ▼]


┌──────────────────────────────────────────────────────────────────────────────┐
│ Sipariş No │ Tarih │ Teslim │ Toplam │ Durum │ Sevkiyat │                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ SP-10458   │ 08.09 │ 12.09  │24.850  │Hazırlanıyor│Sevk edilmedi│ Detay → │
│ SP-10451   │ 05.09 │ 10.09  │18.400  │Kısmi Sevk │%60 sevk      │ Detay → │
│ SP-10438   │ 01.09 │ 05.09  │ 8.750  │Tamamlandı │Tam sevk      │ Detay → │
└──────────────────────────────────────────────────────────────────────────────┘


20 / sayfa                         ‹ 1  2  3  4 ... 12 ›

Detay ekranı:

← Siparişlerim

Sipariş SP-10458                          ● Hazırlanıyor

08 Eylül 2026

                                  [Siparişi Tekrarla] [⋮]


┌────────────────────────────────────────────────────────────────┐
│ Sipariş Alındı  ✓ → Onaylandı ✓ → Hazırlanıyor ● → Sevk ○    │
└────────────────────────────────────────────────────────────────┘


Sipariş Bilgileri

Teslim Tarihi          12.09.2026
Müşteri Referansı      PO-4821
Genel Toplam           24.850,00 TL


Ürünler

┌────────────────────────────────────────────────────────────────────────────┐
│ Ürün              │ Sipariş │ Sevk │ Kalan │ Fiyat │ Toplam │ Durum     │
├────────────────────────────────────────────────────────────────────────────┤
│ Espresso 1 kg     │ 10      │ 6    │ 4     │ 125   │1.250   │Kısmi Sevk│
│ STK-001            │         │      │       │       │        │           │
└────────────────────────────────────────────────────────────────────────────┘


Sevkiyatlar

IRS-202600425     09.09.2026      6 Adet            [Detay]


Faturalar

Henüz fatura oluşmadı.
104. Siparişler Modülünün Ana UX Sorusu

Bu modül tasarlanırken temel kontrol sorusu şu olmalıdır:

Kullanıcı siparişinin nerede olduğunu ve hangi ürünlerin daha gelmediğini birkaç saniye içinde anlayabiliyor mu?

Bu nedenle kullanıcıya yalnızca:

DURUM = 3
KAPANDI = 0

gibi ERP sonuçları göstermek yerine:

Hazırlanıyor

10 adet sipariş edildi
6 adet sevk edildi
4 adet bekliyor

gibi iş anlamı taşıyan bilgi sunulmalıdır.

105. Kısa Fonksiyon Tanımı

Siparişlerim; kullanıcının aktif carisine ait geçmiş ve devam eden siparişleri görüntülediği, sipariş ve ürün satırı seviyesinde durum ve sevkiyat takibi yaptığı, ilişkili ticari belgelere eriştiği ve geçmiş siparişlerden güncel koşullarla yeni sepet oluşturabildiği B2B takip modülüdür.

Bu modülün ürün açısından en kritik farkı da şu olmalı:

Sipariş listesi yalnızca “ne sipariş verdim?” sorusunu değil, “ne kadarının işlemi tamamlandı ve ne kadarı hâlâ bekliyor?” sorusunu cevaplamalıdır.