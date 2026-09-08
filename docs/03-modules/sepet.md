Cart

Bu dosya Netsim B2B Sepet ekranının fonksiyonel ve kullanıcı deneyimi tasarımını tanımlar.

Sepet, kullanıcının ürün kataloğu, hızlı sipariş, favoriler veya tekrar sipariş gibi farklı kaynaklardan seçtiği ürünleri bir araya getirdiği ve gerçek sipariş oluşturmadan önce son kez kontrol ettiği çalışma alanıdır.

Temel prensip:

Sepet, siparişten önceki güvenli kontrol alanıdır.

Kullanıcı Sepet ekranında:

hangi ürünleri sipariş edeceğini,
hangi miktarlarda sipariş edeceğini,
güncel fiyatlarını,
stok durumlarını,
varsa varyantlarını,
toplam sipariş tutarını,
siparişi engelleyen problemleri

net şekilde görebilmelidir.

Sepet doğrudan Netsim siparişi değildir.

Önerilen ana akış:

Ürünler / Hızlı Sipariş / Favoriler / Tekrar Sipariş
                    ↓
                  Sepet
                    ↓
       Fiyat + Stok + Miktar Kontrolü
                    ↓
            Sipariş Bilgileri
                    ↓
             Sipariş Özeti
                    ↓
              Siparişi Onayla
                    ↓
                Netsim ERP
1. Sepetin Temel Amacı

Sepet ekranının temel görevleri:

seçilmiş ürünleri topluca göstermek,
miktarları düzenlemek,
varyantları kontrol etmek,
fiyatları göstermek,
güncel stok durumunu göstermek,
problemli satırları açık şekilde belirtmek,
sipariş toplamını hesaplamak,
siparişe devam etmeyi sağlamak.

Sepet bir ürün keşif alanı değildir.

Ürün keşfi:

Ürünler

modülünde yapılır.

Sepet:

Kullanıcının satın alma kararını son kez kontrol ettiği alandır.

2. Ekran Genel Yapısı

Desktop için önerilen yapı:

Sepetim

8 ürün

┌─────────────────────────────────────────────────────┐
│                                                     │
│                    ÜRÜN SATIRLARI                   │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘

                                    ┌──────────────────────┐
                                    │ Sipariş Özeti        │
                                    │                      │
                                    │ Ara Toplam           │
                                    │ İndirim              │
                                    │ Vergi                │
                                    │ Genel Toplam         │
                                    │                      │
                                    │ [Siparişe Devam Et]  │
                                    └──────────────────────┘

Ana ekran iki temel bölüme ayrılır:

Sol / Ana Alan
→ Sepet ürünleri

Sağ / Özet Alanı
→ Sipariş toplamı ve ana aksiyon

Sepet çok uzun olduğunda sipariş özeti desktop'ta sticky olabilir.

3. Tasarım Karakteri

Sepet ekranı:

sade,
yoğunluğu kontrollü,
kolay taranabilir,
fiyat odaklı,
hata durumlarını açıkça gösteren

bir yapıya sahip olmalıdır.

Sepet içerisinde gereksiz:

banner,
kampanya görselleri,
dashboard widget'ları,
analitik grafikler

kullanılmamalıdır.

Sepetin amacı tek ve nettir:

Siparişi kontrol etmek ve devam etmek.

4. Sayfa Başlığı

Üst bölüm:

Sepetim

8 ürün

şeklinde olabilir.

Sağ tarafta düşük öncelikli işlemler bulunabilir:

Sepeti Temizle

Ancak Sepeti Temizle ana CTA gibi görünmemelidir.

5. Sepet Kaynakları

Sepete ürünler farklı modüllerden gelebilir.

Örneğin:

Ürün Kataloğu
        ↓
      Sepet

Hızlı Sipariş
        ↓
      Sepet

Favoriler
        ↓
      Sepet

Geçmiş Sipariş
        ↓
Siparişi Tekrarla
        ↓
      Sepet

Ürün hangi kaynaktan gelmiş olursa olsun Sepet içerisinde aynı ticari validation kuralları uygulanmalıdır.

6. Sepet Satırı

Her sepet satırı aşağıdaki temel bilgileri içermelidir:

Ürün

Stok Kodu

Varyant

Stok Durumu

Miktar

Birim

Birim Fiyat

Satır Toplamı

İşlem

Ancak tüm bilgiler ayrı kolon olmak zorunda değildir.

Bazı bilgiler aynı alan içerisinde gruplanabilir.

7. Önerilen Desktop Satır Yapısı

Örneğin:

┌─────────────────────────────────────────────────────────────────────┐
│ Ürün              │ Stok   │ Miktar │ Birim Fiyat │ Toplam │       │
├─────────────────────────────────────────────────────────────────────┤
│ STK-001            │ Stokta │   5    │ 125,00 TL   │ 625 TL │  🗑   │
│ Espresso Çekirdeği │ 42 adet│        │             │        │       │
└─────────────────────────────────────────────────────────────────────┘

Varyant varsa ürün bilgilerinin altında gösterilebilir:

Renk: Siyah
Beden: L

Bu sayede ayrı varyant kolonu her ekran genişliğinde zorunlu olmaz.

