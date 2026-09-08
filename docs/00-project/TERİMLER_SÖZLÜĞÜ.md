# Terimler Sözlüğü

Bu doküman, Netsim B2B projesinde kullanılan ERP, Netsim, B2B ve yazılım geliştirme terimlerinin ortak sözlüğüdür.

Amaç; geliştiricilerin, ERP danışmanlarının, proje yöneticilerinin ve diğer iş birimlerinin aynı kavramları aynı anlamda kullanmasını sağlamaktır.

> **Not:** Bu doküman kavramları açıklar. Netsim veritabanındaki tabloların, kolonların ve ilişkilerin teknik detayları `NETSIM_TABLE_MAP.md` ve `ENTITY_RELATIONSHIPS.md` dosyalarında tutulmalıdır.

---

# 1. Genel ERP ve B2B Terimleri

## ERP

### Tanım

**Enterprise Resource Planning (Kurumsal Kaynak Planlama)**; bir işletmenin satış, satınalma, stok, finans, muhasebe, üretim, insan kaynakları ve benzeri operasyonlarını ortak bir veri modeli üzerinde yönetmesini sağlayan kurumsal yazılım sistemidir.

### Netsim Karşılığı

Bu projede ERP sistemi temel olarak **Netsim N4/T4** ürün ailesidir.

### B2B Karşılığı

B2B uygulaması ERP'nin yerine geçmez. ERP'deki ticari verileri daha sade ve müşteri/bayi odaklı bir web arayüzü üzerinden kullanıma açar.

---

## B2B

### Tanım

**Business to Business**, bir işletmenin başka bir işletme ile yürüttüğü ticari ilişkiyi ifade eder.

Sipariş verme, teklif alma, fiyat görüntüleme, cari hesap takibi ve ödeme gibi işlemler B2B sürecinin parçalarıdır.

### Netsim Karşılığı

Netsim ürün ailesinde Nuke B2B, işletmeden işletmeye gerçekleştirilen ticari işlemlere yönelik web altyapısıdır.

### B2B Uygulamasındaki Karşılığı

Bu projede B2B, Netsim ERP kullanan firmanın bayileri veya kurumsal müşterileri için geliştirilecek modern web portalını ifade eder.

---

## Netsim N4

### Tanım

Netsim'in kurumsal ERP çözümüdür.

### Netsim Karşılığı

Cari, stok, satış, satınalma, üretim, finans ve diğer ERP süreçlerinin ana yönetim sistemlerinden biridir.

### B2B Karşılığı

B2B uygulamasındaki ticari verilerin önemli bölümünün **Source of Truth** kaynağıdır.

---

## Netsim T4

### Tanım

Netsim ürün ailesinde yer alan ticari/ERP çözümüdür.

### B2B Karşılığı

B2B entegrasyon mimarisi yalnızca tek bir Netsim kurulumuna sıkı şekilde bağlanmamalı; desteklenecek Netsim ürün ve sürümleri ayrıca tanımlanmalıdır.

---

## Nuke

### Tanım

Netsim'in web tabanlı ticari operasyonları için kullandığı modül ailesidir.

Nuke altında site, kullanıcı, web ürünleri, B2B/B2C ve sanal POS gibi fonksiyonlar bulunabilir.

### Netsim Karşılığı

Netsim N4/T4 ile web tarafındaki ticari işlemler arasında kullanılan mevcut web altyapısıdır.

### B2B Karşılığı

Yeni geliştirilecek B2B uygulamasında Nuke yapıları bir entegrasyon ve mevcut veri kaynağı olarak değerlendirilebilir. Ancak yeni uygulamanın doğrudan Nuke arayüzünü kopyalaması zorunlu değildir.

---

## Nuke B2B

### Tanım

Netsim'de işletmeler arası ticari işlemlere yönelik Nuke fonksiyonudur.

### B2B Karşılığı

Yeni projenin fonksiyonları tasarlanırken mevcut Netsim B2B yetenekleri için önemli bir referans noktasıdır.

---

## Nuke User / Nuke Kullanıcısı

### Tanım

Netsim Nuke sitesine giriş yapabilen kullanıcıdır.

### Netsim Karşılığı

Nuke kullanıcı bilgileri cari kartındaki yetkililer ile ilişkilendirilebilir. Kullanıcı adı, şifre, site ve rol gibi bilgiler üzerinden web erişimi sağlanabilir.

### B2B Karşılığı

Yeni B2B uygulamasında kullanıcı hesabı Netsim'deki:

* cari,
* yetkili kişi,
* Nuke kullanıcısı

ile ilişkilendirilebilir.

Ancak yeni B2B uygulamasının kendi kimlik doğrulama sistemi bulunması da mümkündür.

---

# 2. Cari ve Finans Terimleri

## Cari

### Tanım

İşletmenin ticari veya mali ilişki içerisinde bulunduğu gerçek veya tüzel kişi/kurumdur.

Örneğin:

* müşteri,
* bayi,
* tedarikçi,
* satıcı,
* kurum.

### Netsim Karşılığı

Cari yapıları Netsim içerisinde cari tipleri ve cari kartları ile yönetilir.

Veritabanı seviyesinde temel referanslardan biri `CARI_NO` değeridir.

### B2B Karşılığı

B2B kullanıcısının bağlı olduğu firma/müşteri hesabını temsil eder.

Örneğin bir kullanıcı sisteme giriş yaptığında:

`B2B User → Cari → Siparişler / Teklifler / Finans`

ilişkisi kurulabilir.

---

## Cari Tipi

### Tanım

Carilerin işlevlerine veya sınıflarına göre gruplandırılmasını sağlayan tanımdır.

Örneğin:

* bayi,
* müşteri,
* tedarikçi,
* kamu kurumu,
* bireysel müşteri.

### Netsim Karşılığı

