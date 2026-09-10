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
- Ürünler, Sepetim, Favoriler, Hızlı Sipariş, Teklifler ve Siparişlerim dışındaki modüller
  (checkout/sevkiyat/fatura/cari hesap) hâlâ `portalService` mock
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
