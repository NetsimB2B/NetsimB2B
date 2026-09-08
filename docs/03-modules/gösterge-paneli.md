Dashboard

Bu dosya Netsim B2B Dashboard ekranının fonksiyonel tasarımını tanımlar.

Dashboard, kullanıcının sisteme giriş yaptıktan sonra karşılaştığı ana çalışma alanıdır.

Amaç kullanıcının bütün ERP verilerini tek ekranda görmesi değil; günlük işlerini yönetebilmesi için gerekli olan en önemli bilgileri ve en sık kullandığı işlemleri tek bakışta görebilmesidir.

Dashboard şu sorulara hızlı cevap vermelidir:

Finansal durumum nasıl?
Dikkat etmem gereken ödeme var mı?
Kaç aktif siparişim var?
Siparişlerim hangi aşamada?
Sevk edilmesini beklediğim ürünler var mı?
Sepetimde ürün var mı?
Yeni siparişe nasıl hızlı başlayabilirim?
Son işlemlerime nasıl ulaşabilirim?

Temel ürün prensibi:

Dashboard bilgiyle doldurulan bir rapor ekranı değil, kullanıcının günlük B2B işlemlerini hızlandıran sade bir kontrol merkezidir.

1. Genel Dashboard Yapısı

Dashboard aşağıdaki temel alanlardan oluşur:

Dashboard
│
├── Karşılama Alanı
│
├── Hızlı Erişim
│
├── Ana KPI'lar
│
├── Sipariş Alanı
│   ├── Son Siparişler
│   └── Sipariş Durum Özeti
│
├── Operasyon Alanı
│   ├── Yaklaşan Teslimatlar
│   └── Sepet Özeti
│
└── Opsiyonel Alanlar
    ├── Yaklaşan Ödemeler
    ├── Duyurular
    └── Sipariş Trendi

Bütün alanların aynı anda gösterilmesi zorunlu değildir.

Dashboard bilinçli şekilde orta yoğunlukta tutulmalıdır.

2. Dashboard Tasarım Prensibi

Referans tasarımdaki genel yaklaşım korunmalıdır:

Açık arka plan
+
Beyaz yüzeyler
+
Az sayıda güçlü kart
+
Turuncu aksiyonlar
+
Net bilgi hiyerarşisi

Ekran:

gereksiz grafiklerle,
çok sayıda KPI ile,
uzun tablolarla,
onlarca hızlı erişim butonuyla

doldurulmamalıdır.

Temel kural:

Kullanıcı Dashboard'u açtığında ekranı okumak zorunda kalmamalı, tarayarak anlayabilmelidir.

3. Karşılama Alanı

Dashboard'un üst bölümünde sade bir karşılama alanı bulunur.

Örneğin:

Hoş geldiniz, Umut 👋

Bugün işlemlerinizi hızlıca yönetin.

Bu alan çok yüksek olmamalıdır.

Amaç dekoratif büyük bir hero alanı oluşturmak değil, kullanıcıya:

Kim olarak giriş yaptım?
Hangi firma adına çalışıyorum?

bağlamını hissettirmektir.

Aktif firma bilgisi zaten Topbar içerisinde bulunuyorsa burada tekrar büyük şekilde gösterilmemelidir.

4. Ana Aksiyon

Dashboard üzerinde kullanıcı için en temel ticari aksiyon görünür olmalıdır.

Varsayılan:

+ Yeni Sipariş Oluştur

Bu buton kullanıcıyı ürün kataloğuna veya sipariş başlangıç sürecine götürür.

Sipariş oluşturma yetkisi olmayan kullanıcılarda bu aksiyon gösterilmez.

Ana CTA'nın yanında çok sayıda farklı primary button kullanılmamalıdır.

5. Hızlı Erişim Alanı

Dashboard'un en önemli alanlarından biri Hızlı Erişim bölümüdür.

Amaç kullanıcının sürekli kullandığı işlemlere menüler arasında dolaşmadan ulaşmasını sağlamaktır.

Örnek hızlı erişimler:

Ürünler

Hızlı Sipariş

Favorilerim

Sepetim

Siparişlerim

Tekliflerim

İrsaliyelerim

Faturalarım

Cari Hesap

Cari Ekstre

