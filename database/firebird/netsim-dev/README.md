# Netsim dev veritabanı (yapısal mock)

Bu dizin, gerçek Netsim ERP veritabanına (Firebird, `ZUMRUT.fdb`) erişim beklemeden
B2B backend geliştirmeye başlayabilmek için üretilmiş, **ayrı ve bağımsız** bir Firebird
veritabanı kaynağıdır. `database/firebird/migrations/V001__create_b2b_schema.sql`
(B2B_USERS, B2B_CARTS, ...) ile karıştırılmamalıdır — o dosya B2B'nin kendi veritabanına,
bu dizindekiler ayrı bir "netsim-dev" veritabanına aittir.

- `V000__netsim_dev_subset.sql` — 25 `NS_` tablosu + 15 uyumluluk view'ı (otomatik üretildi,
  bkz. `database/firebird/tools/netsim_ddl_gen.py`).
- `V001__netsim_dev_seed.sql` — deterministik Türkçe demo veri (otomatik üretildi, bkz.
  `database/firebird/tools/netsim_seed_gen.py`).

Her iki dosya da `docs/04-data/Netsim-Veritabani-Semasi.md` şema dökümünden programatik
olarak üretildi; kolon adları uydurulmadı.

## Kurulum

Bu, mevcut `compose.yaml`'daki `firebird` servisinden **ayrı** bir Firebird sunucusu/
veritabanıdır (B2B'nin kendi veritabanıyla karışmasın diye). En basit yol: ikinci bir
Firebird 5 konteyneri.

```bash
docker run -d --name netsim-dev-firebird \
  -e FIREBIRD_ROOT_PASSWORD=devonly \
  -e FIREBIRD_DATABASE=NETSIM_DEV.FDB \
  -e FIREBIRD_USE_LEGACY_AUTH=true \
  -p 3051:3050 \
  firebirdsql/firebird:5.0.4

# DDL ve seed'i çalıştır
docker cp database/firebird/netsim-dev/V000__netsim_dev_subset.sql netsim-dev-firebird:/tmp/V000.sql
docker cp database/firebird/netsim-dev/V001__netsim_dev_seed.sql netsim-dev-firebird:/tmp/V001.sql

docker exec netsim-dev-firebird isql -user SYSDBA -password devonly \
  localhost:/var/lib/firebird/data/NETSIM_DEV.FDB -i /tmp/V000.sql -ch UTF8

docker exec netsim-dev-firebird isql -user SYSDBA -password devonly \
  localhost:/var/lib/firebird/data/NETSIM_DEV.FDB -i /tmp/V001.sql -ch UTF8
```

Windows'ta Git Bash kullanıyorsanız `docker exec`/`docker cp` çağrılarında `/tmp/...`
yollarının Windows yoluna çevrilmesini önlemek için `MSYS_NO_PATHCONV=1` ile çalıştırın.

Veritabanını sıfırdan kurmak isterseniz: `docker rm -f netsim-dev-firebird` ile konteyneri
silip yukarıdaki adımları tekrarlayın (script'ler deterministiktir, aynı veriyi üretir).

## Bağlantı bilgisi (appsettings / .env)

```
ConnectionStrings__Netsim=User=SYSDBA;Password=devonly;Database=localhost/3051:/var/lib/firebird/data/NETSIM_DEV.FDB;DataSource=localhost;Port=3051;Dialect=3;Charset=UTF8;Pooling=true;
```

`.env.example`'daki `ConnectionStrings__Netsim` B2B'nin *kendi* veritabanını (`NETSIM_B2B.FDB`,
port 3050) gösterir — o ayrı kalmalı. Backend'i bu mock'a karşı çalıştırmak için yerel
`.env`'inizde (commit etmeyin) `ConnectionStrings__Netsim` değerini yukarıdaki gibi
3051 portuna ve `NETSIM_DEV.FDB`'ye yönlendirin.

## İçerik özeti

- 1 firma (`NS_FIRMALAR`)
- 3 bayi cari: `CARI_NO` 1001/1002/1003, `CR-1001`/`CR-1002`/`CR-1003` —
  `frontend/src/mocks/portalData.ts` ve `company-context/store.ts`'teki `activeCariNo`
  ile birebir eşleşir (1003 mock'ta henüz yok, ileride eklenirse diye hazır).
- 10 marka, 8 ürün hattı, 6 birim, 50 ürün (`NS_STOKKART`) — ilk 12'si mock ürünlerle
  birebir aynı kod/ad/fiyat/stok, kalan 38'i kategori bazlı üretildi.
- 2 depo, ürün×depo bazlı stok miktarı (`NS_STOKKADE`) — bazı ürünler (örn. `VLV-050`)
  bilerek her iki depoda da 0 stoklu, "stokta yok" senaryosu test edilebilsin diye.
- Bayi başına ayrı fiyat listesi (`NS_FIYALIST`/`NS_FIYADETA`): CR-1001 ×1.00,
  CR-1002 ×0.95, CR-1003 ×1.05 — cari bazlı fiyatlandırma test edilebilir.
- 3 teklif, 3 sipariş, 4 fatura + satırları (`NS_ALSAASIL`/`NS_ALSADETA`),
  `frontend/src/mocks/portalData.ts`'teki teklif/sipariş/fatura kayıtlarıyla tutarlı.
- Ürün başına birincil birim satırı (`NS_STOKBIRI`, `SIRA_NO=1`) — `NetsimProductReadService`
  sorgusunun `STOKBIRI` join'i için gerekli (bkz. aşağıdaki "Düzeltilen hata").

Aşağıdaki NS_ tabloları DDL'de vardır ama **seed edilmedi** (boş): `NS_CARIISLM`,
`NS_STOKBARK`, `NS_STOKGRUP`, `NS_STOKTIPI`, `NS_STOKLIMT`, `NS_STOKASIL`,
`NS_STOKISLM`, `NS_ALSAINDI`, `NS_ALSALINK`, `NS_ALSATESL`, `NS_INDIKART`, `NS_KAMPANYA`.
İhtiyaç oldukça `netsim_seed_gen.py`'a eklenmelidir.

## Doğrulama sonuçları (bu ortamda gerçekten çalıştırıldı — 2026-09-10)

| Kontrol | Sonuç |
| --- | --- |
| Fiziksel tablo sayısı | 25 |
| Uyumluluk view sayısı | 15 |
| Toplam kolon sayısı | 3321 |
| PK constraint sayısı | 25 |
| `SELECT COUNT(*) FROM STOKKART` | 50 |
| `SELECT COUNT(*) FROM STOKKART WHERE WEB_AKTIF = 'E'` | 50 |
| `SELECT COUNT(*) FROM CARIKART` | 3 |
| `SELECT COUNT(*) FROM ALSAASIL` / `ALSADETA` | 10 / 13 |
| Cari bazlı fiyat join (`CARIKART`→`FIYALIST`→`FIYADETA`→`STOKKART`, MTR-001) | CR-1001: 12450.00, CR-1002: 11827.50, CR-1003: 13072.50 — doğru |
| `VLV-050` için iki depoda da `STOKKADE.MIKTAR` toplamı | 0 / 0 — doğru |
| Düzeltilmiş `NetsimProductReadService` sorgusu (`STOKBIRI` join'li), 50 üründe NULL `Unit` sayısı | 0 — doğru |

### ✅ Düzeltilen hata: `NetsimProductReadService.cs` (2026-09-10)

`backend/src/NetsimB2B.Infrastructure/Netsim/Products/NetsimProductReadService.cs`
sorgusu `S.BIRIM AS Unit` seçiyordu, ama:

- Kaynak dokümana göre hem `NS_STOKKART` hem de gerçek `STOKKART` view'ı (aynı 143 alan)
  **`BIRIM` alanı içermiyor** — yalnızca `BIRIM1` var.
- Bu sorgu bu mock veritabanına karşı çalıştırıldığında gerçekten hata veriyordu:
  `SQL error code = -206 / Column unknown / S.BIRIM`.
- Bu, mock'un eksikliği değildi — kaynak şema dökümü gerçek `STOKKART` view'ının da aynı
  alan setine sahip olduğunu gösteriyor, yani bu sorgu gerçek Netsim'e karşı da aynı
  şekilde patlıyor olmalıydı.

**Uygulanan düzeltme:** `NS_STOKBIRI`'ye `STOKBIRI` uyumluluk view'ı eklendi
(`netsim_ddl_gen.py` → `COMPAT_VIEWS`), seed'e her ürün için birincil birim satırı
eklendi (`netsim_seed_gen.py` → `gen_stokbiri_rows`, `SIRA_NO=1`), ve sorgu şu hale
getirildi:

```sql
SELECT ... , SB.BIRIM AS Unit
FROM STOKKART S
LEFT JOIN STOKBIRI SB ON SB.STOK_NO = S.STOK_NO AND SB.SIRA_NO = 1
...
```

Veritabanı sıfırdan yeniden kuruldu, sorgu bu ortamda tekrar çalıştırıldı: hatasız,
50 ürünün tamamında `Unit` dolu (bkz. yukarıdaki tablo). `dotnet build` ile
`NetsimB2B.Infrastructure` projesinin sorunsuz derlendiği doğrulandı.

⚠️ **Kalan varsayım:** `SIRA_NO=1`'in Netsim'de gerçekten "ana/birincil birim" satırını
temsil ettiği doğrulanmadı — bu mock'ta her ürünün tek birimi olduğu için (SIRA_NO=1)
belirsizlik yok, ama gerçek Netsim'de bir ürünün birden fazla birimi/ambalaj tipi varsa
bu varsayım yanlış satırı seçebilir. Netsim'de doğrulanmalı (bkz. aşağıdaki liste).

## NE OLMADIĞI (en önemli bölüm)

- **Bu şema YAPIYI taklit eder, DAVRANIŞI etmez.** Trigger, stored procedure, computed
  field, cascade, check constraint — hiçbiri yok. Kaynak dokümanda bunların gövdesi
  zaten yoktu (bkz. `Netsim-Veritabani-Semasi.md` madde 9).
- Uyumluluk view'ları (`STOKKART`, `CARIKART`, ...) **saf pass-through**'tur
  (`CREATE VIEW X AS SELECT * FROM NS_X`). Gerçek Netsim view'ları JOIN, filtre
  (`WHERE KAYIT_DURUMU <> 'S'` gibi) veya hesaplanmış kolon içerebilir — kaynak dokümanda
  view'ların SQL gövdesi yok, bu yüzden bilinmiyor.
- Bu veritabanında çalışan bir **YAZMA** işlemi gerçek Netsim'de aynı sonucu vermez.
  Gerçek Netsim'de `ALSAASIL`/`ALSADETA`/`STOKASIL`/`CARIISLM` gibi tablolara yazarken
  muhtemelen trigger'lar cari bakiye, stok hareketi, muhasebe fişi vb. yaratıyor —
  bu mock'ta hiçbiri olmaz, düz bir INSERT'tür.
- **İşlem kodları VARSAYIMDIR.** `netsim_seed_gen.py` içinde `TEKLIF`/`SIPARIS`/`FATURA`
  sabit değerleri kullanıldı — gerçek Netsim kurulumunun `ISLEM_KODU` değerleri
  muhtemelen farklı (kısaltma, sayısal kod, firma bazlı özelleştirme vb.) olabilir.
- **Fiyat motoru mantığı VARSAYIMDIR.** Gerçek `NS_FIYADETA` seçim algoritması
  (ONCELIK/tarih aralığı/miktar kademesi arasından hangi satırın kazandığı) doğrulanmadı;
  bu mock yalnızca cari bazlı sabit çarpan uyguluyor. Bkz.
  `docs/04-data/NETSIM_TABLO_HARİTASI.md` → FIYALIST/FIYADETA.
  Miktar kademesi ve kampanya senaryoları **seed edilmedi**.
- **Stok bakiye kaynağı VARSAYIMDIR.** `NS_STOKKADE.MIKTAR` aday olarak kullanıldı;
  gerçek Netsim'de güncel bakiyenin bu tablodan mı yoksa `NS_STOKISLM` üzerinden
  hesaplanan bir SUM'dan mı geldiği doğrulanmadı (bkz.
  `docs/06-netsim-integration/NETSIM_ENTEGRASYON_MİMARİSİ.md` Open Questions).
- Reserved-word tırnaklama listesi (`SECURITY`, `USER`, `DATE`, ...) yalnızca kullanıcının
  verdiği liste + bu 25 tabloda fiilen karşılaşılan kelimelerle sınırlı test edildi.
  `SYSTEM` kelimesi şemada sıkça geçmesine rağmen Firebird 5'te tırnaksız çalıştığı bu
  ortamda doğrulandı (reserved değil) — farklı bir tabloda farklı bir ayrılmış kelimeyle
  karşılaşılırsa `netsim_ddl_gen.py`'daki `RESERVED_WORDS` kümesine eklenmeli.
- Sadece 25 fiziksel tablo ve 15 uyumluluk view'ı var — gerçek Netsim'de 603 fiziksel
  tablo ve 825 view var. Bu kümenin dışında bir tabloya/alana ihtiyaç duyulursa
  `netsim_ddl_gen.py`/`netsim_seed_gen.py` genişletilmeli, tabloyu şemadan tahmin etmeyin.

## Gerçek Netsim veritabanına geçerken doğrulanacaklar

1. Müşteri kurulumundaki gerçek Firebird major/minor sürümü ve `ISLEM_KODU` değerleri.
2. `NS_STOKBIRI`'de `SIRA_NO=1`'in gerçekten ana/birincil birimi temsil ettiği
   varsayımı — birden fazla birimi/ambalaj tipi olan ürünlerde doğru satırı seçmek için
   Netsim'de doğrulanmalı (bkz. yukarıdaki "Düzeltilen hata").
3. `NS_FIYADETA` fiyat seçim algoritmasının tam mantığı (ONCELIK tie-break, tarih/miktar
   aralığı dışı davranış).
4. Güncel stok bakiyesinin gerçek kaynağı (`NS_STOKKADE.MIKTAR` mı, başka bir yer mi).
5. `CARIKART.MUHASEBE_CARI_TURU`, `BAYI_TURU`, `KAYIT_DURUMU` gibi CHAR/VARCHAR bayrak
   alanlarının gerçek domain (enum) değerleri — bu mock'ta varsayılan tek değerler
   (`'BAYI'`, `'A'`) kullanıldı.
6. Gerçek `STOKKART`/`CARIKART`/... view'larının SQL gövdesi ve içerdikleri
   filtre/JOIN'ler (pass-through olmadıkları senaryolar için).
7. Yazma senaryolarını (sipariş/teklif oluşturma) kopya veritabanında transaction ve
   Netsim UI karşılaştırmasıyla test edin — bu mock hiçbir trigger/iş kuralı çalıştırmaz.
8. Salt-okunur bir entegrasyon kullanıcısı açın, gerçek bağlantı bilgilerini repoya
   koymayın (bkz. proje kök `README.md` → Güvenlik notu).
