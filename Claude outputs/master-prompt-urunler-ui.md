# MASTER PROMPT — Ürünler Sayfası Kurumsal B2B Yeniden Tasarımı

> Bu dosya bir **prompt**tur. Claude Code / Codex oturumuna olduğu gibi yapıştırılır.
> Kapsam: `frontend/src/features/products/` + `frontend/src/shared/styles/global.css` token katmanı.

---

## 1. ROL VE BAĞLAM

Sen, kurumsal ERP ve B2B bayi portalları üzerinde uzmanlaşmış bir frontend developer'sın.
SAP Fiori, Salesforce Lightning, Microsoft Dynamics 365, Odoo ve RS Components / Grainger /
Fastenal tipi bayi portallarının tasarım dilini biliyorsun.

Proje: **Netsim B2B** — Netsim ERP'ye bağlı bayi sipariş portalı.
Kullanıcı profili: bayi satın alma sorumlusu. Günde onlarca kez giriyor, 50+ kalemlik
sipariş geçiyor, ürünü stok kodundan tanıyor, görsele bakmıyor. Bu bir **iş aracı**,
tüketici e-ticaret sitesi değil.

Stack: React 19 + TypeScript + Vite + React Router 7 + TanStack Query + Zustand.
Stil: **saf CSS**, feature bazlı `.css` dosyaları, `global.css`'te CSS custom property'ler.
Tailwind/UI kütüphanesi **yok** ve eklenmeyecek.

Dokunacağın dosyalar:
- `frontend/src/features/products/index.tsx` — `ProductsPage` (liste). `ProductDetailPage` bu turda **dokunulmayacak**.
- `frontend/src/features/products/products.css`
- `frontend/src/shared/styles/global.css` — yalnızca token/ölçek bloğu (aşağıda tanımlı)

---

## 2. PROBLEM: MEVCUT TASARIM NEDEN B2B DEĞİL

Mevcut Ürünler sayfası 3 sütunlu, 180px görselli, gölgeli, hover'da yukarı kalkan
kart grid'i. Bu bir **tüketici pazaryeri** düzeni. Somut arızalar:

**Mobil uygulama / e-ticaret havası**
- `.product-visual` → 180px yüksekliğinde gradient panel + `.product-artwork-grid` noktalı
  doku + `mask-image: radial-gradient` + emoji ikon + `drop-shadow`. Ürün başına ekranın
  yarısı dekorasyona gidiyor, taşıdığı bilgi sıfır (emoji kategoriden türetiliyor).
- `.favorite-button` → kartın üstünde yüzen 32px yuvarlak kalp. Bu bir marketplace refleksi.
- `.badge` pill'ler, `border-radius: 999px`, renkli dolgular.

**Kart başına aşırı metin** — tek bir ürün satırı için 8 ayrı metin parçası:
marka · stok kodu · ürün adı · `3 MT stokta` rozeti · `Min. 1 MT` · `Firmanıza özel fiyat`
etiketi · fiyat · `+ KDV` · `Detayları Gör` · `Sepete Ekle`.
Bunların yarısı her kartta birebir aynı sabit metin → bilgi değil gürültü.

**Aşırı hover**
- `.product-card:hover` → `transform: translateY(-3px)` + gölge sıçraması
- `.product-visual:hover .product-artwork-icon` → `scale(1.07) translateY(-2px)`
- `.favorite-button:hover`, `.product-name:hover` (renk değişimi),
  `.product-category-panel > button:hover`, `.sidebar nav a:hover`, `.breadcrumb a:hover`
- Mouse gezdirirken tüm sayfa oynuyor.

**Süs**
- `box-shadow: 0 12px 28px`, `0 5px 20px`, `0 4px 16px` — düz yüzeylerde katmanlı gölgeler
- `.sidebar-brand` → radial + linear gradient kompozisyon
- `linear-gradient(145deg, ...)` kart görsel arkaplanları
- Her yerde turuncu vurgu: aktif nav, rozet, link, buton, focus ring, sayaç.

**Grid oranı bozuk**
- `.product-grid: repeat(3, minmax(0,1fr))` sabit; `pageSize = 8` → son satırda 1 boşluk.
- 1600px ekranda 8 kart 3 ekran boyu kaydırma demek. Tablo düzeninde aynı alana 12+ satır sığıyor.
- `.product-category-panel` 205px sabit, sonuç alanı akışkan → geniş ekranda kartlar şişiyor.
- `.product-name { min-height: 42px }` → değişken başlık uzunluğunu maskeleyen hack; yine de
  kart yükseklikleri satır içinde eşitlenmiyor.

