import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService, type ProductQuery } from "@/shared/services/portalService";
import { Badge, Card, EmptyState, ErrorState, LoadingState, PageHeader } from "@/shared/components/Ui";
import { formatMoney } from "@/shared/lib/format";
import "./products.css";

export function ProductsPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const favorites = useCompanyContext((state) => state.favorites);
  const toggleFavorite = useCompanyContext((state) => state.toggleFavorite);
  const [query, setQuery] = useState<ProductQuery>({ sort: "name" });
  const [page, setPage] = useState(1);
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["products", accountId, query],
    queryFn: () => portalService.getProducts(accountId, query),
  });
  const categories = useMemo(() => ["Motorlar", "Pompalar", "Redüktörler", "Otomasyon", "Rulmanlar", "Vanalar", "Elektrik", "Hidrolik"], []);
  const pageSize = 8;
  const visibleProducts = data.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  function updateQuery(next: Partial<ProductQuery>) {
    setQuery((current) => ({ ...current, ...next }));
    setPage(1);
  }

  return (
    <div className="page">
      <PageHeader title="Ürünler" description="Size özel fiyat ve güncel stok bilgileriyle ürünleri keşfedin." />
      <div className="toolbar">
        <input className="input" aria-label="Ürün ara" placeholder="Ürün adı, kodu veya marka ara" value={query.search ?? ""} onChange={(event) => updateQuery({ search: event.target.value })} />
        <select className="select" aria-label="Kategori" value={query.category ?? ""} onChange={(event) => updateQuery({ category: event.target.value || undefined })}>
          <option value="">Tüm kategoriler</option>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <select className="select" aria-label="Sıralama" value={query.sort} onChange={(event) => updateQuery({ sort: event.target.value as ProductQuery["sort"] })}>
          <option value="name">Ürün adına göre</option>
          <option value="price-asc">Fiyat: Artan</option>
          <option value="price-desc">Fiyat: Azalan</option>
        </select>
        <label className="stock-filter"><input type="checkbox" checked={query.inStock ?? false} onChange={(event) => updateQuery({ inStock: event.target.checked })} /> Stoktakiler</label>
      </div>

      {isLoading && <LoadingState label="Ürünler yükleniyor" />}
      {isError && <ErrorState />}
      {!isLoading && !isError && !visibleProducts.length && <Card><EmptyState title="Ürün bulunamadı" description="Arama veya filtre kriterlerinizi değiştirerek tekrar deneyin." /></Card>}
      {!isLoading && !isError && Boolean(visibleProducts.length) && (
        <>
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <Card className="product-card" key={product.id}>
                <button className={`favorite-button ${favorites.includes(product.id) ? "is-favorite" : ""}`} type="button" aria-label="Favoriye ekle" onClick={() => toggleFavorite(product.id)}>♥</button>
                <Link className="product-visual" to={`/urunler/${product.id}`} aria-label={`${product.name} detayını aç`}>{product.image}</Link>
                <div className="product-card-body">
                  <div className="product-meta"><span>{product.brand}</span><span>{product.code}</span></div>
                  <Link className="product-name" to={`/urunler/${product.id}`}>{product.name}</Link>
                  <div className="product-stock">
                    <Badge tone={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "danger"}>
                      {product.stock > 0 ? `${product.stock} ${product.unit} stokta` : "Stokta yok"}
                    </Badge>
                  </div>
                  <div className="product-buy">
                    <div><small>Size özel</small><strong>{formatMoney(product.price)}</strong></div>
                    <button className="button button-primary" type="button" disabled={!product.stock} onClick={() => addToCart(product.id)}>Sepete Ekle</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="pagination">
            <span>{data.length} ürün</span>
            <div>
              <button className="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Önceki</button>
              <span>{page} / {totalPages}</span>
              <button className="button" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Sonraki</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", accountId, id],
    queryFn: () => portalService.getProduct(accountId, Number(id)),
  });

  if (isLoading) return <div className="page"><LoadingState /></div>;
  if (!product) return <div className="page"><EmptyState title="Ürün bulunamadı" description="Ürün kaldırılmış veya erişiminize kapatılmış olabilir." /></div>;

  return (
    <div className="page">
      <div className="breadcrumb"><Link to="/urunler">Ürünler</Link><span>/</span><span>{product.name}</span></div>
      <div className="product-detail">
        <Card className="product-detail-visual">{product.image}</Card>
        <div className="product-detail-copy">
          <span className="muted">{product.brand} · {product.code}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="detail-price"><small>Size özel fiyat</small><strong>{formatMoney(product.price)}</strong><span>KDV hariç</span></div>
          <Badge tone={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "danger"}>{product.stock > 0 ? `${product.stock} ${product.unit} satılabilir` : "Stokta yok"}</Badge>
          <div className="detail-actions">
            <input className="input quantity-input" type="number" min="1" max={product.stock} value={quantity} onChange={(event) => setQuantity(Math.min(product.stock, Math.max(1, Number(event.target.value) || 1)))} aria-label="Miktar" />
            <button className="button button-primary" disabled={!product.stock} onClick={() => addToCart(product.id, quantity)}>Sepete Ekle</button>
          </div>
          <div className="notice">Fiyat ve stok bilgisi sipariş öncesinde tekrar doğrulanacaktır.</div>
        </div>
      </div>
    </div>
  );
}

