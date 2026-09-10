# Implementation Status

## Phase
S0 / Plan — Ürünleştirme rotası yazıldı (`docs/00-project/URUNLESTIRME_ROTASI.md`)

## Completed (demo UI)
- [x] Portal shell + multi-cari context
- [x] Mock catalog / cart / checkout / quotes / orders / shipments / invoices / finance
- [x] Cross-module deep links + dashboard ops hub
- [x] Quote accept → cart with negotiated price
- [x] Firebird product read stub (backend, UI bağlı değil)

## In Progress
- [ ] FAZ B — Identity + cookie auth + membership

## Blocked by Netsim API
- [ ] HttpNetsimProvider (gerçek OpenAPI / endpoint dokümanı)
- [ ] ValidateOrder / CreateOrder idempotency production proof
- [ ] Batch price / sellable inventory real endpoints
- [ ] Invoice PDF / e-fatura document
- [ ] Quote ERP ISLEM_KODU mapping

## Known TODO
- Frontend hâlâ `portalService` mock
- B2B PostgreSQL identity/cart/outbox yok
- Admin Lite yok
- E2E / tenant leak / double-order testleri yok
- `docs/api/netsim-api-contract-matrix.md` henüz oluşturulmadı

## Next action
FAZ A tamamla (contract matrix + needs-netsim-api) → FAZ B1 PostgreSQL + Identity

## Last verified
- Frontend: `tsc --noEmit`, `npm run lint` (2026-09-10, mock portal)
