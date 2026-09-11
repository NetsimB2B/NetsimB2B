# Netsim Table Map

<!--
Bu dosya B2B projesinde kullanılan Netsim tablolarının merkezi kataloğudur.

Amaç:
Her modül içinde tekrar tekrar tablo açıklaması yapmak yerine tek bir teknik referans oluşturmak.

Her tablo şu formatla belgelenebilir:

---

## TABLE_NAME

### Amaç
Tablonun Netsim içerisindeki fonksiyonu.

### Ana Primary/Identity Alan
Örneğin:
CARI_NO
STOK_NO
ALISSATIS_NO

### Önemli Alanlar
B2B projesinin kullandığı kolonlar.

### B2B'de Kullanıldığı Modüller
Örneğin:
Dashboard
Products
Orders

### İlişkiler
Hangi tablolarla hangi alan üzerinden ilişki kuruluyor?

### Read / Write
B2B bu tabloyu:
- yalnızca okuyor mu?
- kontrollü yazıyor mu?
- Netsim servis üzerinden mi değiştiriyor?

### Açık Sorular
Henüz anlamı kesinleşmeyen alanlar.

---

## Tablo / görünüm ayrımı (doğrulandı — kaynak: `docs/04-data/Netsim-Veritabani-Semasi.md`)

Netsim'de uygulamanın kullandığı isimler (`CARIKART`, `STOKKART`, `ALSAASIL`, ...) **view**'dır.
Fiziksel tablo her zaman `NS_` önekiyle var olur (`NS_CARIKART`, `NS_STOKKART`, `NS_ALSAASIL`, ...).
Kaynak dokümanda view'ların SQL gövdesi yoktur — yalnızca alan listesi doğrulanabildi;
`netsim-dev` mock'undaki uyumluluk view'ları (`CREATE VIEW STOKKART AS SELECT * FROM NS_STOKKART`)
saf pass-through'tur, gerçek Netsim view'ları JOIN/filtre içerebilir. Detay: `database/firebird/netsim-dev/README.md`.

Başlangıçta belgelenmesi gereken tablolar:

## CARIKART (NS_CARIKART)

Cari master. PK: `CARI_NO`.

NOT NULL alanlar: `CARI_NO`, `CARI_KODU`, `CARI_ADI`, `MUHASEBE_CARI_TURU`.

Doğrulanmış diğer alanlar:
- CARI_KODU, CARI_ADI, MUHASEBE_CARI_TURU
- BLOKE, KAYIT_DURUMU
- KREDILI_ISLEM, EMAIL
- VERGI_DAIRESI, VERGI_NO
- BAYI_TURU, CARI_LIMIT_GRUP_NO
- TAHSILAT_NO, ODEME_NO

⚠️ `SEHIR` ve `CARI_ADI_GENEL` bu tabloda **YOKTUR** — adres bilgisi ayrı bir tabloda tutuluyor
(kaynak dokümanda `NS_CARIKART` için adres alanı bulunamadı; hangi tabloda olduğu doğrulanmadı).

## CARIISLM (NS_CARIISLM)

Cari hareketler/ekstre. PK: `CARI_ISLEM_NO`. `NetsimFinanceReadService.cs` bu tabloyu
kullanıyor (Finans/Cari Hesap modülü, 2026-09-11).

Doğrulanmış ve B2B'de fiilen okunan alanlar:
- CARI_ISLEM_NO, CARI_NO
- BORC, ALACAK, BAKIYE, GENEL_BAKIYE
- TARIH, VADE_TARIHI
- BELGE_NO, ISLEM_KODU, ISLEM_ADI, ACIKLAMA, DURUM, DOVIZ_BIRIMI
- REFERANS_ALISSATIS_NO (→ ALSAASIL.ALISSATIS_NO; bir faturaya/işleme bağlı hareketi işaretler)

