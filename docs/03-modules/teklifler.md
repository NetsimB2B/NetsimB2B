Quotes

Bu dosya Netsim B2B Tekliflerim modülünün fonksiyonel ve kullanıcı deneyimi tasarımını tanımlar.

B2B müşteri portalı açısından temel Netsim karşılığı genel olarak müşteriye verilen teklif olmalıdır.

Netsim tarafındaki kesin belge tipi, işlem kodu ve tablo/alan ilişkileri müşteri kurulumu üzerinde doğrulanmalıdır.

Temel prensip:

Teklif ekranı müşterinin yalnızca fiyat gördüğü bir belge ekranı değil; teklifi değerlendirdiği, cevap verdiği ve uygun durumda siparişe dönüştürdüğü ticari karar alanıdır.

1. Amaç

Teklifler modülü kullanıcının:

kendisine verilmiş teklifleri görüntülemesini,
teklif detaylarını incelemesini,
teklifin geçerlilik süresini görmesini,
ürün ve fiyat satırlarını kontrol etmesini,
ödeme ve teslimat şartlarını görmesini,
teklif PDF'ine ulaşmasını,
revizyon talep etmesini,
teklifi kabul etmesini,
teklifi reddetmesini,
kabul edilen tekliften sipariş oluşturmasını

sağlamalıdır.

Ana kullanıcı soruları:

Bana hangi teklifler verildi?

Teklif hâlâ geçerli mi?

Hangi ürün için hangi fiyat verilmiş?

Teslimat ve ödeme koşulları nedir?

Teklif revize edilmiş mi?

Bu teklifi kabul edebilir miyim?

Siparişe dönüştü mü?
2. Teklifler Modülünün Yapısı

Modül iki ana ekrandan oluşur:

Tekliflerim
│
├── Teklif Listesi
│
└── Teklif Detayı
    │
    ├── Genel Bilgiler
    ├── Teklif Durumu
    ├── Geçerlilik
    ├── Ürün Satırları
    ├── Ticari Şartlar
    ├── Revizyon Geçmişi
    ├── İlgili Belgeler
    └── Kullanıcı Aksiyonları

Liste ekranı teklifleri bulmak ve karşılaştırmak içindir.

Detay ekranı ise teklif üzerinde karar vermek için kullanılmalıdır.

3. Teklif Listesi

Liste ekranının temel amacı kullanıcının tekliflerini hızlı şekilde tarayabilmesidir.

Üst bölüm:

Tekliflerim

Size sunulan teklifleri görüntüleyin ve takip edin.

Firma politikasına göre sağ tarafta:

+ Teklif Talebi Oluştur

aksiyonu bulunabilir.

Bu özellik desteklenmiyorsa CTA gösterilmez.

4. Teklif Arama

Kullanıcı en az:

teklif numarası,
müşteri referans numarası

üzerinden arama yapabilmelidir.

Örnek:

[ Teklif no veya referans ara... ]

İleride:

ürün kodu,
ürün adı

ile teklif bulma desteği de eklenebilir.

5. Temel Filtreler

Liste üzerinde önerilen temel filtreler:

Durum
Tarih Aralığı
Geçerlilik

Opsiyonel:

Para Birimi
Tutar Aralığı
Satış Temsilcisi

Daha Fazla Filtre altında tutulabilir.

6. Hızlı Durum Filtreleri

Kullanıcı teklifleri iş anlamına göre hızlı süzebilmelidir.

Örneğin:

Tümü

Aktif

Yanıt Bekleyen

Kabul Edilen

Siparişe Dönüşen

Süresi Dolan

Reddedilen

Bu filtrelerin Netsim teknik statülerinden bağımsız B2B iş durumlarına dayanması gerekir.

7. Teklif Listesi Alanları

Ana kolonlar:

Teklif No

Tarih

Geçerlilik

Genel Toplam

Durum

İşlem

Opsiyonel:

Para Birimi

Revizyon No

Müşteri Referansı

Sipariş Durumu

Her alan listeye ayrı kolon olarak eklenmemelidir.

Örneğin para birimi doğrudan toplam ile birlikte:

24.850,00 TL

gösterilebilir.

8. Teklif No

Teklifin temel identifier'ıdır.

Örneğin:

TKL-202600425

Clickable olmalıdır.

Tıklanınca:

Teklif Detayı

açılır.

9. Teklif Tarihi

Teklifin oluşturulduğu belge tarihidir.

Örneğin:

08.09.2026

Liste ekranında saat bilgisi çoğu durumda gerekli değildir.

10. Geçerlilik Tarihi

Teklif açısından kritik bilgilerden biridir.

Örneğin:

Geçerli:
15.09.2026'ya kadar

veya listede:

15.09.2026

şeklinde gösterilebilir.

Kullanıcının özellikle teklifin ne kadar süre daha kullanılabileceğini hızlı anlaması gerekir.

11. Geçerlilik Durumunun Görsel Sunumu

Teklif süresi henüz geçmemişse:

7 gün kaldı

gibi yardımcı bilgi verilebilir.

Süre yaklaşmışsa:

⚠ 2 gün kaldı

gösterilebilir.

Süre geçmişse:

Süresi Doldu

status'u kullanılır.

Bu bilgi yalnızca gerçekten güvenilir teklif geçerlilik tarihi varsa gösterilmelidir.

12. Genel Toplam

Örnek:

42.750,00 TL

Finansal değer olarak sağa hizalanmalıdır.

Teklifin tarihsel değeridir.

Burada güncel katalog fiyatı değil, teklif belgesindeki tutar gösterilir.

13. Teklif Durumu

Kullanıcıya teknik ERP durum kodları gösterilmemelidir.

Önerilen B2B durumları:

Taslak