Ödemeler

Kampanyalar

Ancak bunların tamamı aynı anda Dashboard'da gösterilmemelidir.

6. Kullanıcı Tarafından Düzenlenebilir Hızlı Erişim

Hızlı Erişim alanı kullanıcı tarafından özelleştirilebilir olmalıdır.

Alan başlığında örneğin:

Hızlı Erişim                      Düzenle

veya:

Hızlı Erişim                      ⚙

aksiyonu bulunabilir.

Düzenle seçildiğinde bir pop-up / modal açılır.

7. Hızlı Erişim Düzenleme Pop-up'ı

Pop-up kullanıcıya kullanılabilir hızlı erişim seçeneklerini gösterir.

Örnek:

Hızlı Erişimi Düzenle

Dashboard'da görmek istediğiniz işlemleri seçin.

☑ Ürünler
☑ Hızlı Sipariş
☑ Siparişlerim
☑ Sepetim
☐ Favorilerim
☐ Tekliflerim
☐ İrsaliyelerim
☐ Faturalarım
☐ Cari Ekstre
☐ Ödemeler

                     [Vazgeç] [Kaydet]

Widget seçimine benzer bir deneyim kullanılmalıdır.

Her seçenek küçük bir kart şeklinde de gösterilebilir:

┌─────────────────┐
│ 📦              │
│ Ürünler         │
│              ✓  │
└─────────────────┘
8. Hızlı Erişim Sayısı

Dashboard'un kalabalıklaşmasını engellemek için aynı anda gösterilebilecek hızlı erişim sayısı sınırlandırılmalıdır.

Önerilen:

Minimum: 3

Varsayılan: 6

Maksimum: 8

Referans tasarımdaki gibi desktop ekranında yaklaşık:

6 hızlı erişim

ideal başlangıç değeridir.

Kullanıcı sekizden fazla seçenek işaretlemek isterse sistem:

Dashboard'da en fazla 8 hızlı erişim gösterebilirsiniz.

şeklinde bilgi verebilir.

9. Varsayılan Hızlı Erişimler

Yeni kullanıcı için önerilen varsayılanlar:

Ürünler

Hızlı Sipariş

Siparişlerim

Sepetim

İrsaliyelerim

Cari Hesap

Ancak yetkilere göre değişmelidir.

Örneğin finans kullanıcısında varsayılan:

Cari Hesap

Cari Ekstre

Faturalar

Ödemeler

Siparişler

olabilir.

10. Hızlı Erişim Sıralaması

Kullanıcı seçtiği hızlı erişimlerin sırasını değiştirebilmelidir.

Bunun iki olası yöntemi vardır:

Drag & Drop

veya düzenleme pop-up'ı içerisindeki:

↑
↓

kontrolleri.

İlk versiyon için pop-up içerisinde basit yeniden sıralama yeterlidir.

Dashboard üzerinde sürekli edit modu göstermek gereksiz karmaşıklık yaratabilir.

11. Hızlı Erişim Tercihlerinin Saklanması

Kullanıcının seçtiği hızlı erişimler sonraki girişlerde korunmalıdır.

Bu bilgi B2B kullanıcı tercihidir.

Örneğin:

User Dashboard Preferences

içerisinde saklanabilir.

Kullanıcının yetkisi sonradan kaldırılmışsa artık kullanamadığı hızlı erişim otomatik olarak gösterilmemelidir.

12. Hızlı Erişim Kartı İçeriği

Her hızlı erişim kartı sade olmalıdır.

Temel yapı:

Icon

Başlık

Kısa açıklama

>

Örneğin:

📦

Ürünler

Ürün kataloğunu görüntüle

>

Açıklama bir veya iki satırı geçmemelidir.

13. Hızlı Erişim Davranışları

Örnek aksiyonlar:

Ürünler
→ Ürün listesine gider.

Hızlı Sipariş
→ Hızlı sipariş ekranını açar.

Siparişlerim
→ Sipariş listesini açar.

Sepetim
→ Mevcut sepete gider.

Favorilerim
→ Favori ürünleri gösterir.

Cari Hesap
→ Cari özet ekranını açar.

Faturalarım
→ Fatura listesini açar.

Hızlı erişimler yeni fonksiyon üretmez.