⚠️ `netsim-dev` mock'unda bu tablo **tamamen boştu** (V001 seed'i üretmiyordu) —
`netsim_seed_gen.py`'a eklenen `gen_cariislm_rows` ile eski frontend mock'undaki
(`accountTransactions`) değerlerle seed edildi (bkz. netsim-dev/README.md).

⚠️ **VARSAYIM — henüz doğrulanmadı:** "Vadesi geçen tutar" gibi özet metrikler için B2B
tarafında bir *açık kalem netleme* mantığı uygulanıyor (aynı `REFERANS_ALISSATIS_NO`'ya
bağlı borç/alacak satırları netleştiriliyor, `DURUM='Vadesi Geçti'` olan faturanın grubu
sayılıyor — bkz. `NetsimFinanceReadService.cs` yorumları). Gerçek Netsim'de açık kalem
eşleştirmesinin bu tabloda mı yoksa ayrı bir muhasebe modülünde mi yapıldığı, ve `DURUM`
alanının gerçek domain değerlerinin ne olduğu doğrulanmadı. `KAPANDI`/`KAPANMA` alanları
şemada var ama B2B tarafında henüz kullanılmıyor.

## CARIKALI (NS_CARIKALI)

Cari kredi limiti. PK: `CARI_KART_LIMIT_NO`. Kaynakta **görünüm** (`CARIKALI`) + fiziksel
tablo (`NS_CARIKALI`) ikilisi olarak yer alıyor — aynı `CARIKART`/`NS_CARIKART` deseni.
`NetsimFinanceReadService.cs` bu tabloyu Finans modülünde bakiye/limit için kullanıyor
(2026-09-11). **`CARIKART`'ta bakiye veya kredi limiti alanı YOKTUR** — bu bilgi yalnızca
`CARIKALI`'da tutuluyor, `CARI_NO` üzerinden join gerekir.

NOT NULL alanlar: `CARI_KART_LIMIT_NO`, `LIMIT_TURU`.

Doğrulanmış diğer alanlar: `CARI_NO`, `FIRMA_NO`, `BLOKE_MAX` (kredi limiti tavanı),
`TOPLAM_RISK` (güncel bakiye/risk tutarı), `TOPLAM`, `UYARI_MIN`/`UYARI_MAX`,
`BLOKE_MIN`, `RISK_YUZDESI`, `GUNCELLEME_TARIHI`.

⚠️ Bu tablo B2B ihtiyacı ortaya çıkana kadar `netsim-dev`'in 25 tablolu alt kümesinde
**yoktu** — `netsim_ddl_gen.py`'a eklenip şema dokümanından üretildi, uydurulmadı (bkz.
netsim-dev/README.md → "Sadece 25 fiziksel tablo... dışında bir tabloya ihtiyaç duyulursa
genişletilmeli" kuralı).

⚠️ **VARSAYIM — henüz doğrulanmadı:** `LIMIT_TURU` alanının domain değerleri bilinmiyor;
B2B `'GENEL'` değerini varsayım olarak kullanıyor (bir cari birden fazla limit türüne
sahip olabilir — örn. döviz bazlı, teminat karşılığı vb. — bu ayrım netleştirilmeli).
Bakiye = `TOPLAM_RISK`, kullanılabilir limit = `BLOKE_MAX - TOPLAM_RISK` yorumu da
alan adlarından çıkarılan mantıklı bir varsayım, Netsim'de doğrulanmadı.

## STOKKART (NS_STOKKART)

Ürün/stok master. PK: `STOK_NO`. 143 alan.

NOT NULL alanlar (yalnızca bunlar): `STOK_NO`, `STOK_KODU`, `STOK_ADI`, `STOK_ADI_GENEL`,
`STOK_TIP_ADI`, `MUHASEBE_STOK_TURU`.

Doğrulanmış diğer alanlar:
- STOK_TIP_NO, STOK_TIP_ADI
- MARKA_NO, URUN_HATTI_NO
- WEB_AKTIF, SATILABILIRLIK, BLOKE, KAYIT_DURUMU
- VARYANT_ZORUNLU
- RESIM (BLOB), ACIKLAMA_HTML (BLOB SUB_TYPE TEXT)
- BIRIM1 (VARCHAR(10)) — birim burada

