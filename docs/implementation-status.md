# Implementation Status

## Phase
S0 / Plan — Ürünleştirme rotası yazıldı (`docs/00-project/URUNLESTIRME_ROTASI.md`)

## Completed (demo UI)
- [x] Portal shell + multi-cari context
- [x] Mock checkout / orders / shipments / invoices / finance
- [x] Cross-module deep links + dashboard ops hub
- [x] Ürünler: liste + detay artık Firebird'e bağlı (STOKKART/STOKBIRI/STOKURHA/STOKMARK/
      FIYADETA/STOKKADE) — cari bazlı fiyat, stok, kategori/marka/arama/sıralama filtreleri
      backend'de çalışıyor; frontend `portalService.getProducts/getProduct` artık gerçek
      `/api/products` API'sini çağırıyor (netsim-dev mock DB üzerinde doğrulandı, 2026-09-10)
- [x] Sepetim: artık B2B veritabanına bağlı (`B2B_CARTS`/`B2B_CART_LINES`, kullanıcı+cari
      bazlı) — `/api/cart` (GET/POST lines/PUT lines/{stokNo}/DELETE lines/{stokNo}/DELETE)
      backend'de çalışıyor; `company-context/store.ts` sepeti sunucudan yükler (`loadCart`,
      oturum/firma değişiminde `AppShell`'de tetiklenir) ve aksiyonlar optimistic update +
      arka planda sunucu senkronizasyonu şeklinde çalışıyor (doğrulandı, 2026-09-10)
- [x] Favoriler: artık B2B veritabanına bağlı (`B2B_FAVORITES`, kullanıcı bazlı — cari/
      firmadan bağımsız, bkz. ürünler.md madde 25) — `/api/favorites` (GET/POST {stokNo}/
      DELETE {stokNo}) backend'de çalışıyor; `company-context/store.ts` `loadFavorites` ile
      oturum doğrulandığında bir kez yükler, `toggleFavorite` optimistic update + arka planda
      senkronizasyon şeklinde çalışıyor (doğrulandı, 2026-09-10)
- [x] Teklifler: liste + detay artık Netsim'e bağlı (ALSAASIL/ALSADETA, ISLEM_KODU='TEKLIF')
      — cari bazlı filtre, geçerlilik tarihine göre canlı hesaplanan durum ("Geçerli"/
      "Süresi Doldu"), teklif kabul → sepete aktarma (anlaşmalı fiyat + quoteId) uçtan uca
      doğrulandı. ALSAASIL'de teklif başlığı için ayrı alan yok — ACIKLAMA bu amaçla
      kullanıldı; REFERANS_NO/YETKILI_ADI/ODEME_BILGISI/DT_NAKLIYE_SEKLI/ACIKLAMA_TEXT ve
      ALSADETA.TANIMLI_LISTE_FIYATI gerçek şema alanları ama netsim-dev seed'inde boştu,
      `netsim-dev/V002__enrich_quote_display_fields.sql` ile dolduruldu (veri uydurulmadı,
      var olan boş kolonlar eski frontend mock'undaki değerlerle dolduruldu). Satır bazlı
      "termin" artık statik metin değil, ürünün canlı stok durumundan hesaplanıyor.
      "Kabul Edildi" durumu backend'den henüz gelmiyor (Siparişler bağlanmadan
      doğrulanamıyor) — doğrulandı, 2026-09-10.
