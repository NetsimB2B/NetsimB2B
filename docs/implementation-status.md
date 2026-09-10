# Implementation Status

## Phase
S0 / Plan — Ürünleştirme rotası yazıldı (`docs/00-project/URUNLESTIRME_ROTASI.md`)

## Completed (demo UI)
- [x] Portal shell + multi-cari context
- [x] Mock checkout / quotes / orders / shipments / invoices / finance
- [x] Cross-module deep links + dashboard ops hub
- [x] Quote accept → cart with negotiated price
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
- [ ] Quote ERP ISLEM_KODU mapping

## Known TODO
- Ürünler, Sepetim, Favoriler ve Hızlı Sipariş dışındaki modüller (checkout/teklifler/
  siparişler/sevkiyat/fatura/cari hesap) hâlâ `portalService` mock
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