yalnızca müşterinin görmesi gereken bir durumsa kullanılmalıdır.

Müşteri tarafında temel durumlar daha çok:

Aktif

Yanıt Bekliyor

Kabul Edildi

Revizyon Talep Edildi

Revize Edildi

Siparişe Dönüştü

Süresi Doldu

Reddedildi

İptal Edildi

olabilir.

14. Durumların Sadeleştirilmesi

İlk sürümde status sayısı azaltılabilir.

Örneğin:

Aktif

Revizyon Bekliyor

Kabul Edildi

Siparişe Dönüştü

Süresi Doldu

Reddedildi

İptal Edildi

Bu yapı kullanıcı açısından daha kolay anlaşılır olabilir.

15. Teklif Durum Renkleri

Önerilen semantic mapping:

Aktif
→ Information

Revizyon Bekliyor
→ Warning

Kabul Edildi
→ Success

Siparişe Dönüştü
→ Success

Süresi Doldu
→ Neutral / Warning

Reddedildi
→ Error / Neutral Error

İptal Edildi
→ Error

Süresi Doldu ile Reddedildi aynı ticari anlamı taşımadığı için metin mutlaka açık olmalıdır.

16. Teklif Listesi Örneği
Teklif No      Tarih       Geçerlilik    Toplam           Durum

TKL-10458      08.09.2026  15.09.2026    24.850,00 TL     Aktif

TKL-10442      02.09.2026  09.09.2026    18.400,00 TL     Revizyon Bekliyor

TKL-10421      24.08.2026  31.08.2026     8.750,00 TL     Siparişe Dönüştü
17. Liste Satırı Aksiyonları

Ana aksiyon:

Detay

olmalıdır.

Aktif tekliflerde opsiyonel hızlı aksiyon:

Kabul Et

gösterilebilir.

Ancak satır başına çok sayıda buton kullanılmamalıdır.

Diğer işlemler:

⋮

menüsü altında:

PDF Görüntüle
Revizyon Talep Et
Reddet

şeklinde bulunabilir.

18. Teklif Detayı

Teklif detay ekranı müşterinin teklif üzerinde karar verdiği ana alandır.

Genel yapı:

Teklif Detayı
│
├── Header
├── Status / Validity
├── Teklif Bilgileri
├── Ürün Satırları
├── Ticari Şartlar
├── Revizyon Bilgisi
├── PDF / Belgeler
└── Aksiyonlar
19. Teklif Detay Header

Örnek:

← Tekliflerim

Teklif TKL-202600425

08 Eylül 2026

● Aktif

Sağ tarafta uygun durumda:

[PDF Görüntüle]

[Revizyon Talep Et]

[Teklifi Kabul Et]

bulunabilir.

Ancak üç güçlü primary button kullanılmamalıdır.

Önerilen:

Primary
→ Teklifi Kabul Et

Secondary
→ Revizyon Talep Et

Ghost / Menu
→ PDF, Reddet
20. Teklif Genel Bilgileri

Detayda:

Teklif No

Teklif Tarihi

Geçerlilik Tarihi

Durum

Revizyon No

Müşteri Referansı

Para Birimi

Genel Toplam

gösterilebilir.

Gereksiz veya boş alanlar gösterilmemelidir.

21. Geçerlilik Alanı

Geçerlilik kullanıcı açısından önemli olduğu için detay ekranında görünür olmalıdır.

Örneğin:

Teklif Geçerliliği

15 Eylül 2026'ya kadar

7 gün kaldı

Süresi dolduysa:

Bu teklifin geçerlilik süresi sona erdi.

gösterilmelidir.

22. Süresi Dolmuş Teklif Davranışı

Teklif süresi dolduğunda:

Teklifi Kabul Et

aksiyonu varsayılan olarak kapatılmalıdır.

Kullanıcıya alternatif aksiyon verilebilir:

Yeni Teklif Talep Et

veya:

Revizyon Talep Et

Firma politikasına bağlıdır.

23. Teklif Ürün Satırları

Önerilen alanlar:

Ürün

Varyant

Miktar

Birim

Teklif Birim Fiyatı

İndirim

Vergi

Satır Toplamı

Teslim Tarihi

Ancak panelin çok yoğun olmaması için:

indirim,
vergi,
bazı ticari detaylar

ayrı kolon olmak zorunda değildir.

24. Ürün Bilgisi

Örnek:

Espresso Çekirdeği 1 kg

STK-001

Varyant varsa:

Kavrum: Orta
Paket: 1 kg

altında gösterilebilir.

25. Teklif Miktarı

Teklifte verilen miktardır.

Örneğin:

100 Adet

Bu değer tarihsel teklif belgesinin bir parçasıdır.

Kullanıcının teklifi kabul ederken miktarı değiştirebilmesi ayrı iş kuralıdır.

Varsayılan yaklaşım:

Teklif kabulü sırasında belge satırları değiştirilmez.

Değişiklik gerekiyorsa revizyon talep edilir.

26. Teklif Fiyatı

Bu modülün en kritik prensiplerinden biri:

Teklif detayında güncel ürün fiyatı değil, teklif belgesine kaydedilmiş teklif fiyatı gösterilir.

Örneğin ürün bugün:

145,00 TL

olsa bile teklif tarihinde:

125,00 TL

verildiyse teklif ekranı:

125,00 TL

göstermelidir.

27. Teklif Fiyatı ile Güncel Fiyat Ayrımı

Teklif tarihi boyunca fiyat snapshot olarak korunmalıdır.

Bu nedenle:

Quote Price
≠
Current Product Price

olabilir.

Kabul işleminin hangi fiyatı kullanacağı ticari süreç açısından kritik bir konudur.