- [x] Siparişlerim: liste + detay artık Netsim'e bağlı (ALSAASIL/ALSADETA,
      ISLEM_KODU='SIPARIS') — cari bazlı filtre, durum/müşteri sipariş no/satış temsilcisi/
      ödeme-taşıma bilgisi gerçek (başlangıçta boş olan) şema alanlarından geliyor
      (`netsim-dev/V003__enrich_order_display_fields.sql`), kaynak teklif bağlantısı
      (REFERANS_ALISSATIS_NO → gerçek Teklifler kaydı) ve "Tekrar Sipariş Ver" → gerçek
      sepete ekleme uçtan uca doğrulandı. Checkout hâlâ mock olduğundan yerelde oluşturulan
      siparişler (`company-context.orders`) DB'den gelenlerle birleştiriliyor. Mock'taki
      kurgusal "B2B-2026-0988" siparişinin netsim-dev'de karşılığı yok — bağlı görünümde
      artık listelenmiyor (beklenen küçülme). `deliveryAddress` için gerçek şemada alan
      bulunamadı — cari hesabın adresine (hâlâ mock) düşüyor; `invoiceId`/`shipmentId`
      Faturalar/Sevkiyatlar henüz bağlanmadığından boş bırakıldı, mevcut UI bunu zaten
      "Henüz oluşmadı"/"Hazırlanıyor" olarak zarifçe gösteriyordu — doğrulandı, 2026-09-10.