8. Ürün Bilgisi

Sepette ürün adı en güçlü satır bilgisidir.

Örnek:

Espresso Çekirdeği 1 kg

STK-001

Ürün adı tıklanırsa ürün detay ekranına gidilebilir.

Ancak kullanıcı sepette yaptığı değişiklikleri kaybetmemelidir.

9. Ürün Görseli

Ürün görselleri varsa küçük thumbnail kullanılabilir.

Örneğin:

56x56

veya:

64x64

Ancak ürün görseli olmayan veya endüstriyel ürün kullanan müşteriler için Sepet tasarımı görsele bağımlı olmamalıdır.

Ürün görseli:

destekleyici bilgi

olmalıdır.

10. Stok Kodu

Stok kodu ürün adının altında secondary bilgi olarak gösterilebilir.

Örnek:

STK-000124

B2B kullanıcılarının ürün kodlarını sık kullandığı düşünülerek kolay kopyalanabilir olması faydalıdır.

11. Varyant

Varyantlı ürünlerde seçilen varyant açıkça gösterilmelidir.

Örneğin:

Renk: Siyah
Beden: XL

Sepette varyant değiştirmenin desteklenip desteklenmeyeceği ürün yapısına göre belirlenmelidir.

Önerilen yaklaşım:

Varyant değişikliği yeni ticari ürün kombinasyonu oluşturuyorsa Sepet içerisinden değiştirilebilir ancak sonrasında fiyat ve stok yeniden hesaplanmalıdır.

12. Miktar

Miktar Sepet içerisindeki temel düzenlenebilir alandır.

Örneğin:

[-]  5  [+]

veya:

[ 5 ]

kullanılabilir.

Desktop B2B kullanımında sayı input'u daha hızlı olabilir.

13. Miktar Güncelleme

Kullanıcı miktarı değiştirdiğinde:

Miktar
↓
Validation
↓
Fiyat gerekiyorsa yeniden hesaplanır
↓
Stok kontrol edilir
↓
Satır toplamı güncellenir
↓
Sepet toplamı güncellenir

Bu işlem mümkün olduğunca sayfa yenilemeden gerçekleşmelidir.

14. Miktar Validation

Kontroller:

miktar 0'dan büyük mü?
sayı formatı geçerli mi?
ürünün birimine uygun mu?
minimum sipariş miktarı var mı?
maksimum sipariş miktarı var mı?
paket/koli katsayısına uyuyor mu?
mevcut satılabilir stokla uyumlu mu?

Örneğin:

Bu ürün 6'lı paketler halinde sipariş edilebilir.

veya:

Minimum sipariş miktarı 10 adettir.
15. Miktar 0 Olursa

Kullanıcı miktarı 0 yaparsa iki yaklaşım mümkündür:

Ürünü kaldır

veya:

0 miktara izin verme

Önerilen UX:

Miktar 0 kabul edilmemeli ve ürün kaldırma için ayrı:

Sepetten Kaldır

aksiyonu kullanılmalıdır.

Bu davranış daha nettir.

16. Birim

Ürünün sipariş birimi açıkça gösterilmelidir.

Örneğin:

Adet
Kg
Metre
Koli
Paket
Takım

Bir ürün birden fazla satış birimine sahipse uygun durumlarda kullanıcı birim değiştirebilir.

Birim değiştirildiğinde:

miktar,
fiyat,
stok,
satır toplamı

yeniden değerlendirilmelidir.

17. Stok Durumu

Sepet satırlarında stok bilgisi mutlaka yeniden kontrol edilmelidir.

Örneğin:

Stokta
42 adet
Son 3 adet
Stok yetersiz
Sipariş üzerine
18. Stok Sayısının Gösterimi

Firma politikasına göre kullanıcıya:

42 adet

gibi kesin miktar gösterilebilir.

Alternatif olarak yalnızca:

Stokta

gösterilebilir.

Bu davranış global Inventory Visibility politikasıyla uyumlu olmalıdır.

19. Sepette Stok Değişimi

Ürün sepete eklendikten sonra başka siparişler nedeniyle stok değişebilir.

Bu nedenle Sepet açıldığında stok doğrulaması yeniden yapılmalıdır.

Örneğin:

Daha önce: 10 adet

Şu anda kullanılabilir: 7 adet

Kullanıcı 10 adet sipariş etmek istiyorsa sistem bunu açık şekilde belirtmelidir.

20. Stok Yetersiz Durumu

Örnek:

⚠ Stok yetersiz

Talep edilen: 10 adet
Kullanılabilir: 7 adet

Backorder kapalıysa:

Miktarı 7 veya daha düşük bir değere güncelleyin.

Satır siparişe devam etmeyi engeller.

21. Backorder Destekleniyorsa

Örneğin:

7 adet hemen temin edilebilir.

Kalan 3 adet sipariş üzerine temin edilecektir.

Bu durumda satır Warning olabilir ancak sipariş devam edebilir.

Kesin davranış firma bazlı iş kuralıdır.

22. Birim Fiyat

Sepette gösterilen fiyat aktif cari için güncel fiyat olmalıdır.

Örneğin:

125,00 TL / Adet