Mevcut uygulama modüllerine shortcut görevi görür.

14. Ana KPI Alanı

Hızlı erişim bölümünün ardından kullanıcının mevcut ticari durumunu gösteren KPI kartları bulunabilir.

Varsayılan olarak dört KPI yeterlidir.

Önerilen:

Cari Bakiye

Vadesi Geçen Tutar

Açık Sipariş

Sevk Bekleyen Sipariş

Bu sayı bilinçli olarak düşük tutulmalıdır.

15. Cari Bakiye

Örnek:

Cari Bakiye

125.430,50 TL

Amaç:

Kullanıcının aktif firma için genel cari durumunu hızlı görmesi.

Tıklanması durumunda:

Cari Hesap

ekranına yönlendirebilir.

Finans yetkisi olmayan kullanıcıya gösterilmez.

16. Vadesi Geçen Tutar

Örnek:

Vadesi Geçen

18.750,00 TL

Tıklama:

Cari Hesap
→ Vadesi Geçen İşlemler

filtreli görünümüne götürebilir.

Bu KPI yalnızca gerçekten açık ve vadesi geçmiş işlemleri göstermelidir.

17. Açık Sipariş

Örnek:

Açık Sipariş

7

Amaç henüz tamamlanmamış aktif siparişlerin sayısını göstermek.

Tıklama:

Siparişlerim
→ Açık Siparişler
18. Sevk Bekleyen Sipariş

Örnek:

Sevk Bekleyen

4

Henüz tamamen sevk edilmemiş siparişleri ifade eder.

Tıklama:

Siparişlerim
→ Sevk Bekleyen
19. Opsiyonel KPI'lar

Firma ihtiyacına göre ileride:

Kullanılabilir Limit

Yaklaşan Ödeme

Açık Fatura

Bu Ayki Sipariş Tutarı

eklenebilir.

Ancak Dashboard aynı anda:

8–10 KPI

göstermemelidir.

Ana görünümde maksimum:

4–6 KPI

önerilir.

Daha detaylı finansal veriler ilgili modüllerde bulunmalıdır.

20. KPI Kartlarının Aksiyon Alması

KPI kartları yalnızca sayı gösteren dekoratif alanlar olmamalıdır.

Mümkün olduğu durumlarda tıklanabilir olmalıdır.

Örneğin:

Açık Sipariş
7

seçildiğinde kullanıcının tekrar filtre seçmesine gerek kalmamalıdır.

Direkt:

Siparişlerim
Status = Açık

şeklinde açılmalıdır.

Bu Dashboard'un operasyonel değerini artırır.

21. Sipariş Durum Özeti

Kullanıcının aktif siparişlerinin hangi aşamalarda olduğunu görmesini sağlar.

Önerilen durumlar:

Onay Bekliyor

Hazırlanıyor

Kısmi Sevk

Sevk Edildi

Örneğin:

Sipariş Durumu

Onay Bekliyor       2

Hazırlanıyor        4

Kısmi Sevk          1

Sevk Edildi         3

Her durum tıklanabilir olmalıdır.

22. Sipariş Durumu Sadeleştirmesi

Netsim içerisindeki bütün teknik statüler Dashboard'a aktarılmamalıdır.

ERP durumları B2B kullanıcılarına anlamlı üst gruplara dönüştürülmelidir.

Örneğin birden fazla Netsim iç durumu:

Hazırlanıyor

B2B durumunun altında toplanabilir.

23. Son Siparişler

Dashboard'un ana bilgi alanlarından biridir.

Amaç kullanıcının son siparişlerine detay modülüne gitmeden hızlıca bakabilmesidir.

Önerilen:

Son 5 Sipariş

gösterilir.

24. Son Sipariş Alanları

Temel kolonlar:

Sipariş No

Tarih

Toplam Tutar

Durum

Teslim Tarihi

İşlem

Örneğin:

SP-10458
08.09.2026
24.850,00 TL
Hazırlanıyor
12.09.2026
Detay
25. Sipariş Detayına Geçiş

Sipariş numarası veya satır tıklandığında:

Sipariş Detayı

açılır.

Ayrıca alanın üst kısmında:

Tüm Siparişleri Gör →

aksiyonu bulunmalıdır.