**Yazılar küçük**
- `.product-meta` 11px, `.product-stock > span` 11px, `.product-price small` 11px,
  `.product-price span` 10px, `.products-eyebrow` 10px, `.breadcrumb` 10px.
- Detay sayfasında `8px` ve `9px` font-size'lar var (`.delivery-benefits small`,
  `.detail-quote-link`, `.related-product-card small`) — bunlar okunabilir değil.
- Buna karşılık `h1` 32px/800 — ters piramit: dekoratif olan büyük, veri olan küçük.

**Başlık şişkinliği**
`.products-header` üç katman taşıyor: eyebrow (`B2B ÜRÜN KATALOĞU`) + 32px başlık +
açıklama cümlesi (`Firmanıza özel fiyatlar, güncel stoklar ve teknik ürün bilgileri.`).
Günde 30 kez girilen bir sayfada bu üç satır da ilk günden sonra okunmuyor, sadece
ekranın üst %15'ini yiyor. Aynı şekilde `.catalog-help` ("Ürün bulamadınız mı?") kutusu.

---

## 3. HEDEF

Ürünler sayfası, **sipariş geçme aracı** olacak: tarama-filtreleme-miktar girme-sepete atma
akışı tek ekranda, kaydırmadan.

Yön: **veri yoğun, yalın, kurumsal.** Referans dil: SAP Fiori list report,
Salesforce Lightning data table, Dynamics 365 grid görünümü.

Temel karar: **varsayılan görünüm kart değil, tablodur.**
Kart görünümü kaldırılmaz, "Liste / Kart" segment kontrolüne alınır ve varsayılan **Liste**'dir.

---

## 4. TASARIM ANAYASASI (İHLAL EDİLEMEZ)

1. **Süs yasağı.** Hiçbir ürün yüzeyinde gradient yok. `box-shadow` yalnızca gerçekten
   üstte yüzen katmanlarda (dropdown, modal, yapışkan çubuğun altında) kullanılır; kart,
   panel, tablo, buton **gölgesiz**, 1px `--c-border` çizgiyle tanımlanır.
2. **Hareket yasağı.** Hiçbir hover'da `transform`, `scale`, `translate` yok. Hover'da
   sadece şunlar değişebilir: arkaplan tonu, kenarlık tonu, alt çizgi. Geçiş süresi max 100ms
   ve yalnızca `background-color`/`border-color` üzerinde.
3. **Yarıçap.** Tüm köşeler `4px`. `999px` pill yalnızca sayaç balonunda. `10px`/`12px` yok.
4. **Minimum tipografi.** Hiçbir yerde 11px altı font yok. Gövde verisi 13.5–14px.
   İkincil metin 12–12.5px. Tablo başlığı 11px uppercase.
5. **Tek birincil aksiyon.** Ekranda dolgulu turuncu buton yalnızca **bir** eylem için
   kullanılır. Diğer tüm butonlar beyaz zemin + gri kenarlık.
6. **Tekrar eden metin silinir.** Her satırda aynı olan bir metin satırda değil, sütun
   başlığında veya tablo altındaki tek bir notta durur.
   (`Firmanıza özel fiyat` → `BİRİM FİYAT` başlığı + altta tek satır not.)
7. **Sayılar hizalı.** Stok, fiyat, miktar sütunları sağa yaslı ve
   `font-variant-numeric: tabular-nums`.
8. **Genişliği kullan.** Sayfa `max-width` ile daraltılmaz; içerik mevcut genişliğe yayılır.

---

## 5. RENK VE TOKEN'LAR

Mevcut kimlik korunur (lacivert + turuncu), fakat **turuncu vurgu rolüne indirilir**,
lacivert yapısal renk olur. Sıcak/parlak tonlar koyulaştırılır.

`global.css` `:root` bloğunu bu token'larla **genişlet** (mevcut değişken adlarını
silme, geriye dönük kırılma olmasın; yeni adları ekle ve Ürünler sayfasında bunları kullan):

