UX Principles

Bu dosya Netsim B2B uygulamasında uygulanacak temel kullanıcı deneyimi prensiplerini tanımlar.

Amaç, Netsim ERP tarafındaki kapsamlı ve teknik yapıyı son kullanıcıya olduğu gibi taşımak değil; kullanıcının günlük ticari işlemlerini kolay, anlaşılır, hızlı ve güvenli şekilde gerçekleştirebileceği bir B2B deneyimine dönüştürmektir.

Temel yaklaşım:

Kullanıcı ERP kullanmayı öğrenmek zorunda kalmamalı; sistem kullanıcının yaptığı işi anlamalı ve ERP karmaşıklığını arka planda yönetmelidir.

Netsim B2B güçlü ve fonksiyonel olmalıdır ancak fonksiyon zenginliği arayüz karmaşıklığına dönüşmemelidir.

1. ERP Karmaşıklığını Gizle

Netsim tarafında bir işlem için çok sayıda:

tablo,
alan,
parametre,
belge tipi,
cari bilgisi,
stok bilgisi,
depo bilgisi,
işlem noktası,
fiyatlandırma kuralı

bulunabilir.

B2B kullanıcısına bunların tamamı gösterilmemelidir.

Kullanıcı yalnızca yaptığı işlem için gerekli bilgileri görmelidir.

Örneğin bir sipariş oluşturulurken ERP tarafında onlarca alan kullanılabilir.

Kullanıcı açısından ise süreç şu kadar basit olabilir:

Ürünü seç
↓
Miktarı belirle
↓
Teslimat bilgilerini kontrol et
↓
Siparişi onayla

Teknik bilgiler sistem tarafından arka planda doldurulmalıdır.

Temel prensip:

Backend karmaşıklığı frontend karmaşıklığına dönüşmemelidir.

2. Progressive Disclosure

Kullanıcıya bütün bilgiler aynı anda gösterilmemelidir.

Önce en önemli bilgiler gösterilir.

Daha detaylı bilgi isteyen kullanıcı ilgili alanı açabilir.

Örneğin ürün detayında ilk görünüm:

Ürün Adı
Fiyat
Stok Durumu
Miktar
Sepete Ekle

Daha sonra:

Teknik Özellikler
Varyantlar
Stok Yerleri
Teslimat Detayı
Geçmiş Siparişler

gibi bilgiler ayrı bölümlerde gösterilebilir.

Bu yöntem özellikle ERP verilerinin B2B tarafında sadeleştirilmesi açısından önemlidir.

3. Kullanıcı Odaklı Terminoloji

ERP ve veritabanı terminolojisi doğrudan kullanıcıya gösterilmemelidir.

Örneğin:

ALISSATIS_NO

yerine:

Sipariş No
CARI_NO

yerine:

Firma

veya bağlama göre:

Müşteri

kullanılmalıdır.

Benzer şekilde kullanıcıya:

Stok Kartı

yerine bazı ekranlarda sadece:

Ürün

demek daha doğru olabilir.

Teknik terminoloji yalnızca gerçekten gerekli olduğu durumlarda kullanılmalıdır.

4. Kullanıcının İş Dilini Kullan

Terminoloji yalnızca teknik olmamakla kalmamalı, kullanıcının ticari süreçlerde kullandığı dile de uygun olmalıdır.

Örneğin:

Cari Hareketler

bazı kullanıcılar için anlamlı olabilir.

Ancak B2B müşterisi açısından:

Hesap Hareketleri

daha anlaşılır olabilir.

Benzer şekilde:

Alınan Sipariş

ERP tarafında doğru bir kavram olabilirken B2B kullanıcısı için:

Siparişlerim

daha doğaldır.

UI dili sistemin değil kullanıcının bakış açısından oluşturulmalıdır.

5. Kullanıcının Ana Hedefini Önceliklendir

Her ekranın birincil amacı açık olmalıdır.

