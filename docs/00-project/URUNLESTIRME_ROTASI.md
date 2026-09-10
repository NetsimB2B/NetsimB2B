# Netsim B2B — Ürünleştirme Rotası

> **Tarih:** 2026-09-10  
> **Kaynaklar:** `docs/` (özellikle `PROJE_KAPSAMI`, `PROJE_VİZYONU`, `UYGULAMA_MİMARİSİ`, `KULLANICI_TİPLERİ`, `Burak_B2B.md` / master spec), Netsim N4/T4 dokümantasyon portalı, Nuke B2B site tanımı, tablo haritası.  
> **Amaç:** Mevcut mock portalı gerçek ürüne dönüştürmek için adım adım çalışma sırası.

---

## 0. Bugünkü durum (dürüst özet)

| Katman | Durum |
|--------|--------|
| **Frontend portal UI** | Zengin demo: ürün, sepet, checkout, teklif, sipariş, sevkiyat, fatura, cari, destek, bildirim, dashboard, Excel/print |
| **Frontend veri** | Tamamen mock (`portalService` + `portalData` + localStorage) |
| **Auth** | Mock login (`demo@netsim.com`) |
| **Backend** | İnce iskelet; Firebird’den ürün arama (read-only) var, UI bağlı değil |
| **B2B DB (PostgreSQL)** | Master spec’te var; production kimlik/sepet/outbox henüz yok |
| **Netsim Integration ACL** | Gateway contract’lar spec’te tanımlı; Http provider + gerçek API yok |
| **Admin / Connector** | Yok |
| **implementation-status.md** | Yoktu → bu rota ile takip edilecek |

**Kritik fark:** UI, dokümandaki **Faz 2 görünümünü** önden kurdu. Ürünleşmede asıl eksik **Faz 1 dikey dilim** (gerçek auth + fiyat/stok + Netsim’e sipariş).

Dokümanların tek cümlelik MVP sınırı:

```text
Login → Firma → Ürün → Benim fiyatım → Satılabilir stok → Sepet → Validate → Netsim sipariş → Takip
```

Bu akış **ERP’de gerçek belge üretmeden** “ürün” sayılmaz.

---

## 1. Kaynaklara göre: Yaptıklarımız / Yapmadıklarımız

### 1.1 Yaptıklarımız (demo / UX omurgası)

- App shell, multi-cari seçici, firma bağlamlı sepet (Zustand)
- Katalog, ürün detay, hızlı sipariş, favoriler (UI)
- Sepet + checkout + limit/stok kontrolü (mock kurallar)
- Teklif list/detay, kabul → sepet (teklif fiyatı + `quoteId`)
- Sipariş / sevkiyat / fatura / cari ekstre (liste+detay, derin linkler)
- Dashboard operasyon özeti (açık fatura, sevkiyat, teklif)
- Destek / bildirim / duyuru / hesabım (client-side)
- Excel + print (birçok belge)
- Backend Clean Architecture iskeleti + `STOKKART`/`STOKBIRI` ürün okuma
- `netsim-dev` Firebird seed / tablo haritası notları
- Tasarım dili (Netsim turuncu/navy), responsive temel

### 1.2 Kısmi / yüzeysel

| Konu | Durum |
|------|--------|
| Auth | Mock; cookie/session/RBAC yok |
| Fiyat | Mock / sabit çarpan; `FIYADETA` motoru yok |
| Stok | Mock; `STOKKADE` / `STYEREZV` satılabilir stok yok |
| Sipariş yazma | localStorage; Netsim `CreateOrder` yok |
| Teklif | UI var; ERP teklif `ISLEM_KODU` doğrulanmadı |
| Sevkiyat/İrsaliye | UI birleşik; irsaliye ayrı domain yok |
| Fatura PDF / e-fatura | UUID gösterimi; belge indirme yok |
| Ödeme | Yöntem seçimi; tahsilat/online ödeme yok |
| Roller | Unvan gösterimi; permission gate yok |
| Bildirim/destek | Sabit liste; persist yok |
| Frontend ↔ API | Bağlı değil (`VITE_DATA_SOURCE=api` planlı) |
| Test | Az unit; E2E / tenant leak / double-order yok |