Cari kart oluşturulmadan önce ilgili cari tipi tanımlanır ve cari kart bu tipe bağlı oluşturulur.

### B2B Karşılığı

Hangi carilerin B2B sistemine erişebileceğini veya hangi ticari kuralların uygulanacağını belirlemek için kullanılabilir.

---

## Cari Kart

### Tanım

Bir cari hakkındaki temel ticari ve finansal bilgilerin tutulduğu ana kayıttır.

### Netsim Karşılığı

Cari kart içerisinde örneğin:

* cari kodu,
* cari adı/unvanı,
* vergi bilgileri,
* ödeme koşulları,
* tahsilat biçimi,
* kredi/limit bilgileri,
* bloke durumu,
* sevkiyat tercihleri,
* iletişim bilgileri

tutulabilir.

### B2B Karşılığı

B2B müşteri hesabının ERP tarafındaki ana kaydıdır.

Ürün fiyatlandırması, sipariş, teklif, finans ve yetkilendirme işlemlerinin büyük bölümü ilgili cari üzerinden yürütülür.

---

## Ana Cari

### Tanım

Birden fazla cari kaydının organizasyonel olarak bağlanabildiği üst cari yapısını ifade eder.

### B2B Karşılığı

İleride merkez firma ve alt şubeler/bayiler gibi yapılarda veri erişim hiyerarşisi oluşturmak için kullanılabilir.

---

## Bayi

### Tanım

Ürün veya hizmeti üretici, distribütör veya ana firmadan alarak kendi ticari faaliyetinde kullanan ya da yeniden satan işletmedir.

### Netsim Karşılığı

Bayi genellikle bir **cari kart** olarak temsil edilir. Cari kart üzerinde bayi türü gibi bilgiler bulunabilir.

### B2B Karşılığı

Portalın ana kullanıcı kuruluşlarından biridir.

---

## Müşteri

### Tanım

İşletmeden ürün veya hizmet satın alan gerçek veya tüzel kişidir.

### Netsim Karşılığı

Genellikle alıcı niteliğindeki bir cari kart ile temsil edilir.

### B2B Karşılığı

Bayi ve müşteri kavramları uygulamanın ticari modeline göre aynı kullanıcı grubunda veya farklı segmentlerde değerlendirilebilir.

---

## Cari Hareket

### Tanım

Cari hesabın borç veya alacak bakiyesini etkileyen finansal işlemdir.

Örneğin:

* satış faturası,
* tahsilat,
* ödeme,
* devir,
* virman,
* finansal düzeltme.

### Netsim Karşılığı

Cari hareketlerinin önemli veri kaynaklarından biri `CARIISLM` yapısıdır.

### B2B Karşılığı

Cari ekstre, bakiye, vadesi geçen borç ve ödeme geçmişi gibi ekranların temel veri kaynağıdır.

---

## Cari Bakiye

### Tanım

Belirli bir anda cari hesabın borç ve alacak hareketleri sonucunda oluşan net finansal durumudur.

### Netsim Karşılığı

Netsim cari hareket ve bakiye tipi yapıları üzerinden hesaplanır/takip edilir.

### B2B Karşılığı

Dashboard ve Finans ekranlarında müşterinin güncel hesap durumunu ifade eder.

> Cari bakiyenin kesin hesaplama yöntemi B2B uygulamasında yeniden tahmin edilmemeli; Netsim'in bakiye mantığı ile uyumlu olmalıdır.

---

## Bakiye Tipi

### Tanım

Cari hareketlerin farklı amaçlara göre ayrı bakiyeler altında takip edilmesini sağlayan yapıdır.

### Netsim Karşılığı

Cari kart üzerinde bakiye tipleri kullanılabilir. Netsim tarafından genel işlem bakiyesi gibi bakiye türleri oluşturulabilir.

### B2B Karşılığı

Örneğin yalnızca web/B2B işlemlerinin ayrı bir bakiye tipi üzerinden takip edilmesi gerektiğinde kullanılabilir.

---

## Borç

### Tanım

Cari hesabın işletmeye karşı yükümlülüğünü artıran finansal tutardır.

### B2B Karşılığı

Finans ekranındaki cari hesap ve ekstre bilgilerinin parçalarından biridir.

---

## Alacak

### Tanım

Borç kavramının karşı tarafındaki cari hesap hareketidir.

### B2B Karşılığı

Cari hesap ekstresi ve bakiye hesabının oluşturulmasında kullanılır.

---

## Cari Limit Grubu

### Tanım

Carilerin belirli limit ve risk kuralları altında sınıflandırılmasını sağlayan yapıdır.

### Netsim Karşılığı

Cari kart üzerinde limit grubu seçilebilir ve carinin borçlanma/alacaklanma limit ve risk yapısı bu tanımlarla yönetilebilir.

### B2B Karşılığı

Sipariş checkout aşamasında müşterinin sipariş verebilme kapasitesinin kontrol edilmesinde kullanılabilir.

---

## Risk

### Tanım

Cari ile yapılan ticari işlemler sonucunda işletmenin maruz kaldığı finansal yükümlülük veya kredi riskidir.

### Netsim Karşılığı

Cari limit ve bakiye sistemleriyle birlikte değerlendirilir.

### B2B Karşılığı

Yeni sipariş kabul edilmeden önce gerçekleştirilebilecek finansal kontrollerden biridir.

---

## Risk Limiti / Kredi Limiti

### Tanım

Cari için kabul edilen maksimum finansal risk veya borçlanma sınırıdır.

### B2B Karşılığı

Örneğin:

`Kullanılabilir Limit = Tanımlı Limit - Kullanılmış Risk`

gibi bir gösterim üretilebilir.

Kesin hesaplama Netsim'in mevcut risk/limit sistemine göre yapılmalıdır.

---

## Kullanılabilir Limit

