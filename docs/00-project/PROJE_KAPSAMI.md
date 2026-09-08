Project Scope

Bu dosya Netsim B2B projesinin ürün sınırlarını tanımlar.

Temel amacı şu sorulara açık cevap vermektir:

Bu projede ne geliştiriyoruz?
Hangi iş süreçlerini B2B portalına taşıyoruz?
Hangi süreçler Netsim ERP içerisinde kalmaya devam ediyor?
İlk canlı sürümde hangi fonksiyonlar zorunlu?
Hangi özellikler sonraki fazlara bırakılacak?
Projenin temel varsayımları ve kısıtları nelerdir?

Bu dosya kapsam kontrolünün ana referansıdır.

Yeni bir özellik talep edildiğinde öncelikle bu dokümana göre:

In Scope
MVP Scope
Future Scope
Out of Scope

sınıflarından hangisine girdiği değerlendirilmelidir.

1. Kapsamın Temel Tanımı

Netsim B2B;

Netsim ERP kullanan bir firmanın bayi ve kurumsal müşterilerine ürün, fiyat, stok, teklif, sipariş, lojistik ve finans bilgilerini web üzerinden sunmasını sağlayan B2B müşteri portalıdır.

Projenin amacı Netsim ERP'nin tamamını web ortamına taşımak değildir.

B2B yalnızca müşteri veya bayi açısından anlamlı olan ticari süreçleri kapsar.

Temel kapsam:

Kimlik ve firma erişimi
        ↓
Ürün ve katalog
        ↓
Fiyat ve stok
        ↓
Sepet
        ↓
Teklif / Sipariş
        ↓
Sevkiyat / İrsaliye
        ↓
Fatura
        ↓
Cari / Finans
2. Scope Prensibi

Bir Netsim özelliğinin ERP içerisinde bulunması, o özelliğin B2B kapsamına otomatik olarak girdiği anlamına gelmez.

Bir fonksiyonun B2B'ye dahil edilmesi için aşağıdaki sorulardan en az birine olumlu cevap vermesi gerekir:

Bayinin satın alma sürecini kolaylaştırıyor mu?
Müşterinin ticari bilgiye erişimini kolaylaştırıyor mu?
Sipariş sürecini hızlandırıyor mu?
Sipariş sonrası takibi iyileştiriyor mu?
Finansal görünürlüğü artırıyor mu?
Satıcı firma ile müşteri arasındaki manuel iletişim ihtiyacını azaltıyor mu?

Bu kriterleri karşılamayan ERP fonksiyonları B2B kapsamının dışında değerlendirilmelidir.

3. In Scope

Aşağıdaki alanlar Netsim B2B ürününün genel kapsamına dahildir.

3.1 Kullanıcı Girişi

B2B kullanıcılarının güvenli şekilde sisteme giriş yapabilmesi.

Kapsam:

kullanıcı hesabı,
giriş,
çıkış,
kullanıcı durumu,
oturum yönetimi,
gerekli doğrulama mekanizmaları.

İleride:

SMS doğrulama,
OTP,
SSO

gibi yöntemler eklenebilir.

3.2 Kullanıcı–Firma / Cari İlişkisi

B2B kullanıcısının erişebileceği Netsim cari hesaplarının belirlenmesi.

Kapsam:

kullanıcının bir veya birden fazla cariye bağlanabilmesi,
varsayılan firma,
aktif firma seçimi,
firma değişimi,
firma bazlı veri erişimi.
3.3 Rol ve Yetkilendirme

Kullanıcıların yalnızca yetkili oldukları işlemleri gerçekleştirmesi.

Örneğin:

ürün görüntüleme,
fiyat görüntüleme,
sipariş oluşturma,
fatura görüntüleme,
finans görüntüleme,
kullanıcı yönetme.

Detaylı rol yapısı USER_TYPES.md içerisinde tanımlanır.

3.4 Dashboard

Kullanıcının ticari durumunu hızlı şekilde görebileceği özet ekran.

Dashboard aşağıdaki modüllerden özet bilgiler gösterebilir:

sipariş,
cari,
sevkiyat,
ödeme,
sepet,
duyuru,
ürün.

Dashboard yeni bir ticari veri kaynağı değildir.

Mevcut modüllerdeki bilgilerin özetini sunar.

3.5 Ürün Kataloğu

B2B üzerinden satışa açık ürünlerin listelenmesi.

Kapsam:

ürün listeleme,
ürün arama,
ürün detayına ulaşma,
ürün kodu,
ürün adı,
birim,
açıklama,
ürün görseli,
satışa uygun ürün bilgileri.

ERP stok kartındaki bütün teknik alanların gösterilmesi kapsam dahilinde değildir.

3.6 Kategoriler

Ürünlerin kullanıcı dostu şekilde gruplandırılması.

Kapsam:

ana kategori,
alt kategori,
kategori bazlı ürün listeleme,
kategori filtreleme.

Kategori yapısının Netsim'den mi yoksa B2B katalog katmanından mı yönetileceği veri mimarisinde kesinleştirilecektir.

3.7 Ürün Varyantları

Ürün satış modelinde gerekli olduğu durumlarda ürün varyantlarının gösterilmesi.

Örneğin:

renk,
beden,
ölçü,
paket,
model.

B2B, kullanıcıya satış açısından gerekli varyant bilgisini gösterir.

ERP'nin bütün teknik varyant altyapısını kullanıcıya açmaz.

3.8 Fiyatlandırma

Kullanıcının kendi ticari koşullarına uygun fiyatları görüntülemesi.

Kapsam:

birim fiyat,
müşteriye özel fiyat,
gerekiyorsa iskonto,
fiyat listesi kaynaklı sonuç,
sepet fiyat hesaplama.

B2B'nin ERP'den bağımsız ikinci bir ticari fiyat sistemi oluşturması hedeflenmez.

3.9 Stok Görünürlüğü

Kullanıcının ürünün satın alınabilirliğini anlayabilmesi.

Kapsam örnekleri:

Stokta

Stokta yok

Son 5 adet

Sipariş üzerine

Gerekirse satılabilir miktar gösterilebilir.

ERP içerisindeki bütün stok yeri ve hareket detaylarının müşteriye açılması zorunlu değildir.

3.10 Ürün Arama

Kullanıcının ürünlere hızlı ulaşabilmesi.

Arama en az:

ürün adı,
ürün kodu,
kategori

üzerinden çalışmalıdır.

İleride daha gelişmiş arama fonksiyonları eklenebilir.

3.11 Ürün Filtreleme

Ürün sayısı arttığında gerekli filtreleme fonksiyonlarının sağlanması.

Örneğin:

kategori,
stok durumu,
ürün özellikleri,
fiyat aralığı.

Filtre yapısı ürün tipine göre genişleyebilir.

3.12 Favoriler

Kullanıcının sık kullandığı ürünleri kaydedebilmesi.

Kapsam:

favoriye ekle,
favoriden kaldır,
favori ürünleri listele,
favoriden sepete ekle.

Favori bilgisi B2B'ye özgü veridir.

3.13 Hızlı Sipariş

Ürün kodunu veya ürün adını bilen profesyonel müşterilerin katalog içerisinde dolaşmadan sipariş hazırlayabilmesi.

Temel kullanım:

Ürün
+
Miktar

şeklinde çok sayıda ürün ekleyerek sepete aktarım yapılabilmesidir.

3.14 Sepet

Sipariş öncesindeki geçici çalışma alanıdır.

Kapsam:

sepete ürün ekleme,
ürünü kaldırma,
miktar değiştirme,
fiyat hesaplama,
ara toplam,
genel toplam,
stok yeniden kontrolü,
sipariş sürecine geçiş.

Sepet B2B tarafında tutulur.

3.15 Teklifler

Müşterinin teklif süreçlerini B2B üzerinden takip edebilmesi.

Genel ürün kapsamında:

teklif listeleme,
teklif detayları,
teklif durumu,
teklif satırları,
teklif talebi oluşturma,
uygun teklifin siparişe dönüşmesi

desteklenebilir.