Frontend fiyatı kendi başına üretmemelidir.

23. Fiyat Yenileme

Sepet açıldığında fiyatın gerektiğinde yeniden doğrulanması gerekir.

Özellikle:

ürün uzun süredir sepetteyse,
firma değiştiyse,
miktar değiştiyse,
fiyat listesi değiştiyse,
kampanya değiştiyse

yeniden hesaplama gerekebilir.

24. Fiyat Değişikliği

Kullanıcının ürünü sepete eklediği fiyat ile mevcut fiyat farklıysa sistem bunu gizlememelidir.

Örneğin:

Fiyat güncellendi

Önceki: 120,00 TL
Güncel: 125,00 TL

Satır warning olarak gösterilebilir.

25. Fiyat Düştüyse

Benzer şekilde:

Fiyat güncellendi

Önceki: 125,00 TL
Güncel: 118,00 TL

bilgisi gösterilebilir.

Ancak bu değişim mesajı kullanıcıya gerçekten değer sunuyorsa kullanılmalıdır.

26. İndirim

Müşterinin ticari fiyatlandırmasında indirim ayrı şekilde gösteriliyorsa:

Liste Fiyatı      150,00 TL
İndirim           %10
Net Fiyat         135,00 TL

gibi gösterilebilir.

Fakat Sepet satırlarını gereksiz derecede kalabalıklaştırmamak gerekir.

Ana görünümde:

Net Birim Fiyat

yeterli olabilir.

Detay tooltip veya expandable alan içerisinde gösterilebilir.

27. Satır Toplamı

Kavramsal olarak:

Miktar
×
Net Birim Fiyat
=
Satır Toplamı

Örneğin:

5 × 125,00 TL

625,00 TL

Satır toplamı finansal değer olduğu için görsel olarak belirgin olmalıdır.

28. Vergi Gösterimi

KDV veya diğer vergilerin ürün satırında mı yoksa toplam özetinde mi gösterileceği sistem genelinde tutarlı olmalıdır.

Önerilen yaklaşım:

Sepet satırlarında:

Net Birim Fiyat
Satır Toplamı

ana bilgiler gösterilir.

Vergi toplamı sağdaki Sipariş Özeti alanında gösterilir.

29. Satır Durumları

Her sepet satırı aşağıdaki state'lerden birinde olabilir:

Ready

Updating

Warning

Error
30. Ready

Siparişe uygun satır.

Örneğin:

✓ Hazır

Her satırda ayrıca yazılması şart değildir.

Normal görünüm Ready kabul edilebilir.

31. Updating

Miktar veya varyant değiştiğinde:

Fiyat kontrol ediliyor...

veya:

Stok kontrol ediliyor...

gibi lokal loading kullanılabilir.

Bütün Sepet bloke edilmemelidir.

32. Warning

Siparişi engellemeyen fakat kullanıcının görmesi gereken durum.

Örneğin:

⚠ Ürünün 3 adedi sipariş üzerine temin edilecektir.
33. Error

Siparişi engelleyen durum.

Örneğin:

Bu ürün artık satışa açık değil.
Stok yetersiz.
Geçerli fiyat alınamadı.
Varyant bilgisi geçersiz.
34. Hatalı Satırların Görsel Davranışı

Hatalı satır:

hafif error border,
küçük error icon,
açık hata mesajı

ile gösterilebilir.

Satır tamamen kırmızı background'a çevrilmemelidir.

Amaç kullanıcının problemi kolay bulmasıdır.

35. Sepetten Ürün Kaldırma

Her satırda:

Sepetten Kaldır

aksiyonu bulunmalıdır.

Icon olarak:

Trash

kullanılabilir.

Hover tooltip:

Sepetten Kaldır

olmalıdır.

36. Ürün Kaldırmada Confirmation

Tek bir ürünü sepetten kaldırırken confirmation gerekmeyebilir.

Önerilen:

Ürün sepetten kaldırıldı.

[Geri Al]

toast kullanmak.

Bu işlem geri alınabilir olduğu için modal kullanıcıyı gereksiz yavaşlatır.

37. Sepeti Temizle

Bütün sepeti temizlemek daha riskli işlemdir.

Bu nedenle confirmation kullanılmalıdır.

Örneğin:

Sepeti temizlemek istiyor musunuz?

Sepetinizdeki 8 ürün kaldırılacaktır.

[Vazgeç] [Sepeti Temizle]
38. Sepeti Kaydetme

Sepet kullanıcı için geçici ama güvenilir çalışma alanı olmalıdır.

Kullanıcı:

sayfa değiştirdiğinde,
logout olduğunda,
daha sonra geri geldiğinde

sepetin kaybolmaması tercih edilir.

Sepet B2B tarafında persist edilmelidir.

39. Firma Bazlı Sepet

Her sepet aktif firma/cari ile ilişkilidir.

Örneğin:

User
│
├── Cari A
│   └── Cart A
│
└── Cari B
    └── Cart B

Önerilen yaklaşım:

Kullanıcının her cari için ayrı aktif sepeti olabilir.

Firma değiştirildiğinde ilgili firmanın sepeti açılır.

40. Sepet Sayacı