- [x] Hızlı Sipariş: zaten `portalService.getProducts`/`addToCart` üzerinden Ürünler ve
      Sepetim'in gerçek API'lerini kullanıyordu (kod→ürün çözümleme, stok/fiyat, sepete
      ekleme uçtan uca doğrulandı, 2026-09-10). Bu geçişte ortaya çıkan bir boşluk da
      giderildi: `Product.featured` alanı gerçek veride hiç karşılığı olmadığından
      (STOKKART'ta "öne çıkan ürün" kavramı yok) sessizce hep boş kalıyordu — kaldırıldı;
      Hızlı Sipariş'teki "Sık sipariş verilen ürünler" ve Dashboard'daki "Sık Alınanlar"
      önerileri artık gerçek verili Favoriler listesinden besleniyor. Artık kullanılmayan
      `mocks/portalData.ts`'teki `products` mock dizisi de kaldırıldı.
- [x] Faturalar: liste + detay artık Netsim'e bağlı (ALSAASIL/ALSADETA,
      ISLEM_KODU='FATURA') — cari bazlı filtre, kaynak siparişe bağlantı
      (REFERANS_ALISSATIS_NO → gerçek Siparişler kaydı, Siparişler'in Teklifler'e
      bağlanmasıyla aynı desen) doğrulandı. "Ödendi"/"Açık"/"Vadesi Geçti" durumu
      DURUM'a değil, BAKIYE (kalan borç) ve VADE_TARIHI'nden canlı hesaplanan mantığa
      dayanıyor (Teklifler'in ValidUntil bazlı durumuyla aynı yaklaşım) — ödenen tutar da
      GENEL_TOPLAM - BAKIYE olarak türetiliyor, ayrı bir alan gerekmedi. ACIKLAMA/
      ODEME_BILGISI/BAKIYE/REFERANS_ALISSATIS_NO gerçek şema alanları ama netsim-dev
      seed'inde boştu, `netsim-dev/V004__enrich_invoice_display_fields.sql` ile eski
      frontend mock'undaki değerlerle dolduruldu. Satır bazlı KDV oranı (`KDV_ORANI`)
      seed'de zaten doluydu, ek bir enrichment gerekmedi. `eInvoiceUuid` için ALSAASIL'in
      hiçbir alanında karşılık bulunamadı (`Product.featured` ile aynı gerekçe) —
      veritabanına taşınmadı, ilgili UI gösterimleri kaldırıldı. Mock'taki kurgusal
      "B2B-2026-0988" siparişine bağlı "FTR-2026-1431" faturası artık sipariş linksiz
      ("Manuel fatura") görünüyor — beklenen küçülme (bkz. Siparişlerim notu). Artık
      kullanılmayan `mocks/portalData.ts`'teki `invoices` mock dizisi kaldırıldı —
      doğrulandı, 2026-09-11.
- [x] Finans / Cari Hesap: artık Netsim'e bağlı — ama `CARIKART`'ta bakiye/kredi limiti
      alanı hiç yok, bu yüzden Faturalar'daki "boş kolonu doldur" yaklaşımı yetmedi; yeni
      bir tablo (`NS_CARIKALI` — Cari Kart Limiti, `BLOKE_MAX`/`TOPLAM_RISK`) şema
      dokümanından `netsim_ddl_gen.py`'a eklenip netsim-dev'e kazandırıldı, `NS_CARIISLM`
      (cari hareket/ekstre — şemada vardı ama tamamen boştu) `netsim_seed_gen.py`'a eklenen
      üretici ile eski frontend mock'undaki (`accounts`/`accountTransactions`) değerlerle
      birebir seed edildi (bkz. `netsim_seed_gen.py` → `gen_cariislm_rows`/
      `gen_carikali_rows`, ve çalışan container'a aynı SQL'i uygulayan
      `finans_incremental.sql` — ayrı bir migration dosyası olarak commitlenmedi, V000/V001
      zaten güncel hâliyle kaynak). `/api/finance/accounts` (tüm erişilebilir cariler —
      `ICurrentCompanyContext.AllowedCariNos` yeni eklendi, tek aktif cariyle sınırlı değil)
      ve `/api/finance/transactions` (aktif cari) backend'de çalışıyor. Bakiye =
      `CARIKALI.TOPLAM_RISK`, kullanılabilir limit = `BLOKE_MAX - TOPLAM_RISK`. Vadesi geçen
      tutar `CARIISLM`'den açık kalem netlemesiyle hesaplanıyor (aynı faturaya
      `REFERANS_ALISSATIS_NO` ile bağlı borç/alacak satırları netleştirilir, yalnızca o
      faturanın `DURUM`'u 'Vadesi Geçti' olan gruplar sayılır) — canlı Netsim trigger'ı
      değil, bu mock seed'inin kendi tutarlılığına dayanıyor. `LIMIT_TURU` domain değeri
      ('GENEL') ve açık kalem eşleştirme mantığı VARSAYIM, gerçek Netsim'de doğrulanmalı.
      CARI_NO 1003 için mock'ta karşılık yoktu — makul bir limit profili verildi (gerçek
      kaynağı yok, FIYALIST'teki 3. bayi fiyat çarpanıyla aynı gerekçe). `Account` tipindeki
      `paymentTerm`/`riskGroup`/`accountManager`/`address`/`lastPaymentDate`/
      `lastPaymentAmount`/`brandColor`/`logoUrl` alanları için şemada doğrulanmış karşılık
      yok — bağlanmadı, UI'da "—" ile zarifçe gösteriliyor (Faturalar'daki `eInvoiceUuid`
      ile aynı yaklaşım). `taxNumber` (`CARIKART.VERGI_NO`) bağlandı. Uçtan uca doğrulandı
      (curl + tarayıcı, iki cari için de tutarlar mock'la birebir eşleşti), 2026-09-11.

## In Progress
- [ ] FAZ B — Identity + cookie auth + membership

## Blocked by Netsim API
- [ ] HttpNetsimProvider (gerçek OpenAPI / endpoint dokümanı)
- [ ] ValidateOrder / CreateOrder idempotency production proof
- [ ] Batch price / sellable inventory real endpoints
- [ ] Invoice PDF / e-fatura document
- [ ] Quote → Order ERP bağlantısı ("Kabul Edildi" durumu, bkz. Known TODO) — liste/detay
      okuma kısmı artık bağlı, yalnızca Sipariş'e dönüşüm izleme kısmı blocked
- [ ] Sevkiyatlar (Shipments): `STOKASIL`/`STOKISLM` alan bazlı iş anlamı doğrulanmadı
      (bkz. `NETSIM_TABLO_HARİTASI.md` ve `NETSIM_ENTEGRASYON_MİMARİSİ.md` → Open Questions)
      ve netsim-dev'de seed edilmedi (tamamen boş) — Teklifler/Siparişler'de yapılan
      "gerçek-ama-boş kolonu doldur" yaklaşımı burada uygulanamaz, çünkü kolonların
      *anlamı* da belirsiz. Taşıyıcı/takip no/araç-şoför/çok adımlı sevkiyat zaman
      çizelgesi gibi UI alanlarının karşılığı olan doğrulanmış bir kolon yok. Kullanıcıyla
      görüşüldü (2026-09-10): şimdilik mock bırakılması onaylandı; ilerlemek için ya gerçek
      şema doğrulaması ya da Siparişler verisinden türetilen daha sade bir görünüm gerekir.

## Known TODO
- Ürünler, Sepetim, Favoriler, Hızlı Sipariş, Teklifler, Siparişlerim, Faturalar ve
  Finans/Cari Hesap dışındaki modüller (checkout/sevkiyat) hâlâ `portalService` mock
- Teklif "Kabul Edildi" durumu ve Teklif→Sipariş dönüşümünün ERP tarafında izlenmesi
  Siparişler modülü bağlanmadan tamamlanamaz (bkz. `docs/04-data/NETSIM_TABLO_HARİTASI.md`
  → ALSAASIL "Quote ERP ISLEM_KODU mapping" — gerçek Netsim'de TEKLIF/SIPARIS/FATURA kod
  değerleri ve ikisi arasındaki bağlantı alanı doğrulanmadı)
- Ürünler fiyat/stok sorgusu basitleştirilmiş varsayımlar içeriyor (bkz.
  `NetsimProductReadService.cs` başındaki notlar ve `netsim-dev/README.md` →
  "Gerçek Netsim veritabanına geçerken doğrulanacaklar"): FIYADETA'da ONCELIK/tarih/miktar
  kademesi seçimi yok (tek satır varsayılıyor), STOKKADE.MIKTAR toplamı stok kaynağı olarak
  varsayılıyor, kategori sayfalama/backend gerçek sayfalama henüz yok (küçük katalog için
  tek istekte tüm sonuç alınıp frontend'de sayfalanıyor)
- Sepetim sunucu senkronizasyonu optimistic — istek başarısız olursa rollback yok, yalnızca
  konsola loglanıyor (bkz. `company-context/store.ts`); checkout/sipariş oluşturma hâlâ
  `portalService.createOrder` üzerinden mock sipariş kaydı üretiyor (gerçek sipariş yazma
  Netsim'e karşı henüz yapılmıyor)
- B2B outbox yok (identity + cart + favoriler artık Firebird B2B_* tablolarına bağlı)
- Admin Lite yok
- E2E / tenant leak / double-order testleri yok
- `docs/api/netsim-api-contract-matrix.md` henüz oluşturulmadı

## Next action
FAZ A tamamla (contract matrix + needs-netsim-api) → FAZ B1 PostgreSQL + Identity

## Last verified
- Frontend: `tsc --noEmit`, `npm run lint` (2026-09-10, mock portal)
- Faturalar uçtan uca doğrulandı (2026-09-11): `dotnet build` (backend, 0 hata),
  `tsc --noEmit`/`npm run lint`/`vitest run` (frontend, temiz), `GET /api/invoices`
  curl ile her iki cari için ayrı ayrı test edildi (durum/sipariş bağlantısı/tutarlar
  doğru), tarayıcıda Faturalar liste + detay sayfaları (bağlı sipariş linkli ve linksiz
  "Manuel fatura" durumu dahil) ve Excel export butonu hatasız çalıştı, konsolda hata yok
- Finans/Cari Hesap uçtan uca doğrulandı (2026-09-11): `dotnet build` + `dotnet test`
  (backend, 0 hata), `tsc --noEmit`/`npm run lint`/`vitest run` (frontend, temiz),
  `GET /api/finance/accounts` + `/api/finance/transactions` curl ile iki cari için de
  test edildi (bakiye/limit/vadesi geçen tutar eski mock'la birebir eşleşti — bir
  netleme sorgusu hatası curl testinde yakalanıp düzeltildi, bkz. NetsimFinanceReadService
  yorumları), tarayıcıda Finans sayfası + Dashboard kartları + firma değiştirme + Excel
  export iki cari için de hatasız çalıştı, konsolda hata yok
