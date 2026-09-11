import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService, type ProductQuery } from "@/shared/services/portalService";
import { Badge, Card, EmptyState, ErrorState, LoadingState } from "@/shared/components/Ui";
import { formatMoney } from "@/shared/lib/format";
import type { Product } from "@/shared/types/portal";
import "./products.css";

function stockTone(stock: number) {
  return stock > 10 ? "success" : stock > 0 ? "warning" : "danger";
}

function stockDotTone(stock: number) {
  return stock > 10 ? "ok" : "warn";
}

function ProductArtwork({ image, category }: { image: string; category: string }) {
  return (
    <span className="product-artwork" aria-hidden="true">
      <span className="product-artwork-grid" />
      <span className="product-artwork-icon">{image}</span>
      <small>{category}</small>
    </span>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = () => setMatches(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function countBy(products: Product[], key: "category" | "brand") {
  const counts = new Map<string, number>();
  products.forEach((product) => counts.set(product[key], (counts.get(product[key]) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], "tr"));
}

export function ProductsPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const favorites = useCompanyContext((state) => state.favorites);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<NonNullable<ProductQuery["sort"]>>("name");
  const [view, setView] = useState<"list" | "card">("card");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const isNarrow = useMediaQuery("(max-width: 640px)");
  const effectiveView = isNarrow ? "card" : view;

  const { data: products = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["products", accountId, "catalog"],
    queryFn: () => portalService.getProducts(accountId),
  });

  const categoryOptions = useMemo(() => countBy(products, "category"), [products]);
  const brandOptions = useMemo(() => countBy(products, "brand"), [products]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("tr-TR");
    const list = products.filter((product) => {
      if (term && !`${product.name} ${product.code} ${product.brand}`.toLocaleLowerCase("tr-TR").includes(term)) return false;
      if (selectedCategories.length && !selectedCategories.includes(product.category)) return false;
      if (selectedBrands.length && !selectedBrands.includes(product.brand)) return false;
      if (inStockOnly && product.stock <= 0) return false;
      if (favoritesOnly && !favorites.includes(product.id)) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name, "tr");
    });
  }, [products, search, selectedCategories, selectedBrands, inStockOnly, favoritesOnly, favorites, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const hasFilters = Boolean(search || selectedCategories.length || selectedBrands.length || inStockOnly || favoritesOnly);

  function resetPage() {
    setPage(1);
  }

  function toggleCategory(category: string) {
    setSelectedCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
    resetPage();
  }

  function toggleBrand(brand: string) {
    setSelectedBrands((current) => current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand]);
    resetPage();
  }

  function clearFilters() {
    setSearch("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setFavoritesOnly(false);
    resetPage();
  }

  function quantityFor(product: Product) {
    return quantities[product.id] ?? 1;
  }

  function changeQuantity(product: Product, delta: number) {
    const max = Math.max(1, product.stock);
    setQuantities((current) => ({ ...current, [product.id]: Math.min(max, Math.max(1, quantityFor(product) + delta)) }));
  }

  function setQuantityDirect(product: Product, value: number) {
    const max = Math.max(1, product.stock);
    setQuantities((current) => ({ ...current, [product.id]: Math.min(max, Math.max(1, value || 1)) }));
  }

  function handleAdd(product: Product) {
    addToCart(product.id, quantityFor(product));
    setAddedProductId(product.id);
    window.setTimeout(() => setAddedProductId((current) => current === product.id ? null : current), 1200);
  }

  function toggleSelect(id: number) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleSelectAllVisible() {
    setSelectedIds((current) => {
      const allSelected = visible.length > 0 && visible.every((product) => current.includes(product.id));
      if (allSelected) return current.filter((id) => !visible.some((product) => product.id === id));
      return [...new Set([...current, ...visible.map((product) => product.id)])];
    });
  }

  function addSelectedToCart() {
    selectedIds.forEach((id) => {
      const product = products.find((item) => item.id === id);
      if (product && product.stock > 0) addToCart(id, quantityFor(product));
    });
    setSelectedIds([]);
  }

  async function exportCatalog() {
    setIsExporting(true);
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ürünler");
      worksheet.columns = [
        { header: "Stok Kodu", key: "code", width: 16 },
        { header: "Ürün Adı", key: "name", width: 42 },
        { header: "Marka", key: "brand", width: 18 },
        { header: "Kategori", key: "category", width: 18 },
        { header: "Birim", key: "unit", width: 10 },
        { header: "Stok", key: "stock", width: 10 },
        { header: "Birim Fiyat", key: "price", width: 14 },
      ];
      worksheet.getRow(1).font = { bold: true };
      filtered.forEach((product) => {
        worksheet.addRow({
          code: product.code,
          name: product.name,
          brand: product.brand,
          category: product.category,
          unit: product.unit,
          stock: product.stock,
          price: product.price,
        });
      });
      worksheet.getColumn("price").numFmt = '₺#,##0.00';
      const buffer = await workbook.xlsx.writeBuffer();
      const url = URL.createObjectURL(new Blob([buffer as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "netsim-urunler.xlsx";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ürün listesi dışa aktarılamadı", error);
    } finally {
      setIsExporting(false);
    }
  }

  function pageNumbers() {
    const end = Math.min(totalPages, Math.max(4, safePage + 2));
    const start = Math.max(1, end - 4);
    const numbers: number[] = [];
    for (let n = start; n <= end; n += 1) numbers.push(n);
    return numbers;
  }

  const allVisibleSelected = visible.length > 0 && visible.every((product) => selectedIds.includes(product.id));

  return (
    <div className="page products-page">
      <header className="products-topbar">
        <div>
          <nav className="products-crumb" aria-label="Sayfa yolu"><Link to="/dashboard">Ana Sayfa</Link><span>/</span><span>Ürünler</span></nav>
          <h1>Ürünler</h1>
        </div>
        <div className="products-topbar-actions">
          <button className="button" type="button" disabled={isExporting || !filtered.length} onClick={exportCatalog}>{isExporting ? "Aktarılıyor…" : "Excel'e Aktar"}</button>
          <Link className="button" to="/hizli-siparis">Hızlı Sipariş</Link>
        </div>
      </header>

      {isLoading && (
        <div className="product-table-wrap">
          <div className="product-skeleton" role="status" aria-label="Ürünler yükleniyor">
            {Array.from({ length: 12 }).map((_, index) => <div className="product-skeleton-row" key={index} />)}
          </div>
        </div>
      )}

      {isError && (
        <div className="product-table-wrap">
          <div className="product-state">
            <p>Ürünler şu anda yüklenemedi.</p>
            <button className="text-action" type="button" onClick={() => refetch()}>Tekrar dene</button>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="products-layout">
          <details className="product-filters" open>
            <summary>Filtreler{hasFilters && <em className="filters-badge" aria-hidden="true" />}</summary>

            <div className="filter-section">
              <h2>Kategori</h2>
              {categoryOptions.map(([category, count]) => (
                <label className="filter-check" key={category}>
                  <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} />
                  <span>{category}</span><em>{count}</em>
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h2>Marka</h2>
              {brandOptions.map(([brand, count]) => (
                <label className="filter-check" key={brand}>
                  <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
                  <span>{brand}</span><em>{count}</em>
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h2>Durum</h2>
              <label className="filter-check">
                <input type="checkbox" checked={inStockOnly} onChange={(event) => { setInStockOnly(event.target.checked); resetPage(); }} />
                <span>Yalnızca stoktakiler</span>
              </label>
              <label className="filter-check">
                <input type="checkbox" checked={favoritesOnly} onChange={(event) => { setFavoritesOnly(event.target.checked); resetPage(); }} />
                <span>Favorilerim</span>
              </label>
            </div>

            {hasFilters && <button className="text-action filter-clear" type="button" onClick={clearFilters}>Filtreleri temizle</button>}
          </details>

          <section className="product-results" aria-label="Ürün sonuçları">
            <div className="products-toolbar">
              <label className="toolbar-search">
                <span aria-hidden="true">⌕</span>
                <input aria-label="Ürün ara" placeholder="Ürün adı, stok kodu veya marka ara..." value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} />
              </label>
              <select className="select toolbar-sort" aria-label="Sırala" value={sort} onChange={(event) => { setSort(event.target.value as typeof sort); resetPage(); }}>
                <option value="name">Ürün adına göre</option>
                <option value="price-asc">Fiyat: Artan</option>
                <option value="price-desc">Fiyat: Azalan</option>
              </select>
              {!isNarrow && (
                <div className="view-switch" role="group" aria-label="Görünüm">
                  <button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")}>Liste</button>
                  <button type="button" className={view === "card" ? "active" : ""} onClick={() => setView("card")}>Kart</button>
                </div>
              )}
            </div>

            <div className="products-meta-row">
              <div className="products-meta-chips">
                <span className="products-count">{filtered.length} kayıt</span>
                {search && <button className="filter-chip" type="button" onClick={() => { setSearch(""); resetPage(); }}>“{search}” ×</button>}
                {selectedCategories.map((category) => <button className="filter-chip" type="button" key={category} onClick={() => toggleCategory(category)}>{category} ×</button>)}
                {selectedBrands.map((brand) => <button className="filter-chip" type="button" key={brand} onClick={() => toggleBrand(brand)}>{brand} ×</button>)}
                {inStockOnly && <button className="filter-chip" type="button" onClick={() => { setInStockOnly(false); resetPage(); }}>Stokta ×</button>}
                {favoritesOnly && <button className="filter-chip" type="button" onClick={() => { setFavoritesOnly(false); resetPage(); }}>Favorilerim ×</button>}
              </div>
              <p className="products-price-note">Fiyatlar firmanıza özel net fiyattır, KDV hariç.</p>
            </div>

            {!visible.length ? (
              <div className="product-table-wrap">
                <div className="product-state">
                  <p>Bu filtrelerle ürün bulunamadı.</p>
                  {hasFilters && <button className="text-action" type="button" onClick={clearFilters}>Filtreleri temizle</button>}
                </div>
              </div>
            ) : effectiveView === "list" ? (
              <div className="product-table-wrap">
                {selectedIds.length > 0 && (
                  <div className="bulk-bar">
                    <span>{selectedIds.length} ürün seçildi</span>
                    <button type="button" onClick={addSelectedToCart}>Seçilenleri sepete ekle</button>
                    <button type="button" onClick={() => setSelectedIds([])}>Seçimi temizle</button>
                  </div>
                )}
                <table className="product-table">
                  <thead>
                    <tr>
                      <th className="col-select"><input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAllVisible} aria-label="Sayfadaki tümünü seç" /></th>
                      <th>Stok Kodu</th>
                      <th>Ürün</th>
                      <th className="col-unit">Birim</th>
                      <th className="col-num">Stok</th>
                      <th className="col-num">Birim Fiyat</th>
                      <th className="col-qty">Miktar</th>
                      <th className="col-action" />
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((product) => (
                      <tr key={product.id}>
                        <td className="col-select"><input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleSelect(product.id)} aria-label={`${product.name} satırını seç`} /></td>
                        <td className="col-code">{product.code}</td>
                        <td className="col-name">
                          <Link to={`/urunler/${product.id}`}>{product.name}</Link>
                          <small>{product.brand}{favorites.includes(product.id) && <em className="fav-mark" aria-label="Favori">★</em>}</small>
                        </td>
                        <td className="col-unit">{product.unit}</td>
                        <td className="col-num">
                          {product.stock > 0
                            ? <><i className={`stock-dot tone-${stockDotTone(product.stock)}`} aria-hidden="true" />{product.stock} {product.unit}</>
                            : <span className="stock-out">Stokta yok</span>}
                        </td>
                        <td className="col-num col-price">{formatMoney(product.price)}<small>+ KDV</small></td>
                        <td className="col-qty">
                          <div className="qty-stepper">
                            <button type="button" aria-label="Miktarı azalt" disabled={!product.stock} onClick={() => changeQuantity(product, -1)}>−</button>
                            <input type="number" min={1} max={Math.max(1, product.stock)} value={quantityFor(product)} disabled={!product.stock} onChange={(event) => setQuantityDirect(product, Number(event.target.value))} aria-label="Miktar" />
                            <button type="button" aria-label="Miktarı artır" disabled={!product.stock} onClick={() => changeQuantity(product, 1)}>＋</button>
                          </div>
                        </td>
                        <td className="col-action">
                          <button className="button button-primary" type="button" disabled={!product.stock} onClick={() => handleAdd(product)}>{addedProductId === product.id ? "Eklendi" : "Sepete"}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="product-card-grid">
                {visible.map((product) => (
                  <div className="product-card" key={product.id}>
                    <Link className="product-card-image" to={`/urunler/${product.id}`} aria-label={`${product.name} detayını aç`}>
                      <ProductArtwork image={product.image} category={product.category} />
                      {favorites.includes(product.id) && <em className="fav-mark product-card-fav" aria-label="Favori">★</em>}
                    </Link>
                    <div className="product-card-top">
                      <span>{product.code}</span>
                    </div>
                    <Link className="product-card-name" to={`/urunler/${product.id}`}>{product.name}</Link>
                    <span className="product-card-brand">{product.brand}</span>
                    <div className="product-card-stock">
                      {product.stock > 0
                        ? <><i className={`stock-dot tone-${stockDotTone(product.stock)}`} aria-hidden="true" />{product.stock} {product.unit}</>
                        : <span className="stock-out">Stokta yok</span>}
                    </div>
                    <div className="product-card-price">{formatMoney(product.price)}<small>+ KDV</small></div>
                    <div className="qty-stepper">
                      <button type="button" aria-label="Miktarı azalt" disabled={!product.stock} onClick={() => changeQuantity(product, -1)}>−</button>
                      <input type="number" min={1} max={Math.max(1, product.stock)} value={quantityFor(product)} disabled={!product.stock} onChange={(event) => setQuantityDirect(product, Number(event.target.value))} aria-label="Miktar" />
                      <button type="button" aria-label="Miktarı artır" disabled={!product.stock} onClick={() => changeQuantity(product, 1)}>＋</button>
                    </div>
                    <button className="button button-primary" type="button" disabled={!product.stock} onClick={() => handleAdd(product)}>{addedProductId === product.id ? "Eklendi" : "Sepete Ekle"}</button>
                  </div>
                ))}
              </div>
            )}

            {visible.length > 0 && (
              <div className="table-footer">
                <div className="table-footer-info">
                  <span>{filtered.length} kayıttan {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} arası</span>
                  <label className="page-size">Sayfa boyutu
                    <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}>
                      <option value={12}>12</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </label>
                </div>
                <div className="table-pagination">
                  <button type="button" disabled={safePage === 1} onClick={() => setPage((value) => value - 1)}>‹</button>
                  {pageNumbers().map((number) => (
                    <button type="button" key={number} className={number === safePage ? "active" : ""} onClick={() => setPage(number)}>{number}</button>
                  ))}
                  <button type="button" disabled={safePage === totalPages} onClick={() => setPage((value) => value + 1)}>›</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const favorites = useCompanyContext((state) => state.favorites);
  const toggleFavorite = useCompanyContext((state) => state.toggleFavorite);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", accountId, id],
    queryFn: () => portalService.getProduct(accountId, Number(id)),
  });
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["products", accountId, "related", product?.category],
    queryFn: () => portalService.getProducts(accountId, { category: product?.category }),
    enabled: Boolean(product),
  });

  if (isLoading) return <div className="page"><LoadingState /></div>;
  if (isError) return <div className="page"><ErrorState /></div>;
  if (!product) return <div className="page"><EmptyState title="Ürün bulunamadı" description="Ürün kaldırılmış veya erişiminize kapatılmış olabilir." /></div>;

  const taxIncludedPrice = product.price * 1.2;
  const subtotal = product.price * quantity;
  const productId = product.id;
  const specifications = [
    ["Stok Kodu", product.code],
    ["Marka", product.brand],
    ["Kategori", product.category],
    ["Satış Birimi", product.unit],
    ["Menşei", "Türkiye"],
    ["Garanti", "24 Ay"],
    ["KDV Oranı", "%20"],
    ["Sevk Süresi", product.stock > 0 ? "1–2 iş günü" : "Termin sorunuz"],
  ];

  function handleDetailAdd() {
    addToCart(productId, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="page product-detail-page">
      <nav className="breadcrumb" aria-label="Sayfa yolu"><Link to="/dashboard">Ana Sayfa</Link><span>›</span><Link to="/urunler">Ürünler</Link><span>›</span><Link to="/urunler">{product.category}</Link><span>›</span><strong>{product.code}</strong></nav>

      <section className="product-detail">
        <div className="product-gallery">
          <Card className="product-detail-visual">
            <ProductArtwork image={product.image} category={product.category} />
            <button className={`detail-favorite ${favorites.includes(product.id) ? "is-favorite" : ""}`} type="button" onClick={() => toggleFavorite(product.id)} aria-label={favorites.includes(product.id) ? "Favorilerden çıkar" : "Favoriye ekle"}>♥</button>
          </Card>
          <div className="product-thumbnails">
            <button className="active" type="button"><ProductArtwork image={product.image} category={product.category} /></button>
            <button type="button"><span aria-hidden="true">360°</span></button>
            <button type="button"><span aria-hidden="true">⌗</span></button>
          </div>
        </div>

        <div className="product-detail-copy">
          <div className="detail-brand-row"><span>{product.brand}</span><small>Stok Kodu: <strong>{product.code}</strong></small></div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="detail-availability">
            <Badge tone={stockTone(product.stock)}>{product.stock > 0 ? "● Stokta" : "Stokta yok"}</Badge>
            {product.stock > 0 && <span><strong>{product.stock} {product.unit}</strong> hemen sevke hazır</span>}
          </div>

          <Card className="product-purchase-card">
            <div className="detail-price">
              <small>Firmanıza özel net fiyat</small>
              <div><strong>{formatMoney(product.price)}</strong><span>+ KDV</span></div>
              <p>KDV dahil {formatMoney(taxIncludedPrice)}</p>
            </div>
            <div className="detail-purchase-divider" />
            <label className="quantity-label">Miktar <small>({product.unit})</small></label>
            <div className="quantity-control">
              <button type="button" aria-label="Miktarı azalt" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <input type="number" min="1" max={product.stock} value={quantity} onChange={(event) => setQuantity(Math.min(product.stock, Math.max(1, Number(event.target.value) || 1)))} aria-label="Miktar" />
              <button type="button" aria-label="Miktarı artır" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}>＋</button>
            </div>
            <div className="detail-subtotal"><span>Ara toplam</span><strong>{formatMoney(subtotal)}</strong></div>
            <button className={`button button-primary detail-add-button ${added ? "is-added" : ""}`} disabled={!product.stock} onClick={handleDetailAdd}>{added ? "✓ Sepete Eklendi" : "Sepete Ekle"}</button>
            <Link className="detail-quote-link" to="/destek">Yüksek miktar için teklif isteyin →</Link>
          </Card>

          <div className="delivery-benefits">
            <div><span aria-hidden="true">▤</span><p><strong>Güvenli ödeme</strong><small>Vadeli hesap veya havale</small></p></div>
            <div><span aria-hidden="true">→</span><p><strong>Hızlı sevkiyat</strong><small>1–2 iş gününde kargoda</small></p></div>
            <div><span aria-hidden="true">✓</span><p><strong>Netsim güvencesi</strong><small>Yetkili ürün garantisi</small></p></div>
          </div>
        </div>
      </section>

      <section className="product-information">
        <Card className="product-specifications">
          <div className="product-section-heading"><span>Ürün Bilgileri</span><h2>Teknik özellikler</h2><p>Sipariş vermeden önce ürünün temel teknik bilgilerini inceleyin.</p></div>
          <dl>{specifications.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </Card>
        <Card className="product-documents">
          <div className="product-section-heading"><span>Dokümanlar</span><h2>Teknik belgeler</h2><p>Ürüne ait güncel dokümanları görüntüleyin.</p></div>
          <button type="button"><span aria-hidden="true">PDF</span><div><strong>Ürün Teknik Föyü</strong><small>PDF · 1,2 MB</small></div><b>↓</b></button>
          <button type="button"><span aria-hidden="true">PDF</span><div><strong>Kullanım ve Montaj Kılavuzu</strong><small>PDF · 2,8 MB</small></div><b>↓</b></button>
          <div className="notice">Fiyat, stok ve teknik bilgiler sipariş onayı öncesinde tekrar doğrulanacaktır.</div>
        </Card>
      </section>

      {relatedProducts.filter((item) => item.id !== product.id).length > 0 && (
        <section className="related-products">
          <div className="related-products-heading"><div><span>Benzer Ürünler</span><h2>Bunlar da ilginizi çekebilir</h2></div><Link to="/urunler">Tüm ürünleri gör →</Link></div>
          <div>
            {relatedProducts.filter((item) => item.id !== product.id).slice(0, 4).map((item) => (
              <Link className="related-product-card" to={`/urunler/${item.id}`} key={item.id}>
                <ProductArtwork image={item.image} category={item.category} />
                <div><small>{item.brand} · {item.code}</small><strong>{item.name}</strong><b>{formatMoney(item.price)}</b></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