Topbar'daki sepet iconunda:

🛒 8

gibi ürün sayısı gösterilebilir.

Buradaki sayı:

benzersiz satır sayısı

olmalıdır.

Toplam ürün miktarı değil.

Örneğin:

Ürün A × 100
Ürün B × 50

için badge:

2

olması daha anlaşılırdır.

41. Toplu İşlem

Çok büyük sepetlerde kullanıcı birden fazla ürünü seçip:

Seçilenleri Kaldır

gibi toplu aksiyon kullanabilir.

Ancak MVP için zorunlu değildir.

42. Sipariş Özeti

Sepetin sağ tarafındaki en önemli alanlardan biridir.

Önerilen yapı:

Sipariş Özeti

8 ürün

Ara Toplam            12.450,00 TL

İndirim                  750,00 TL

KDV                     2.106,00 TL

────────────────────────────────

Genel Toplam           13.806,00 TL


[Siparişe Devam Et]
43. Sipariş Özeti Bilgileri

Firma ticari yapısına göre:

Satır Sayısı

Toplam Miktar

Ara Toplam

İndirim

Vergi

Ek Masraf

Genel Toplam

gösterilebilir.

Ancak bulunmayan kalemler 0 TL olarak gereksiz yere gösterilmemelidir.

44. Finansal Hesapların Kaynağı

Sepet toplamları frontend'in basit fiyat çarpımlarına güvenmemelidir.

Özellikle:

iskonto,
kampanya,
vergi,
miktar fiyatı,
cari özel fiyat

varsa backend hesaplamalıdır.

Frontend:

hesap sonucunu görüntüleyen katmandır.

45. Genel Toplam

Sipariş özetindeki en güçlü finansal değer:

Genel Toplam

olmalıdır.

Örneğin:

13.806,00 TL

daha büyük ve bold gösterilebilir.

46. Para Birimi

Sepette birden fazla para birimi destekleniyorsa davranış ayrıca belirlenmelidir.

Mümkün olduğunca tek sepet:

tek para birimi

ile çalışmalıdır.

Farklı para birimlerinin aynı sepette karıştırılması hesaplama ve kullanıcı deneyimini karmaşıklaştırabilir.

47. Kredi Limiti Kontrolü

Firma kredi limiti kullanıyorsa Sepet özetinde opsiyonel olarak:

Kullanılabilir Limit

74.570,00 TL

gösterilebilir.

Sipariş:

Toplam > Kullanılabilir Limit

durumundaysa firmanın iş kuralına göre:

sipariş engellenebilir,
warning gösterilebilir,
onaya düşebilir.

Bu davranış kesin Netsim kuralına göre belirlenmelidir.

48. Minimum Sipariş Tutarı

Firma minimum sipariş tutarı uyguluyorsa Sepet üzerinde açık şekilde gösterilmelidir.

Örneğin:

Minimum sipariş tutarı: 5.000 TL

Siparişiniz: 3.420 TL

Sipariş oluşturmak için 1.580 TL daha ekleyin.

Bu kontrol kullanıcı siparişi tamamlamaya çalışana kadar gizlenmemelidir.

49. Siparişe Devam Et

Sepetin ana CTA'sı:

Siparişe Devam Et

olmalıdır.

Bu buton:

Primary Orange

şeklinde gösterilir.

50. Siparişe Devam Et Davranışı

Butona basıldığında sistem son kez:

Ürün geçerliliği

Varyant

Miktar

Stok

Fiyat

Cari

Limit

Minimum sipariş kuralları

kontrolü yapmalıdır.

Ardından sipariş bilgi / checkout adımına geçilir.

51. Sepet Doğrudan Sipariş Oluşturmamalıdır

Önerilen UX:

Sepet
↓
Sipariş Bilgileri
↓
Sipariş Özeti
↓
Onay
↓
Netsim Siparişi

Sepetteki:

Siparişe Devam Et

butonu doğrudan ERP'ye belge yazmamalıdır.

Kullanıcının teslimat ve son toplamı görmesi gerekir.

52. Sipariş Bilgileri

Sepetten sonraki adımda örneğin:

Teslimat Adresi

Talep Edilen Teslim Tarihi

Sipariş Notu

Müşteri Sipariş No / Referans No

Ödeme Şekli

gibi bilgiler alınabilir.

Bunların tamamı Sepet ekranına doldurulmamalıdır.

Sepet sade kalmalıdır.

53. Müşteri Sipariş Referansı

B2B müşterilerinde önemli bir alan olabilir.

Örneğin:

Müşteri Sipariş No

PO-2026-845

Bu bilgi Sepet ekranında opsiyonel küçük alan veya bir sonraki Sipariş Bilgileri adımında alınabilir.

Önerilen:

Sipariş Bilgileri adımında almak.

54. Sipariş Notu

Benzer şekilde sipariş notu:

Sipariş Notu

Sepette sürekli büyük textarea olarak gösterilmemelidir.

Sipariş oluşturma aşamasında alınması daha temizdir.

55. Sepete Ürün Eklemeye Devam Et

Kullanıcı Sepet'ten katalog sayfasına kolayca geri dönebilmelidir.

Örneğin:

← Alışverişe Devam Et

veya:

+ Ürün Ekle

aksiyonu bulunabilir.

Bu aksiyon secondary olmalıdır.

56. Hızlı Siparişe Git

B2B müşterileri için Sepet içerisinde:

+ Hızlı Sipariş ile Ürün Ekle

aksiyonu da faydalı olabilir.

Bu şekilde kullanıcı mevcut sepeti kaybetmeden Quick Order'a geçebilir.

Quick Order satırları aynı sepete eklenir.

57. Favorilerden Ürün Ekle

İleride:

Favorilerden Ekle

kısa yolu kullanılabilir.

Ancak Sepet başlığında çok sayıda ürün ekleme yöntemi göstermemek gerekir.

Bir:

Ürün Ekle ▼

menüsü altında:

Ürün Kataloğundan
Hızlı Siparişten
Favorilerden

toplanabilir.

58. Teklif İste

Bazı firmalarda Sepet'teki ürünlerin doğrudan sipariş yerine teklif talebine dönüşmesi gerekebilir.

Opsiyonel secondary action:

Teklif İste

olabilir.

Akış:

Sepet
↓
Teklif Talebi

Bu özellik firma bazlı konfigüre edilmelidir.

59. Sepeti Teklif ile Sipariş İçin Aynı Anda Kullanma

Eğer hem:

Siparişe Devam Et

hem:

Teklif İste

varsa bir tanesi primary, diğeri secondary olmalıdır.

Standart B2B akışında:

Primary
→ Siparişe Devam Et

Secondary
→ Teklif İste

olabilir.

60. Uyarı Özeti

Sepette problemli satırlar varsa sipariş özetinin üzerinde genel bir durum alanı gösterilebilir.

Örneğin:

Sepet Kontrolü

6 ürün hazır
1 ürün uyarı içeriyor
1 ürün düzeltilmeli

1 ürün düzeltilmeli seçildiğinde ilgili satıra scroll yapılabilir.

61. Siparişe Engel Olan Hata

Herhangi bir blocking error varsa:

Siparişe Devam Et

disabled olabilir.

Ancak kullanıcı neden disabled olduğunu anlayabilmelidir.

Örneğin:

Siparişe devam etmek için 2 üründeki sorunları düzeltin.
62. Disabled Buton Problemi

Sadece gri ve tıklanamayan bir buton kullanmak yeterli değildir.

Örneğin:

Siparişe Devam Et

disabled ise yakınında:

2 ürün stok nedeniyle güncellenmelidir.

açıklaması bulunmalıdır.

63. Sepet Yenileme

Kullanıcı gerektiğinde:

Fiyat ve Stokları Yenile

aksiyonuna sahip olabilir.

Ancak normal kullanımda bu işlem otomatik yapılmalıdır.

Manuel yenileme ana workflow olmamalıdır.

64. Sepet Son Güncelleme

Uzun süre açık kalan sepetlerde:

Fiyat ve stok bilgileri 16:20'de güncellendi.

gibi bilgi opsiyonel olarak gösterilebilir.

Her satıra ayrı timestamp eklemek gerekmez.

65. Empty State

Sepet boşsa büyük boş tablo gösterilmemelidir.

Önerilen:

Sepetiniz henüz boş.

Ürünleri inceleyerek veya hızlı sipariş kullanarak
yeni siparişinizi hazırlayabilirsiniz.

[Ürünlere Git]

[Hızlı Sipariş]

Bu durumda Sipariş Özeti paneli gösterilmesine gerek yoktur.

66. Sepet Empty State Önceliği

Primary CTA:

Ürünlere Git

Secondary:

Hızlı Sipariş

olabilir.

Eğer kullanıcı profesyonel B2B tipi ise rollerine göre Hızlı Sipariş primary yapılabilir.

67. Çok Büyük Sepetler

Sepette yüzlerce ürün bulunması mümkün olabilir.

Bu durumda:

performans,
scroll,
toplu validation

dikkate alınmalıdır.

Sepet pagination kullanmak zorunda değildir.

Ancak:

100+

satır varsa virtualized list düşünülebilir.

68. Ürün Arama — Sepet İçinde

Büyük sepetlerde:

Sepette Ara

fonksiyonu faydalı olabilir.

Örneğin kullanıcı 150 satırlık sepette:

STK-102

aramak isteyebilir.

MVP için zorunlu değildir.

69. Sepet Sıralama

Sepet default olarak:

Eklenme sırası

ile gösterilebilir.

İleride:

Ürün adı
Stok kodu
Kategori

gibi sorting eklenebilir.

Ancak Sepet bir tablo yönetim ekranına dönüşmemelidir.

70. Loading

Sepet açıldığında skeleton kullanılabilir.

Örneğin:

Product Line Skeleton

Order Summary Skeleton

Sepet içeriği görünürken yalnızca fiyat servisi gecikiyorsa bütün ekran gizlenmemelidir.

71. Partial Failure

Örneğin 8 satırdan 1 tanesinin fiyatı alınamazsa:

7 satır normal gösterilir.

1 satır:
Fiyat alınamadı.
[Tekrar Dene]