Kullanıcı ekranı açtığında birkaç saniye içerisinde:

"Burada ne yapabilirim?"

sorusunun cevabını alabilmelidir.

Örneğin:

Ürünler
→ Ürün bulmak ve sepete eklemek

Sepet
→ Siparişi hazırlamak

Siparişler
→ Sipariş durumunu takip etmek

Teklifler
→ Teklifleri incelemek veya oluşturmak

Cari Hesap
→ Finansal durumu görmek

İrsaliyeler
→ Sevkiyatları takip etmek

Bir ekran aynı anda çok fazla ana göreve sahip olmamalıdır.

6. Minimum Click

Sık kullanılan işlemler mümkün olduğunca az adımda tamamlanmalıdır.

Özellikle:

sepete ürün ekleme,
miktar değiştirme,
favoriye ekleme,
siparişi tekrar etme,
sipariş detayına ulaşma,
irsaliye görüntüleme,
teklif görüntüleme,
ödeme durumunu kontrol etme

işlemleri kısa tutulmalıdır.

Örneğin:

Siparişlerim
→ Siparişi Tekrarla
→ Sepet

şeklindeki bir işlem tercih edilmelidir.

Kullanıcının eski sipariş içerisindeki bütün ürünleri tek tek tekrar bulması istenmemelidir.

7. Sık Yapılan İşlemleri Hızlandır

Minimum click prensibinin yanında sistem, tekrar eden B2B davranışlarını desteklemelidir.

Örneğin:

Son Siparişi Tekrarla

Favorilerden Sepete Ekle

Sık Alınan Ürünler

Son Kullanılan Teslimat Adresi

Son Kullanılan Sipariş Miktarı

Son Siparişler

gibi kolaylaştırıcı özellikler kullanılabilir.

B2B müşterisinin davranışı çoğu zaman tekrar eden siparişlerden oluşur.

Bu nedenle sistem yalnızca ürün keşfetmeye değil tekrar satın almaya da optimize edilmelidir.

8. Kullanıcı Hafızasına Güvenme

Kullanıcı sistem içerisindeki:

stok kodlarını,
sipariş numaralarını,
kategori yapılarını,
fiyat kurallarını,
önceki seçimlerini

hatırlamak zorunda bırakılmamalıdır.

Örneğin arama:

Stok kodu
Ürün adı
Kategori

ile çalışabilmelidir.

Kullanıcıya mümkün olduğunca seçim yaptırılmalı, ezber yaptırılmamalıdır.

Temel UX prensibi:

Recognition over recall.

9. Güçlü Arama

Ürün sayısı arttıkça navigation tek başına yeterli olmayacaktır.

Arama temel kullanım yollarından biri olmalıdır.

Kullanıcı şu bilgilerle ürün bulabilmelidir:

Ürün adı
Ürün kodu
Kategori
Marka

Gerekirse daha sonra:

Varyant
Ürün açıklaması

da dahil edilebilir.

Arama sonucu kullanıcıyı mümkün olduğunca hızlı doğru ürüne götürmelidir.

10. Filtreleri Kontrollü Kullan

B2B sistemlerinde filtreler önemlidir ancak ekranın kendisi kadar karmaşık hale gelmemelidir.

İlk seviyede en sık kullanılan filtreler gösterilmelidir.

Örneğin:

Durum
Tarih
Kategori

Daha az kullanılan filtreler:

Daha Fazla Filtre

altında toplanabilir.

10 farklı select'in yan yana gösterildiği klasik ERP filtre ekranlarından kaçınılmalıdır.

11. Bilgi Önceliği

Her ekranda bilgiler kullanıcı açısından önem sırasına göre sunulmalıdır.

Örneğin ürün ekranında:

1. Ürün adı
2. Fiyat
3. Stok durumu
4. Teslimat bilgisi
5. Miktar
6. Sipariş aksiyonu
7. Teknik detaylar

