import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService, type ProductQuery } from "@/shared/services/portalService";
import { Badge, Card, EmptyState, ErrorState, LoadingState } from "@/shared/components/Ui";
import { formatMoney } from "@/shared/lib/format";
import "./products.css";

function stockTone(stock: number) {
  return stock > 10 ? "success" : stock > 0 ? "warning" : "danger";
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

export function ProductsPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const favorites = useCompanyContext((state) => state.favorites);
  const toggleFavorite = useCompanyContext((state) => state.toggleFavorite);
  const [query, setQuery] = useState<ProductQuery>({ sort: "name" });
  const [page, setPage] = useState(1);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["products", accountId, query],
    queryFn: () => portalService.getProducts(accountId, query),
  });
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", accountId, "catalog-counts"],
    queryFn: () => portalService.getProducts(accountId),
  });
  const brands = useMemo(() => [...new Set(allProducts.map((product) => product.brand))].sort((a, b) => a.localeCompare(b, "tr")), [allProducts]);
  const categories = useMemo(() => [...new Set(allProducts.map((product) => product.category))].sort((a, b) => a.localeCompare(b, "tr")), [allProducts]);
  const pageSize = 8;
  const visibleProducts = data.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const hasFilters = Boolean(query.search || query.category || query.brand || query.inStock);

  function updateQuery(next: Partial<ProductQuery>) {
    setQuery((current) => ({ ...current, ...next }));
    setPage(1);
  }

  function handleAddToCart(productId: number) {
    addToCart(productId);
    setAddedProductId(productId);
    window.setTimeout(() => setAddedProductId((current) => current === productId ? null : current), 1400);
  }

  function clearFilters() {
    setQuery({ sort: query.sort ?? "name" });
    setPage(1);
  }

  return (
    <div className="page products-page">
      <header className="products-header">
        <div>
          <span className="products-eyebrow">B2B Ürün Kataloğu</span>
          <h1>Ürünler</h1>
          <p>Firmanıza özel fiyatlar, güncel stoklar ve teknik ürün bilgileri.</p>
        </div>
        <Link className="button products-quote-button" to="/teklifler">◇ Tekliflerimi Gör</Link>
      </header>

      <Card className="product-toolbar">
        <label className="product-search">
          <span aria-hidden="true">⌕</span>
          <input aria-label="Ürün ara" placeholder="Ürün adı, stok kodu veya marka ara..." value={query.search ?? ""} onChange={(event) => updateQuery({ search: event.target.value })} />
        </label>
        <select className="select" aria-label="Kategori" value={query.category ?? ""} onChange={(event) => updateQuery({ category: event.target.value || undefined })}>
          <option value="">Tüm kategoriler</option>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <select className="select" aria-label="Marka" value={query.brand ?? ""} onChange={(event) => updateQuery({ brand: event.target.value || undefined })}>
          <option value="">Tüm markalar</option>
          {brands.map((brand) => <option key={brand}>{brand}</option>)}
        </select>
        <select className="select" aria-label="Sıralama" value={query.sort} onChange={(event) => updateQuery({ sort: event.target.value as ProductQuery["sort"] })}>
          <option value="name">Ürün adına göre</option>
          <option value="price-asc">Fiyat: Artan</option>
          <option value="price-desc">Fiyat: Azalan</option>
        </select>
        <label className="stock-filter"><input type="checkbox" checked={query.inStock ?? false} onChange={(event) => updateQuery({ inStock: event.target.checked })} /><span>Yalnızca stoktakiler</span></label>
      </Card>

      {isLoading && <LoadingState label="Ürünler yükleniyor" />}
      {isError && <ErrorState />}

      {!isLoading && !isError && (
        <div className="product-catalog-layout">
          <Card className="product-category-panel">
            <div className="category-panel-title"><strong>Kategoriler</strong><span>{allProducts.length} ürün</span></div>
            <button className={!query.category ? "active" : ""} type="button" onClick={() => updateQuery({ category: undefined })}>
              <span>Tüm Ürünler</span><small>{allProducts.length}</small>
            </button>
            {categories.map((category) => (
              <button className={query.category === category ? "active" : ""} type="button" key={category} onClick={() => updateQuery({ category })}>
                <span>{category}</span><small>{allProducts.filter((product) => product.category === category).length}</small>
              </button>
            ))}
            <div className="catalog-help">
              <span aria-hidden="true">?</span>
              <div><strong>Ürün bulamadınız mı?</strong><Link to="/destek">Destek ekibine sorun</Link></div>
            </div>
          </Card>

          <section className="product-results" aria-label="Ürün sonuçları">
            <div className="product-results-header">
              <div><strong>{data.length} ürün bulundu</strong><span>{query.category ?? "Tüm kategoriler"} · Firmanıza özel fiyatlar</span></div>
              {hasFilters && <button type="button" onClick={clearFilters}>Filtreleri temizle ×</button>}
            </div>

            {!visibleProducts.length ? (
              <Card><EmptyState title="Ürün bulunamadı" description="Arama veya filtre kriterlerinizi değiştirerek tekrar deneyin." /></Card>
            ) : (
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <Card className="product-card" key={product.id}>
                    <button className={`favorite-button ${favorites.includes(product.id) ? "is-favorite" : ""}`} type="button" aria-label={favorites.includes(product.id) ? "Favorilerden çıkar" : "Favoriye ekle"} onClick={() => toggleFavorite(product.id)}>♥</button>
                    <Link className="product-visual" to={`/urunler/${product.id}`} aria-label={`${product.name} detayını aç`}>
                      <ProductArtwork image={product.image} category={product.category} />
                    </Link>
                    <div className="product-card-body">
                      <div className="product-meta"><span>{product.brand}</span><span>{product.code}</span></div>
                      <Link className="product-name" to={`/urunler/${product.id}`}>{product.name}</Link>
                      <div className="product-stock">
                        <Badge tone={stockTone(product.stock)}>
                          {product.stock > 0 ? `${product.stock} ${product.unit} stokta` : "Stokta yok"}
                        </Badge>
                        <span>Min. 1 {product.unit}</span>
                      </div>
                      <div className="product-price"><small>Firmanıza özel fiyat</small><strong>{formatMoney(product.price)}</strong><span>+ KDV</span></div>
                      <div className="product-buy">
                        <Link className="product-detail-link" to={`/urunler/${product.id}`}>Detayları Gör</Link>
                        <button className={`button button-primary ${addedProductId === product.id ? "is-added" : ""}`} type="button" disabled={!product.stock} onClick={() => handleAddToCart(product.id)}>
                          {addedProductId === product.id ? "✓ Eklendi" : "Sepete Ekle"}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {visibleProducts.length > 0 && (
              <div className="pagination">
                <span>{data.length} üründen {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, data.length)} arası gösteriliyor</span>
                <div>
                  <button className="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>← Önceki</button>
                  <span>Sayfa <strong>{page}</strong> / {totalPages}</span>
                  <button className="button" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Sonraki →</button>
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