Sepetin tamamı hata sayfasına dönüşmemelidir.

72. Sepetin Kaydedilmesi

Sepet değişiklikleri mümkün olduğunca otomatik persist edilmelidir.

Kullanıcının ayrıca:

Sepeti Kaydet

butonuna basması gerekmemelidir.

Örneğin miktar değiştiğinde:

Miktar değişti
↓
Backend update
↓
Saved

mantığı kullanılabilir.

73. Optimistic Update

Miktar değişikliklerinde kontrollü optimistic update kullanılabilir.

Örneğin:

5 → 6

arayüzde hemen gösterilir.

Backend başarısızsa:

Miktar güncellenemedi.

mesajı ile eski değere dönülebilir.

Ancak fiyat ve stok sonuçları backend doğrulamasına bağlıdır.

74. Duplicate Ürün

Aynı ürün + varyant sepete yeniden eklenirse yeni satır oluşturmak yerine mevcut satır miktarı artırılabilir.

Örneğin:

Sepette:
5 adet

Yeni eklenen:
3 adet

Sonuç:
8 adet

Bu davranış kullanıcı için daha temizdir.

75. Farklı Varyantlar

Aynı ürünün farklı varyantları farklı sepet satırları olmalıdır.

Örneğin:

Tişört / Siyah / L

Tişört / Beyaz / L

iki ayrı satırdır.

76. Farklı Birimler

Aynı ürün farklı birimlerde sipariş ediliyorsa iş modeline göre ayrı satırlar olabilir.

Örneğin:

Ürün A / Adet

Ürün A / Koli

Birim dönüşüm mantığı Netsim ile uyumlu olmalıdır.

77. Yetkilendirme

Sepet için minimum permission:

cart.view

ve düzenleme için:

cart.manage

kullanılabilir.

Sipariş oluşturmak için ayrıca:

order.create

gerekebilir.

78. Sipariş Oluşturma Yetkisi Olmayan Kullanıcı

Bazı kullanıcılar sepet hazırlayabilir ancak sipariş oluşturamayabilir.

Örneğin:

Satın Alma Personeli
↓
Sepeti Hazırla
↓
Sipariş Onay Kullanıcısı

Bu senaryoda ana CTA:

Onaya Gönder

olabilir.

Firma workflow'una göre değişir.

79. Fiyat Yetkisi

Kullanıcının:

prices.view

yetkisi yoksa:

birim fiyat,
satır toplamı,
sepet toplamı

gösterilmemelidir.

Backend de bu bilgileri response içinde göndermemelidir.

80. Finans Yetkisi

Kredi limiti gibi bilgiler:

finance.view

veya daha spesifik permission ile korunmalıdır.

Normal sipariş kullanıcısının Sepet'te kredi limiti görmesi zorunlu değildir.

81. Responsive Desktop

Desktop'ta önerilen:

70–75%
Sepet Satırları

25–30%
Sipariş Özeti

Sipariş özeti sticky olabilir.

82. Tablet

Tablet'te:

Ürün listesi
↓
Sipariş Özeti

alt alta gelebilir.

Bazı ikincil kolonlar ürün bilgi alanının içine taşınabilir.

83. Mobile

Mobilde klasik geniş tablo kullanılmamalıdır.

Her ürün küçük bir kart olabilir:

Espresso Çekirdeği
STK-001

Stokta · 42 adet

125,00 TL / Adet

Miktar
[-] 5 [+]

625,00 TL

Sepetten Kaldır

Alt bölümde sticky:

Toplam: 13.806 TL

[Siparişe Devam Et]

kullanılabilir.

84. Mobile Sticky CTA

Mobilde kullanıcı uzun sepet boyunca scroll ederken toplam ve ana aksiyona erişebilmelidir.

Alt sticky bar:

13.806,00 TL

[Siparişe Devam Et]

şeklinde olabilir.

Detaylı toplamlar tıklandığında açılır.

85. Netsim Veri İhtiyaçları

Sepet temel olarak aşağıdaki Netsim domainlerine ihtiyaç duyar:

Product

Variant

Unit

Pricing

Inventory

Cari / Company

Credit / Risk Rules

Tax / Commercial Calculations
86. Muhtemel Netsim Kaynakları

Ürün master için:

STOKKART

gibi yapılar kullanılabilir.

Stok, varyant ve fiyat için gerçek Netsim tabloları ayrıca doğrulanmalıdır.

Sepet ekranında teknik tablo isimlerinin kullanıcıya hiçbir şekilde yansıması olmamalıdır.

87. B2B Veri Kaynakları

Sepet B2B'nin kendi domainidir.

Kavramsal modeller:

CART

CART_ITEM

olabilir.

Örneğin:

Cart
│
├── id
├── userId
├── cariNo
├── currency
├── status
└── updatedAt

ve:

CartItem
│
├── cartId
├── productId
├── variantId
├── quantity
├── unit
└── metadata

Gerçek database modeli Data Architecture içerisinde belirlenmelidir.

88. Fiyat Sepette Source of Truth Değildir

Sepette fiyat preview tutulabilir.

Ancak:

cart_item.price

sipariş oluşturma anında nihai ticari gerçek kabul edilmemelidir.