Sipariş ekranında:

1. Sipariş No
2. Durum
3. Tarih
4. Tutar
5. Sevkiyat
6. Sipariş içeriği
7. Teknik detaylar

Bu sıralama ERP tablosundaki kolon sırasına göre belirlenmemelidir.

12. Görsel Hiyerarşi

Kullanıcı önemli bilgiyi tarayarak görebilmelidir.

Aynı ekran içerisinde bütün bilgiler:

aynı boyutta,
aynı renkte,
aynı font weight ile

gösterilmemelidir.

Bilgi üç temel seviyeye ayrılmalıdır:

Primary
Secondary
Tertiary

Örneğin:

125.430,50 TL        → Primary
Cari Bakiye          → Secondary
Son güncelleme bugün → Tertiary
13. Finansal Şeffaflık

Finansal bilgiler B2B ilişkisinin kritik parçalarındandır.

Kullanıcı kolayca:

cari bakiye,
vadesi geçen tutar,
yaklaşan ödeme,
ödeme durumu,
varsa kredi limiti,
kullanılabilir limit

bilgilerini anlayabilmelidir.

Finansal bilgiler belirsiz ifadelerle sunulmamalıdır.

Örneğin:

Bakiye: 125.430,50 TL

tek başına yeterli olmayabilir.

Gerekirse:

Borç Bakiyesi
125.430,50 TL

gibi anlam açıkça belirtilmelidir.

14. Fiyat Şeffaflığı

Kullanıcı sipariş vermeden önce mümkün olduğunca net şekilde:

Birim fiyat
Miktar
İskonto
Vergi
Ara toplam
Genel toplam

bilgilerini görebilmelidir.

Sistem son adımda beklenmeyen fiyat değişiklikleri yaratmamalıdır.

Fiyat değişmişse kullanıcıya bunun nedeni anlaşılır şekilde açıklanmalıdır.

15. Stok Bilgisini Anlaşılır Göster

ERP tarafındaki stok kavramları kullanıcıya doğrudan aktarılmamalıdır.

Örneğin backend tarafında:

Fiziki stok
Rezerv
Bloke
Depo
Stok yeri
Satılabilir miktar

bulunabilir.

B2B müşterisinin asıl ihtiyacı çoğu durumda:

Stokta

Son 4 ürün

Sipariş üzerine

Stokta yok

gibi sonuçları bilmektir.

Gerekirse detay isteyen kullanıcı için daha fazla bilgi gösterilebilir.

16. Teslimat Beklentisini Netleştir

B2B satın alma sürecinde fiyat kadar teslimat bilgisi de önemlidir.

Mümkünse ürün veya sipariş seviyesinde:

Stokta
1–2 iş günü

Sipariş üzerine
Tahmini 7 iş günü

gibi anlaşılır bilgiler kullanılmalıdır.

Kullanıcı sipariş verdikten sonra ne olacağı konusunda belirsizlik yaşamamalıdır.

17. Sistem Durumu Görünürlüğü

Kullanıcı yaptığı işlemin hangi aşamada olduğunu sürekli anlayabilmelidir.

Örneğin:

Sipariş Alındı
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

Bu durum bilgileri yalnızca renk ile anlatılmamalıdır.

Metin ile de açıkça belirtilmelidir.

18. İşlem Sonucu Anında Bildirilmelidir

Kullanıcı bir işlem yaptıktan sonra sistem tepki vermelidir.

Örneğin:

Ürün sepete eklendi.
Sipariş başarıyla oluşturuldu.
Favorilere eklendi.
Sipariş iptal edilemedi.

Kullanıcı butona bastıktan sonra işlemin gerçekleşip gerçekleşmediğini tahmin etmek zorunda kalmamalıdır.

19. Optimistic UX Kontrollü Kullanılmalı

Basit ve geri alınabilir işlemler anlık gerçekleşmiş gibi gösterilebilir.