Geçerli teklif siparişe dönüşürken çoğu durumda teklif fiyatının korunması beklenebilir; ancak kesin Netsim davranışı doğrulanmalıdır.

28. İndirim

Teklif belgesinde indirim bilgisi bulunuyorsa kullanıcı görebilir.

Örneğin:

Liste Fiyatı      150,00 TL
İndirim           %10
Teklif Fiyatı     135,00 TL

Ancak teklif ekranını muhasebe hesap dökümüne çevirmemek gerekir.

Ana kullanıcı ihtiyacı:

Bana sunulan net fiyat nedir?

sorusudur.

29. Vergi

Vergi/KDV bilgisi teklif toplamında önemliyse:

Ara Toplam

İndirim

KDV

Genel Toplam

şeklinde özet alanında gösterilmelidir.

Satır bazlı KDV oranı gerektiğinde detay olarak gösterilebilir.

30. Teklif Finans Özeti

Örneğin:

Teklif Özeti

Ara Toplam            40.000,00 TL
İndirim               -2.000,00 TL
KDV                     6.840,00 TL
────────────────────────────────
Genel Toplam           44.840,00 TL

Finansal hesap Netsim teklif belgesindeki tarihsel değerlerle uyumlu olmalıdır.

31. Ödeme Şartları

B2B teklifinin yalnızca fiyatı değil ticari koşulları da önemlidir.

Örneğin:

Ödeme Şekli
30 Gün Vadeli

veya:

%50 Peşin
%50 Teslimatta

gibi bilgi gösterilebilir.

Netsim'de bunun nasıl temsil edildiği doğrulanmalıdır.

32. Teslimat Şartları

Örneğin:

Tahmini Teslimat
7–10 İş Günü

veya:

Teslim Tarihi
18.09.2026

gösterilebilir.

Bu bilgi gerçek Netsim teklif verisinden geliyorsa kullanılmalıdır.

33. Teklif Notları

Satış temsilcisinin teklif üzerinde müşteriye yönelik açıklaması varsa gösterilebilir.

Örneğin:

Teklif Notu

Fiyatlar 15 Eylül 2026 tarihine kadar geçerlidir.
Teslimat Ankara depo teslimidir.

ERP'nin iç kullanım notları ile müşteri notları birbirinden ayrılmalıdır.

34. İç Notlar Gösterilmemelidir

Netsim teklif kaydında firma içi:

maliyet,
iç açıklama,
satış temsilcisi notu,
yönetim notu

bulunabilir.

Müşteriye yalnızca açıkça müşteriyle paylaşılması amaçlanan bilgiler gösterilmelidir.

35. Revizyon Kavramı

Teklifler çoğu B2B sürecinde tek versiyonlu değildir.

Örneğin:

Teklif Revizyon 0
↓
Müşteri değişiklik istedi
↓
Teklif Revizyon 1
↓
Fiyat değişti
↓
Revizyon 2

Sistem teklif revizyonlarını destekleyecek şekilde tasarlanmalıdır.

36. REVIZYON_NO

Netsim tarafındaki:

REVIZYON_NO

gibi alanların gerçek davranışı doğrulanmalıdır.

Bu alan gerçekten teklif versiyonunu temsil ediyorsa B2B'de:

Revizyon 2

şeklinde gösterilebilir.

Tahmin edilerek kullanılmamalıdır.

37. REFERANS_ALISSATIS_NO

Aşağıdaki alan gibi referans yapıları:

REFERANS_ALISSATIS_NO

teklif revizyonlarının veya teklif → sipariş ilişkilerinin kurulmasında rol oynayabilir.

Kesin işlev Netsim üzerinde araştırılmalıdır.

38. Revizyon Geçmişi

Teklif versiyonları güvenilir şekilde ilişkilendirilebiliyorsa kullanıcıya:

Revizyon Geçmişi

Revizyon 2    Aktif
08.09.2026

Revizyon 1
05.09.2026

İlk Teklif
01.09.2026

gösterilebilir.

Varsayılan olarak en güncel revizyon açılmalıdır.

39. Eski Revizyon Davranışı

Eski revizyon görüntülenirken kullanıcıya:

Bu teklifin daha yeni bir revizyonu bulunmaktadır.

uyarısı gösterilmelidir.

Ana CTA:

Güncel Teklife Git

olabilir.

Eski revizyondan kabul işlemi yapılmamalıdır.

40. Revizyon Talebi

Kullanıcı teklif üzerinde değişiklik istediğinde:

Revizyon Talep Et

aksiyonu kullanabilir.

Bu B2B'ye özgü workflow olabilir.

41. Revizyon Talebi Modalı

Örnek:

Revizyon Talebi

Teklif üzerinde hangi konuda değişiklik istiyorsunuz?

Konu
[ Fiyat ▼ ]

Açıklama
[                                         ]

[Vazgeç] [Talebi Gönder]

Konu örnekleri:

Fiyat

Miktar

Teslimat

Ödeme Şartı

Ürün / Varyant

Diğer
42. Revizyon Talebi ERP Teklifini Doğrudan Değiştirmez

Önemli prensip:

Müşteri Revizyon Talep Et dediğinde B2B mevcut Netsim teklif satırlarını doğrudan değiştirmemelidir.

Önce bir:

Revision Request

oluşturulmalıdır.

Satıcı firma bu talebi değerlendirir.

Ardından Netsim'de yeni teklif/revizyon oluşturulur.

43. B2B Revizyon Talebi Verileri

Kavramsal olarak:

QuoteRevisionRequest

quoteId
userId
companyId
reason
description
status
createdAt
resolvedAt

gibi bilgiler tutulabilir.

Bu Netsim ana teklif belgesinden ayrı B2B verisidir.

44. Revizyon Talebi Durumları

Örneğin:

Talep Alındı