### Tanım

Müşterinin mevcut risk durumu dikkate alındıktan sonra yeni ticari işlemler için kullanabileceği kalan kredi kapasitesidir.

### B2B Karşılığı

Dashboard veya checkout ekranında gösterilebilir.

Bu değer genellikle hesaplanan bir B2B göstergesidir.

---

## Vade

### Tanım

Bir borcun veya ticari işlemin ödenmesi gereken tarih veya süreyi ifade eder.

### Netsim Karşılığı

Cari ve alış/satış işlemlerinde vade tarihleri ve ödeme koşulları takip edilebilir.

### B2B Karşılığı

Fatura, teklif, sipariş ve finans ekranlarında kullanılır.

---

## Vade Tarihi

### Tanım

Bir finansal yükümlülüğün ödeme için son tarihidir.

### B2B Karşılığı

Vadesi geçen borç ve yaklaşan ödeme hesaplarının temel girdisidir.

---

## Vadesi Geçen Tutar

### Tanım

Vade tarihi geçmiş ancak henüz tamamen kapanmamış finansal yükümlülüklerin toplamıdır.

### B2B Karşılığı

Dashboard ve Finans ekranındaki ana KPI'lardan biridir.

Basitçe tüm eski faturaların toplamı alınmamalıdır; kısmi tahsilat ve kapatma durumları dikkate alınmalıdır.

---

## Vade Farkı

### Tanım

Ödemenin belirlenen vadeden önce veya sonra yapılması nedeniyle oluşabilecek fiyat/tutar farkıdır.

### Netsim Karşılığı

Cari tipi, cari kart ve ticari işlemlerde vade farkı parametreleri bulunabilir.

### B2B Karşılığı

Fiyatlandırma veya ödeme koşullarının kullanıcıya gösterilmesinde kullanılabilir.

---

## Tahsilat

### Tanım

İşletmenin müşteriden para veya başka bir ödeme aracı ile alacağını tahsil etmesidir.

### Netsim Karşılığı

Cari finans işlemleriyle ilişkilidir.

### B2B Karşılığı

Ödemeler ekranından gerçekleştirilen veya ERP'den alınan müşteri ödeme hareketlerini ifade eder.

---

## Ödeme Biçimi

### Tanım

Bir ticari işlemin hangi ödeme koşuluyla gerçekleştirileceğini belirtir.

Örneğin:

* peşin,
* kredi kartı,
* havale,
* 30 gün vadeli,
* DBS.

### Netsim Karşılığı

Cari kart ve alış/satış işlemleri ile ilişkilendirilebilir.

### B2B Karşılığı

Sepet/checkout sırasında müşteriye uygulanacak ödeme koşuludur.

---

## Bloke Cari

### Tanım

Belirli ticari işlemleri gerçekleştirmesi sistem tarafından engellenmiş cari hesabıdır.

### Netsim Karşılığı

Cari kart üzerinde hangi işlem gruplarında carinin bloke olacağı tanımlanabilir.

### B2B Karşılığı

Sipariş oluşturma gibi işlemler öncesinde backend tarafından kontrol edilmesi gereken önemli bir iş kuralıdır.

---

# 3. Ürün ve Stok Terimleri

## Stok

### Tanım

İşletmenin ticari veya operasyonel olarak takip ettiği mal, ürün, hammadde, yarı mamul veya benzeri kalemdir.

### Netsim Karşılığı

Stok kayıtları stok kartları ve stok hareketleri üzerinden takip edilir.

### B2B Karşılığı

B2B ürün kataloğunda kullanıcıya sunulan ticari ürünün ERP tarafındaki karşılığıdır.

---

## Stok Kartı

### Tanım

Bir stok kaleminin temel özelliklerini tutan ana kayıttır.

### Netsim Karşılığı

Stok kartında örneğin:

* stok kodu,
* stok adı,
* stok tipi,
* birim,
* varyant ayarları,
* marka,
* web aktif bilgisi,
* satılabilirlik,
* açıklamalar,
* görseller

bulunabilir.

### B2B Karşılığı

Ürün kataloğundaki `Product` varlığının temel ERP kaynağıdır.

---

## Stok Tipi

### Tanım

Stok kartlarının ortak özelliklerine veya kullanım amaçlarına göre gruplandırılmasını sağlayan tanımdır.

### Netsim Karşılığı

Stok kartları bir stok tipine bağlı olarak oluşturulabilir.

### B2B Karşılığı

Bazı kurulumlarda ürün kategorisi veya ürün sınıflandırması için kullanılabilir.

Ancak ERP stok tipi ile web kategorisi her zaman birebir aynı kavram değildir.

---

## Stok Tip Varyantı

### Tanım

Bir stok tipine bağlı ürünlerin varyant yapısının ve gerektiğinde ürün içeriğinin ortak tanımıdır.

### Netsim Karşılığı

Netsim üretim yapısında ürünün farklı çeşitlerinde kullanılacak malzemelerin tanımlanmasında kullanılabilir.

### B2B Karşılığı

Doğrudan kullanıcıya gösterilecek varyanttan çok ERP'deki varyant modelinin altyapı tanımıdır.

---

## Stok Kart Varyantı / Stok Varyantı

### Tanım

Belirli bir stok kartının farklı çeşidini ifade eder.

Örneğin:

* Siyah / XL,
* Alüminyum Ayak,
* Sabit Kolçak,
* 128 GB.

### Netsim Karşılığı

Stok kartına bağlı olarak varyant kaydı oluşturulabilir.

### B2B Karşılığı

Kullanıcının ürün detayında seçtiği satın alınabilir ürün seçeneğidir.

---

## Varyant

### Tanım

Bir ürünün aynı temel ürün altında bulunan farklı çeşididir.

### B2B Karşılığı

Ürün seçimi sırasında:

`Ürün + Varyant + Miktar`

kombinasyonunun doğru belirlenmesini sağlar.

---

## Stok Yeri

### Tanım

Stoğun fiziksel veya mantıksal olarak bulunduğu konumu ifade eder.

### Netsim Karşılığı

Stok Yeri Tanımları ile depo veya operasyonel stok alanları temsil edilebilir.

### B2B Karşılığı

Depo bazlı stok miktarı ve teslimat hesaplarında kullanılabilir.

---

## Depo

### Tanım

Stokların fiziksel olarak saklandığı alanın iş kavramıdır.

### Netsim Karşılığı

Projeye göre Netsim'deki stok yeri yapıları depo kavramını temsil edebilir.

### B2B Karşılığı

Örneğin:

* Ankara Depo: 25
* İstanbul Depo: 10

gibi stok görünürlüğünde kullanılabilir.

---

## Raf

### Tanım

Stok yeri içerisindeki daha detaylı fiziksel konum bilgisidir.

### B2B Karşılığı

Genellikle bayi portalındaki son kullanıcıya gösterilmesine gerek yoktur; lojistik ve depo entegrasyonunda kullanılabilir.

---

## Fiziksel Stok / On-Hand Stock

### Tanım

İşletmenin ilgili stok yeri veya depoda fiziksel olarak sahip olduğu stok miktarıdır.

### B2B Karşılığı

Doğrudan satılabilir stok ile aynı olmak zorunda değildir.

---

## Rezerv

### Tanım

Belirli bir talep, sipariş veya operasyon için ayrılmış stok miktarıdır.

### Netsim Karşılığı

Netsim stok yapısında rezervasyonla ilgili kurallar ve stok hareketleri bulunabilir.

### B2B Karşılığı

Bir ürünün fiziksel olarak depoda bulunmasına rağmen başka siparişler için ayrılmış kısmını ifade edebilir.

---

## Satılabilir Stok / Available Stock

### Tanım

Yeni B2B siparişlerinde kullanılabilecek gerçek stok miktarıdır.

### B2B Karşılığı

Genel kavramsal yaklaşım:

`Satılabilir Stok = Fiziksel Stok - Kullanılamayan/Rezerve Stok`

Ancak kesin Netsim formülü doğrulanmadan uygulamada bu formül sabitlenmemelidir.

---

## Stok Hareketi

### Tanım

Stoğun miktarını veya durumunu etkileyen giriş, çıkış, transfer, rezervasyon veya benzeri işlemdir.

### Netsim Karşılığı

Stok işlem ve hareket yapılarında takip edilir.

### B2B Karşılığı

Stok miktarı, sevk edilen miktar ve sipariş kalan miktarı gibi hesapların kaynağı olabilir.

---

## Birim

### Tanım

Stok miktarının hangi ölçü biriminde ifade edildiğini belirtir.

Örneğin:

* adet,
* metre,
* kilogram,
* paket.

### B2B Karşılığı

Ürün miktarı ve fiyatın kullanıcıya doğru gösterilmesi için gereklidir.

---

## Lot

### Tanım

Aynı ürünün belirli üretim veya tedarik partisini tanımlayan takip bilgisidir.

### B2B Karşılığı

Standart ürün kataloğunda her zaman gösterilmesi gerekmez; izlenebilirlik gereken sektörlerde sevkiyat detayında kullanılabilir.

---

## Kalite

### Tanım

Stok kaleminin belirli kalite sınıfı veya kalite durumunu temsil eden ERP bilgisidir.

### B2B Karşılığı

Sektöre göre ürün seçimi veya stok uygunluğu üzerinde etkili olabilir.

---

## Marka

### Tanım

Ürünün ticari markasıdır.

### B2B Karşılığı

Ürün listesi, filtreleme ve ürün detay ekranında kullanılabilir.

---

## Ürün Hattı

### Tanım

Benzer ürünlerin aynı ürün ailesi veya ticari hat altında gruplandırılmasıdır.

### B2B Karşılığı

Ürün navigasyonu ve filtreleme yapısında kullanılabilir.

---

## Web Aktif

### Tanım

Bir ERP kaydının web kanalında kullanılabilir/gösterilebilir olup olmadığını belirleyen kontroldür.

### Netsim Karşılığı

Stok ve bazı cari tanımlarında web kullanımına yönelik aktiflik ayarları bulunabilir.

### B2B Karşılığı

ERP'deki her stok kartının otomatik olarak B2B ürün kataloğuna çıkmasını önleyen filtrelerden biridir.

---

## Satılabilirlik

### Tanım

Bir stok kartının ticari satış işlemlerinde kullanılabilme durumudur.

### B2B Karşılığı

Ürünün B2B üzerinden siparişe eklenip eklenemeyeceğinin belirlenmesinde kullanılabilir.

---

# 4. Satış, Teklif ve Sipariş Terimleri

## Teklif

### Tanım

Bir ürün veya hizmetin belirli fiyat, miktar, ödeme ve teslimat koşullarıyla müşteriye sunulduğu ticari belgedir.

### B2B Karşılığı

Tekliflerim ekranında müşterinin görüntülediği ticari fiyat önerisidir.

---

## Verilen Teklif

### Tanım

İşletmenin müşterisine ürün veya hizmet satışı için verdiği tekliftir.

### Netsim Karşılığı

Satış İşlemleri içerisindeki **Verilen Teklif** işlemidir.

Verilen teklif daha sonra alınan sipariş ve satış işlemine dönüştürülebilir.

### B2B Karşılığı

`Tekliflerim` ekranının temel belge türüdür.

---

## Alınan Teklif

### Tanım

İşletmenin bir tedarikçi veya başka bir ticari taraftan aldığı tekliftir.

### B2B Karşılığı

Müşteri/bayi portalının standart satış senaryosunda genellikle gösterilmez.