Örneğin:

Favoriye ekleme
Sepet miktarı değiştirme

Ancak:

Sipariş oluşturma
Ödeme
Sipariş iptali

gibi kritik işlemlerde backend sonucu alınmadan işlem tamamlanmış gibi gösterilmemelidir.

20. Hata Yönetimi

Backend veya ERP hata mesajları kullanıcıya doğrudan gösterilmemelidir.

Örneğin:

Foreign key violation

veya:

Dynamic SQL Error
SQL error code = -803

kullanıcıya gösterilmemelidir.

Bunun yerine:

Sipariş oluşturulamadı.

Bilgilerinizi kontrol ederek tekrar deneyin.

gibi kullanıcı odaklı mesajlar kullanılmalıdır.

Teknik hata gerekli ise log sistemine gönderilmelidir.

21. Hata Mesajı Eyleme Dönük Olmalı

Sadece:

Bir hata oluştu.

demek yeterli değildir.

Mümkün olduğunca çözüm gösterilmelidir.

Örneğin:

Bu üründen yalnızca 4 adet sipariş verebilirsiniz.

Sepet miktarını 4 veya daha düşük bir değer olarak güncelleyin.

Bu yapı kullanıcıya problemi nasıl çözeceğini anlatır.

22. Form Hataları Yerinde Gösterilmeli

Form gönderildikten sonra yalnızca sayfanın üstünde genel bir hata gösterilmemelidir.

Problemli alan doğrudan işaretlenmelidir.

Örneğin:

Teslimat Tarihi

[            ]

Lütfen teslimat tarihi seçin.

Kullanıcı hatanın nerede olduğunu aramak zorunda kalmamalıdır.

23. Kullanıcının Girdiği Veri Kaybolmamalı

Form içerisinde hata oluşursa kullanıcı daha önce yazdığı bilgileri tekrar girmek zorunda bırakılmamalıdır.

Örneğin sipariş adresinde hata varsa:

ürünler
miktarlar
notlar
adres

silinmemelidir.

Bu prensip özellikle uzun sipariş ve teklif süreçlerinde önemlidir.

24. Empty States

Veri olmayan ekranlarda boş tablo gösterilmemelidir.

Örneğin:

Henüz favori ürününüz yok.

Sık sipariş verdiğiniz ürünleri favorilerinize ekleyerek
daha hızlı ulaşabilirsiniz.

[ Ürünleri Keşfet ]

Empty state şu yapıya sahip olmalıdır:

Durumu açıkla
↓
Ne yapılabileceğini anlat
↓
Gerekirse CTA sun
25. Loading

Loading sırasında mümkün olduğunca skeleton kullanılmalıdır.

Özellikle:

Ürün kartları
Tablolar
Özet bilgiler
Kartlar

için skeleton tercih edilir.

Skeleton sayesinde ekranın yapısı yükleme sırasında korunur.

Spinner daha çok küçük ve lokal işlemlerde kullanılmalıdır.

Örneğin:

[ Sipariş Oluşturuluyor... ]
26. Kullanıcıyı Gereksiz Bekletme

Bir işlem uzun sürüyorsa kullanıcıya sistemin çalıştığı anlatılmalıdır.

Örneğin:

Siparişiniz oluşturuluyor...

gibi bir durum gösterilebilir.

Uzun işlemlerde buton tekrar tıklanamaz hale getirilmelidir.

Bu sayede duplicate sipariş gibi sorunlar engellenir.

27. Confirmation

Her işlem için confirmation gösterilmemelidir.

Örneğin:

Favoriye ekle
Sepete ekle
Filtre uygula

işlemleri confirmation gerektirmez.

Confirmation yalnızca önemli sonuç doğuran işlemlerde kullanılmalıdır.

Örneğin:

Siparişi iptal et
Sepeti tamamen temizle
Adresi sil
Ödeme işlemini başlat
28. Confirmation Metni Açık Olmalı

