import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { CompanyLogo } from "@/shared/components/CompanyLogo";
import { Badge, Card, EmptyState, LoadingState } from "@/shared/components/Ui";
import { formatDate, formatMoney } from "@/shared/lib/format";
import "./dashboard.css";

export function DashboardPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const storedCart = useCompanyContext((state) => state.cartByAccount[state.activeCariNo]);
  const cart = storedCart ?? [];
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["orders", accountId], queryFn: () => portalService.getOrders(accountId) });
  const { data: products = [] } = useQuery({ queryKey: ["products", accountId, "featured"], queryFn: () => portalService.getProducts(accountId) });
  const account = accounts.find((item) => item.id === accountId);
  const openOrders = orders.filter((order) => order.status !== "Sevk Edildi").length;
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const totalCredit = (account?.balance ?? 0) + (account?.availableCredit ?? 0);
  const creditUsage = totalCredit > 0 ? Math.min(100, ((account?.balance ?? 0) / totalCredit) * 100) : 0;
  const today = new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div className="page dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-welcome">
          {account && (
            <CompanyLogo
              className="dashboard-company-logo"
              name={account.name}
              logoUrl={account.logoUrl}
              color={account.brandColor}
            />
          )}
          <div>
            <span className="dashboard-date">{today}</span>
            <h1>Günaydın, Burak</h1>
            <p><strong>{account?.name ?? "Firmanız"}</strong> için güncel ticari görünüm.</p>
          </div>
        </div>
        <div className="dashboard-header-actions">
          <Link className="button dashboard-secondary-action" to="/hizli-siparis">Hızlı Sipariş</Link>
          <Link className="button button-primary" to="/urunler"><span aria-hidden="true">＋</span> Yeni Sipariş</Link>
        </div>
      </header>

      <div className="dashboard-metrics">
        <Card className="dashboard-stat dashboard-stat-balance">
          <div className="dashboard-stat-head"><span className="dashboard-stat-icon" aria-hidden="true">₺</span><p>Cari Bakiye</p></div>
          <strong className="dashboard-stat-value">{formatMoney(account?.balance ?? 0)}</strong>
          <div className="dashboard-stat-footer">
            <Link to="/finans">Hesap hareketleri <span aria-hidden="true">→</span></Link>
            {(account?.overdueAmount ?? 0) > 0 && <span className="dashboard-alert">Vadesi geçen: {formatMoney(account?.overdueAmount ?? 0)}</span>}
          </div>
        </Card>

        <Card className="dashboard-stat dashboard-stat-credit">
          <div className="dashboard-stat-head"><span className="dashboard-stat-icon" aria-hidden="true">↗</span><p>Kullanılabilir Limit</p></div>
          <strong className="dashboard-stat-value metric-success">{formatMoney(account?.availableCredit ?? 0)}</strong>
          <div className="credit-progress" aria-label={`Kredi kullanım oranı yüzde ${Math.round(creditUsage)}`}>
            <span style={{ width: `${creditUsage}%` }} />
          </div>
          <small>Limitin %{Math.round(creditUsage)} kadarı kullanıldı</small>
        </Card>

        <Card className="dashboard-stat dashboard-stat-orders">
          <div className="dashboard-stat-head"><span className="dashboard-stat-icon" aria-hidden="true">◷</span><p>Açık Sipariş</p></div>
          <strong className="dashboard-stat-value">{openOrders}</strong>
          <div className="dashboard-stat-footer">
            <Link to="/siparisler">Siparişleri görüntüle <span aria-hidden="true">→</span></Link>
            <span>Aktif işlem</span>
          </div>
        </Card>

        <Card className="dashboard-stat dashboard-stat-cart">
          <div className="dashboard-stat-head"><span className="dashboard-stat-icon" aria-hidden="true">▣</span><p>Sepetteki Ürün</p></div>
          <strong className="dashboard-stat-value">{cartCount}</strong>
          <div className="dashboard-stat-footer">
            <Link to="/sepet">Sepete git <span aria-hidden="true">→</span></Link>
            <span>{cart.length} farklı kalem</span>
          </div>
        </Card>
      </div>

      <Card className="dashboard-banner">
        <div className="dashboard-banner-copy">
          <Badge tone="warning">Eylül fırsatı</Badge>
          <h2>Seçili motor ve sürücülerde avantajlı fiyatlar</h2>
          <p>Firmanıza özel kampanya koşullarını ve güncel stokları inceleyin.</p>
          <Link className="button button-primary" to="/urunler">Kampanyayı İncele <span aria-hidden="true">→</span></Link>
        </div>
        <nav className="dashboard-quick-actions" aria-label="Hızlı işlemler">
          <Link to="/hizli-siparis"><span aria-hidden="true">＋</span><div><strong>Hızlı Sipariş</strong><small>Ürün koduyla ekle</small></div></Link>
          <Link to="/teklifler"><span aria-hidden="true">◇</span><div><strong>Teklifler</strong><small>Güncel teklifleri gör</small></div></Link>
          <Link to="/finans"><span aria-hidden="true">₺</span><div><strong>Cari Hesap</strong><small>Bakiyeyi incele</small></div></Link>
        </nav>
      </Card>

      <div className="dashboard-columns">
        <Card className="dashboard-panel">
          <div className="section-heading"><div><h2>Son Siparişler</h2><p>En son oluşturulan siparişleriniz</p></div><Link to="/siparisler">Tümünü Gör <span aria-hidden="true">→</span></Link></div>
          {isLoading ? <LoadingState /> : orders.length === 0 ? (
            <EmptyState title="Henüz sipariş yok" description="İlk siparişinizi ürün kataloğundan oluşturabilirsiniz." />
          ) : (
            <div className="dashboard-order-list">
              {orders.slice(0, 4).map((order) => (
                <Link className="dashboard-order" to={`/siparisler/${order.id}`} key={order.id}>
                  <span className="dashboard-order-icon" aria-hidden="true">□</span>
                  <div><strong>{order.id}</strong><small>{formatDate(order.createdAt)} · {order.lines.length} kalem</small></div>
                  <span className="dashboard-order-total">{formatMoney(order.total)}</span>
                  <Badge tone={order.status === "Sevk Edildi" ? "success" : "warning"}>{order.status}</Badge>
                  <span className="dashboard-row-arrow" aria-hidden="true">›</span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="dashboard-panel">
          <div className="section-heading"><div><h2>Sık Alınanlar</h2><p>Firmanız için öne çıkanlar</p></div><Link to="/urunler">Katalog <span aria-hidden="true">→</span></Link></div>
          <div className="frequent-products">
            {products.filter((product) => product.featured).slice(0, 3).map((product) => (
              <Link to={`/urunler/${product.id}`} key={product.id}>
                <span className="frequent-product-image">{product.image}</span>
                <div><strong>{product.name}</strong><small>{product.code} · Stokta {product.stock}</small><b>{formatMoney(product.price)}</b></div>
                <span className="dashboard-row-arrow" aria-hidden="true">›</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