---

## Sipariş

### Tanım

Belirli ürün veya hizmetlerin belirli miktar ve koşullarla satın alınması/satılması için oluşturulan ticari taleptir.

---

## Alınan Sipariş

### Tanım

Müşterinin işletmeye verdiği satış siparişidir.

### Netsim Karşılığı

Satış İşlemleri altındaki Alınan Sipariş yapısıdır.

Cari, stok, varyant, miktar, birim fiyat ve teslimat bilgileri gibi veriler içerebilir.

### B2B Karşılığı

Müşteri B2B portalında checkout işlemini tamamladığında oluşması beklenen ERP siparişidir.

---

## Verilen Sipariş

### Tanım

İşletmenin tedarikçisine verdiği satınalma siparişidir.

### B2B Karşılığı

Standart müşteri/bayi portalında doğrudan kullanılmaz.

---

## Sipariş Başlığı / Order Header

### Tanım

Siparişin ortak bilgilerini tutan üst seviye kayıttır.

Örneğin:

* cari,
* sipariş tarihi,
* ödeme biçimi,
* teslim tarihi,
* genel toplam.

### Netsim Karşılığı

Projede alış/satış işlemlerinin header yapısı `ALSAASIL` ile ilişkilidir.

Ayrıntılı tablo bilgisi `NETSIM_TABLE_MAP.md` dosyasında tutulur.

---

## Sipariş Satırı / Order Line

### Tanım

Sipariş içerisindeki her bir ürün/hizmet kalemidir.

### Netsim Karşılığı

Projede alış/satış satır yapısı `ALSADETA` ile ilişkilidir.

### B2B Karşılığı

Örneğin:

`10 × Switch 24 Port`

tek bir sipariş satırıdır.

---

## Sipariş Durumu

### Tanım

Siparişin ticari ve operasyonel yaşam döngüsündeki mevcut aşamasıdır.

### B2B Karşılığı

Kullanıcıya örneğin:

* Onay Bekliyor
* Hazırlanıyor
* Kısmi Sevk
* Sevk Edildi
* Tamamlandı
* İptal

şeklinde gösterilebilir.

Bu değer doğrudan tek bir ERP kolonundan gelmek zorunda değildir; birden fazla Netsim verisinden türetilebilir.

---

## Kısmi Sevkiyat

### Tanım

Siparişteki ürünlerin tamamının değil yalnızca belirli bir bölümünün sevk edilmesidir.

### B2B Karşılığı

Örneğin:

* Sipariş: 100 adet
* Sevk: 60 adet
* Kalan: 40 adet

---

## Kalan Sipariş Miktarı

### Tanım

Henüz sevk edilmemiş sipariş miktarıdır.

### B2B Karşılığı

Genel yaklaşım:

`Kalan = Sipariş Miktarı - Geçerli Sevk Miktarı`

İade ve ters stok hareketleri gibi durumlar ayrıca değerlendirilmelidir.

---

# 5. Lojistik ve Belge Terimleri

## Sevkiyat

### Tanım

Sipariş edilen ürünlerin müşteriye gönderilmesi amacıyla işletmeden fiziksel olarak çıkarılması sürecidir.

### Netsim Karşılığı

Stok işlem ve sevkiyat kayıtlarıyla ilişkilidir.

### B2B Karşılığı

Siparişin hangi ürünlerinin ne zaman gönderildiğini ifade eder.

---

## İrsaliye

### Tanım

Malların sevk edildiğini ve taşınan ürünleri belgeleyen ticari belgedir.

### B2B Karşılığı

`İrsaliyelerim` ekranında müşterinin sevkiyat belgelerini görüntülemesini sağlar.

---

## e-İrsaliye

### Tanım

İrsaliyenin elektronik belge standartlarına uygun dijital biçimidir.

### Netsim Karşılığı

Cari kartta e-İrsaliye kullanıcısı gibi ayarlar bulunabilir ve Netsim elektronik belge süreçleriyle ilişkilidir.

### B2B Karşılığı

Kullanıcı ilgili elektronik belgeyi görüntüleyebilir veya indirebilir.

---

## Fatura

### Tanım

Satılan ürün veya hizmetin miktarını, fiyatını, vergilerini ve toplam bedelini gösteren ticari belgedir.

### B2B Karşılığı

`Faturalarım` ekranında müşterinin kendi faturalarını görüntülemesini sağlar.

---

## e-Fatura

### Tanım

Faturanın elektronik belge standartlarına uygun dijital biçimidir.

### Netsim Karşılığı

Cari kart üzerinde e-Fatura kullanıcısı ve elektronik fatura şablonu gibi ayarlar bulunabilir.

---

## Belge No

### Tanım

Sipariş, teklif, fatura veya irsaliye gibi ticari belgenin kullanıcı tarafından görülebilen numarasıdır.

### B2B Karşılığı

ERP internal ID değerleri yerine mümkün olduğunca kullanıcı arayüzünde belge numarası gösterilir.

---

## Referans No

### Tanım

Bir işlemin başka bir ticari belge veya dış sistem kaydıyla ilişkilendirilmesi için kullanılan referanstır.

### B2B Karşılığı

Kargo, müşteri sipariş numarası veya dış entegrasyon referanslarında kullanılabilir.

---

## Teslim Tarihi

### Tanım

Sipariş veya sipariş satırının müşteriye teslim edilmesinin planlandığı tarihtir.

### B2B Karşılığı

Sipariş ve ürün ekranlarının önemli kullanıcı bilgilerinden biridir.

---

## Nakliye Tipi

### Tanım

Ürünlerin hangi taşıma yöntemi veya lojistik modeliyle sevk edileceğini belirleyen tanımdır.

### B2B Karşılığı

Örneğin:

* Kargo
* Firma Aracı
* Müşteri Teslim Alacak