Dashboard içerisinde uzun pagination kullanılmaz.

26. Son Siparişler Empty State

Kullanıcının henüz siparişi yoksa boş tablo yerine:

Henüz siparişiniz bulunmuyor.

Ürünleri inceleyerek ilk siparişinizi oluşturabilirsiniz.

[Ürünlere Git]

gösterilmelidir.

27. Yaklaşan Teslimatlar

Teslim tarihi yaklaşan aktif siparişleri veya sevkiyatları gösterir.

Örneğin:

Yaklaşan Teslimatlar

SP-10458
12 Eylül
4 gün kaldı

SP-10461
15 Eylül
7 gün kaldı

Her kayıt ilgili sipariş veya sevkiyat detayına gider.

28. Yaklaşan Teslimat Önceliği

Bu alan yalnızca güvenilir teslimat verisi varsa gösterilmelidir.

ERP tarafında teslim tarihi doğru yönetilmiyorsa kullanıcıya tahmini ancak güvenilmez bilgi vermek yerine bu widget hiç gösterilmemelidir.

29. Geciken Teslimatlar

Planlanan teslim tarihi geçmiş ve tamamlanmamış sipariş bulunuyorsa daha belirgin gösterilebilir.

Örneğin:

1 siparişin planlanan teslim tarihi geçti.

[Detayları Gör]

Bu bilgi warning niteliğindedir.

Ancak ekranın tamamını kırmızı uyarılara çevirmemelidir.

30. Sepet Özeti

Dashboard üzerinde küçük bir sepet widget'ı bulunabilir.

Örneğin:

Sepetim

3 ürün

2.950,00 TL

[Sepete Git]

Bu alan kullanıcının yarım bıraktığı siparişe dönmesini kolaylaştırır.

31. Sepet Boş Durumu

Sepet boşsa:

Sepetiniz boş.

Yeni sipariş oluşturmak için ürünleri inceleyin.

[Ürünlere Git]

gösterilebilir.

Boş sepet kartı çok fazla alan kaplamamalıdır.

32. Yaklaşan Ödeme

Finans yetkisine sahip kullanıcılarda gösterilebilir.

Örneğin:

Yaklaşan Ödeme

12.500,00 TL

3 gün içinde

Tıklanması:

Cari Hesap
→ Yaklaşan Vadeler

alanını açabilir.

33. Ödeme Uyarıları

Vadesi geçen işlem varsa kullanıcı bunu Dashboard üzerinde görebilmelidir.

Ancak hem KPI hem ayrı büyük widget ile aynı bilgi tekrar tekrar gösterilmemelidir.

Örneğin Vadesi Geçen KPI zaten mevcutsa ayrıca büyük bir gecikmiş ödeme kartı yalnızca kritik durumda gösterilebilir.

34. Duyurular

Firma tarafından yayınlanan önemli B2B duyuruları gösterilebilir.

Örneğin:

Yeni ürün kataloğu yayınlandı.

Bayram sevkiyat programı güncellendi.

Dashboard üzerinde en fazla:

2–3 duyuru

gösterilmelidir.

35. Kampanyalar

Aktif kampanya bulunuyorsa küçük bir alan kullanılabilir.

Örneğin:

Eylül Kampanyası

Seçili ürünlerde size özel fiyatlar.

[Ürünleri Gör]

Dashboard büyük reklam banner'larıyla doldurulmamalıdır.

Kampanyalar ikincil içeriktir.

36. Sipariş Trendi

İleri aşamada basit bir grafik kullanılabilir.

Örneğin:

Aylık Siparişler

ve:

Son 6 Ay

filtresi.

Gösterilebilecek veri:

Sipariş Tutarı

veya:

Sipariş Sayısı

olabilir.

Dashboard üzerinde bir adet ana grafik yeterlidir.

Birden fazla analitik chart kullanılması Dashboard'u raporlama ekranına dönüştürür.

37. Dashboard Yoğunluk Kuralı

Dashboard'un boğuk olmaması için bazı sınırlar tanımlanmalıdır.

Ana görünüm için öneri:

Hızlı Erişim:
6 adet

Ana KPI:
4 adet

Son Sipariş:
5 kayıt

Yaklaşan Teslimat:
3–5 kayıt