### 1.3 Yapmadıklarımız (ürün için zorunlu / fazlı)

**MVP (doküman Faz 1 — zorunlu):**

1. Gerçek B2B identity (user, membership, cookie session)
2. Tenant + account isolation (backend)
3. `INetsim*Gateway` + MockNetsimProvider (deterministic)
4. Product read model + batch price + batch inventory
5. Server-side cart
6. `ValidateOrder` + `CreateOrder` + Outbox + Idempotency
7. Sipariş list/detay ERP mapping ile
8. Temel finance summary (bakiye / limit) gateway üzerinden
9. Admin Lite (user ↔ cari, integration health)
10. `docs/implementation-status.md` + contract matrix

**Faz 2 (ticari görünürlük — UI’da var, backend yok):**

- Teklif ERP workflow, sevkiyat/irsaliye sync, fatura + belge, detaylı ekstre, tekrar sipariş, Excel import

**Faz 3+ (gelecek):**

- Online ödeme, iade, teknik servis, satış temsilcisi, ATP, AI, white-label, multi-tenant SaaS

**Out of scope (asla B2B’ye taşınmaz):**

- Stok kartı/depo/MRP/üretim/muhasebe fişi/IK/Netsim parametre yönetimi

### 1.4 Netsim dökümanlarından çıkan ürün beklentisi

Netsim ekosisteminde klasik B2B (Nuke / partner B2B) bayilere şunları verir:

- Özel fiyat / iskonto
- Stok görünürlüğü
- Online sipariş + takip
- Cari bakiye + ekstre
- Fatura / teslimat bilgisi

Nuke site tanımında B2B çalışma şekli, cari tipi, bakiye tipi, web sipariş e-posta ayarları vardır → yeni portal **Nuke’un kopyası değil**, aynı ticari yetenekleri modern UX ile sunar.

Şemada görülen web procedure ipuçları (`WEB_ALSAASIL_CREATE`, `WEB_CARI_EKSTRE`, `CHECK_CARILIMIT`, `ALISSATIS_FIYATBUL` …) **doğrudan çağrılmamalı**; gerçek Netsim API sözleşmesi gelince gateway’e map edilir.

---

## 2. Çalışma ilkeleri (rotayı bozma)

1. **Önce dikey dilim, sonra genişlik.** Yeni UI modülü eklemek yerine Login→Sipariş ERP’ye bağla.
2. **Frontend ERP bilmez.** `STOKKART` / `ALSAASIL` yok; `/api/v1/...` var.
3. **Transactional Firebird WRITE yok.** Sipariş Netsim business API/service üzerinden.
4. **Mock ≠ production.** `NETSIM_PROVIDER=Mock` production’da fail.
5. **Sahte success yok.** ERP doğrulamadan “sipariş oluştu” deme.
6. **Her faz sonunda:** build, lint, test, bu dosyayı güncelle.
7. Mevcut zengin UI **atılmaz**; `portalService` arkasına gerçek API konur.

---

## 3. Adım adım rota (yapacağımız sıra)

### FAZ A — Anlaşma ve takip altyapısı (1–2 gün)

| # | İş | Çıktı |
|---|-----|--------|
| A1 | Bu rotayı ekipçe onayla | Kapsam kilidi |
| A2 | `docs/implementation-status.md` güncel tut | Şeffaf ilerleme |
| A3 | `docs/api/netsim-api-contract-matrix.md` şablon | Endpoint takip |
| A4 | `docs/api/needs-netsim-api.md` P0 liste | Netsim’den istenecekler |

**Dur:** Gerçek endpoint uydurma.

---

### FAZ B — Platform iskeleti (master spec Faz 0–1)

