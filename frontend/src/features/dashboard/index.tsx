import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Badge, Card, LoadingState, PageHeader } from "@/shared/components/Ui";
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

  return (
    <div className="page">
      <PageHeader title="Günaydın, Burak" description={`${account?.name ?? "Firmanız"} için güncel ticari görünüm.`} action={<Link className="button button-primary" to="/urunler">Yeni Sipariş</Link>} />
      <div className="content-grid content-grid-4 dashboard-metrics">
        <Card><p className="metric-label">Cari Bakiye</p><p className="metric-value">{formatMoney(account?.balance ?? 0)}</p><Link to="/finans">Hesap hareketleri</Link></Card>
        <Card><p className="metric-label">Kullanılabilir Limit</p><p className="metric-value metric-success">{formatMoney(account?.availableCredit ?? 0)}</p><span>Güncel cari limiti</span></Card>
        <Card><p className="metric-label">Açık Sipariş</p><p className="metric-value">{openOrders}</p><Link to="/siparisler">Siparişleri görüntüle</Link></Card>
        <Card><p className="metric-label">Sepetteki Ürün</p><p className="metric-value">{cart.reduce((sum, line) => sum + line.quantity, 0)}</p><Link to="/sepet">Sepete git</Link></Card>
      </div>
      <Card className="dashboard-banner">
        <div><Badge tone="warning">Eylül fırsatı</Badge><h2>Seçili motor ve sürücülerde avantajlı fiyatlar</h2><p>Firmanıza özel kampanya koşullarını ürünlerde görüntüleyin.</p><Link className="button button-primary" to="/urunler">Ürünleri İncele</Link></div>
        <span aria-hidden="true">⚙️</span>
      </Card>
      <div className="dashboard-columns">
        <Card>
          <div className="section-heading"><div><h2>Son Siparişler</h2><p>En son oluşturulan siparişleriniz</p></div><Link to="/siparisler">Tümünü Gör</Link></div>
          {isLoading ? <LoadingState /> : orders.slice(0, 4).map((order) => <Link className="dashboard-order" to={`/siparisler/${order.id}`} key={order.id}><div><strong>{order.id}</strong><small>{formatDate(order.createdAt)}</small></div><span>{formatMoney(order.total)}</span><Badge tone={order.status === "Sevk Edildi" ? "success" : "warning"}>{order.status}</Badge></Link>)}
        </Card>
        <Card>
          <div className="section-heading"><div><h2>Sık Alınanlar</h2><p>Hızlıca yeniden keşfedin</p></div><Link to="/urunler">Katalog</Link></div>
          <div className="frequent-products">{products.filter((product) => product.featured).slice(0, 3).map((product) => <Link to={`/urunler/${product.id}`} key={product.id}><span>{product.image}</span><div><strong>{product.name}</strong><small>{formatMoney(product.price)}</small></div></Link>)}</div>
        </Card>
      </div>
    </div>
  );
}