```css
:root {
  /* yüzey ve çizgi */
  --c-bg:            #f4f5f7;
  --c-surface:       #ffffff;
  --c-border:        #dfe3e8;   /* normal çizgi */
  --c-border-strong: #c9d0d8;   /* input, buton kenarı, tablo başlık altı */
  --c-line:          #eceff2;   /* tablo satır ayracı */

  /* yapısal renk (eski --secondary #405574'ün koyulaştırılmışı) */
  --c-navy:          #1f3350;
  --c-navy-soft:     #eef1f5;

  /* metin */
  --c-text:          #1b2430;
  --c-text-2:        #5b6572;
  --c-text-3:        #8a929c;

  /* vurgu — eski #ff5a1f'in oturaklı hali, YALNIZCA birincil aksiyon + aktif işaret */
  --c-accent:        #c2500f;
  --c-accent-hover:  #a94409;
  --c-accent-soft:   #fdf1ea;

  /* durum — dolgulu pill değil, nokta + metin rengi olarak kullanılır */
  --c-ok:            #15694a;
  --c-warn:          #8a5a00;
  --c-bad:           #a52222;

  --radius:          4px;
}
```

**Turuncunun kullanılabileceği yerler (tamamı):** sepete ekle birincil butonu, sol menüde
aktif öğenin 2px şeridi, "filtreleri temizle" metin linki. Başka hiçbir yerde yok —
rozetlerde, sayaçlarda, focus ring'de, ikonlarda, breadcrumb'da, fiyat rakamında yok.

**Focus ring:** `outline: 2px solid var(--c-navy); outline-offset: 1px;` — turuncu değil.

**Tipografi ölçeği:**

| Kullanım | Boyut | Ağırlık |
|---|---|---|
| Sayfa başlığı (`h1`) | 19px | 600 |
| Bölüm başlığı | 15px | 600 |
| Tablo hücresi / gövde | 13.5px | 400–500 |
| Tablo başlığı | 11px, `uppercase`, `letter-spacing:.06em` | 700 |
| İkincil metin, breadcrumb, footer | 12.5px | 400 |
| Fiyat | 13.5px | 600, tabular-nums |

`h1` için `font-weight: 800` ve `letter-spacing: -.035em` kaldırılır.

---

## 6. SAYFA SPESİFİKASYONU

### 6.1 Sayfa başlığı çubuğu
Tek satır, beyaz zemin, altında 1px çizgi, sayfa gövdesinden ayrı:
- Sol: `Ana Sayfa / Ürünler` breadcrumb (12px, `--c-text-3`) + `Ürünler` (19px/600)
- Sağ: `Excel'e Aktar`, `Hızlı Sipariş` — ikisi de beyaz/kenarlıklı buton

**Silinecek:** `.products-eyebrow` (`B2B ÜRÜN KATALOĞU`), `.products-header p` açıklama
cümlesi, `.products-quote-button` içindeki `◇` karakteri.

### 6.2 Sol filtre rayı (240px sabit)
`.product-category-panel` yerini alır. Beyaz yüzey, 1px kenarlık, gölge yok, yapışkan değil.
Bölümler arası 1px çizgi:
- `KATEGORİ` — **checkbox listesi** (çoklu seçim), her satırın sağında adet
- `MARKA` — checkbox listesi + adet
- `DURUM` — `Yalnızca stoktakiler`, `Favorilerim`
- En altta `Filtreleri temizle` metin butonu

**Silinecek:** `.catalog-help` ("Ürün bulamadınız mı? / Destek ekibine sorun") kutusu.
Not: tek seçimli kategori butonlarından çoklu checkbox'a geçiş, `ProductQuery` tipinde
`category?: string` → `categories?: string[]` değişikliği gerektirir; `brand` için de aynısı.
Filtreleme `portalService` içinde client-side yapıldığı için backend sözleşmesi değişmez.

### 6.3 Araç çubuğu (sonuç alanının üstü, tek satır, kart içinde değil)
`[ ⌕ arama input (flex:1) ] [ Sırala select ] [ Liste | Kart segment ]`
- Yükseklik 32px, kenarlık `--c-border-strong`, gölge yok.
- `.product-toolbar.card` sarmalayıcısı kaldırılır — bunlar çıplak kontroller olacak.

### 6.4 Sonuç meta satırı
Sol: `42 kayıt` + aktif filtre chip'leri (`Pompalar ×`, `Stokta ×`) — 24px yükseklik,
beyaz zemin, 1px kenarlık, 4px radius.
Sağ: `Fiyatlar firmanıza özel net fiyattır, KDV hariç.` (12.5px, `--c-text-3`) —
kart başına tekrarlanan `Firmanıza özel fiyat` + `+ KDV` metinleri **buraya taşınır**.