| # | İş | Kabul kriteri |
|---|-----|----------------|
| B1 | PostgreSQL (+ Redis opsiyonel) compose | Local ayağa kalkar |
| B2 | Tenant, User, Membership, Role, Permission | Migration + seed |
| B3 | Cookie session auth: login/logout/me | Mock auth kalkar |
| B4 | Active account API + frontend bağla | Firma değişince query invalidate |
| B5 | Permission + account scope middleware | Cross-account 403 test |

**Demo hesabı:** `buyer@demo` + 2 cari + roller (Buyer / Finance / ReadOnly).

---

### FAZ C — Netsim ACL + Mock provider (master Faz 2)

| # | İş | Kabul kriteri |
|---|-----|----------------|
| C1 | Gateway interface’ler (Catalog, Pricing, Inventory, Order, Account, Finance) | Domain Netsim tablo adı bilmez |
| C2 | `MockNetsimProvider` deterministic seed | Timeout / limit / price-changed senaryoları |
| C3 | Provider switch: Mock / Http(skeleton) | Env ile seçilir |
| C4 | Contract/mapper unit testleri | |

Mevcut Firebird `ProductEndpoints` → geçici read helper veya mock’a taşınır; UI yine B2B API konuşur.

---

### FAZ D — Katalog + fiyat + stok (master Faz 3–4) = **ürünün kalbi**

| # | İş | Kabul kriteri |
|---|-----|----------------|
| D1 | Product read model sync (mock→PG) | Pagination + search |
| D2 | `POST /pricing/query` batch | Cari A ≠ Cari B fiyat |
| D3 | `POST /inventory/query` batch | Satılabilir miktar |
| D4 | Frontend `portalService` → API | `VITE_DATA_SOURCE=api` |
| D5 | Checkout öncesi canlı fiyat/stok refresh | Stale uyarı |

**Netsim tabloları (referans, doğrudan UI’ya değil):**  
`NS_STOKKART`, `NS_STOKBIRI`, `NS_STOKKADE` / `NS_STYEREZV`, `NS_FIYADETA`.

---

### FAZ E — Sepet sunucu tarafı (master Faz 5)

| # | İş | Kabul kriteri |
|---|-----|----------------|
| E1 | Cart DB (tenant + user + account) | localStorage cart kalkar |
| E2 | Cart API CRUD | Account switch sızıntı yok |
| E3 | Mevcut sepet/checkout UI bağla | Excel export korunabilir |

---

### FAZ F — Sipariş (master Faz 6) = **en kritik faz**

| # | İş | Kabul kriteri |
|---|-----|----------------|
| F1 | Order aggregate + snapshot + status history | |
| F2 | `POST /orders/validate` | Limit / stok / fiyat değişimi |
| F3 | `POST /orders` + Outbox + IdempotencyKey | Double order = 0 |
| F4 | Worker retry + dead letter | Timeout-after-create senaryosu |
| F5 | UI: pending ERP / success / error + correlation id | Sahte success yok |
| F6 | Order list/detail ERP id ile | |

**MVP Definition of Done burada kilitlenir.**

---

### FAZ G — Sipariş sonrası + finans (master Faz 7–8)

| # | İş | Not |
|---|-----|-----|
| G1 | Order status sync / mapping | Netsim ham kod → B2B status |
| G2 | Shipment / dispatch read API | Mevcut UI’ya bağla |
| G3 | Invoice list/detail + document capability | PDF API gelince |
| G4 | Finance summary + statement | `WEB_CARI_EKSTRE` benzeri capability |
| G5 | Permission: `finance.read` | Finans menüsü gate |

---

### FAZ H — Admin Lite (master Faz 9)

| # | İş |
|---|-----|
| H1 | User / membership / rol yönetimi |
| H2 | Duyuru/banner (B2B content) |
| H3 | Integration monitor + manual retry (audit’li) |

---

### FAZ I — Kolaylıklar (master Faz 10–11) — UI zaten var, backend’e taşı

| # | İş |
|---|-----|
| I1 | Favorites API |
| I2 | Quick order + Excel/CSV preview |
| I3 | Repeat order (güncel fiyat/stok ile) |
| I4 | Quotes gateway + feature flag (ERP endpoint gelmeden production create kapalı) |

