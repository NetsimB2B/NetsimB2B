import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Badge, Card, EmptyState, LoadingState, PageHeader } from "@/shared/components/Ui";
import { formatDate, formatMoney } from "@/shared/lib/format";

export function FinancePage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const account = accounts.find((item) => item.id === accountId);
  const transactions = accountId === 1001 ? [
    { date: "2026-09-05", document: "FTR-2026-1482", description: "Satış faturası", debit: 74_700, credit: 0 },
    { date: "2026-09-02", document: "THS-2026-0841", description: "Havale tahsilatı", debit: 0, credit: 50_000 },
    { date: "2026-08-24", document: "FTR-2026-1431", description: "Satış faturası", debit: 28_750, credit: 0 },
  ] : [
    { date: "2026-09-07", document: "FTR-2026-1520", description: "Satış faturası", debit: 30_475, credit: 0 },
    { date: "2026-09-01", document: "THS-2026-0812", description: "Havale tahsilatı", debit: 0, credit: 20_000 },
  ];
  return <div className="page"><PageHeader title="Cari Hesabım" description="Bakiye, limit ve hesap hareketlerinizi görüntüleyin." /><div className="content-grid content-grid-4"><Card><p className="metric-label">Bakiye</p><p className="metric-value">{formatMoney(account?.balance ?? 0)}</p></Card><Card><p className="metric-label">Kredi Limiti</p><p className="metric-value">{formatMoney((account?.balance ?? 0) + (account?.availableCredit ?? 0))}</p></Card><Card><p className="metric-label">Kullanılabilir Limit</p><p className="metric-value">{formatMoney(account?.availableCredit ?? 0)}</p></Card><Card><p className="metric-label">Vadesi Geçen</p><p className="metric-value">{formatMoney(account?.overdueAmount ?? 0)}</p></Card></div><h2 className="section-title">Hesap Hareketleri</h2><div className="table-wrap"><table className="data-table"><thead><tr><th>Tarih</th><th>Belge</th><th>Açıklama</th><th>Borç</th><th>Alacak</th></tr></thead><tbody>{transactions.map((item) => <tr key={item.document}><td>{formatDate(item.date)}</td><td>{item.document}</td><td>{item.description}</td><td>{item.debit ? formatMoney(item.debit) : "—"}</td><td>{item.credit ? formatMoney(item.credit) : "—"}</td></tr>)}</tbody></table></div></div>;
}

export function ShipmentsPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const { data = [], isLoading } = useQuery({ queryKey: ["shipments", accountId], queryFn: () => portalService.getShipments(accountId) });
  return <div className="page"><PageHeader title="Sevkiyatlar" description="Siparişlerinizin teslimat sürecini takip edin." />{isLoading ? <LoadingState /> : <div className="content-grid content-grid-2">{data.map((item) => <Card key={item.id}><div className="section-heading"><div><span className="muted">{item.id}</span><h2>{item.orderId}</h2></div><Badge tone={item.status === "Teslim Edildi" ? "success" : "warning"}>{item.status}</Badge></div><p>{item.carrier}</p><small className="muted">{formatDate(item.date)}</small></Card>)}</div>}</div>;
}

export function InvoicesPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const { data = [], isLoading } = useQuery({ queryKey: ["invoices", accountId], queryFn: () => portalService.getInvoices(accountId) });
  return <div className="page"><PageHeader title="Faturalar" description="Faturalarınızı ve ödeme durumlarını görüntüleyin." />{isLoading ? <LoadingState /> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Fatura No</th><th>Tarih</th><th>Vade</th><th>Tutar</th><th>Durum</th></tr></thead><tbody>{data.map((item) => <tr key={item.id}><td><strong>{item.id}</strong></td><td>{formatDate(item.date)}</td><td>{formatDate(item.dueDate)}</td><td>{formatMoney(item.total)}</td><td><Badge tone={item.status === "Ödendi" ? "success" : item.status === "Vadesi Geçti" ? "danger" : "warning"}>{item.status}</Badge></td></tr>)}</tbody></table></div>}</div>;
}

