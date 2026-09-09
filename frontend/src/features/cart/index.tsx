import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Card, EmptyState, LoadingState, PageHeader } from "@/shared/components/Ui";
import { formatMoney } from "@/shared/lib/format";
import "./cart.css";

export function CartPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const storedLines = useCompanyContext((state) => state.cartByAccount[state.activeCariNo]);
  const lines = storedLines ?? [];
  const updateCartLine = useCompanyContext((state) => state.updateCartLine);
  const removeCartLine = useCompanyContext((state) => state.removeCartLine);
  const clearCart = useCompanyContext((state) => state.clearCart);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", accountId, "cart"],
    queryFn: () => portalService.getProducts(accountId),
  });

  const cartLines = lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const total = cartLines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  return (
    <div className="page">
      <PageHeader
        title="Sepetim"
        description={`${lines.length} farklı ürün`}
        action={lines.length ? <button className="button button-danger" onClick={() => clearCart()}>Sepeti Temizle</button> : undefined}
      />
      {isLoading && <LoadingState />}
      {!isLoading && !cartLines.length && (
        <Card><EmptyState title="Sepetiniz boş" description="İhtiyacınız olan ürünleri kataloğumuzdan sepete ekleyebilirsiniz." action={<Link className="button button-primary" to="/urunler">Ürünlere Git</Link>} /></Card>
      )}
      {!isLoading && Boolean(cartLines.length) && (
        <div className="cart-layout">
          <div className="cart-lines">
            {cartLines.map(({ product, quantity }) => (
              <Card className="cart-line" key={product.id}>
                <div className="cart-product-icon">{product.image}</div>
                <div className="cart-product-copy">
                  <span>{product.code} · {product.brand}</span>
                  <Link to={`/urunler/${product.id}`}>{product.name}</Link>
                  <small>{formatMoney(product.price)} / {product.unit}</small>
                </div>
                <div className="quantity-control">
                  <button aria-label="Miktarı azalt" onClick={() => updateCartLine(product.id, quantity - 1)}>−</button>
                  <input type="number" min="1" max={product.stock} value={quantity} aria-label={`${product.name} miktarı`} onChange={(event) => updateCartLine(product.id, Math.min(product.stock, Math.max(1, Number(event.target.value) || 1)))} />
                  <button aria-label="Miktarı artır" disabled={quantity >= product.stock} onClick={() => updateCartLine(product.id, quantity + 1)}>+</button>
                </div>
                <strong className="cart-line-total">{formatMoney(product.price * quantity)}</strong>
                <button className="remove-line" aria-label={`${product.name} ürününü kaldır`} onClick={() => removeCartLine(product.id)}>×</button>
              </Card>
            ))}
          </div>
          <Card className="cart-summary">
            <h2>Sipariş Özeti</h2>
            <div><span>Ara toplam</span><strong>{formatMoney(total)}</strong></div>
            <div><span>KDV</span><span>Sipariş sırasında hesaplanır</span></div>
            <div className="cart-grand-total"><span>Tahmini toplam</span><strong>{formatMoney(total)}</strong></div>
            <p>Fiyat ve stok sipariş öncesinde tekrar doğrulanacaktır.</p>
            <Link className="button button-primary" to="/checkout">Siparişe Devam Et</Link>
          </Card>
        </div>
      )}
    </div>
  );
}