Netsim/backend fiyatı yeniden doğrulamalıdır.

89. Stok Sepette Source of Truth Değildir

Benzer şekilde Sepet'te görünen stok snapshot'tır.

Sipariş oluşturma sırasında güncel stok yeniden kontrol edilmelidir.

90. Cart Validation Service

Backend tarafında kavramsal olarak:

Cart Validation

servisi bulunabilir.

Kontroller:

Product Validity

Variant Validity

Quantity

Unit

Price

Inventory

Company Eligibility

Commercial Rules
91. Cart Summary Service

Toplamların hesaplanması için:

Cart
↓
Pricing
↓
Tax
↓
Discount
↓
Summary

aggregation kullanılabilir.

92. API İhtiyaçları

Kavramsal backend fonksiyonları:

Get Cart

Add Item

Update Quantity

Remove Item

Clear Cart

Validate Cart

Refresh Pricing

Refresh Inventory

Get Cart Summary

Proceed To Checkout

Kesin endpoint isimleri API dokümanında belirlenmelidir.

93. Bulk Validation

Sepette 100 ürün varsa her ürün için ayrı frontend request yapmak yerine toplu validation tercih edilmelidir.

Örneğin:

100 Cart Item
↓
Cart Validation
↓
100 Item Result
+
Cart Summary
94. Performans

Sepet açılırken anti-pattern:

Her ürün
× ayrı ürün sorgusu
× ayrı stok sorgusu
× ayrı fiyat sorgusu

olmamalıdır.

Backend mümkün olduğunca toplu sorgular kullanmalıdır.

95. Cache

Ürün adı ve görsel gibi bilgiler cache edilebilir.

Ancak:

Price

Available Inventory

Credit / Limit

daha güncel değerlendirilmelidir.

96. Siparişe Geçişte Son Validation

En kritik kural:

Kullanıcının Sepet'e girdiği anda yapılan validation, sipariş oluşturma anında yeterli kabul edilmemelidir.

Siparişe geçişte yeniden:

Price
Stock
Product
Variant
Quantity
Commercial Rules

kontrol edilmelidir.

97. Sipariş Onayı Öncesi Fiyat Değişimi

Örneğin Sepet'te:

13.806 TL

görünürken checkout sırasında fiyat:

14.120 TL

olduysa sistem doğrudan sipariş oluşturmamalıdır.

Kullanıcıya:

Sepetinizdeki bazı fiyatlar güncellendi.

Önceki toplam: 13.806 TL
Yeni toplam: 14.120 TL

Lütfen güncel toplamı kontrol edin.

denmelidir.

98. Güvenli Sipariş Deneyimi

Sepetin amacı kullanıcıyı mümkün olduğunca hızlı siparişe taşımaktır.

Ancak hız:

ticari doğruluk pahasına sağlanmamalıdır.

Özellikle:

Fiyat

Stok

Miktar

Toplam

Firma

siparişten önce kesin olmalıdır.

99. Sepette Tavsiye Edilen Ürünler

E-ticaret sitelerindeki gibi büyük:

Bunları da satın alın

alanları ana Sepet deneyimini bozabilir.

B2B için öneri:

MVP'de kullanılmaması.

İleride gerçekten iş değeri varsa:

Tamamlayıcı Ürünler

küçük ve düşük öncelikli bir alan olarak eklenebilir.

100. Akıllı Muadil

Stokta olmayan ürün varsa ileride satır içerisinde:

Alternatif Ürünleri Gör

aksiyonu verilebilir.

Örneğin:

Bu ürün stokta değil.

[Muadil Ürünleri Gör]

Bu özellik Future Scope'tur.

101. ATP

İleride yalnızca:

Stokta / Stokta değil

yerine:

7 adet hemen teslim

Kalan 3 adet 14 Eylül'de

gibi ATP bilgisi gösterilebilir.

Bu özellik Sepet UX'ini önemli ölçüde güçlendirebilir.

102. Sepet MVP Scope

İlk sürümde Sepet için yeterli kapsam:

Ürün satırları

Ürün adı + stok kodu

Varyant

Stok durumu

Miktar düzenleme

Birim

Birim fiyat

Satır toplamı

Ürün kaldırma

Sepet toplamı

Stok validation

Fiyat validation

Sepeti temizleme

Siparişe devam et
103. Phase 2

Daha sonra:

Fiyat değişiklik bildirimi

Minimum sipariş kontrolü

Kredi limiti görünürlüğü

Favorilerden ürün ekleme

Teklif iste

Sipariş onay workflow'u

Otomatik taslak

eklenebilir.

104. Future Scope

İleride:

ATP

Akıllı muadil

Tamamlayıcı ürün önerisi

Akıllı miktar önerisi

AI sepet kontrolü

Sepet paylaşımı

Bayi içi onay workflow'u

gibi özellikler değerlendirilebilir.

105. Açık Sorular

Sepet implementasyonu öncesinde Netsim tarafında aşağıdaki konular doğrulanmalıdır.