Değerlendiriliyor

Yeni Revizyon Oluşturuldu

Reddedildi

Kapandı

Bu durumlar teklif status'undan ayrı tutulmalıdır.

45. Teklifi Kabul Et

Aktif ve geçerli tekliflerde ana aksiyon:

Teklifi Kabul Et

olabilir.

Ancak kabul davranışı Netsim'deki gerçek ticari sürece göre tasarlanmalıdır.

46. Kabul Confirmation

Teklif kabulü ticari sonuç doğurduğu için confirmation kullanılmalıdır.

Örnek:

Teklifi kabul etmek istiyor musunuz?

TKL-202600425 numaralı,
44.840,00 TL toplam tutarlı teklifi kabul ediyorsunuz.

Kabul sonrası sipariş oluşturma işlemine geçilecektir.

[Vazgeç] [Teklifi Kabul Et]
47. Kabul Sonrası İki Olası Model

İki temel ticari model olabilir.

Model A — Kabul → Sepet
Teklif
↓
Kabul
↓
Teklif Satırları
↓
Sepet
↓
Teslimat / Son Kontrol
↓
Sipariş
Model B — Kabul → Doğrudan Sipariş
Teklif
↓
Kabul
↓
Netsim Siparişi

B2B UX açısından çoğu durumda Model A daha güvenli olabilir.

Çünkü kullanıcı:

teslimat,
referans,
son sipariş bilgileri

gibi alanları kontrol edebilir.

Ancak Netsim'in standart teklif → sipariş dönüşümü doğrudan belge dönüşümü yapıyorsa bu davranış ayrıca değerlendirilmelidir.

48. Teklif → Sipariş Dönüşümü

Tekliften sipariş oluşturulurken teklif satırlarının ticari bağının korunması önemlidir.

Muhtemel referans alanları:

REFERANS_ALISSATIS_NO

REFERANS_ALISSATIS_DETAY_NO

olabilir.

Bu alanların gerçek Netsim davranışı doğrulanmalıdır.

49. Teklif Fiyatının Korunması

Teklif siparişe dönüşürken en kritik açık sorulardan biridir:

Sipariş fiyatı teklif fiyatı mı olmalı, yoksa güncel fiyat yeniden mi hesaplanmalı?

Teklif hâlâ geçerliyse ticari beklenti çoğu zaman teklif fiyatının korunmasıdır.

Ancak Netsim'in standart belge dönüşüm davranışı esas alınmalıdır.

B2B bu kararı kendi başına vermemelidir.

50. Stok Kontrolü

Teklif verilmiş olması ürünün teklif kabul edildiği anda hâlâ stokta olduğu anlamına gelmez.

Bu nedenle kabul/sipariş dönüşümünde:

Ürün aktif mi?

Varyant geçerli mi?

Stok mevcut mu?

Teslimat koşulları hâlâ geçerli mi?

kontrolleri gerekebilir.

51. Teklifte Stok Garantisi

Firma bazı tekliflerde stok rezervasyonu yapıyorsa durum farklı olabilir.

Bu nedenle teklif:

Fiyat garantisi

ve:

Stok garantisi

aynı şey kabul edilmemelidir.

Netsim rezervasyon ilişkisi ayrıca araştırılmalıdır.

52. Teklifi Reddet

Kullanıcı aktif teklifi reddedebilir.

Aksiyon:

Teklifi Reddet

primary olmamalıdır.

Daha düşük öncelikli veya ⋮ menüsü altında bulunabilir.

53. Teklif Red Modalı

Örnek:

Teklifi reddetmek istiyor musunuz?

Red Nedeni
[ Fiyat uygun değil ▼ ]

Açıklama
[                                    ]

[Vazgeç] [Teklifi Reddet]

Red nedeni satış ekibi açısından faydalı geri bildirim sağlayabilir.

54. Teklif Red Nedenleri

Örnek:

Fiyat uygun değil

Teslimat süresi uygun değil

Ürün ihtiyacı değişti

Başka ürün tercih edildi

Teklif koşulları uygun değil

Diğer

Firma tarafından konfigüre edilebilir.

55. Red Davranışı

Teklif reddedildiğinde doğrudan Netsim kaydının hangi alanda güncelleneceği doğrulanmalıdır.

B2B tarafında en az:

Customer Response = Rejected

bilgisi tutulabilir.

ERP entegrasyon modeli ayrıca belirlenir.

56. Müşteri Cevabı

Teklife verilen cevap ayrı kavram olarak düşünülebilir:

Pending

Accepted

Rejected

RevisionRequested

Bu B2B tarafında tutulabilir.

ERP belge durumu ile müşteri cevabı aynı olmak zorunda değildir.

57. Teklif Durumu Hesaplama

B2B status'u şu kaynakların birleşimi olabilir:

ERP Document Status
+
Validity Date
+
Revision State
+
Customer Response
+
Order Conversion

Örneğin:

ERP aktif
+
geçerlilik tarihi geçti
=
Süresi Doldu

veya:

ERP aktif
+
customer response = accepted
+
order created
=
Siparişe Dönüştü
58. Status Önceliği

Bir teklif aynı anda teorik olarak birden fazla koşula uyabilir.

Bu nedenle status resolver için öncelik sırası belirlenmelidir.

Kavramsal örnek:

İptal Edildi
↓
Siparişe Dönüştü
↓
Reddedildi
↓
Süresi Doldu
↓
Revizyon Bekliyor
↓
Aktif

Kesin mantık business rule olarak tanımlanmalıdır.

59. PDF

Teklif PDF'i B2B müşterisi için önemli bir fonksiyondur.

Aksiyon:

PDF Görüntüle

veya:

Teklifi İndir

olabilir.

60. PDF Kaynağı