Duyuru:
2–3 kayıt

Ana Grafik:
En fazla 1

Daha fazla bilgi:

Tümünü Gör

aksiyonu üzerinden detay modüllerine bırakılmalıdır.

38. Dashboard'da Öncelik Seviyeleri

Bileşenler üç seviyeye ayrılabilir.

Primary

Kullanıcının hemen görmesi gerekenler:

Ana KPI'lar
Hızlı Erişim
Son Siparişler
Secondary

Günlük işlerini destekleyen bilgiler:

Sepet
Yaklaşan Teslimatlar
Sipariş Durumu
Tertiary

Destekleyici bilgiler:

Duyurular
Kampanyalar
Grafikler

Desktop ekranında Primary alanlar scroll yapmadan görülebilecek konuma yakın tutulmalıdır.

39. Dashboard Widget Mantığı

Dashboard'un tamamının serbestçe sürüklenebilir bir widget sistemine dönüşmesi ilk sürüm için önerilmez.

Bu yaklaşım:

kullanım karmaşıklığını,
geliştirme maliyetini,
responsive problemleri

artırabilir.

Bunun yerine:

Sadece Hızlı Erişim alanı kullanıcı tarafından özelleştirilebilir olmalıdır.

Ana KPI, sipariş ve finans alanlarının yerleşimi sistem tarafından kontrol edilmelidir.

Bu hem kişiselleştirme sağlar hem Dashboard düzeninin bozulmasını önler.

40. Gelecekte Dashboard Özelleştirme

İleride ihtiyaç oluşursa sınırlı widget kişiselleştirmesi eklenebilir.

Örneğin kullanıcı:

Sipariş Trendi

Yaklaşan Teslimatlar

Duyurular

Favoriler

widget'larını açıp kapatabilir.

Ancak çekirdek KPI ve kritik işlem alanları sistem tarafından korunmalıdır.

41. Permission Bazlı Dashboard

Kullanıcının yetkisine sahip olmadığı hiçbir Dashboard verisi gösterilmemelidir.

Örneğin:

finance.view = false

ise:

Cari Bakiye
Vadesi Geçen
Yaklaşan Ödeme
Kullanılabilir Limit

görünmez.

Boş alan bırakılmaz.

Diğer Dashboard componentleri kalan alanı kullanır.

42. Rol Bazlı Varsayılan Dashboard

Hızlı Erişim başlangıç tercihi ve bazı widget'lar kullanıcı rolüne göre belirlenebilir.

Örneğin:

Standart Bayi Kullanıcısı
Ürünler
Hızlı Sipariş
Siparişlerim
Sepetim
Favoriler
İrsaliyeler
Finans Kullanıcısı
Cari Hesap
Cari Ekstre
Faturalar
Ödemeler
Siparişler
Bayi Yöneticisi
Siparişler
Ürünler
Finans
Faturalar
Kullanıcılar
Raporlar

Kullanıcı daha sonra Hızlı Erişim alanını değiştirebilir.

43. Loading Davranışı

Dashboard tamamen tek bir spinner arkasında beklememelidir.

Widget bazlı skeleton loading kullanılmalıdır.

Örneğin:

KPI yükleniyor

sırasında Son Siparişler hazırsa gösterilebilir.

Bir alanın yüklenmesi diğer alanları bloke etmemelidir.

44. Partial Error

Örneğin finans verisi alınamaz ancak sipariş verisi alınabiliyorsa Dashboard tamamen hata ekranına dönüşmemelidir.

Örneğin:

Cari Bakiye

Finans bilgisi şu anda alınamıyor.

[Tekrar Dene]

gösterilebilir.

Diğer Dashboard alanları normal çalışmaya devam eder.

45. Veri Güncelliği

Kritik verilerde gerektiğinde son güncelleme zamanı gösterilebilir.

Örneğin:

Son güncelleme: 16:12

Ancak her kartın altına ayrı timestamp koymak Dashboard'u gereksiz şekilde kalabalıklaştırabilir.

Gerekirse Dashboard genelinde tek güncelleme zamanı kullanılabilir.

46. Refresh

Dashboard genel yenileme aksiyonu destekleyebilir.

Örneğin:

↻ Yenile