gibi seçeneklerin ERP karşılığı olabilir.

---

# 6. Netsim İşlem ve Organizasyon Terimleri

## İşlem Kodu

### Tanım

Netsim'de bir işlem veya tanım için kullanılan kısa koddur.

### Netsim Karşılığı

İşlem kodları kullanıcı tarafından tanımlanabilir ve kurulumdan kuruluma değişebilir.

Örneğin alınan sipariş için `ALISIP` benzeri bir kod kullanılabilir.

### B2B Karşılığı

B2B backend'i:

`ISLEM_KODU = 'ALISIP'`

gibi sabit kodlara bağımlı olmamalıdır.

İşlem kodları konfigürasyon üzerinden yönetilmelidir.

---

## İşlem Adı

### Tanım

Bir Netsim işleminin kullanıcı tarafından anlaşılabilen açıklayıcı adıdır.

Örneğin:

* Alınan Sipariş
* Verilen Teklif
* Satış
* Stok Çıkışı.

---

## İşlem Yönü

### Tanım

Ticari veya stok hareketinin sistem açısından giriş/çıkış, alış/satış gibi yön bilgisidir.

### B2B Karşılığı

Özellikle stok ve finans hesaplarında hangi hareketlerin toplama dahil edileceğinin belirlenmesinde önemlidir.

---

## İşlem Noktası

### Tanım

Firma veya şube altında tanımlanan organizasyonel/operasyonel alt birimdir.

### Netsim Karşılığı

Şube altındaki:

* departman,
* operasyon birimi,
* iş istasyonu

gibi yapıları temsil edebilir.

### B2B Karşılığı

Sipariş, stok, web sitesi veya sevkiyatın hangi operasyonel Netsim noktasında çalışacağını belirlemek için kullanılabilir.

---

## Firma

### Tanım

ERP'de işlem yapan ana tüzel veya organizasyonel yapıdır.

### B2B Karşılığı

Multi-company senaryosunda kullanıcının işlem yapmak istediği ana şirketi temsil edebilir.

---

## Şube

### Tanım

Firma altında faaliyet gösteren organizasyonel birimdir.

### B2B Karşılığı

Stok, teslimat, işlem noktası veya yetkilendirme açısından veri ayrımı oluşturabilir.

---

## Kayıt Durumu

### Tanım

Netsim kaydının sistem yaşam döngüsündeki durumudur.

Örneğin giriş, onay veya benzeri kayıt durumları bulunabilir.

### B2B Karşılığı

ERP'nin teknik kayıt durumunun kullanıcıya doğrudan gösterilmesi zorunlu değildir.

Backend bu durumu kullanıcı dostu bir B2B statüsüne dönüştürebilir.

---

## Onaylandı

### Tanım

Netsim'deki bir kaydın gerekli veri girişleri tamamlanarak işlem açısından kullanılabilir/onaylı duruma getirilmesini ifade eder.

### B2B Karşılığı

Sipariş veya teklif gibi belgelerin iş akışında önemli bir ERP durumudur.

---

## Kapanma / Kapanan İşlem

### Tanım

Bir ticari işlemin ilgili stok, alış/satış veya finansal yükümlülüklerinin tamamlanması sonucunda kapanmış sayılmasıdır.

### Netsim Karşılığı

Netsim'de işlemin farklı açılardan kapanma durumları bulunabilir.

### B2B Karşılığı

Örneğin siparişin tamamlanıp tamamlanmadığını belirleyen girdilerden biri olabilir.

Kesin alan davranışları SQL testleriyle doğrulanmalıdır.

---

## ALSA

### Tanım

**Bu proje içerisinde kullanılan teknik kısa addır.**

Netsim'deki alış/satış ticari işlem ailesini ifade etmek için kullanılır.

### Proje Karşılığı

Örneğin:

* `ALSAASIL` → alış/satış işlem başlığı,
* `ALSADETA` → alış/satış işlem satırı

gibi yapılarla ilişkilidir.

> `ALSA` tek başına mutlaka fiziksel bir veritabanı tablosu anlamına gelmez. Proje içerisinde alış/satış işlem ailesini anlatan kısa isim olarak kullanılmalıdır.

---

# 7. B2B İş Kuralları Terimleri

## ATP — Available to Promise

### Tanım

Müşteriye belirli bir tarihte gerçekten teslim edilebilecek ürün miktarını hesaplama yaklaşımıdır.

### B2B Karşılığı

Sadece mevcut stok göstermek yerine örneğin:

* 20 adet bugün,
* 30 adet 15 Eylül'de

şeklinde gerçek teslimat sözü üretmek için kullanılabilir.

### Netsim Karşılığı

Stok, rezerv, açık sipariş, satınalma ve üretim gibi ERP verilerinden beslenebilir.

ATP bu proje kapsamında hesaplanan bir B2B/planlama fonksiyonu olabilir.

---

## Backorder

### Tanım

Sipariş verilen miktarın mevcut stoktan fazla olması durumunda karşılanamayan kısmın açık sipariş olarak bekletilmesidir.

### Örnek

Sipariş: 50
Stok: 30

30 adet hemen sevk edilir.

20 adet **backorder** olarak bekler.

### B2B Karşılığı

Firma politikasına göre:

* izin verilebilir,
* tamamen engellenebilir,
* kullanıcı tercihine bırakılabilir.

---

## Checkout

### Tanım

Sepetin gerçek siparişe dönüştürülmeden önce doğrulandığı ve onaylandığı süreçtir.

### B2B Karşılığı

Checkout sırasında örneğin:

* ürün geçerliliği,
* fiyat,
* stok,
* cari bloke,
* risk limiti,
* ödeme koşulu,
* teslimat

yeniden kontrol edilir.

---

## Sepet / Cart

### Tanım