İki temel seçenek vardır.

Netsim Rapor Motoru

Netsim'in resmi teklif çıktısı alınır.

Avantaj:

ERP belgesiyle birebir uyum,
firmanın mevcut rapor tasarımı,
ticari çıktı standardı.
B2B PDF

B2B kendi modern PDF formatını oluşturur.

Avantaj:

daha modern görünüm,
web deneyimiyle tutarlılık.

Ancak resmi belge ile farklılık riski vardır.

61. PDF İçin Önerilen Yaklaşım

İlk tercih:

Netsim'in mevcut teklif çıktısını kullanmak.

Eğer uygun bir servis/çıktı altyapısı yoksa B2B PDF daha sonra değerlendirilebilir.

B2B'nin ürettiği PDF'in resmi Netsim belgesiyle tutarsız olmaması gerekir.

62. PDF Versiyonu

Revizyonlu tekliflerde PDF mutlaka ilgili revizyona ait olmalıdır.

Örneğin kullanıcı:

Revizyon 1

görüntülüyorsa yanlışlıkla:

Revizyon 2 PDF

indirilmemelidir.

63. Teklif ile Sipariş Bağlantısı

Teklif siparişe dönüştüyse detay ekranında görünür bağlantı bulunmalıdır.

Örneğin:

Bu teklif siparişe dönüştürüldü.

Sipariş No
SP-202600584

[Siparişi Gör]

Bu durumda:

Teklifi Kabul Et

aksiyonu tekrar gösterilmemelidir.

64. Teklif ile Revizyon Bağlantısı

Eski teklif revizyonunda:

Bu teklif revize edilmiştir.

Güncel Revizyon:
TKL-202600425 / Revizyon 2

[Güncel Teklife Git]

gösterilebilir.

65. Teklif Talebi

Ürünün genel kapsamına dahilse müşteri:

Teklif Talebi Oluştur

işlemi yapabilir.

Bu akış:

Ürünler / Sepet
↓
Teklif Talebi
↓
Satıcı Firma
↓
Verilen Teklif
↓
Tekliflerim

şeklinde olabilir.

Ancak Teklif Talebi ile Verilen Teklif aynı domain kaydı olarak düşünülmemelidir.

66. Teklif Talebi ile Teklif Ayrımı
Quote Request
=
Müşterinin satıcı firmadan teklif istemesi

Quote
=
Satıcı firmanın müşteriye sunduğu ticari teklif

B2B Tekliflerim ekranının ana odağı:

Quote / Verilen Teklif

olmalıdır.

67. Netsim Kaynakları

Mevcut çalışma varsayımıyla teklif ana ve detay kayıtları için:

ALSAASIL

ALSADETA

önemli adaylardır.

Ancak aynı tablolar farklı:

teklif,
sipariş,
satış belgesi

türlerini içerebilir.

Bu nedenle teklif belirleme yalnızca tablo adına bakılarak yapılmamalıdır.

68. Teklif İşlem Kodu

Teklif kaydını ayırt etmek için Netsim tarafındaki:

İşlem Kodu

veya belge tipi kritik olabilir.

Önemli mimari prensip:

Verilen Teklif işlem kodu uygulama içerisinde hard-code edilmemelidir.

Çünkü müşteri kurulumları arasında farklılık olabilir.

Örneğin kavramsal konfigürasyon:

quote.transactionCode

üzerinden yönetilebilir.

69. Müşteri Bazlı İşlem Kodları

Farklı Netsim müşterileri:

VERILEN_TEKLIF

SATIS_TEKLIF

TEKLIF

gibi farklı işlem kodları kullanıyor olabilir.

B2B domain bunu:

Quote

olarak görmelidir.

Integration layer gerçek Netsim kodunu bilir.

70. Teklif Header Kaynağı

Muhtemel:

ALSAASIL

üzerinden:

teklif no,
tarih,
cari,
durum,
para birimi,
toplam,
revizyon,
referans

bilgileri alınabilir.

Kesin alan mapping'i ayrıca doğrulanmalıdır.

71. Teklif Satır Kaynağı

Muhtemel:

ALSADETA

üzerinden:

ürün,
varyant,
miktar,
birim,
fiyat,
iskonto,
toplam

gibi bilgiler gelebilir.

Kesin alanlar doğrulanmalıdır.

72. Fiyat Snapshot Prensibi

Teklif satırındaki fiyat:

tarihsel belge değeridir.

Ürün kataloğundaki güncel fiyat ile overwrite edilmemelidir.

Bu teklif modülü açısından sipariş modülündeki tarihsel veri prensibiyle aynıdır.

73. Geçerlilik Kaynağı

Teklif geçerlilik tarihinin hangi Netsim alanında tutulduğu doğrulanmalıdır.

Olası senaryolar:

Teklif Son Geçerlilik Tarihi

doğrudan alan olabilir.

veya:

Teklif Tarihi
+
Geçerlilik Gün Sayısı

hesaplanıyor olabilir.

Tahmin edilmemelidir.

74. Geçerlilik Hesabı

Kavramsal olarak:

bugün <= validUntil
→ geçerli

bugün > validUntil
→ süresi dolmuş

Ancak:

revize edilmiş,
iptal edilmiş,
siparişe dönüşmüş

tekliflerde sadece tarihe bakılmamalıdır.

75. Revizyon İlişkisi

Aşağıdaki Netsim alanlarının gerçek rolü araştırılmalıdır:

REVIZYON_NO

REFERANS_ALISSATIS_NO

REFERANS_ALISSATIS_DETAY_NO

Özellikle:

eski/yeni teklif ilişkisi,
teklif → sipariş dönüşümü,
satır bazlı referans

açısından önemlidir.

76. B2B Özel Verileri

