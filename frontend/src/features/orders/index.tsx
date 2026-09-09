import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Badge, Card, EmptyState, LoadingState, PageHeader } from "@/shared/components/Ui";
import { formatDate, formatMoney } from "@/shared/lib/format";
import type { OrderStatus } from "@/shared/types/portal";
import "./orders.css";

const statusTone = (status: OrderStatus) => status === "Sevk Edildi" ? "success" : status === "Hazırlanıyor" ? "warning" : "neutral";

export function OrdersPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["orders", accountId], queryFn: () => portalService.getOrders(accountId) });
  const filtered = orders.filter((order) => (!search || order.id.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR"))) && (!status || order.status === status));

  return (
    <div className="page">
      <PageHeader title="Siparişlerim" description="Siparişlerinizi görüntüleyin ve durumlarını takip edin." action={<Link className="button button-primary" to="/urunler">Yeni Sipariş</Link>} />
      <div className="toolbar">
        <input className="input" placeholder="Sipariş numarası ara" aria-label="Sipariş ara" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select className="select" aria-label="Durum" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Tüm durumlar</option>
          <option>Alındı</option><option>Onaylandı</option><option>Hazırlanıyor</option><option>Sevk Edildi</option>
        </select>
      </div>
      {isLoading && <LoadingState />}
      {!isLoading && !filtered.length && <Card><EmptyState title="Sipariş bulunamadı" description="Seçtiğiniz kriterlere uygun sipariş bulunmuyor." /></Card>}
      {!isLoading && Boolean(filtered.length) && (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Sipariş No</th><th>Tarih</th><th>Ürün</th><th>Toplam</th><th>Durum</th><th /></tr></thead>
            <tbody>{filtered.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong></td><td>{formatDate(order.createdAt)}</td><td>{order.lines.length} çeşit</td><td>{formatMoney(order.total)}</td>
                <td><Badge tone={statusTone(order.status)}>{order.status}</Badge></td>
                <td><Link className="table-link" to={`/siparisler/${order.id}`}>Detay</Link></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["orders", accountId], queryFn: () => portalService.getOrders(accountId) });
  const { data: products = [] } = useQuery({ queryKey: ["products", accountId, "order-detail"], queryFn: () => portalService.getProducts(accountId) });
  const order = orders.find((item) => item.id === id);
  const steps: OrderStatus[] = ["Alındı", "Onaylandı", "Hazırlanıyor", "Sevk Edildi"];
  const currentStep = order ? steps.indexOf(order.status) : 0;
  const lines = useMemo(() => order?.lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ ...line, product }] : [];
  }) ?? [], [order, products]);

  if (isLoading) return <div className="page"><LoadingState /></div>;
  if (!order) return <div className="page"><EmptyState title="Sipariş bulunamadı" description="Bu sipariş aktif firma hesabına ait olmayabilir." /></div>;

  return (
    <div className="page">
      <PageHeader title={`Sipariş ${order.id}`} description={`${formatDate(order.createdAt)} tarihinde oluşturuldu.`} action={<button className="button" onClick={() => order.lines.forEach((line) => addToCart(line.productId, line.quantity))}>Tekrar Sepete Ekle</button>} />
      <Card className="order-progress">
        {steps.map((step, index) => <div className={index <= currentStep ? "is-complete" : ""} key={step}><span>{index < currentStep ? "✓" : index + 1}</span><strong>{step}</strong></div>)}
      </Card>
      <div className="content-grid content-grid-2 order-detail-grid">
        <Card>
          <h2>Sipariş Satırları</h2>
          {lines.map(({ product, quantity }) => <div className="order-line" key={product.id}><span className="order-line-icon">{product.image}</span><div><strong>{product.name}</strong><small>{product.code} · {quantity} {product.unit}</small></div><strong>{formatMoney(product.price * quantity)}</strong></div>)}
          <div className="order-total"><span>Toplam</span><strong>{formatMoney(order.total)}</strong></div>
        </Card>
        <Card>
          <h2>Teslimat ve Ödeme</h2>
          <dl className="detail-list"><div><dt>Teslimat adresi</dt><dd>{order.deliveryAddress}</dd></div><div><dt>Ödeme yöntemi</dt><dd>{order.paymentMethod}</dd></div><div><dt>Sipariş durumu</dt><dd><Badge tone={statusTone(order.status)}>{order.status}</Badge></dd></div>{order.note && <div><dt>Not</dt><dd>{order.note}</dd></div>}</dl>
        </Card>
      </div>
    </div>
  );
}