Kesin teklif workflow'u Netsim'in mevcut satış süreçlerine göre şekillendirilecektir.

3.16 Sipariş Oluşturma

Sepetin Netsim'de gerçek bir ticari siparişe dönüşmesi.

Kapsam:

sipariş öncesi validation,
cari kontrolü,
ürün kontrolü,
fiyat kontrolü,
stok kontrolü,
teslimat bilgileri,
sipariş özeti,
sipariş onayı,
Netsim'e aktarım,
kullanıcıya sipariş numarası gösterimi.
3.17 Siparişlerim

Kullanıcının kendi firmasına ait siparişleri görüntüleyebilmesi.

Kapsam:

sipariş listesi,
sipariş arama,
tarih filtresi,
durum filtresi,
sipariş detayı,
ürün satırları,
tutarlar,
sipariş durumu.
3.18 Sipariş Durumu

Netsim'deki operasyonel durumların kullanıcı dostu B2B statülerine dönüştürülmesi.

Örnek:

Sipariş Alındı
Onaylandı
Hazırlanıyor
Kısmi Sevk
Sevk Edildi
Tamamlandı
İptal Edildi
3.19 Tekrar Sipariş

Kullanıcının geçmiş siparişlerinden yeni sepet oluşturabilmesi.

Sistem yeniden:

ürün geçerliliği,
stok,
fiyat

kontrolü yapmalıdır.

Eski sipariş kör şekilde kopyalanmaz.

3.20 Sevkiyatlar

Sipariş sonrası lojistik durumun görüntülenmesi.

Kapsam:

ilgili sipariş,
sevk edilen ürünler,
miktarlar,
sevk tarihi,
kısmi sevk bilgisi,
sevkiyat durumu.

Kargo firması bazlı detaylı takip ayrı bir entegrasyon olarak Future Scope içerisinde değerlendirilebilir.

3.21 İrsaliyeler

Kullanıcının kendi firmasına ait irsaliyeleri görüntüleyebilmesi.

Kapsam:

irsaliye listesi,
irsaliye numarası,
tarih,
ilgili sipariş,
ürün satırları,
miktarlar,
belge detayları.
3.22 Faturalar

Kullanıcının kendi firmasına ait faturaları görüntüleyebilmesi.

Kapsam:

fatura listesi,
fatura numarası,
tarih,
tutar,
vade,
ödeme durumu,
ilgili sipariş,
ilgili irsaliye.

Belge indirme Netsim altyapısının uygunluğuna göre desteklenebilir.

3.23 Cari Hesap

Kullanıcının Netsim'deki cari hesabının B2B için gerekli özetini görüntüleyebilmesi.

Kapsam:

cari bakiye,
borç/alacak görünümü,
hesap hareketleri,
açık işlemler,
vadesi geçen işlemler.

ERP'deki cari kartın bütün tanım alanlarının gösterilmesi kapsam dahilinde değildir.

3.24 Finansal Özet

Kullanıcı yetkisine bağlı olarak:

bakiye,
vadesi geçen,
yaklaşan ödeme,
açık fatura,
kredi limiti,
kullanılabilir limit

gibi finansal bilgiler gösterilebilir.

3.25 Ödeme Geçmişi

Netsim'de kayıtlı ödeme bilgilerinin müşteriye gösterilmesi.

İlk kapsamda ödeme modülü:

Ödeme bilgilerinin görüntülenmesi

şeklinde düşünülebilir.

Portal üzerinden gerçek online ödeme işlemi ayrı bir özellik olarak ele alınır.

3.26 Kampanyalar

Ürün ve ticari iletişim kampanyalarının kullanıcıya gösterilmesi.

Kapsam:

kampanya listesi,
kampanya detayları,
ilgili ürünlere yönlendirme.

İleri seviye kampanya motoru Netsim fiyatlandırma sisteminin yerine geçmemelidir.

3.27 Duyurular

Satıcı firmanın B2B kullanıcılarına bilgi yayınlayabileceği alan.

Örneğin:

tatil duyurusu,
katalog güncellemesi,
yeni ürün,
sevkiyat duyurusu,
sistem bilgilendirmesi.
3.28 Bildirimler