Bazı bilgiler Netsim teklifinin doğal parçası olmayabilir.

B2B tarafında tutulabilecek bilgiler:

Customer Response

Revision Request

Revision Request Reason

Revision Request Description

Reject Reason

Reject Description

Viewed At

Accepted At

Rejected At

Bunlar ERP ticari belgesine ait master alanlarla karıştırılmamalıdır.

77. Görüntülendi Bilgisi

İleride satıcı firma açısından faydalı olabilecek bir özellik:

Teklif müşteri tarafından görüntülendi.

bilgisi olabilir.

Örneğin:

İlk görüntülenme:
08.09.2026 14:32

Bu B2B davranış verisidir.

MVP için gerekli değildir.

78. Bildirimler

Teklif event'leri bildirim oluşturabilir.

Örneğin:

Yeni teklifiniz hazır.
Teklifiniz revize edildi.
Teklifinizin geçerlilik süresi 2 gün sonra sona erecek.
Revizyon talebiniz sonuçlandı.
79. Yaklaşan Geçerlilik Bildirimi

Örneğin geçerlilik bitimine:

2 gün

kaldığında kullanıcıya bildirim verilebilir.

Bu değer firma bazlı konfigüre edilebilir.

80. Yetkilendirme

Teklif görüntülemek için:

quotes.view

gerekebilir.

Revizyon talebi:

quotes.requestRevision

Kabul:

quotes.accept

Red:

quotes.reject

Teklif talebi oluşturma:

quotes.request

ayrı permission'lar olabilir.

81. Fiyat Yetkisi

Teklif ticari bir fiyat belgesi olduğundan fiyat görmeyen kullanıcıların teklif modülüne erişimi ayrıca düşünülmelidir.

İki yaklaşım olabilir:

Yaklaşım A

Fiyat yetkisi olmayan kullanıcı teklifi hiç göremez.

Yaklaşım B

Teklif operasyonunu görür ancak fiyatlar maskelenir.

B2B açısından çoğu durumda teklifin temel amacı fiyat olduğu için A daha anlamlı olabilir.

Ancak müşteri rol yapısına göre belirlenmelidir.

82. Veri Kapsamı

External kullanıcı yalnızca bağlı olduğu aktif carinin tekliflerini görebilmelidir.

Kontrol:

User
↓
Active Company Membership
↓
CARI_NO
↓
Quote

üzerinden yapılmalıdır.

83. Bayi Kullanıcılarının Ortak Teklif Görünümü

Aynı cari altında birden fazla kullanıcı varsa:

tüm firmanın tekliflerini mi,
yalnızca kendi talep ettiği teklifleri mi

göreceği firma politikasına bağlıdır.

Önerilen varsayılan:

Bayi ticari belgeleri cari seviyesinde ortak görünür.

Ancak permission ile daha dar scope desteklenebilir.

84. Teklif Kabul Yetkisi

Bütün kullanıcıların teklifi kabul edebilmesi gerekmeyebilir.

Örneğin:

Satın Alma Kullanıcısı
→ Görür

Bayi Yöneticisi
→ Kabul eder

gibi yapı desteklenebilir.

85. Teklif Kabul Onayı

Firma içerisindeki B2B approval workflow'u gerekiyorsa:

Teklifi Kabul Et
↓
Firma İç Onay
↓
Teklif Kabulü
↓
Sipariş

akışı kurulabilir.

MVP için zorunlu değildir.

86. Loading

Liste ekranında table skeleton kullanılmalıdır.

Detay ekranında parçalı loading yapılabilir.

Örneğin:

Teklif Genel Bilgileri     ✓
Ürün Satırları             ✓
PDF                         yükleniyor
Revizyon Geçmişi           yükleniyor

PDF üretimi bütün detay ekranını bloke etmemelidir.

87. Partial Failure

Örneğin PDF servisi çalışmıyorsa:

Teklif bilgileri gösterilir.

PDF şu anda oluşturulamıyor.
[Tekrar Dene]

Sipariş dönüşüm servisi geçici hatalıysa diğer ekran fonksiyonları çalışmaya devam etmelidir.

88. Performans

Teklif listesinde her teklif için ayrı:

satır,
revizyon,
sipariş,
PDF

sorgusu çalıştırılmamalıdır.

Liste için özet projection hazırlanmalıdır.

89. Liste Veri Modeli

Liste için yalnızca:

quoteNumber

quoteDate

validUntil

total

currency

status

revisionNumber

gibi gerekli bilgiler yeterlidir.

Ürün satırları detay request'inde getirilmelidir.

90. Pagination

Teklif geçmişi backend tarafında sayfalanmalıdır.

Örneğin:

20
50
100

kayıt seçenekleri olabilir.

Bütün teklifler frontend'e çekilip tarayıcıda filtrelenmemelidir.

91. Cache

Geçmiş, kapanmış teklifler uzun süre değişmeyebilir.

Ancak:

Aktif teklif

Revizyon bekleyen teklif

Kabul bekleyen teklif

daha güncel tutulmalıdır.

92. Responsive Liste

Desktop'ta tablo kullanılabilir.

Mobilde kart yapısı:

TKL-202600425

08 Eylül 2026

44.840,00 TL

● Aktif

Geçerlilik
15 Eylül 2026

[Detay]

şeklinde olabilir.

93. Mobil Teklif Detayı

Mobilde:

Teklif No

Durum

Geçerlilik

Toplam

en üstte görünmelidir.

Ardından:

Ürünler

Ticari Şartlar

Revizyonlar

Belgeler

gelir.

Ana CTA alt sticky alanda kullanılabilir:

[Teklifi Kabul Et]
94. Panelin Boğuk Olmaması