Manuel refresh kullanıcının normal kullanımının zorunlu parçası olmamalıdır.

Sistem uygun noktalarda verileri kendisi yenilemelidir.

47. Netsim Veri Kaynakları

Dashboard temel olarak şu Netsim iş alanlarından veri alacaktır:

Cari

Cari Hareket

Sipariş

Sipariş Detayı

Stok

Sevkiyat

İrsaliye

Fatura

Ödeme

Mevcut araştırmalarda karşılaşılabilecek muhtemel tablolar:

CARIKART

CARIISLM

ALSAASIL

ALSADETA

STOKKART

STOKASIL

STOKISLM

Ancak tablo ve kolonların Dashboard hesaplamalarındaki kesin rolü Netsim database yapısı üzerinden ayrıca doğrulanmalıdır.

Tahmin edilen tablo ilişkileri production implementasyonu olarak kabul edilmemelidir.

48. Dashboard Veri Mapping Çalışması

Her bileşen için ileride aşağıdaki tablo doldurulmalıdır:

Dashboard Alanı	İş Anlamı	Netsim Kaynağı	Hesaplama	Güncellik
Cari Bakiye	Güncel cari durum	Doğrulanacak	Doğrulanacak	Yüksek
Vadesi Geçen	Açık ve vadesi geçmiş işlemler	Doğrulanacak	Doğrulanacak	Yüksek
Açık Sipariş	Tamamlanmamış siparişler	Doğrulanacak	Status mapping	Yüksek
Sevk Bekleyen	Tam sevk edilmemiş sipariş	Doğrulanacak	Sipariş - sevk	Yüksek
Son Siparişler	Son N sipariş	Doğrulanacak	Tarih sırası	Orta
Yaklaşan Teslimat	Yaklaşan sevkiyat	Doğrulanacak	Tarih hesabı	Orta
Sepet	Aktif B2B sepeti	B2B	Anlık	Anlık
Duyurular	Aktif duyuru	B2B	Yayın dönemi	Düşük
49. Dashboard Hesaplanan Alanları

Nihai formülleri daha sonra doğrulanacak temel calculated fields:

Cari Bakiye

Vadesi Geçen Tutar

Kullanılabilir Limit

Açık Sipariş Sayısı

Sevk Bekleyen Sipariş Sayısı

Yaklaşan Ödeme

Yaklaşan Teslimat

Bu hesapların Netsim'in kendi ticari mantığıyla uyumlu olması gerekir.

50. Dashboard API Yaklaşımı

Frontend'in her Dashboard kartı için doğrudan ayrı Netsim sorgusu çalıştırması önerilmez.

Backend tarafında bir Dashboard aggregation servisi kullanılabilir.

Kavramsal yapı:

Dashboard
    ↓
Dashboard Service
    │
    ├── Orders
    ├── Finance
    ├── Logistics
    ├── Cart
    └── Communication

Örnek API:

GET /api/v1/dashboard

Kesin API tasarımı ilgili teknik dokümantasyonda tanımlanacaktır.

51. Hızlı Erişim Tercih API'si

Hızlı erişim kullanıcı tercihi olduğu için ayrı olarak yönetilebilir.

Kavramsal olarak:

GET
/dashboard/preferences

kullanıcının mevcut tercihlerini getirir.

PUT
/dashboard/preferences

seçilen hızlı erişimleri ve sıralamayı kaydeder.

Kesin endpoint yapısı API tasarım aşamasında belirlenecektir.

52. Performans

Dashboard her açıldığında Netsim üzerinde:

tüm siparişler

tüm cari hareketler

tüm stok hareketleri

gibi büyük veri setleri taranmamalıdır.

Dashboard yalnızca gösterilecek özet için gerekli veriyi çekmelidir.

Örneğin:

Son 5 Sipariş

isteniyorsa binlerce sipariş frontend'e gönderilmemelidir.

53. Cache

Dashboard verilerinin cache ihtiyacı farklı olabilir.

Örneğin:

Duyurular
→ uzun cache

Sipariş trendi
→ orta cache

Sipariş sayısı
→ kısa cache

Cari bakiye
→ kısa cache / güncel

Sepet
→ anlık

Kesin cache süreleri performans ve güncellik testlerinden sonra belirlenmelidir.