Fiyat
Cari bazlı net fiyat nasıl hesaplanıyor?
Miktar değiştiğinde fiyat değişiyor mu?
İskonto hangi seviyelerde uygulanıyor?
Vergi nasıl hesaplanıyor?
Kampanya veya özel fiyat sistemi var mı?
Sipariş oluşturulurken fiyat tekrar hesaplanıyor mu?
Stok
Sepette hangi stok gösterilmeli?
Fiziki stok mu?
Serbest stok mu?
Satılabilir stok mu?
Rezervler nasıl hesaba katılıyor?
Negatif stok siparişi mümkün mü?
Backorder destekleniyor mu?
Ürün
Satışa kapalı ürün nasıl belirleniyor?
Pasif ürün Sepet'te bulunuyorsa nasıl davranılmalı?
Minimum sipariş miktarı nerede?
Paket/koli katsayıları nasıl tutuluyor?
Varyant
Varyant değişikliği aynı stok kartını mı temsil ediyor?
Fiyat varyanta göre değişiyor mu?
Stok varyant bazında mı tutuluyor?
Cari
Kredi limiti nerede ve nasıl hesaplanıyor?
Limit sipariş oluşturmayı engelliyor mu?
Cari bloke durumu var mı?
Sipariş engelleyen cari durumları neler?
Sipariş
Sepetten Netsim siparişine geçerken hangi alanlar zorunlu?
Teslimat adresi nasıl eşleşecek?
İşlem tipi nasıl belirlenecek?
Sipariş referans numarası destekleniyor mu?
106. Önerilen Desktop Tasarım İskeleti

İlk görsel tasarım şu yapıda olabilir:

Sepetim                                             8 ürün

← Alışverişe Devam Et


┌──────────────────────────────────────────────────┐  ┌───────────────────────┐
│                                                  │  │ Sipariş Özeti         │
│ Espresso Çekirdeği 1 kg                         │  │                       │
│ STK-001                                          │  │ 8 ürün                │
│                                                  │  │                       │
│ Stokta · 42 adet                                 │  │ Ara Toplam            │
│                                                  │  │ 12.450,00 TL          │
│ Miktar                                           │  │                       │
│ [-] 5 [+]     Adet      125 TL      625 TL      │  │ İndirim               │
│                                           🗑     │  │ -750,00 TL            │
├──────────────────────────────────────────────────┤  │                       │
│                                                  │  │ KDV                   │
│ Filtre Kahve 500 g                               │  │ 2.106,00 TL           │
│ STK-002                                          │  │                       │
│                                                  │  │ ─────────────────     │
│ ⚠ Son 3 adet                                     │  │                       │
│                                                  │  │ Genel Toplam          │
│ Miktar                                           │  │ 13.806,00 TL          │
│ [-] 3 [+]     Adet      90 TL       270 TL      │  │                       │
│                                           🗑     │  │ [Siparişe Devam Et]  │
└──────────────────────────────────────────────────┘  └───────────────────────┘


[+ Ürün Ekle]       [Hızlı Sipariş ile Ekle]

Burada Sepet alanı ürünleri rahatça düzenlemek için geniş tutulur.

Sipariş Özeti daha dar fakat görsel olarak sabit ve belirgin bir alan olur.

107. Sepetin Bilgi Önceliği

Bir satırda kullanıcının bakış sırası ideal olarak:

1. Ürün

2. Stok durumu

3. Miktar

4. Birim fiyat

5. Satır toplamı

6. Uyarı / hata

olmalıdır.

Teknik ERP alanları bu sıralamanın içine girmemelidir.

108. Panelin Boğuk Olmaması İçin Kurallar

Sepet tasarımında özellikle şu sınırlar korunmalıdır:

ürün başına yalnızca temel ticari bilgiler gösterilir,
gereksiz kolon kullanılmaz,
fiyat hesaplama detayları varsayılan görünümde açılmaz,
aynı hata birden fazla yerde tekrar edilmez,
tek bir güçlü Primary CTA bulunur,
ürün önerileri Sepet'i işgal etmez,
toplam alanı sade tutulur,
çok sayıda border ve badge kullanılmaz,
ürün kartları gereksiz yüksek yapılmaz.

Sepet, Dashboard'dan daha veri yoğun olabilir ancak yine de ferah görünmelidir.

109. Sepetin Ana UX Prensibi

Sepet tasarlanırken şu soru temel filtre olmalıdır:

Kullanıcı sipariş vermeden önce yanlış ürün, yanlış miktar, yanlış fiyat veya stok problemi olup olmadığını birkaç saniye içerisinde anlayabiliyor mu?

Sepetin amacı yalnızca ürünleri saklamak değildir.

Asıl görevi:

sipariş öncesi belirsizliği ortadan kaldırmaktır.

110. Kısa Fonksiyon Tanımı

Sepet; farklı B2B modüllerinden seçilen ürünlerin aktif firma bağlamında bir araya getirildiği, miktar, varyant, güncel fiyat, stok ve toplam kontrollerinin yapıldığı ve doğrulanan içeriğin sipariş oluşturma sürecine aktarıldığı geçici ticari çalışma alanıdır.

Bu ekran için en güçlü tasarım cümlesi de şu olabilir:

“Siparişe geçmeden önce her şey doğru mu?” sorusunun cevabı Sepet'te verilmelidir.