Kullanıcının önemli olaylardan haberdar olması.

Örneğin:

Siparişiniz onaylandı.

Siparişiniz sevk edildi.

Yeni faturanız oluştu.

Ödemenizin vadesi yaklaşıyor.

İlk aşamada uygulama içi bildirimler düşünülebilir.

E-posta, SMS ve push gibi kanallar sonraki fazlarda genişletilebilir.

3.29 Hesabım

B2B kullanıcı hesabına ait bilgilerin görüntülenmesi ve uygun alanların yönetilmesi.

Örneğin:

ad soyad,
e-posta,
telefon,
şifre,
bildirim tercihleri.

Cari kart üzerindeki ticari master verinin kullanıcı tarafından serbestçe değiştirilmesi hedeflenmez.

3.30 Destek

Kullanıcının yardım ve destek kanallarına ulaşabilmesi.

İlk aşamada:

iletişim bilgileri,
destek talebine yönlendirme

yeterli olabilir.

İleride tam destek talep sistemi oluşturulabilir.

3.31 Netsim ERP Entegrasyonu

B2B ile Netsim ERP arasında veri alışverişinin sağlanması proje kapsamındadır.

Ana veri grupları:

Ürün
Fiyat
Stok
Cari
Teklif
Sipariş
Sevkiyat
İrsaliye
Fatura
Finans
Ödeme

Netsim'in teknik karmaşıklığı kullanıcı arayüzüne taşınmayacaktır.

4. Out of Scope

Aşağıdaki Netsim / ERP fonksiyonlarının doğrudan B2B kullanıcıları tarafından yönetilmesi proje kapsamının dışındadır.

4.1 Firma ve Şube Master Tanımları

B2B üzerinden:

yeni Netsim firma oluşturma,
şube tanımlama,
işletme yapısı oluşturma

yapılmaz.

Bunlar ERP yönetim fonksiyonlarıdır.

4.2 Stok Kartı Master Yönetimi

Bayi kullanıcısı B2B üzerinden:

stok kartı oluşturamaz,
ERP stok kodunu değiştiremez,
stok tipini değiştiremez,
stok master datasını silemez.

Ürünlerin web sunumu için B2B'ye özgü ek içerikler ayrı konu olarak değerlendirilebilir.

4.3 Stok Tipi ve Stok Sınıfı Tanımlama

Netsim stok sınıflandırma yapısının oluşturulması ve yönetimi ERP içerisinde kalır.

4.4 Üretim Reçeteleri

B2B üzerinden:

BOM,
ürün ağacı,
reçete,
reçete varyantı

tanımlanmaz veya yönetilmez.

4.5 Rota Tanımları

Üretim rotası:

oluşturma,
değiştirme,
operasyon bağlama

B2B kapsamı dışındadır.

4.6 Operasyon Yönetimi

B2B:

operasyon tanımlama,
operasyon süresi,
makine,
iş istasyonu

yönetmez.

4.7 İş Emirleri

Üretim iş emri:

oluşturma,
çizelgeleme,
operasyon tamamlama,
malzeme sarfı

B2B müşterisine açılmaz.

4.8 MRP Yönetimi

B2B üzerinden:

MRP çalıştırma,
ihtiyaç planlama,
satın alma önerisi,
üretim önerisi

oluşturulmaz.

MRP sonuçlarının dolaylı olarak teslimat/ATP hesaplarında kullanılması gelecekte mümkün olabilir.

4.9 Depo Operasyonları

B2B kullanıcısı:

depo oluşturmaz,
stok yeri oluşturmaz,
depo transferi yapmaz,
sayım gerçekleştirmez,
depo giriş/çıkışı oluşturmaz.
4.10 Satın Alma Yönetimi

Satıcı firmanın kendi tedarikçilerine yönelik:

satın alma talebi,
satın alma siparişi,
tedarikçi teklifi,
mal kabul

süreçleri müşteri B2B portalının kapsamında değildir.

4.11 Muhasebe Yönetimi

B2B üzerinden:

muhasebe fişi oluşturma,
hesap planı tanımlama,
yevmiye kayıtları,
dönem sonu işlemleri,
muhasebe parametreleri

yönetilmez.

4.12 İnsan Kaynakları

Aşağıdakiler kapsam dışıdır:

personel yönetimi,
bordro,
izin,
puantaj,
vardiya,
özlük.
4.13 Netsim Sistem Parametreleri

B2B kullanıcıları:

Netsim sistem parametrelerini,
kullanıcı giriş parametrelerini,
belge yapılarını,
sistem konfigürasyonlarını

değiştiremez.

4.14 Database Yönetimi

B2B hiçbir son kullanıcıya:

SQL çalıştırma,
tablo düzenleme,
doğrudan database erişimi

sağlamaz.

4.15 ERP Yönetim Panelinin Yerini Alma

Netsim B2B:

Netsim N4'ün web versiyonu değildir.

Firma çalışanlarının Netsim üzerinde gerçekleştirdiği tüm operasyonları yeniden üretmek proje hedefi değildir.

5. MVP Scope

İlk canlı sürümün amacı uçtan uca gerçek bir B2B satın alma sürecinin çalışmasıdır.

MVP'nin çekirdeği:

Login
↓
Firma
↓
Ürün
↓
Fiyat + Stok
↓
Sepet
↓
Sipariş
↓
Sipariş Takibi

olmalıdır.

5.1 MVP — Authentication

Mutlaka bulunmalıdır:

kullanıcı girişi,
çıkış,
oturum yönetimi,
aktif/pasif kullanıcı kontrolü.
5.2 MVP — Firma / Cari Seçimi

Kullanıcı birden fazla cariye bağlıysa firma seçebilmelidir.

Aktif firma bütün ticari verilerin bağlamını belirlemelidir.

5.3 MVP — Dashboard

Temel özet ve navigasyon ekranı.

İlk sürümde sınırlı sayıda önemli veri yeterlidir.

5.4 MVP — Ürünler

Mutlaka:

ürün listesi,
ürün arama,
ürün detayı,
ürün fiyatı,
stok durumu

bulunmalıdır.

5.5 MVP — Kategoriler

Ürün kataloğunda yeterli ürün sayısı varsa temel kategori navigasyonu bulunmalıdır.

5.6 MVP — Sepet

Mutlaka:

sepete ekleme,
miktar değiştirme,
ürün kaldırma,
toplam hesaplama

bulunmalıdır.

5.7 MVP — Sipariş Oluşturma

Sepetin Netsim siparişine güvenli şekilde dönüşmesi MVP'nin en kritik fonksiyonudur.

5.8 MVP — Siparişlerim

Kullanıcı:

geçmiş siparişlerini,
sipariş detayını,
sipariş durumunu

görebilmelidir.

5.9 MVP — Temel Cari / Finans Görünümü

En azından kullanıcı yetkisine bağlı olarak:

cari bakiye,
vadesi geçen tutar

gibi temel finansal bilgiler gösterilebilir.

5.10 MVP — Responsive Temel Kullanım

İlk sürüm desktop önceliklidir.

Ancak temel ekranlar tablet ve mobil cihazlarda kullanılabilir olmalıdır.

6. MVP'de Zorunlu Olmayan Özellikler

Aşağıdaki özellikler genel ürün kapsamına dahil olsa da ilk canlı sürüm için zorunlu değildir:

Hızlı Sipariş
Favoriler
Teklif Talebi
Tekrar Sipariş
Detaylı Sevkiyat
İrsaliye
Fatura Modülü
Gelişmiş Finans
Kampanyalar
Bildirim Merkezi
Bayi Kullanıcı Yönetimi
Satış Temsilcisi Paneli

MVP sonrası fazlara taşınabilirler.

7. Phase 2 Scope

MVP sonrasında ticari işlemi zenginleştiren özellikler eklenebilir.

Önerilen ikinci faz:

favoriler,
hızlı sipariş,
tekrar sipariş,
teklifler,
sevkiyat,
irsaliye,
faturalar,
gelişmiş cari hesap,
ödeme geçmişi.