export function FavoritesPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const favorites = useCompanyContext((state) => state.favorites);
  const toggleFavorite = useCompanyContext((state) => state.toggleFavorite);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const { data: products = [] } = useQuery({ queryKey: ["products", accountId, "favorites"], queryFn: () => portalService.getProducts(accountId) });
  const items = products.filter((product) => favorites.includes(product.id));
  return <div className="page"><PageHeader title="Favoriler" description="Sık kullandığınız ürünlere hızlıca ulaşın." />{!items.length ? <Card><EmptyState title="Favori ürününüz yok" description="Ürün kartlarındaki kalp simgesini kullanarak favorilerinizi oluşturabilirsiniz." action={<Link className="button button-primary" to="/urunler">Ürünlere Git</Link>} /></Card> : <div className="content-grid content-grid-3">{items.map((product) => <Card key={product.id}><div className="section-heading"><span className="product-mini-icon">{product.image}</span><button className="remove-line" onClick={() => toggleFavorite(product.id)}>×</button></div><h2>{product.name}</h2><p className="muted">{product.code} · {product.stock} {product.unit} stokta</p><p className="metric-value">{formatMoney(product.price)}</p><div className="page-actions"><Link className="button" to={`/urunler/${product.id}`}>Detay</Link><button className="button button-primary" onClick={() => addToCart(product.id)}>Sepete Ekle</button></div></Card>)}</div>}</div>;
}

export function NotificationsPage() {
  const read = useCompanyContext((state) => state.notificationsRead);
  const markRead = useCompanyContext((state) => state.markNotificationsRead);
  const items = ["Sipariş B2B-2026-1002 hazırlanmaya başladı.", "Eylül motor kampanyası yayınlandı.", "Yeni faturanız FTR-2026-1482 hazır."];
  return <div className="page"><PageHeader title="Bildirimler" description="Ticari süreçlerinizle ilgili güncellemeler." action={<button className="button" onClick={markRead}>Tümünü Okundu İşaretle</button>} /><div className="content-grid">{items.map((item, index) => <Card key={item}><div className="notification-row"><span className={!read && index === 0 ? "notification-dot" : ""} /><div><strong>{item}</strong><small>{index + 1} gün önce</small></div></div></Card>)}</div></div>;
}

export function AnnouncementsPage() {
  return <div className="page"><PageHeader title="Duyurular ve Kampanyalar" description="Firmanıza özel güncel bilgilendirmeler." /><div className="content-grid content-grid-2"><Card><Badge tone="warning">Kampanya</Badge><h2>Motor ve sürücülerde Eylül avantajları</h2><p className="muted">Seçili ürünlerde firmanıza özel fiyatlar 30 Eylül’e kadar geçerlidir.</p></Card><Card><Badge>Bilgilendirme</Badge><h2>Hafta sonu sevkiyat planı</h2><p className="muted">Cumartesi günü depo teslimatları 09.00–13.00 saatleri arasında yapılacaktır.</p></Card></div></div>;
}

export function AccountPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const account = accounts.find((item) => item.id === accountId);
  return <div className="page"><PageHeader title="Hesabım" description="Kullanıcı ve firma bilgilerinizi görüntüleyin." /><div className="content-grid content-grid-2"><Card><h2>Kullanıcı Bilgileri</h2><dl className="detail-list"><div><dt>Ad Soyad</dt><dd>Burak Admin</dd></div><div><dt>E-posta</dt><dd>demo@netsim.com</dd></div><div><dt>Rol</dt><dd>Satın Alma Yetkilisi</dd></div></dl></Card><Card><h2>Aktif Firma</h2><dl className="detail-list"><div><dt>Firma</dt><dd>{account?.name}</dd></div><div><dt>Cari Kodu</dt><dd>{account?.code}</dd></div><div><dt>Para Birimi</dt><dd>{account?.currency}</dd></div></dl></Card></div></div>;
}

export function SupportPage() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent) { event.preventDefault(); setSent(true); }
  return <div className="page"><PageHeader title="Destek Merkezi" description="Sorularınızı ve taleplerinizi Netsim ekibine iletin." /><Card>{sent ? <EmptyState title="Talebiniz alındı" description="Demo destek talebiniz kaydedildi. Gerçek backend bağlandığında destek ekibine iletilecektir." /> : <form className="content-grid" onSubmit={submit}><div className="form-grid"><div className="field"><label htmlFor="subject">Konu</label><input id="subject" className="input" required /></div><div className="field"><label htmlFor="type">Talep türü</label><select id="type" className="select"><option>Teknik Destek</option><option>Sipariş</option><option>Finans</option></select></div></div><div className="field"><label htmlFor="message">Açıklama</label><textarea id="message" className="textarea" required /></div><button className="button button-primary" type="submit">Talep Oluştur</button></form>}</Card></div>;
}