Confirmation:

Emin misiniz?

şeklinde tek başına kullanılmamalıdır.

Bunun yerine:

Siparişi iptal etmek istiyor musunuz?

SP2025001234 numaralı sipariş iptal edilecektir.
Bu işlem geri alınamayabilir.

[Vazgeç] [Siparişi İptal Et]

gibi bağlam verilmelidir.

29. Geri Alınabilir İşlemlerde Undo Tercih Et

Mümkün olan durumlarda confirmation yerine undo kullanılabilir.

Örneğin:

Ürün favorilerden kaldırıldı.

[Geri Al]

Bu yöntem akışı gereksiz confirmation ekranlarıyla yavaşlatmaz.

30. Kullanıcı Kontrolü

Kullanıcı sistem içerisinde sıkışmış hissetmemelidir.

Her workflow içerisinde mümkün olduğunca:

Geri
Vazgeç
Kapat
Düzenle

gibi seçenekler bulunmalıdır.

Ancak bu aksiyonlar primary action ile rekabet etmemelidir.

31. İşlem Öncesi Sonuçları Göster

Özellikle sipariş oluşturma sürecinde kullanıcı son işlemden önce özet görebilmelidir.

Örneğin:

Ürünler
Toplam miktar
Teslimat adresi
Ödeme şekli
Ara toplam
Vergiler
Genel toplam

gösterildikten sonra:

Siparişi Onayla

aksiyonu sunulmalıdır.

32. Büyük İşlemleri Adımlara Böl

Çok uzun formlar tek sayfada sunulmamalıdır.

Gerekirse işlem:

1. Ürünler
2. Teslimat
3. Ödeme
4. Kontrol

gibi adımlara bölünebilir.

Ancak gereksiz wizard kullanımından kaçınılmalıdır.

İki inputtan oluşan işlem dört adıma bölünmemelidir.

33. Kullanıcının Nerede Olduğunu Göster

Navigation içerisinde aktif sayfa açıkça belirtilmelidir.

Derin yapılar için breadcrumb kullanılabilir.

Örneğin:

Ürünler / Endüstriyel Ürünler / Ürün Detayı

Kullanıcı navigasyon yapısını tahmin etmek zorunda kalmamalıdır.

34. Tutarlılık

Aynı işlem uygulamanın her yerinde benzer davranmalıdır.

Örneğin:

Detay

aksiyonu bir yerde modal, başka yerde tamamen farklı bir pattern olmamalıdır; özel bir gerekçe yoksa ortak yaklaşım kullanılmalıdır.

Aynı şekilde:

Tamamlandı

durumu her ekranda aynı renk ve badge sistemini kullanmalıdır.

35. Tekrarlanan Patternler

Aşağıdaki patternler standartlaştırılmalıdır:

Listeleme
Detay
Arama
Filtreleme
Pagination
Status
Confirmation
Empty State
Loading
Error
Success
Form

Kullanıcı bir patterni öğrendiğinde uygulamanın başka bölümlerinde yeniden öğrenmek zorunda kalmamalıdır.

36. Kullanıcı Tercihlerini Hatırla

Mümkün olduğu durumlarda kullanıcının sık kullanılan tercihleri korunabilir.

Örneğin:

Tablo sayfa boyutu
Son kullanılan filtre
Tercih edilen firma
Son kullanılan teslimat adresi
Liste/Grid görünümü

Ancak otomatik seçimler kullanıcı açısından sürpriz yaratmamalıdır.

37. Varsayılanlar Akıllı Olmalı

Formlarda mümkün olduğunca güvenli ve mantıklı default değerler kullanılmalıdır.

Örneğin kullanıcı sürekli aynı firmayla çalışıyorsa o firma başlangıçta seçilebilir.

Ancak kritik alanlarda kullanıcı adına varsayım yapılmamalıdır.

Özellikle:

Ödeme
Teslimat
Sipariş onayı

gibi alanlar açık olmalıdır.

38. Riskli İşlemler Gizlenmemeli Ama Ön Planda da Olmamalı

Örneğin:

Siparişi İptal Et

kullanılabilir olmalıdır ancak ana CTA gibi gösterilmemelidir.

Genellikle:

⋮ Diğer İşlemler

altında bulunabilir.

Bu yaklaşım yanlışlıkla yapılan işlemleri azaltır.

39. Bildirim Yorgunluğundan Kaçın

Her küçük işlem için modal veya büyük alert gösterilmemelidir.

Örneğin:

Sepete eklendi

için küçük toast yeterlidir.

Ancak:

Sipariş oluşturulamadı

daha görünür feedback gerektirir.

Feedback'in büyüklüğü işlemin önemine uygun olmalıdır.

40. Responsive UX

Responsive tasarım yalnızca componentleri küçültmek anlamına gelmemelidir.

Mobil cihazlarda kullanıcıların gerçekleştirmesi beklenen temel işlemler korunmalıdır.

Örneğin:

Ürün ara
Ürün görüntüle
Sepete ekle
Sepet görüntüle
Sipariş görüntüle
Sipariş durumu takip et
Cari bakiye görüntüle

mobilde rahat kullanılabilmelidir.

41. Mobilde Önceliklendirme

Desktop ekranındaki her bilgi mobile taşınmak zorunda değildir.

Mobilde:

Primary information
Primary action

korunmalı,

ikincil bilgiler detay ekranlarına taşınmalıdır.

Örneğin desktop sipariş tablosu:

Sipariş No
Tarih
Firma
Tutar
Durum
Teslimat
İşlemler

içerirken mobile:

Sipariş No
Tarih
Tutar
Durum

kart olarak gösterilebilir.

42. Touch Hedefleri

Mobil ve tablet üzerinde clickable alanlar yeterince büyük olmalıdır.

Minimum hedef:

44 × 44 px

civarında olmalıdır.

Özellikle:

Icon button
Checkbox
Quantity control
Pagination
Menu

alanlarında önemlidir.

43. Accessibility

Uygulama mümkün olduğunca erişilebilir tasarlanmalıdır.

Minimum standartlar:

yeterli renk kontrastı,
keyboard navigation,
görünür focus state,
doğru form label kullanımı,
icon-only button için açıklama,
semantic HTML,
yalnızca renkle bilgi vermeme.
44. Renk Tek Başına Anlam Taşımamalı

Örneğin sipariş durumu yalnızca:

●

şeklinde yeşil nokta ile gösterilmemelidir.

Bunun yerine:

● Sevk Edildi

kullanılmalıdır.

Bu yaklaşım hem erişilebilirliği hem anlaşılabilirliği artırır.

45. Klavye Kullanımı

Özellikle masaüstü B2B kullanıcıları için klavye desteği önemlidir.

Kullanıcı:

Tab
Shift + Tab
Enter
Escape

ile temel form ve modal işlemlerini gerçekleştirebilmelidir.

Gelişmiş aşamada global search için:

Ctrl + K

gibi shortcut düşünülebilir.

46. Focus Yönetimi

Modal açıldığında focus modal içine taşınmalıdır.

Modal kapatıldığında focus açan elemana dönmelidir.

Form error olduğunda kullanıcı ilgili input'a yönlendirilebilir.

Focus border hiçbir zaman tamamen kaldırılmamalıdır.

47. Performans Algısı

Gerçek performans kadar algılanan performans da önemlidir.

Uygulama mümkün olduğunca:

hızlı response,
skeleton,
lokal loading,
incremental rendering

kullanmalıdır.

Bir component yüklenirken bütün sayfanın bloke edilmesinden kaçınılmalıdır.

48. Context Kaybını Önle

Kullanıcı listeden detaya girdikten sonra geri döndüğünde mümkünse:

scroll position
filter
search
pagination

korunmalıdır.

Örneğin kullanıcı 6. sayfadaki sipariş detayına girdiğinde geri döndüğünde tekrar 1. sayfaya gönderilmemelidir.

49. Data Yoğun Ekranlarda Kullanıcıyı Yorma

ERP/B2B ekranlarında veri miktarı yüksek olabilir.

Bu durumda:

Grouping
Tabs
Filters
Collapsible Sections
Pagination
Summary

kullanılabilir.

Amaç bilgiyi kaldırmak değil, doğru zamanda göstermektir.

50. Kullanıcıya Kontrol Edilebilir Bilgi Yoğunluğu Sun

Bazı profesyonel kullanıcılar daha fazla veri görmek isteyebilir.

Bu nedenle ileride:

Kolon seçimi
Compact table
Sayfa boyutu

gibi kontroller eklenebilir.

Ancak default görünüm mümkün olduğunca sade kalmalıdır.

51. B2B Tekrar Sipariş Deneyimi

B2B sisteminin önemli UX özelliklerinden biri tekrar sipariş kolaylığı olmalıdır.

Geçmiş sipariş içerisinde:

Siparişi Tekrarla

aksiyonu bulunabilir.

Sistem mevcut:

fiyatları,
stok durumunu,
artık satışta olmayan ürünleri

yeniden kontrol ederek kullanıcıyı bilgilendirmelidir.

Eski sipariş doğrudan kör şekilde tekrar oluşturulmamalıdır.

52. Sipariş Güvenliği

Sipariş oluşturma süreci duplicate işlem riskine karşı korunmalıdır.

Kullanıcı:

Siparişi Oluştur

butonuna bastığında buton loading durumuna geçmeli ve ikinci kez tetiklenmemelidir.

Sipariş başarıyla oluştuğunda:

Siparişiniz oluşturuldu.

Sipariş No: SP2026001234

[Sipariş Detayını Gör]

gibi net sonuç gösterilmelidir.

53. Sepet Davranışı

Sepet kullanıcı tarafından güvenilir bir geçici çalışma alanı olarak görülmelidir.

Sayfa değiştirildiğinde sepet kaybolmamalıdır.

Sepette:

ürün,
miktar,
birim fiyat,
satır toplamı

kolayca görülmelidir.

Miktar değiştirilirse toplamlar anında güncellenmelidir.

54. Firma Değiştirme UX'i

Bir kullanıcı birden fazla firma ile ilişkiliyse aktif firma her zaman anlaşılır olmalıdır.

Firma değiştirildiğinde sistem kullanıcıya bunun etkisini göstermelidir.

Örneğin:

Firma değiştirildiğinde mevcut sepetiniz temizlenecektir.

Devam etmek istiyor musunuz?

gibi bir durum varsa açıkça belirtilmelidir.

Firma değişikliğinin:

fiyat,
cari,
sipariş,
teslimat,
sepet

bağlamını değiştirebileceği unutulmamalıdır.

55. Veri Güncelliği

Stok, fiyat, bakiye gibi değişken bilgilerde gerektiğinde veri güncelliği kullanıcıya belirtilebilir.

Örneğin:

Son güncelleme: 14:32

Ancak bu bilgi gerekli olmadığı sürece arayüzü kalabalıklaştırmamalıdır.

56. Güven Unsuru

B2B uygulaması ticari işlemler içerdiği için kullanıcı sisteme güvenebilmelidir.

Bu güven şu UX davranışlarıyla desteklenmelidir:

işlem sonucunun açık gösterilmesi,
toplamların şeffaf olması,
durum bilgilerinin güncel olması,
kritik işlemlerin doğrulanması,
hata mesajlarının anlaşılır olması,
kullanıcının yaptığı işlemin kaybolmaması.
57. Yardım Bağlam İçerisinde Sunulmalı