Kullanıcının henüz kesin sipariş haline getirmediği ürün seçimlerinin geçici listesidir.

### B2B Karşılığı

Sepet B2B uygulama verisidir.

### Netsim Karşılığı

Sepetin doğrudan `ALSAASIL` üzerinde yarım/taslak sipariş olarak tutulması zorunlu değildir.

Bu projede sepetin B2B veritabanında tutulması hedeflenmektedir.

---

## Siparişi Tekrarla / Reorder

### Tanım

Geçmiş bir siparişin ürün, varyant ve miktar bilgilerinin yeni sepete aktarılmasıdır.

### B2B Karşılığı

Eski fiyat doğrudan kopyalanmaz.

Yeni siparişte:

* güncel stok,
* güncel fiyat,
* güncel kampanya

yeniden hesaplanmalıdır.

---

# 8. Yazılım ve Entegrasyon Terimleri

## Source of Truth

### Tanım

Bir veri türü için doğru ve yetkili kabul edilen ana veri kaynağıdır.

### Proje Örneği

Netsim:

* cari,
* ürün,
* stok,
* teklif,
* sipariş

için Source of Truth olabilir.

B2B PostgreSQL:

* sepet,
* favori,
* destek talebi,
* kullanıcı tercihleri

için Source of Truth olabilir.

---

## Tenant

### Tanım

Aynı uygulama içerisinde verileri ve yetkileri diğer müşterilerden ayrılmış bağımsız organizasyonu ifade eder.

### B2B Karşılığı

Tenant kavramı projeye göre:

* Netsim firması,
* müşteri firma,
* bayi organizasyonu

olabilir.

Kesin tenant modeli mimari dokümanda tanımlanmalıdır.

---

## Multi-Tenant

### Tanım

Tek uygulama örneğinin birden fazla tenant'a hizmet verebildiği mimaridir.

### B2B Karşılığı

Birden fazla Netsim firması veya farklı müşteri kuruluşu aynı B2B platformunu kullanacaksa önem kazanır.

---

## ERP Adapter

### Tanım

B2B uygulamasının belirli bir ERP sistemi ile konuşmasını sağlayan entegrasyon katmanıdır.

### Proje Örneği

`NetsimAdapter`

aşağıdaki işlemleri gerçekleştirebilir:

* ürün oku,
* stok oku,
* fiyat bul,
* sipariş oluştur,
* cari bilgisi getir.

### Amaç

B2B domain kodunun doğrudan:

* `STOKKART`,
* `ALSAASIL`,
* `CARIISLM`

gibi Netsim tablo isimlerine bağımlı olmasını azaltmaktır.

---

## Integration Layer

### Tanım

B2B backend'i ile Netsim ERP arasındaki teknik entegrasyon katmanıdır.

### Sorumlulukları

* ERP bağlantısı,
* sorgular,
* veri dönüşümü,
* ERP hata yönetimi,
* Netsim'e özel iş kuralları.

---

## API

### Tanım

Frontend veya başka servislerin backend fonksiyonlarıyla kontrollü şekilde iletişim kurmasını sağlayan programlama arayüzüdür.

### Proje Karşılığı

Örneğin:

* Product API
* Cart API
* Quote API
* Order API
* Finance API.

---

## Endpoint

### Tanım

API içerisinde belirli bir fonksiyona erişmek için kullanılan adres ve HTTP metodudur.

### Örnek

`GET /api/v1/orders`

kullanıcının sipariş listesini döndüren endpoint olabilir.

---

## DTO — Data Transfer Object

### Tanım

Katmanlar veya servisler arasında veri taşımak için kullanılan sade veri modelidir.

### B2B Karşılığı

Netsim tablo yapıları doğrudan frontend'e gönderilmek yerine:

`ALSAASIL → OrderDto`

gibi kullanıcı/domaın odaklı modellere dönüştürülmelidir.

---

## Domain Model

### Tanım

Uygulamanın iş kavramlarını yazılım içerisinde temsil eden modeldir.

### Örnek

* Product
* Customer
* Cart
* Quote
* Order
* Shipment.

Domain model doğrudan ERP tablo şemasının kopyası olmak zorunda değildir.

---

## Repository

### Tanım

Uygulamanın veriye erişim detaylarını servis/domain katmanından ayıran yazılım bileşenidir.

### Örnek

`OrderRepository`

Netsim sipariş verilerini okuyabilir.

---

## Service

### Tanım

Belirli bir iş yeteneğini veya use-case'i uygulayan yazılım katmanıdır.

### Örnek

`OrderService`

sipariş listeleme, doğrulama veya tekrar sipariş işlemlerini yönetebilir.

---

## Cache

### Tanım

Sık kullanılan verilerin ana kaynağa tekrar tekrar sorgu göndermeden hızlı erişilebilmesi için geçici olarak saklanmasıdır.

### B2B Karşılığı

Örneğin ürün master verileri cache edilebilir.

Ancak:

* stok,
* fiyat,
* cari risk

gibi hızlı değişebilen verilerin cache süreleri dikkatli belirlenmelidir.

---

## Read Model

### Tanım

Verinin özellikle hızlı ve kullanıcı dostu biçimde okunması için hazırlanmış modelidir.

### B2B Karşılığı

Dashboard gibi bir ekran farklı Netsim tablolarından veri toplamak yerine optimize edilmiş bir read model veya cache kullanabilir.

---

## Write Model

### Tanım

Veri oluşturma veya değiştirme işlemlerinin uygulandığı iş modelidir.

### B2B Karşılığı

Netsim'e sipariş yazılması yalnızca tablo `INSERT` işlemi olarak görülmemeli; Netsim business logic'i dikkate alınmalıdır.

---

## Authentication

### Tanım

Sisteme erişmeye çalışan kullanıcının kim olduğunun doğrulanmasıdır.

### Örnek