Bu fazın amacı sipariş öncesi ve sipariş sonrası süreçlerin tamamlanmasıdır.

8. Phase 3 Scope

Kullanıcı deneyimini ve ticari etkileşimi geliştiren özellikler:

bildirim merkezi,
kampanyalar,
gelişmiş arama,
kayıtlı filtreler,
belge indirme,
kullanıcı yönetimi,
firma bazlı roller,
gelişmiş raporlar.
9. Future Scope

Aşağıdaki özellikler ürünün uzun vadeli gelişim alanlarıdır.

9.1 ATP

Available to Promise desteği.

Sistem yalnızca fiziksel stok yerine gerçekten sipariş verilebilir miktarı ve gerekiyorsa tahmini teslimat zamanını gösterebilir.

9.2 Akıllı Muadil

Stokta olmayan ürünler için:

benzer ürün,
alternatif ürün,
uyumlu ürün

önerileri.

9.3 AI Ürün Arama

Doğal dil üzerinden ürün bulma.

Örneğin:

Geçen ay aldığım ürüne benzeyen ve stokta olan alternatifleri göster.

9.4 AI Sipariş Asistanı

Kullanıcı doğal dil ile:

Geçen siparişimi tekrar hazırla.

veya:

Bu ay sevk edilmeyen siparişlerimi göster.

gibi işlemler gerçekleştirebilir.

9.5 Akıllı Tekrar Sipariş

Geçmiş satın alma davranışlarından:

yeniden sipariş zamanı,
sık alınan ürünler,
önerilen miktar

gibi öneriler üretilebilir.

9.6 Online Ödeme

Ödeme kuruluşları veya bankalarla entegrasyon.

Örneğin:

Açık Fatura
↓
Ödeme
↓
Ödeme Sağlayıcı
↓
Netsim Ödeme Kaydı

Bu özellik finansal ve güvenlik gereksinimleri nedeniyle ayrı proje fazı olarak ele alınmalıdır.

9.7 Kargo Takip Entegrasyonu

Kargo veya lojistik firmaları ile entegrasyon.

Kullanıcı:

takip numarası,
gönderi durumu,
tahmini teslimat

görebilir.

9.8 Gelişmiş Analitik

Bayi tarafında:

satın alma trendleri,
ürün bazlı harcama,
dönemsel siparişler,
finansal analizler

gibi raporlar.

9.9 Satış Temsilcisi Paneli

Satış temsilcilerinin kendi müşteri portföylerini yönetebileceği ayrı çalışma alanı.

9.10 Yönetim Paneli

Satıcı firmanın B2B'ye özgü ayarlarını yönetebileceği alan.

Örneğin:

B2B kullanıcıları,
erişimler,
duyurular,
ürün web içerikleri,
B2B konfigürasyonları.
9.11 White-Label

Farklı Netsim müşterilerinin portalı kendi markalarıyla kullanabilmesi.

9.12 Multi-Tenant SaaS

Uzun vadede birden fazla firmanın aynı B2B ürün altyapısını izole tenant yapısıyla kullanabilmesi.

9.13 Farklı ERP Entegrasyonları

İlk ürün Netsim merkezlidir.

Ancak uzun vadede domain mimarisi uygun tutulursa farklı ERP connector'ları değerlendirilebilir.

Bu mevcut projenin kısa vadeli kapsamı değildir.

10. Varsayımlar

Proje başlangıcında aşağıdaki varsayımlar kabul edilmektedir.

10.1 Netsim ERP Ana Ticari Veri Kaynağıdır

Temel ticari gerçeklik Netsim'den gelir.

Örneğin:

ürün,
stok,
fiyat,
cari,
sipariş,
irsaliye,
fatura,
finans.
10.2 B2B ERP'yi Kopyalamaz

B2B yalnızca kullanıcı deneyimi için gerekli verileri işler veya geçici olarak saklar.

10.3 Ürün Master Datası Netsim'den Gelir

B2B temel ürün kimliğini kendi başına oluşturmaz.

Web'e özgü:

görsel,
açıklama,
sıralama,
öne çıkarma

gibi bilgiler gerektiğinde B2B tarafında tutulabilir.

10.4 Cari Master Datası Netsim'den Gelir

Cari ticari hesabının ana kaynağı Netsim'dir.

B2B kullanıcısı ile cari arasında mapping oluşturulur.

10.5 Sepet B2B Tarafında Tutulur

Sepet henüz Netsim siparişi değildir.

Kullanıcı siparişi kesinleştirdiğinde Netsim'e ticari işlem oluşturulur.

10.6 Favoriler B2B Tarafında Tutulur

Favoriler ERP ticari verisi değildir.

Kullanıcı deneyimi verisidir.

10.7 Sipariş Netsim'de Kesinleşir

B2B'nin sipariş oluşturuldu mesajını verebilmesi için Netsim tarafında siparişin başarıyla oluşturulduğu doğrulanmalıdır.

10.8 Kullanıcı B2B Kimliğine Sahiptir

Bayi kullanıcısının Netsim Nuke kullanıcısı olması zorunlu değildir.

10.9 Veri Yetkisi Cari Bazlıdır

External kullanıcının ticari verilere erişimi bağlı olduğu cari hesaplarla sınırlandırılır.

10.10 Müşteri Bazlı Ticari Kurallar Olabilir

Fiyat, limit, ödeme veya sipariş davranışı müşteriye göre farklılık gösterebilir.

Mimari bu farklılıkları desteklemelidir.

11. Teknik ve Ürün Kısıtları

Proje aşağıdaki potansiyel kısıtlar dikkate alınarak geliştirilmelidir.

11.1 Netsim Sürüm Farklılıkları

Farklı Netsim müşterileri farklı:

N4 sürümü,
database yapısı,
parametrik yapı,
geliştirme paketi

kullanıyor olabilir.

Bu nedenle tek bir müşteri database yapısı bütün Netsim kurulumlarını temsil ediyor kabul edilmemelidir.

11.2 Müşteri Özelleştirmeleri

Netsim kurulumları müşteriye özel:

alan,
tablo,
workflow,
trigger,
işlem kodu

içerebilir.

B2B entegrasyonu bu farklılıklardan etkilenebilir.

11.3 İşlem Kodu Farklılıkları

Sipariş, teklif, irsaliye veya diğer belgelerde kullanılan işlem kodları firmaya göre değişebilir.

Bunların uygulama içerisinde hard-code edilmemesi gerekir.

11.4 Firebird Performansı

Netsim verisinin tutulduğu Firebird yapısında:

büyük tablolar,
yoğun sorgular,
indeks eksiklikleri,
eşzamanlı kullanıcı yükü

performansı etkileyebilir.

B2B'nin ERP database'ine gereksiz yük bindirmemesi gerekir.

11.5 Güncellik ve Cache Dengesi

Her veri aynı güncellik ihtiyacına sahip değildir.

Örneğin ürün açıklaması cache edilebilirken:

stok
fiyat
kredi limiti
cari bakiye

gibi bilgiler daha güncel olmalıdır.

11.6 İnternet ve Ağ Erişimi

Bazı Netsim müşterilerinin ERP altyapısı:

şirket içi ağda,
VPN arkasında,
firewall arkasında

çalışabilir.

B2B'nin Netsim'e güvenli bağlantısı müşteri altyapısına göre değişebilir.

11.7 ERP Availability

Netsim veya müşteri altyapısı geçici olarak erişilemez hale gelebilir.

Bu durumda B2B:

anlamlı hata göstermeli,
teknik hata mesajını kullanıcıya taşımamalı,
kritik write işlemlerini başarılı kabul etmemelidir.
11.8 Veri Kalitesi

B2B'nin kullanıcı deneyimi Netsim'deki master data kalitesinden etkilenir.

Örneğin:

hatalı ürün adı,
eksik kategori,
yanlış birim,
eski cari bilgisi

B2B tarafında da sorun oluşturabilir.

Portal bütün kötü ERP datasını otomatik olarak düzeltebilecek bir master data sistemi değildir.