Teklif detayında bütün bilgileri ayrı ayrı büyük kartlara bölmekten kaçınılmalıdır.

Önerilen bilgi hiyerarşisi:

Teklif Durumu + Geçerlilik

↓

Genel Bilgiler

↓

Ürünler

↓

Teklif Özeti

↓

Ödeme / Teslimat Şartları

↓

Revizyon / Belgeler

Bir teklif ekranı ERP formu gibi 30 alanlık form görünümüne dönüşmemelidir.

95. Teklif Detayında Gösterilmemesi Gerekenler

Varsayılan olarak müşteriye gösterilmemelidir:

İç maliyet

Kar oranı

İç iskonto yetki detayları

Satışçı iç notları

Teknik ERP kayıt statüleri

İşlem kodları

Muhasebe kodları

Database alanları
96. Teklif Timeline

Gerçek event datası varsa opsiyonel olarak:

01 Eylül
Teklif oluşturuldu

05 Eylül
Revizyon talep edildi

07 Eylül
Revizyon 1 oluşturuldu

08 Eylül
Müşteri teklifi kabul etti

şeklinde timeline kullanılabilir.

Bu özellik Phase 2 için daha uygundur.

97. Tekliften Sipariş Oluşturulduktan Sonra

Detay ekranının ana aksiyonları değişmelidir.

Örneğin:

Önce:

[Teklifi Kabul Et]

Sonra:

✓ Siparişe Dönüştü

Sipariş SP-202600584

[Siparişi Gör]

Aynı teklif tekrar siparişe dönüştürülmemelidir.

98. Idempotency

Teklifi Kabul Et veya Sipariş Oluştur butonuna kullanıcının çift tıklaması iki sipariş oluşturmamalıdır.

Backend:

Quote
→ max one intended conversion

mantığını korumalıdır.

Teknik yöntem daha sonra API mimarisinde belirlenir.

99. Teklif İptali

Müşteri teklif belgesini doğrudan ERP'den silemez.

Teklif satıcı firma tarafından iptal edilmişse B2B:

İptal Edildi

gösterir.

Müşteri kendi açısından teklifi kullanmak istemiyorsa:

Reddet

aksiyonu kullanır.

İptal ve Red birbirine karıştırılmamalıdır.

100. MVP Teklifler Kapsamı

İlk sürüm için yeterli kapsam:

Teklif Listesi

Teklif Arama

Durum Filtresi

Tarih Filtresi

Teklif No

Teklif Tarihi

Geçerlilik Tarihi

Toplam

Durum

Teklif Detayı

Ürün Satırları

Miktar

Birim

Teklif Fiyatı

Satır Toplamı

Toplam Özet

Ödeme / Teslimat Şartları

PDF Görüntüleme

Eğer Netsim teklif → sipariş dönüşümü netleştirilebilirse:

Tekliften Sipariş Oluştur

MVP'nin güçlü bir parçası olabilir.

101. Phase 2

İkinci fazda:

Revizyon Talebi

Revizyon Geçmişi

Teklifi Kabul Et

Teklifi Reddet

Red Nedeni

Müşteri Cevabı

Sipariş Bağlantısı

Teklif Geçerlilik Bildirimleri

Teklif Timeline

eklenebilir.

102. Future Scope

İleride:

Online teklif müzakeresi

Teklif mesajlaşması

Alternatif ürün önerileri

AI teklif özeti

AI teklif karşılaştırması

Önceki tekliflerle fiyat karşılaştırması

Dijital onay / e-imza

Teklif paylaşımı

Satış temsilcisi canlı iletişimi

gibi özellikler değerlendirilebilir.

103. AI Teklif Özeti

İleride uzun tekliflerde AI:

Teklif Özeti

• 24 ürün bulunuyor.
• Genel toplam 184.500 TL.
• Teklif 15 Eylül'e kadar geçerli.
• Teslimat süresi 7–10 iş günü.
• Ödeme şekli 30 gün vadeli.

gibi özet sunabilir.

Ancak AI hiçbir zaman teklif fiyatının veya şartlarının source of truth'u olmamalıdır.

104. Netsim Açık Soruları

Teklif modülü implementasyonu öncesinde aşağıdaki konular doğrulanmalıdır.

Belge Türü
B2B açısından "Verilen Teklif" hangi işlem koduyla tutuluyor?
İşlem kodu firmalar arasında değişiyor mu?
Teklif ile sipariş aynı ALSAASIL yapısını mı kullanıyor?
Teklif tipi hangi alanlardan kesin olarak ayırt ediliyor?
ALSAASIL
Teklif numarası hangi alan?
Teklif tarihi hangi alan?
Cari bağlantısı hangi alan?
Genel toplam nasıl tutuluyor?
Para birimi hangi alan?
DURUM ne ifade ediyor?
KAYIT_DURUMU ne ifade ediyor?
İptal nasıl belirleniyor?
Geçerlilik tarihi hangi alan?
REVIZYON_NO tam olarak nasıl çalışıyor?
REFERANS_ALISSATIS_NO neyi ifade ediyor?
ALSADETA
Teklif miktarı hangi alan?
Birim fiyat hangi alan?
Net fiyat hangi alan?
İndirim nerede tutuluyor?
Varyant bağlantısı nasıl kuruluyor?
Vergi satır bazında nasıl tutuluyor?
Satır toplamı nasıl belirleniyor?
Revizyon
Yeni revizyon aynı ALISSATIS_NO üzerinde mi tutuluyor?
Yoksa yeni belge mi oluşuyor?
Eski revizyona nasıl referans veriliyor?
Aktif revizyon nasıl belirleniyor?
Teklif → Sipariş
Netsim standart belge dönüşüm süreci var mı?
Yeni sipariş oluşturulurken hangi alanlarla teklif referansı korunuyor?
REFERANS_ALISSATIS_NO bu amaçla mı kullanılıyor?
Satır tarafında REFERANS_ALISSATIS_DETAY_NO kullanılıyor mu?
Teklif fiyatı siparişe aynen aktarılıyor mu?
Teklif siparişe dönüştüğünde nasıl kapanıyor?
Geçerlilik
Teklif son geçerlilik tarihi doğrudan tutuluyor mu?
Gün sayısı mı tutuluyor?
Süresi dolmuş teklif ERP'de ayrıca status değiştiriyor mu?
B2B'nin tarihi kendisinin hesaplaması gerekiyor mu?
PDF
Netsim rapor motorundan teklif çıktısı alınabiliyor mu?
PDF doğrudan dosya olarak üretilebiliyor mu?
Hangi rapor şablonu kullanılmalı?
Revizyonlara özel PDF ayrımı bulunuyor mu?
105. Önerilen Desktop Liste Tasarımı
Tekliflerim                                   [+ Teklif Talebi]