* e-posta/şifre,
* SMS OTP,
* SSO.

---

## Authorization

### Tanım

Kimliği doğrulanan kullanıcının hangi verilere ve işlemlere erişebileceğinin belirlenmesidir.

### B2B Karşılığı

Örneğin kullanıcı yalnızca bağlı olduğu carinin siparişlerini görebilir.

---

## RBAC — Role Based Access Control

### Tanım

Yetkilerin kullanıcı rollerine göre belirlendiği erişim kontrol yöntemidir.

### Örnek Roller

* Bayi Kullanıcısı
* Bayi Yöneticisi
* Finans Kullanıcısı
* Satış Temsilcisi
* Admin.

---

## Pagination

### Tanım

Büyük veri listelerinin tamamını tek istekte getirmek yerine sayfalara bölünerek sunulmasıdır.

### B2B Karşılığı

Özellikle:

* ürün,
* sipariş,
* teklif,
* fatura,
* cari hareket

listelerinde kullanılmalıdır.

---

## Idempotency

### Tanım

Aynı isteğin yanlışlıkla birden fazla gönderilmesinin aynı işlemi birden fazla kez oluşturmamasını sağlayan prensiptir.

### B2B Karşılığı

Özellikle:

* sipariş oluşturma,
* ödeme,
* Netsim'e belge aktarma

işlemlerinde önemlidir.

Örneğin kullanıcı `Siparişi Onayla` butonuna iki kez bastığında iki ayrı ERP siparişi oluşmamalıdır.

---

## Correlation ID

### Tanım

Bir isteğin frontend, backend ve ERP entegrasyonu boyunca takip edilmesini sağlayan benzersiz kimliktir.

### B2B Karşılığı

Bir Netsim entegrasyon hatasının hangi kullanıcı isteğinden kaynaklandığını bulmak için kullanılabilir.

---

## ERP Business Logic

### Tanım

ERP'nin yalnızca tablolardan ibaret olmayan; bir işlem gerçekleştirilirken uyguladığı kurallar, kontroller, triggerlar, hesaplamalar ve bağlı işlemler bütünüdür.

### B2B Karşılığı

Örneğin sipariş oluştururken yalnızca:

`INSERT INTO ALSAASIL`

yapılması yeterli olmayabilir.

Netsim'in:

* fiyatlandırma,
* stok,
* cari,
* onay,
* session,
* güvenlik,
* bağlı işlem

mantıkları da dikkate alınmalıdır.

---

## Direct Database Read

### Tanım

B2B backend'in Netsim Firebird veritabanından doğrudan `SELECT` sorguları kullanarak veri okumasıdır.

### Kullanım

Raporlama ve bazı master veri okumalarında uygun olabilir.

---

## Direct Database Write

### Tanım

B2B uygulamasının Netsim tablolarına doğrudan `INSERT`, `UPDATE` veya `DELETE` işlemi yapmasıdır.

### Proje Prensibi

Transactional ERP tablolarında varsayılan entegrasyon yöntemi olarak kabul edilmemelidir.

Öncelikle Netsim'in servis, procedure veya business-layer seçenekleri değerlendirilmelidir.

---

# 9. Projede Sık Kullanılan Veri Kimlikleri

## CARI_NO

### Tanım

Netsim içerisinde cari kaydını tanımlayan temel teknik kimliklerden biridir.

### B2B Karşılığı

B2B kullanıcısının hangi müşteri/bayi verisini görebileceğinin belirlenmesinde ana referanslardan biridir.

---

## STOK_NO

### Tanım

Netsim stok kartının teknik kimliğidir.

### B2B Karşılığı

Product ile Netsim stok kartı arasındaki temel referanstır.

---

## ALISSATIS_NO

### Tanım

Netsim alış/satış işlem başlığının teknik kimliğidir.

### B2B Karşılığı

Teklif, sipariş veya ilgili alış/satış belgesinin ERP referansı olarak kullanılabilir.

---

## ALISSATIS_DETAY_NO

### Tanım

Netsim alış/satış işlem satırının teknik kimliğidir.

### B2B Karşılığı

Sipariş satırı ile sevkiyat/stok hareketi gibi detay kayıtların ilişkilendirilmesinde kullanılabilir.

---

## STOK_ISLEMA_NO

### Tanım

Netsim stok işlem başlığına ait teknik kimliktir.

### B2B Karşılığı

Sevkiyat veya stok hareket gruplarının detay kayıtlarıyla ilişkilendirilmesinde kullanılabilir.

---

# 10. Dokümantasyon Kuralları

Bu sözlüğe yeni terim eklenirken aşağıdaki yapı mümkün olduğunca korunmalıdır:

## Terim Adı

### Tanım

Terimin ERP veya yazılım dünyasındaki kısa ve açık anlamı.

### Netsim Karşılığı

Terimin Netsim N4/T4/Nuke içerisinde hangi yapıya karşılık geldiği.

Bu bilgi bilinmiyorsa tahmin edilmemeli ve:

**Araştırılacak**

olarak işaretlenmelidir.

### B2B Karşılığı

Terimin geliştirilecek B2B uygulamasındaki kullanım şekli.

---

Tablo ve kolon detayları bu sözlükte gereksiz yere çoğaltılmamalıdır.

Detaylı Netsim veritabanı bilgileri:

`04-data/NETSIM_TABLE_MAP.md`

dosyasında tutulmalıdır.

Tablolar arasındaki ilişkiler:

`04-data/ENTITY_RELATIONSHIPS.md`

dosyasında tutulmalıdır.

Modül bazındaki kullanım şekilleri:

`03-modules/`

altındaki ilgili modül dokümanlarında tutulmalıdır.

Entegrasyon kararları ise:

`06-netsim-integration/NETSIM_INTEGRATION_ARCHITECTURE.md`

dosyasında tutulmalıdır.