### 6.5 Ürün tablosu (varsayılan görünüm)
1px kenarlıklı, 4px radius'lu tek bir konteyner. İçinde `<table>`:

| Sütun | Genişlik | Hizalama | İçerik |
|---|---|---|---|
| seçim | 34px | orta | checkbox |
| `STOK KODU` | 120px | sol | `STK-10241`, tabular-nums, `--c-text-2` |
| `ÜRÜN` | esnek | sol | 1. satır: ürün adı (link, 13.5px/500, tek satır, `text-overflow: ellipsis`)<br>2. satır: marka (12px, `--c-text-3`) |
| `BİRİM` | 70px | sol | `AD` / `MT` |
| `STOK` | 110px | **sağ** | 7px renkli nokta + `156 PK`. Stok yoksa `Stokta yok` (`--c-bad`) |
| `BİRİM FİYAT` | 130px | **sağ** | `8.940,00 ₺` (600) + altında `+ KDV` (11.5px, `--c-text-3`) |
| `MİKTAR` | 104px | sol | satır içi `− [ 1 ] +` stepper, 28px yükseklik |
| aksiyon | 96px | sol | `Sepete` butonu (28px, beyaz/kenarlıklı; stok yoksa `disabled`) |

Kurallar:
- `thead` yapışkan (`position: sticky; top: 0`), zemin `#f7f8fa`, altında
  1px `--c-border-strong`.
- Satır ayracı 1px `--c-line`. Zebra şerit **yok**.
- `tbody tr:hover { background: #f8f9fb; }` — başka hiçbir hover efekti yok.
- Satır yüksekliği ~40px (`padding: 9px 12px`). 1600×900 ekranda en az 12 satır
  kaydırmasız görünmeli.
- Favori: kalp balonu kaldırılır. Favoriler sol raydaki `Favorilerim` filtresinden
  yönetilir; satırda favori işareti gerekiyorsa `ÜRÜN` sütununda 12px nötr bir yıldız
  olarak durur, yüzen buton olarak değil.
- Emoji ürün görseli tablo görünümünde **hiç kullanılmaz.**

### 6.6 Toplu seçim çubuğu
Bir veya daha fazla satır seçiliyse tablonun üstünde 36px'lik bir şerit belirir:
`3 ürün seçildi` + `Seçilenleri sepete ekle` + `Seçimi temizle`.
Zemin `--c-navy-soft`, metin `--c-navy`. Animasyonsuz.

### 6.7 Alt bilgi / sayfalama
Tablo konteynerinin içinde, üstünde 1px çizgi:
- Sol: `42 kayıttan 1–12 arası` + `Sayfa boyutu [12 ▾]` (12 / 25 / 50)
- Sağ: `‹ 1 2 3 4 ›` — aktif sayfa `--c-navy` dolgulu, diğerleri beyaz/kenarlıklı
- `pageSize` sabit 8 yerine state'e bağlanır, varsayılan **12**.
- `← Önceki` / `Sonraki →` ok karakterleri `‹` `›` ile sadeleşir.

### 6.8 Kart görünümü (segment ile açılır, ikincil)
Kart tamamen silinmez ama kurumsallaştırılır:
- 180px görsel paneli → 56px'lik nötr kare yer tutucu (gradient yok, noktalı doku yok,
  `drop-shadow` yok) veya tamamen kaldırılır.
- Kart gölgesiz, 1px kenarlıklı, 4px radius, hover'da yalnız kenarlık tonu değişir.
- Grid `repeat(auto-fill, minmax(280px, 1fr))` — sabit 3 sütun değil; böylece 1600px'te
  boş sütun ve ragged son satır oluşmaz.
- Kart içeriği: stok kodu + ad + marka + stok + fiyat + miktar stepper + `Sepete`.
  `Min. 1 AD`, `Firmanıza özel fiyat`, `Detayları Gör` metinleri kaldırılır
  (ürün adı zaten detaya link).

### 6.9 Duruş halleri
- Yükleniyor: tablo iskeleti — 12 satırlık gri çizgi bloğu. Nabız animasyonu
  (`@keyframes pulse`) kaldırılır, sabit `#f2f4f7` yeterli.