Kullanıcı yardım almak için uygulamadan çıkmak zorunda kalmamalıdır.

Karmaşık alanlarda:

?

tooltip veya kısa açıklama kullanılabilir.

Daha geniş yardım için:

Destek

alanına yönlendirilebilir.

Ancak her alanın yanına soru işareti koymak yerine yalnızca gerçekten açıklama gerektiren kavramlarda kullanılmalıdır.

58. Kullanıcıyı Eğitmek Yerine Arayüzü Açık Hale Getir

Bir işlemi gerçekleştirmek için uzun kullanım dokümanı okunması gerekiyorsa UX yeniden değerlendirilmelidir.

Öncelik:

Clear Label
Good Default
Logical Flow
Contextual Help

olmalıdır.

Dokümantasyon gerektiğinde destekleyici rol oynamalıdır.

59. Kullanıcı Hatasını Önle

En iyi hata mesajı hiç gösterilmek zorunda kalmayan hata mesajıdır.

Sistem hatayı mümkün olduğunca oluşmadan engellemelidir.

Örneğin stokta yalnızca 5 ürün varsa quantity input:

999

girilmesine izin vermek yerine kullanıcı önceden bilgilendirilebilir.

60. Kullanıcıyı Gereksiz Bilgiyle Uyarma

Her teknik kısıt kullanıcıya önceden gösterilmemelidir.

Sadece kullanıcı kararını etkileyen bilgiler gösterilmelidir.

Örneğin:

Bu ürün şu anda stokta yok.

önemlidir.

Ancak ERP'nin hangi stok yeri algoritmasıyla bu sonuca ulaştığını kullanıcı bilmek zorunda değildir.

61. UX Karar Önceliği

Bir ekran veya özellik tasarlanırken karar sırası şu şekilde olmalıdır:

1. Kullanıcı burada ne yapmak istiyor?

2. Bunu yapmak için hangi bilgi gerçekten gerekli?

3. En kısa güvenli akış nedir?

4. Kullanıcı hangi noktada hata yapabilir?

5. Sistem hangi bilgiyi otomatik yönetebilir?

6. İkincil bilgiler nasıl gizlenebilir?

7. İşlem sonucu kullanıcıya nasıl bildirilecek?

UI tasarımı ancak bu sorular cevaplandıktan sonra yapılmalıdır.

62. Karmaşıklık Bütçesi

Her yeni özellik ekranda yeni bir:

button
filter
tab
card
column
modal

oluşturmak zorunda değildir.

Yeni UI elementi eklenmeden önce şu soru sorulmalıdır:

Kullanıcı bu elementi gerçekten görmek zorunda mı?

Mevcut bir pattern içerisinde çözülebiliyorsa yeni bir pattern oluşturulmamalıdır.

63. Fonksiyonellik ve Sadelik Dengesi

Netsim B2B'nin hedefi mümkün olduğunca az özellik göstermek değildir.

Hedef:

Gerekli fonksiyonları kullanıcının ihtiyaç duyduğu anda ulaşılabilir hale getirmektir.

Bu nedenle sistem:

Basit

olmalı ancak:

Yetersiz

olmamalıdır.

Aynı şekilde:

Fonksiyonel

olmalı ancak:

Karmaşık

olmamalıdır.

Bu iki taraf arasındaki denge ürünün temel UX karakteridir.

64. Temel UX İlkelerinin Özeti

Netsim B2B için ana kullanıcı deneyimi yaklaşımı şu şekilde özetlenebilir:

ERP'nin karmaşıklığını kullanıcıdan gizle, kullanıcının ticari hedefini öne çıkar, sık yapılan işlemleri hızlandır, kritik bilgileri görünür kıl ve her işlemde kullanıcıya sistemin ne yaptığını açıkça göster.

Daha kısa ürün prensibi ise:

Kolay öğrenilir, hızlı kullanılır, gerektiğinde güçlüdür.