11.9 Yetkilendirme Güvenliği

Frontend'de görünmeyen veri kullanıcı tarafından API üzerinden de erişilemez olmalıdır.

Tüm veri kapsamı backend'de doğrulanmalıdır.

12. Kapsam Dışı ile Future Scope Arasındaki Fark

Bu iki kavram karıştırılmamalıdır.

Out of Scope

Ürünün doğası gereği B2B'nin yapmaması gereken işlerdir.

Örneğin:

Üretim reçetesi
MRP
Muhasebe fişi
Bordro

Bunları ileride B2B'ye eklemek genel olarak hedeflenmez.

Future Scope

B2B ürününün doğal parçası olan fakat ilk sürümlerde yapılmayacak özelliklerdir.

Örneğin:

AI asistan
ATP
Online ödeme
Akıllı muadil
Kargo entegrasyonu
13. Scope Creep Kontrolü

Netsim çok geniş bir ERP olduğu için proje sırasında sürekli yeni özellik ekleme riski vardır.

Her yeni talepte aşağıdaki sorular sorulmalıdır:

1. Bu özellik B2B kullanıcısının problemi mi?

2. Müşteri bunu portal üzerinden gerçekten kullanacak mı?

3. ERP'de bulunması dışında B2B'ye eklemek için bir neden var mı?

4. Mevcut çekirdek akışı iyileştiriyor mu?

5. MVP için gerçekten gerekli mi?

6. Future Scope'a bırakılabilir mi?

Bu sorular net cevaplanmadan özellik MVP kapsamına eklenmemelidir.

14. MVP Başarı Sınırı

İlk sürümün başarılı kabul edilmesi için Netsim'in bütün özelliklerinin web üzerinde bulunması gerekmez.

MVP şu senaryoyu güvenilir şekilde tamamlayabiliyorsa çekirdek amacını gerçekleştirmiş olur:

Kullanıcı giriş yaptı
        ↓
Firmasını seçti
        ↓
Ürün buldu
        ↓
Kendi fiyatını gördü
        ↓
Stok durumunu gördü
        ↓
Sepete ekledi
        ↓
Sipariş verdi
        ↓
Sipariş Netsim'de oluştu
        ↓
Kullanıcı siparişini B2B'den takip etti

Bu akış projenin ilk gerçek vertical slice'ı olarak kabul edilmelidir.

15. Genel Faz Planı

Projenin ürün kapsamını kabaca şu şekilde ilerletmek mantıklıdır:

FAZ 1
B2B Commerce Core

Authentication
Company
Products
Pricing
Inventory
Cart
Orders
Order Tracking

↓

FAZ 2
Commercial Visibility

Quotes
Shipments
Dispatch Notes
Invoices
Finance
Favorites
Quick Order
Repeat Order

↓

FAZ 3
Customer Experience

Notifications
Campaigns
Advanced Search
User Management
Reporting

↓

FAZ 4
Smart B2B

ATP
Online Payment
Shipping Integration
AI Search
AI Assistant
Smart Alternatives
Smart Reorder

↓

FAZ 5
Platform

B2B Admin
Sales Representative Portal
White Label
Multi-Tenant SaaS
Potential Additional ERP Connectors
16. Kapsamın Tek Cümlelik Tanımı

Netsim B2B'nin kapsamı, Netsim ERP'deki müşteriyle ilişkili ürün, fiyat, stok, teklif, sipariş, lojistik ve finans süreçlerini modern bir self-service B2B portalına taşımak; firma içi ERP yönetim, üretim, muhasebe ve sistem konfigürasyon süreçlerini ise ERP içerisinde bırakmaktır.

Bu dosyada özellikle MVP ile genel ürün kapsamını ayırmamız önemli oldu. Şu anda ürün vizyonumuz geniş ama ilk geliştirme hedefimiz çok daha net: Login → Firma → Ürün → Fiyat/Stok → Sepet → Sipariş → Sipariş Takibi. Bu omurga çalışmadan teklif, AI, ATP veya gelişmiş rapor tarafına geçmemek proje yönetimi açısından daha sağlıklı olur.