- Boş: tablo konteyneri içinde tek satır, ikon yok, daire yok:
  `Bu filtrelerle ürün bulunamadı.` + `Filtreleri temizle` linki.
- Hata: `.state-icon` yuvarlağı ve turuncu dolgu kullanılmaz; düz metin + `Tekrar dene`.

---

## 7. DUYARLILIK

- `≥1280px`: 240px filtre rayı + tablo
- `1024–1280px`: filtre rayı 208px, `BİRİM` sütunu gizlenir (birim stok hücresinde zaten var)
- `<1024px`: filtre rayı üstte açılır/kapanır panele döner; tablo `overflow-x: auto`
  içinde yatay kaydırılır — sütunlar ezilmez
- `<640px`: liste görünümü otomatik olarak kart görünümüne düşer (tek sütun)

---

## 8. KAPSAM SINIRI

**Yapılacak:** yalnızca `ProductsPage` görsel katmanı + `products.css` + `global.css` token bloğu.
**Yapılmayacak:**
- `ProductDetailPage` (ayrı turda ele alınacak)
- `portalService`, `productsApi`, `httpClient`, `store.ts` iş mantığı — yalnızca
  `ProductQuery` tipinin çoklu filtreye açılması ve `pageSize`'ın state'e alınması serbest
- Yeni npm paketi kurulumu (ikon kütüphanesi dahil)
- Diğer sayfaların CSS'i (`dashboard.css`, `orders.css`, `cart.css` …) — bu tur sadece
  ürünler; desen oturunca aynı kurallar oraya taşınacak
- Türkçe metinlerin dili/tonu değişmez, yalnız gereksiz olanlar silinir

TypeScript derlemesi temiz kalmalı (`npm run build` → `tsc -b` hata vermemeli),
mevcut testler (`npm run test`) geçmeye devam etmeli.

---

## 9. KABUL KRİTERLERİ

Bitirdiğinde her maddeyi tek tek doğrula:

- [ ] `products.css` içinde `gradient` geçen tek bir satır kalmadı
- [ ] `transform` içeren tek bir `:hover` kuralı kalmadı
- [ ] `box-shadow` yalnızca yüzen katmanlarda; kart/panel/tablo/butonda yok
- [ ] 11px'in altında `font-size` yok (`grep -E "font-size:\s*([0-9]|10)(\.[0-9]+)?px"` boş dönüyor)
- [ ] `border-radius` değerleri yalnızca `4px` ve sayaç balonu için `999px`
- [ ] `#ff5a1f` / `--primary` Ürünler sayfasında yalnızca birincil butonda ve aktif nav şeridinde
- [ ] `Firmanıza özel fiyat` metni satır/kart başına değil, sayfada **bir kez** geçiyor
- [ ] `Min. 1 {unit}` metni tamamen kaldırıldı
- [ ] 1600×900 viewport'ta kaydırmadan ≥12 ürün satırı görünüyor
- [ ] Sayfada dolgulu turuncu buton sayısı: satır başına 1, sabit bir üst aksiyon yok
- [ ] Tüm sayısal sütunlar sağa yaslı ve `tabular-nums`
- [ ] Klavyeyle gezinirken her odaklanabilir öğede lacivert focus ring görünüyor
- [ ] `npm run build` ve `npm run test` temiz

---

## 10. ÇALIŞMA ŞEKLİ

1. Önce `products.css`'i **sıfırdan yaz** — mevcut dosyayı yamalamaya çalışma, 1100 satırın
   çoğu silinecek. `ProductDetailPage` selektörlerini (`.product-detail*`, `.detail-*`,
   `.related-product*`, `.product-specifications`, `.product-documents`, `.delivery-benefits`,
   `.breadcrumb`, `.product-thumbnails`, `.quantity-*`) olduğu gibi koru ve dosyanın
   sonuna `/* --- DETAY SAYFASI: bu turda dokunulmadı --- */` yorumu altında topla.
2. Sonra `index.tsx` içindeki `ProductsPage`'i yeni yapıya göre yeniden kur.
3. `global.css`'e token bloğunu ekle.
4. Bitince bana **ne sildiğini** özetle: kaldırılan metinler, kaldırılan efektler,
   kaldırılan CSS kuralları sayısı.
5. Değişiklikleri tek seferde yap, ara onay isteme; ben ekranı görüp geri bildirim vereceğim.
