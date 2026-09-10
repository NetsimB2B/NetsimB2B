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

Cari hareketler. PK: `CARI_ISLEM_NO`.

Aday alanlar (henüz tek tek doğrulanmadı — sadece nesne/PK doğrulandı):
- CARI_ISLEM_NO
- CARI_NO
- BORC
- ALACAK
- BAKIYE
- VADE_TARIHI
- KAPANDI
- KAPANMA

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

Stok işlem/sevkiyat header. Nesne/PK doğrulandı (`NS_STOKASIL`, PK `STOK_ISLEMA_NO`),
alan bazlı iş anlamı doğrulanmadı.

## STOKISLM

Stok hareket satırları. Nesne/PK doğrulandı (`NS_STOKISLM`, PK `STOK_ISLEM_NO`),
alan bazlı iş anlamı doğrulanmadı.

Yeni tablo keşfedildikçe bu dosyaya eklenmelidir.

Önemli:
Tablo ismi tahmin edilerek eklenmemelidir.
Gerçek Firebird şeması veya Netsim dokümantasyonu ile doğrulanmalıdır.
-->