⚠️ **`BIRIM` (BIRIM1 değil) bu tabloda YOKTUR.** Kaynak dokümana göre gerçek `STOKKART`
view'ı da (NS_STOKKART ile birebir aynı 143 alan) `BIRIM` alanı içermiyor — yalnızca
`BIRIM1` var. `NetsimProductReadService.cs` bu yüzden `SELECT ... S.BIRIM AS Unit`
ile `SQL error -206 Column unknown S.BIRIM` veriyordu (doğrulandı).

✅ **Düzeltildi (2026-09-10):** Sorgu artık `NS_STOKBIRI`'ye (uyumluluk view'ı `STOKBIRI`)
`STOK_NO` + `SIRA_NO=1` ile join olup `SB.BIRIM AS Unit` seçiyor. `SIRA_NO=1`'in
Netsim'de gerçekten ana/birincil birimi temsil ettiği ⚠️ **varsayımdır**, birden fazla
birimi olan ürünlerde doğrulanmalı. Detay: `database/firebird/netsim-dev/README.md`
→ "Düzeltilen hata".

⚠️ `SEHIR` ve `CARI_ADI_GENEL` bu tabloyla ilgisiz (CARIKART notuna bakın); STOKKART'ta
`STOK_ADI_GENEL` vardır ama bu farklı bir alan (genel/uzun ürün adı).

## STOKBIRI (NS_STOKBIRI)

Ürün birim tanımı (birden fazla birim/ambalaj tipi mümkün). PK: `STOK_BIRIM_NO`.

NOT NULL alanlar: `STOK_BIRIM_NO`, `BIRIM`, `BIRIMX`.

Doğrulanmış diğer alanlar: `STOK_NO`, `SIRA_NO`, `KATSAYI`, `MIN_MIKTAR`, `MAX_MIKTAR`.

