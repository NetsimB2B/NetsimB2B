import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Badge, Card, EmptyState, ErrorState, LoadingState } from "@/shared/components/Ui";
import { formatDate, formatMoney } from "@/shared/lib/format";
import type { OrderStatus } from "@/shared/types/portal";
import "./orders.css";

const statusTone = (status: OrderStatus) => status === "Sevk Edildi" ? "success" : status === "Hazırlanıyor" ? "warning" : "neutral";
const statusDescriptions: Record<OrderStatus, string> = {
  "Alındı": "Siparişiniz sisteme kaydedildi",
  "Onaylandı": "Fiyat ve stok kontrolü tamamlandı",
  "Hazırlanıyor": "Ürünler depoda hazırlanıyor",
  "Sevk Edildi": "Siparişiniz taşıyıcıya teslim edildi",
};

export function OrdersPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "amount">("newest");
  const { data: orders = [], isLoading, isError } = useQuery({ queryKey: ["orders", accountId], queryFn: () => portalService.getOrders(accountId) });
  const filtered = useMemo(() => orders
    .filter((order) => {
      const term = search.trim().toLocaleLowerCase("tr-TR");
      return (!term || `${order.id} ${order.customerOrderNo ?? ""}`.toLocaleLowerCase("tr-TR").includes(term)) && (!status || order.status === status);
    })
    .sort((a, b) => sort === "amount" ? b.total - a.total : sort === "oldest" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [orders, search, sort, status]);
  const processing = orders.filter((order) => order.status !== "Sevk Edildi").length;
  const shipped = orders.filter((order) => order.status === "Sevk Edildi").length;

  return (
    <div className="page orders-page">
      <header className="orders-header"><div><span className="orders-eyebrow">Satın Alma Operasyonları</span><h1>Siparişlerim</h1><p>Siparişlerinizi, teslimat planlarını ve belge süreçlerini tek noktadan yönetin.</p></div><Link className="button button-primary" to="/urunler">＋ Yeni Sipariş</Link></header>
      {isLoading ? <LoadingState label="Siparişler yükleniyor" /> : isError ? <ErrorState message="Siparişler şu anda yüklenemedi." /> : (
        <>
          <div className="order-stats">
            <Card><span>▤</span><div><small>Toplam Sipariş</small><strong>{orders.length}</strong><p>Tüm dönemler</p></div></Card>
            <Card><span className="processing">◷</span><div><small>İşlemde</small><strong>{processing}</strong><p>Operasyon süreci devam eden</p></div></Card>
            <Card><span className="shipped">✓</span><div><small>Sevk Edilen</small><strong>{shipped}</strong><p>Taşıyıcıya teslim edilen</p></div></Card>
            <Card><span className="value">₺</span><div><small>Toplam Sipariş Tutarı</small><strong>{formatMoney(orders.reduce((sum, order) => sum + order.total, 0))}</strong><p>KDV hariç</p></div></Card>
          </div>

          <Card className="orders-toolbar">
            <label className="orders-search"><span>⌕</span><input placeholder="Sipariş no veya satın alma referansı ara..." aria-label="Sipariş ara" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            <select className="select" aria-label="Durum" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tüm durumlar</option><option>Alındı</option><option>Onaylandı</option><option>Hazırlanıyor</option><option>Sevk Edildi</option></select>
            <select className="select" aria-label="Sıralama" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="newest">En yeni siparişler</option><option value="oldest">En eski siparişler</option><option value="amount">Tutara göre</option></select>
          </Card>

          <Card className="orders-table-card">
            <div className="orders-table-heading"><div><h2>Sipariş Listesi</h2><p>{filtered.length} kayıt gösteriliyor</p></div><span>Son güncelleme: bugün</span></div>
            {!filtered.length ? <EmptyState title="Sipariş bulunamadı" description="Arama veya durum filtresini değiştirerek tekrar deneyin." /> : <div className="orders-table-wrap"><table className="orders-table">
              <thead><tr><th>Sipariş / Referans</th><th>Tarih</th><th>Ürünler</th><th>Planlanan Teslimat</th><th>Tutar</th><th>Durum</th><th /></tr></thead>
              <tbody>{filtered.map((order) => <tr key={order.id}>
                <td><Link to={`/siparisler/${order.id}`}>{order.id}</Link><small>{order.customerOrderNo ?? "Online sipariş"}</small></td>
                <td><strong>{formatDate(order.createdAt)}</strong><small>{new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(new Date(order.createdAt))}</small></td>
                <td><strong>{order.lines.length} ürün kalemi</strong><small>{order.lines.reduce((sum, line) => sum + line.quantity, 0)} adet</small></td>
                <td><strong>{order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : "Planlanıyor"}</strong><small>{order.shippingMethod ?? "Sevkiyat yöntemi atanacak"}</small></td>
                <td><strong className="order-table-total">{formatMoney(order.total)}</strong><small>+ KDV</small></td>
                <td><Badge tone={statusTone(order.status)}>{order.status}</Badge><small>{statusDescriptions[order.status]}</small></td>
                <td><Link className="order-row-link" to={`/siparisler/${order.id}`}>İncele ›</Link></td>
              </tr>)}</tbody>
            </table></div>}
          </Card>
          <div className="orders-help"><span>i</span><p><strong>Sipariş desteğine mi ihtiyacınız var?</strong><small>Değişiklik ve teslimat talepleri için sipariş numaranızla satış temsilcinize ulaşın.</small></p><Link to="/destek">Destek talebi oluştur →</Link></div>
        </>
      )}
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const { data: orders = [], isLoading, isError } = useQuery({ queryKey: ["orders", accountId], queryFn: () => portalService.getOrders(accountId) });
  const { data: products = [], isLoading: productsLoading } = useQuery({ queryKey: ["products", accountId, "order-detail"], queryFn: () => portalService.getProducts(accountId) });
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const order = orders.find((item) => item.id === id)!;
  const account = accounts.find((item) => item.id === accountId);
  const steps: OrderStatus[] = ["Alındı", "Onaylandı", "Hazırlanıyor", "Sevk Edildi"];
  const currentStep = order ? steps.indexOf(order.status) : 0;
  const lines = useMemo(() => order?.lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ ...line, product }] : [];
  }) ?? [], [order, products]);

  if (isLoading || productsLoading) return <div className="page"><LoadingState /></div>;
  if (isError) return <div className="page"><ErrorState message="Sipariş detayı şu anda yüklenemedi." /></div>;
  if (!order) return <div className="page"><EmptyState title="Sipariş bulunamadı" description="Bu sipariş aktif firma hesabına ait olmayabilir." /></div>;
  const vat = order.total * .2;

  return (
    <div className="page order-detail-page">
      <nav className="order-breadcrumb"><Link to="/dashboard">Ana Sayfa</Link><span>›</span><Link to="/siparisler">Siparişlerim</Link><span>›</span><strong>{order.id}</strong></nav>
      <header className="order-detail-header"><div><span className="orders-eyebrow">Sipariş Detayı · {order.customerOrderNo ?? "Online Sipariş"}</span><h1>{order.id}</h1><p>{formatDate(order.createdAt)} tarihinde {account?.name} adına oluşturuldu.</p></div><div><Badge tone={statusTone(order.status)}>{order.status}</Badge><button type="button" onClick={() => window.print()}>⎙ Yazdır / PDF</button><button className="button" onClick={() => order.lines.forEach((line) => addToCart(line.productId, line.quantity))}>↻ Tekrar Sipariş Ver</button></div></header>

      <Card className="order-progress">
        {steps.map((step, index) => <div className={index <= currentStep ? "is-complete" : ""} key={step}><span>{index < currentStep ? "✓" : index + 1}</span><p><strong>{step}</strong><small>{statusDescriptions[step]}</small></p></div>)}
      </Card>

      <Card className="order-overview">
        <div><span>Müşteri Sipariş No</span><strong>{order.customerOrderNo ?? "—"}</strong></div><div><span>Sipariş Tarihi</span><strong>{formatDate(order.createdAt)}</strong></div><div><span>Planlanan Teslimat</span><strong>{order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : "Planlanıyor"}</strong></div><div><span>Satış Temsilcisi</span><strong>{order.salesRepresentative ?? "Netsim Satış"}</strong></div><div><span>Ödeme Koşulu</span><strong>{order.paymentMethod}</strong></div>
      </Card>

      <div className="order-detail-layout">
        <div className="order-detail-main">
          <Card className="order-lines-card">
            <div className="order-section-heading"><div><h2>Sipariş Kalemleri</h2><p>{lines.length} ürün · {lines.reduce((sum, line) => sum + line.quantity, 0)} adet</p></div><span>Fiyatlar KDV hariçtir</span></div>
            <div className="order-lines-wrap"><table className="order-lines-table"><thead><tr><th>Ürün</th><th>Miktar</th><th>Birim Fiyat</th><th>Satır Toplamı</th><th>Stok / Termin</th></tr></thead><tbody>
              {lines.map(({ product, quantity }) => <tr key={product.id}><td><div className="order-product"><span>{product.image}</span><p><Link to={`/urunler/${product.id}`}>{product.name}</Link><small>{product.brand} · {product.code}</small></p></div></td><td><strong>{quantity}</strong><small>{product.unit}</small></td><td><strong>{formatMoney(product.price)}</strong></td><td><strong className="order-line-total">{formatMoney(product.price * quantity)}</strong></td><td><strong className={product.stock >= quantity ? "stock-ok" : "stock-warning"}>{product.stock >= quantity ? "● Stok uygun" : "● Tedarik planında"}</strong><small>{order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : "Tarih bekleniyor"}</small></td></tr>)}
            </tbody></table></div>
            <div className="order-totals"><div><span>Ara toplam</span><strong>{formatMoney(order.total)}</strong></div><div><span>KDV (%20)</span><strong>{formatMoney(vat)}</strong></div><div className="grand"><span>Genel toplam</span><strong>{formatMoney(order.total + vat)}</strong></div></div>
          </Card>

          <div className="order-info-grid">
            <Card><span>⌖</span><div><h3>Teslimat Bilgileri</h3><p>{order.deliveryAddress}</p><dl><div><dt>Taşıma yöntemi</dt><dd>{order.shippingMethod ?? "Planlanıyor"}</dd></div><div><dt>Tahmini teslim</dt><dd>{order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : "Planlanıyor"}</dd></div></dl></div></Card>
            <Card><span>₺</span><div><h3>Ödeme ve Faturalama</h3><dl><div><dt>Ödeme koşulu</dt><dd>{order.paymentMethod}</dd></div><div><dt>Fatura No</dt><dd>{order.invoiceId ? <Link to="/faturalar">{order.invoiceId}</Link> : "Sipariş sonrası oluşacak"}</dd></div></dl></div></Card>
          </div>
          {order.note && <div className="order-note"><span>i</span><p><strong>Sipariş Notu</strong><small>{order.note}</small></p></div>}
        </div>

        <aside className="order-detail-sidebar">
          <Card className="order-status-card"><div className="order-status-icon">{order.status === "Sevk Edildi" ? "✓" : "◷"}</div><h2>{statusDescriptions[order.status]}</h2><p>Siparişinizin güncel operasyon durumu aşağıda yer almaktadır.</p><div><span>Güncel durum</span><Badge tone={statusTone(order.status)}>{order.status}</Badge></div><div><span>Planlanan teslimat</span><strong>{order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : "Planlanıyor"}</strong></div>{order.shipmentId && <Link className="button button-primary" to="/sevkiyatlar">Sevkiyatı Görüntüle</Link>}</Card>
          <Card className="order-documents-card"><h3>Sipariş Belgeleri</h3><Link to="/faturalar"><span>▤</span><p><strong>Fatura</strong><small>{order.invoiceId ?? "Henüz oluşmadı"}</small></p><b>›</b></Link><Link to="/sevkiyatlar"><span>▣</span><p><strong>İrsaliye / Sevkiyat</strong><small>{order.shipmentId ?? "Hazırlanıyor"}</small></p><b>›</b></Link></Card>
          <Card className="order-contact-card"><span>SY</span><div><small>Müşteri temsilciniz</small><strong>{order.salesRepresentative ?? "Netsim Satış"}</strong><Link to="/destek">Sipariş desteği al →</Link></div></Card>
        </aside>
      </div>
    </div>
  );
}