---

### FAZ J — Gerçek Netsim API bağlama (master Faz 17)

| # | İş |
|---|-----|
| J1 | OpenAPI / endpoint dokümanı al |
| J2 | Contract matrix doldur |
| J3 | `HttpNetsimProvider` implement |
| J4 | Staging E2E gerçek ERP’de |
| J5 | Eksikleri `needs-netsim-api.md`’ye yaz; Firebird write ile “çözme” |

---

### FAZ K — Production hardening (master Faz 16)

- Rate limit, CSRF, lockout, CSP, secrets
- Observability (OTel)
- CI/CD, backup, production guard (`Mock` yasak)
- Playwright E2E smoke
- Load / index / tenant leak suite

---

### FAZ L — Genişleme (bilinçli sonra)

Online ödeme → İade → Teknik servis → Satış temsilcisi → ATP / AI → White-label / Super Admin / Connector agent.

---

## 4. Önerilen sprint sırası (pratik)

| Sprint | Odak | “Bitti” hissi |
|--------|------|----------------|
| **S0** | Rota + status + API talep listesi | Ekip aynı sayfada |
| **S1** | Auth + membership + account context | Gerçek login |
| **S2** | Mock gateway + catalog API | Mock’tan API’ye ürün listesi |
| **S3** | Batch price + stock + cart API | Benim fiyatım / stok |
| **S4** | Validate + CreateOrder + outbox | **İlk gerçek vertical slice** |
| **S5** | Order tracking + finance summary | Self-service çekirdek |
| **S6** | Admin Lite + monitoring | Operasyon hazır |
| **S7** | Favorites / quick / repeat / quotes bind | Faz 2 kalitesi |
| **S8** | Real Netsim provider (doküman gelince) | Pilot müşteri |
| **S9** | Hardening + E2E | Canlıya aday |

---

## 5. Netsim’den hemen istenmesi gereken P0 API’ler

```text
Health / Version / Branches / TransactionPoints / TransactionCodes / PaymentMethods
SearchProducts / GetProduct / Groups / Brands / Warehouses / ChangedProducts
BatchInventory / SellableInventory
BatchPrice / CalculatePrice / ValidatePrice
GetAccount / Addresses / Balance / Risk / CreditLimit / Statement
ValidateOrder / CreateOrder (ExternalOrderId + Idempotency) / GetOrder / SearchOrders / GetOrderStatus
```

P1: Shipments, DispatchNotes, Invoices, InvoiceDocument, OpenItems, CreateCollection  
P2: Quotes, Returns, Service, ATP, OnBehalfOf

---

## 6. Şu an yapılmaması gerekenler

- Yeni “güzel ekran” eklemek (iade/AI/ödeme UI) — dikey dilim bitmeden
- Firebird’e `INSERT NS_ALSAASIL` yazmak
- Gerçek Netsim URL uydurmak
- Tüm ERP alanlarını ürün detayına dökmek
- Mikroservis / full SaaS paneli (henüz)
- Master spec’teki Faz 12–15’e atlamak

---

## 7. Başarı tanımı

**Ürün MVP hazır** sayılır ancak:

1. Kullanıcı gerçek (veya staging identity) ile girer  
2. Cari seçer  
3. Kendi fiyatını ve satılabilir stoğu görür  
4. Sepetten validate geçer  
5. Sipariş Netsim’de oluşur (veya mock’ta idempotent ERP simülasyonu + gerçek provider hazır)  
6. B2B’den takip eder  
7. Tenant/account sızıntısı yok, çift sipariş yok  

Mevcut zengin UI bunun **vitrini**; yukarıdaki akış **ürün**.

---

## 8. Sonraki tek adım (şimdi)

**Sprint S0 + S1 başlangıcı:**  
`implementation-status.md` güncelle → PostgreSQL + Identity + cookie auth → frontend mock auth’ı kes.

Bu rota onaylandıktan sonra uygulamaya **FAZ B1** ile başlanır.