`NetsimProductReadService.cs` ürün biriminin bu tablodan `STOK_NO` + `SIRA_NO=1` ile
okunması gerektiğini bulduk (STOKKART'ta `BIRIM` yok, bkz. STOKKART notu). ⚠️ `SIRA_NO=1`'in
"ana/birincil birim" satırını temsil ettiği varsayımdır, Netsim'de doğrulanmalı.

## STOKKADE (NS_STOKKADE)

Depo bazlı stok miktarı. PK: `STOK_DETAY_NO`.

Doğrulanmış alanlar: `STOK_DETAY_NO`, `STOK_NO`, `STOK_ADI`, `BIRIM`, `MIKTAR`,
`STOK_YERI_NO`, `STOK_TIP_ADI`. Yalnızca `STOK_DETAY_NO` NOT NULL — geri kalan alanların
tamamı (MIKTAR dahil) nullable, uygulama tarafında NULL=0 varsayımı netleştirilmeli.

Bu tablo, "güncel stok bakiyesi" için en güçlü aday — bkz.
`docs/06-netsim-integration/NETSIM_ENTEGRASYON_MİMARİSİ.md` Open Questions.

## FIYALIST (NS_FIYALIST) / FIYADETA (NS_FIYADETA) — fiyat motoru

`FIYALIST` fiyat listesi başlığı (PK `FIYAT_NO`), `FIYADETA` ürün bazlı fiyat satırı
(PK `FIYAT_DETAY_NO`, NOT NULL: `BIRIM`, `TURU`, `LISTE_FIYATI`, `DOVIZ_BIRIMI`, `KDV`).

`NS_FIYADETA` üzerinde aynı anda bulunan şu alanlar — `CARI_KODU`, `CARI_TIP_NO`,
`ODEME_NO`, `KAMPANYA_NO`, `MIN_MIKTAR`/`MAX_MIKTAR`, `BASLAMA_TARIHI`/`BITIS_TARIHI`,
`ONCELIK` — fiyatın **cari + ödeme şekli + miktar kademesi + tarih aralığına göre,
öncelik (ONCELIK) sırasıyla** seçildiğini gösteriyor: birden fazla satır aynı STOK_NO
için eşleşebilir (örn. genel liste fiyatı + belirli bir cariye özel fiyat + kampanya
fiyatı), motor bunlar arasından en yüksek ONCELIK'e sahip ve tarih/miktar aralığına
uyan satırı seçiyor gibi görünüyor. **Seçim algoritmasının tam mantığı (eşitlik durumunda
tie-break, tarih aralığı dışı satırların davranışı) Netsim'de doğrulanmadı.**

`database/firebird/netsim-dev` mock'u bu motoru basitleştirerek yalnızca cari bazlı sabit
çarpan uyguluyor (bkz. netsim-dev README "NE OLMADIĞI") — miktar kademesi/kampanya
senaryoları mock'ta seed edilmedi.

## ALSAASIL (NS_ALSAASIL)

Alış/satış işlem header. PK: `ALISSATIS_NO`.

NOT NULL alanlar: `ALISSATIS_NO`, `ISLEM_KODU`, `ISLEM_ADI`, `TARIH`, `VADE_TARIHI`,
`KUR_TARIHI`, `DOVIZ_BIRIMI`, `DOVIZ_KURU`.

Diğer doğrulanmış alanlar: `BELGE_NO`, `CARI_NO`, `ISLEM_YONU`, `TOPLAM_HAM_TUTAR`,
`TOPLAM_KDV_TUTARI`, `GENEL_TOPLAM`, `KAYIT_DURUMU`.

B2B'de Teklif / Sipariş / Fatura muhtemelen `ISLEM_KODU` ile ayrışıyor — **gerçek kod
değerleri (örn. `TEKLIF`/`SIPARIS`/`FATURA` mı, yoksa Netsim'in kendi kısaltmaları mı)
doğrulanmadı**, netsim-dev mock'u varsayım olarak `TEKLIF`/`SIPARIS`/`FATURA` kullanıyor.

⚠️ `CARI_ADI` / `CARI_KODU` bu tabloda **YOKTUR** — cari adı/kodu göstermek için
`CARIKART`'a `CARI_NO` üzerinden join gerekir.

## ALSADETA (NS_ALSADETA)

Alış/satış işlem satırları. PK: `ALISSATIS_DETAY_NO`.

NOT NULL alanlar: `ALISSATIS_DETAY_NO`, `ISLEM_KODU`, `STOK_ADI`, `BIRIMX`, `MIKTAR`,
`DOVIZ_BIRIMI`, `DOVIZ_KURU`.

Diğer doğrulanmış alanlar: `ALISSATIS_NO`, `SIRA_NO`, `STOK_NO`, `BIRIM`, `BIRIM_FIYAT`,
`HAM_TUTAR`, `KDV_ORANI`, `KDV_TUTARI`, `SATIR_INDIRIM_ORANI`, `FIYAT_DETAY_NO`.

## STOKASIL

Stok işlem başlığı (117 alan). PK: `STOK_ISLEMA_NO`. `NetsimShipmentReadService.cs` bu
tabloyu Sevkiyatlar modülünde kullanıyor (2026-09-11) — tüm alanlar tek tek tarandı.

⚠️ Genel bir stok hareket başlığı (muhtemelen üretim/transfer/sayım gibi başka hareket
türlerini de tutuyor) — yalnızca sevkiyat amaçlı değil. B2B, `ISLEM_KODU='SEVKIYAT'`
olan satırları müşteri sevkiyatı olarak okuyor (⚠️ VARSAYIM, gerçek değer doğrulanmadı).

Doğrulanmış ve B2B'de fiilen okunan alanlar:
- STOK_ISLEMA_NO, TARIH, ISLEM_KODU, ISLEM_ADI, DURUM, DURUM_TARIHI, BELGE_NO
- ALISSATIS_NO (→ ALSAASIL.ALISSATIS_NO, kaynak sipariş)
- CARI_NO (→ CARIKART, alıcı)
- CIKIS_STOK_YERI_NO (→ STOKYERI, çıkış deposu — GIRIS_STOK_YERI_NO da var, muhtemelen
  transfer hareketlerinde "varış deposu" anlamında, sevkiyatta kullanılmadı)
- SEVK_NAKLIYECI_FIRMA_NO (→ CARIKART; taşıyıcı da bir cari kaydı — ⚠️ VARSAYIM, netsim-dev'e
  bu amaçla yeni bir cari eklendi, bkz. netsim_seed_gen.py → CARRIERS/TASIYICI_CARI_NO)
- ARAC_PLAKA, ARAC_SOFOR, ARAC_SOFOR_TELEFON (ve ikinci araç/şoför için ARAC_PLAKA2/
  ARAC_SOFOR2/ARAC_SOFOR2_TELEFON — B2B henüz kullanmıyor)
- KARGO_REFERANS_NO (kargo takip no için kullanıldı — ⚠️ VARSAYIM: `TAKIP_NO` alanı da var
  ama ALSAASIL'de de bulunan daha genel/dahili bir takip alanı gibi duruyor, kargo takip
  no'sundan farklı olabileceği düşünüldü, doğrulanmadı)

⚠️ B2B'nin **kullanmadığı** ama var olan ilgili alanlar: `KARGO_TOPLAM_DESI` (hacimsel
birim — kg değil, "toplam ağırlık" olarak yanlış etiketlenmemesi için taşınmadı),
`KARGO_ODEMESI`, `SEVK_CARI_ADI`/`SEVK_ACIKLAMA`/`SEVK_REFERANS_NO` (muhtemelen sevkiyata
özel ayrı bir alıcı adı/not/referans — henüz incelenmedi), `NAKLIYE_TIP_NO`.

**Ayrıca araştırılan ama kullanılmayan ilgili tablolar:**
- `NS_ALSATESL` (Teslimat/sevkiyat bilgisi, 65 alan, PK `ALISSATIS_TESLIM_NO`) — sipariş
  **satırı** bazında (`ALISSATIS_DETAY_NO` → ALSADETA) planlanan/onaylanan/gerçekleşen
  teslimat tarihini (`KESIN_TERMIN_TARIHI`/`MUSTERI_ONAY_TARIHI`/`MUSTERI_TESLIM_TARIHI`)
  ve teslimat yerini (`TESLIM_YERI`, serbest metin) tutuyor. Şemada var, netsim-dev'de
  seed edilmedi — gelecekte `estimatedDelivery`'nin STOKASIL'e bağlı siparişin
  `VADE_TARIHI`'si yerine bu tablodan (daha isabetli) okunması için aday.
- `NS_ARACKART` (Araç kartı, 69 alan, PK `ARAC_NO`) — `PLAKA` alanı var ama STOKASIL'den
  buna giden doğrulanmış bir ilişki bulunamadı (STOKASIL kendi `ARAC_PLAKA`'sını serbest
  metin olarak tutuyor, ARACKART'a referans vermiyor).
- `NS_GUZERGAH` (Güzergah/rota) — incelenmedi.

## STOKISLM

Stok hareket satırları. Nesne/PK doğrulandı (`NS_STOKISLM`, PK `STOK_ISLEM_NO`),
alan bazlı iş anlamı doğrulanmadı.

## STOKISLM

Stok hareket satırları. Nesne/PK doğrulandı (`NS_STOKISLM`, PK `STOK_ISLEM_NO`),
alan bazlı iş anlamı doğrulanmadı.

Yeni tablo keşfedildikçe bu dosyaya eklenmelidir.

Önemli:
Tablo ismi tahmin edilerek eklenmemelidir.
Gerçek Firebird şeması veya Netsim dokümantasyonu ile doğrulanmalıdır.
-->