Size sunulan teklifleri görüntüleyin ve yönetin.


[ Teklif ara... ]   [Durum ▼]   [Tarih ▼]   [Geçerlilik ▼]


┌─────────────────────────────────────────────────────────────────────────────┐
│ Teklif No │ Tarih │ Geçerlilik │ Toplam │ Durum │                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ TKL-10458 │ 08.09 │ 15.09.2026 │24.850  │ Aktif             │ Detay →    │
│ TKL-10442 │ 02.09 │ 12.09.2026 │18.400  │ Revizyon Bekliyor │ Detay →    │
│ TKL-10421 │ 24.08 │ 31.08.2026 │ 8.750  │ Siparişe Dönüştü  │ Detay →    │
└─────────────────────────────────────────────────────────────────────────────┘


20 / sayfa                          ‹ 1  2  3 ... 8 ›
106. Önerilen Desktop Detay Tasarımı
← Tekliflerim

Teklif TKL-10458                              ● Aktif

08 Eylül 2026

Geçerlilik: 15 Eylül 2026 · 7 gün kaldı


                          [PDF Görüntüle]
                          [Revizyon Talep Et]
                          [Teklifi Kabul Et]


Teklif Bilgileri

Revizyon            1
Müşteri Referansı   RFQ-8451
Ödeme               30 Gün Vadeli
Teslimat             7–10 İş Günü


Ürünler

┌──────────────────────────────────────────────────────────────────────────────┐
│ Ürün              │ Miktar │ Birim │ Teklif Fiyatı │ İndirim │ Toplam     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Espresso 1 kg     │ 10     │ Adet  │ 125,00 TL     │ %5      │ 1.187,50 TL│
│ STK-001            │        │       │               │         │            │
└──────────────────────────────────────────────────────────────────────────────┘


                                      Teklif Özeti

                                      Ara Toplam        20.000 TL
                                      İndirim           -1.000 TL
                                      KDV                3.420 TL
                                      ───────────────────────────
                                      Genel Toplam      22.420 TL


Teklif Notu

Fiyatlarımız 15 Eylül 2026 tarihine kadar geçerlidir.


Revizyon Geçmişi

Revizyon 1      08.09.2026      Aktif
İlk Teklif      05.09.2026
107. Teklif Modülünün Bilgi Önceliği

Kullanıcının detay ekranında ideal bakış sırası:

1. Teklif hâlâ geçerli mi?

2. Toplam tutar nedir?

3. Hangi ürünler ve miktarlar teklif edildi?

4. Birim fiyatlar nedir?

5. Ödeme ve teslimat şartları nedir?

6. Teklif revize edilmiş mi?

7. Kabul / revizyon / red için ne yapabilirim?

Bu sıralama ERP alan sırasına göre belirlenmemelidir.

108. Teklifler Modülünün Ana UX Sorusu

Bu ekran tasarlanırken ana soru:

Kullanıcı teklifi açtığında “Bu teklif benim için uygun mu ve şimdi ne yapabilirim?” sorusunun cevabını birkaç saniye içinde alabiliyor mu?

Teklif ekranı kullanıcıyı:

belgeyi bul
→ şartları anla
→ karar ver

akışında desteklemelidir.

109. En Kritik İş Kuralları

Teklif modülünde özellikle aşağıdaki kurallar korunmalıdır:

Teklif fiyatı tarihsel belge fiyatıdır.
Güncel katalog fiyatı teklif fiyatının üzerine yazılmaz.
Süresi dolmuş teklif varsayılan olarak kabul edilemez.
Eski revizyon üzerinden işlem yapılamaz.
Teklif kabulü duplicate sipariş oluşturmamalıdır.
Teklif reddi ile ERP teklif iptali aynı şey değildir.
Revizyon talebi mevcut teklif kaydını doğrudan değiştirmemelidir.
Teklif → Sipariş referans ilişkisi korunmalıdır.
Müşteri yalnızca kendi carisine ait teklifleri görebilmelidir.
ERP teknik durumları doğrudan kullanıcıya gösterilmemelidir.
110. Kısa Fonksiyon Tanımı

Tekliflerim; kullanıcının aktif carisine verilmiş ticari teklifleri görüntülediği, tarihsel teklif fiyatlarını ve ödeme/teslimat şartlarını incelediği, teklif geçerliliği ve revizyonlarını takip ettiği ve yetkisine göre revizyon, kabul, red veya sipariş dönüşümü işlemlerini gerçekleştirdiği B2B ticari karar modülüdür.

Bu ekran için en önemli ürün cümlesi de şu olabilir:

Teklif ekranı “bana ne fiyat verildi?” sorusunun yanında “bu teklifle şimdi ne yapabilirim?” sorusunu da cevaplamalıdır.