54. Responsive Dashboard

Desktop ana kullanım ortamıdır.

Desktop'ta:

Hızlı Erişim → yatay kart grid

KPI → 4 kolon

Alt içerik → çok kolonlu yapı

kullanılabilir.

Tablet'te:

Hızlı Erişim → 3 kolon

KPI → 2 kolon

Mobile'da ise:

Hızlı Erişim → 2 kolon

KPI → 1 veya 2 kolon

Tablo → sade card list

şeklinde dönüşebilir.

55. Dashboard'un MVP İçeriği

İlk sürümde Dashboard şu alanlarla sınırlandırılabilir:

Karşılama

Yeni Sipariş CTA

Özelleştirilebilir Hızlı Erişim

Cari Bakiye

Vadesi Geçen Tutar

Açık Sipariş

Sevk Bekleyen Sipariş

Son Siparişler

Sepet Özeti

Bu yapı hem güçlü hem yeterince sade bir başlangıç sağlar.

56. Phase 2 Dashboard

Daha sonra:

Sipariş Durum Özeti

Yaklaşan Teslimatlar

Yaklaşan Ödemeler

Son Faturalar

Duyurular

Favoriler / Sık Alınanlar

eklenebilir.

57. Future Dashboard

Daha ileri aşamada:

Sipariş Trendi

Satın Alma Analizi

Akıllı Tekrar Sipariş

Ürün Önerileri

AI Ticari Özet

eklenebilir.

Bu alanlar ilk sürümün temel Dashboard deneyimini ağırlaştırmamalıdır.

58. Dashboard'da Gösterilmemesi Gerekenler

Dashboard üzerinde:

Uzun ERP tabloları

Stok hareketlerinin tamamı

Cari hareketlerin tamamı

Teknik Netsim durum kodları

Database kolon adları

Çok detaylı analitik

Uzun ürün katalogları

Çok sayıda grafik

Çok sayıda CTA

bulunmamalıdır.

Bunlar ilgili detay ekranlarına bırakılmalıdır.

59. Tasarım İçin Önerilen İlk Yerleşim

Referans görsel baz alınarak ilk Dashboard yapısı aşağıdaki şekilde düşünülebilir:

┌──────────────────────────────────────────────────────────────┐
│ Hoş geldiniz                             [+ Yeni Sipariş]    │
└──────────────────────────────────────────────────────────────┘


Hızlı Erişim                                      [Düzenle]

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Ürünler  │ │ Hızlı    │ │Siparişler│ │ Sepetim  │ │  Cari    │
│          │ │ Sipariş  │ │          │ │          │ │  Hesap   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘


┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Cari Bakiye    │ │ Vadesi Geçen  │ │ Açık Sipariş  │ │ Sevk Bekleyen │
│                │ │                │ │                │ │                │
│ 125.430,50 TL  │ │ 18.750,00 TL  │ │       7        │ │       4        │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘


┌─────────────────────────────────────┐ ┌───────────────────────┐
│                                     │ │                       │
│          Son Siparişler             │ │     Sepet Özeti       │
│                                     │ │                       │
│                                     │ ├───────────────────────┤
│                                     │ │                       │
│                                     │ │ Sipariş Durumu /      │
│                                     │ │ Yaklaşan Teslimatlar  │
└─────────────────────────────────────┘ └───────────────────────┘

Bu yerleşimde özellikle boşluk bırakılması bilinçli bir tasarım kararıdır.

Amaç her boş alanı yeni bir widget ile doldurmak değildir.

60. Dashboard'un Ana Kararı

Dashboard için temel yaklaşım şu olmalıdır:

Sistem ana ticari bilgilerin yerleşimini kontrol eder; kullanıcı ise kendisi için önemli olan hızlı işlemleri kişiselleştirebilir.

Bu sayede iki hedef aynı anda sağlanır:

Tutarlı ve sade Dashboard
+
Kullanıcıya özel hızlı çalışma alanı

Dashboard'un genel karakteri ise:

Az sayıda güçlü KPI, özelleştirilebilir hızlı erişimler, son işlemler ve aksiyon gerektiren bilgilerin önceliklendirildiği ferah bir çalışma alanı

olmalıdır.