import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Badge, Card, EmptyState, LoadingState, PageHeader } from "@/shared/components/Ui";
import { formatDate, formatMoney } from "@/shared/lib/format";

export function QuotesPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const { data: quotes = [], isLoading } = useQuery({ queryKey: ["quotes", accountId], queryFn: () => portalService.getQuotes(accountId) });
  return (
    <div className="page">
      <PageHeader title="Tekliflerim" description="Firmanıza sunulan teklifleri ve geçerlilik durumlarını inceleyin." />
      {isLoading && <LoadingState />}
      {!isLoading && !quotes.length && <Card><EmptyState title="Teklif bulunmuyor" description="Firmanıza ait güncel bir teklif bulunamadı." /></Card>}
      {!isLoading && Boolean(quotes.length) && <div className="content-grid content-grid-2">{quotes.map((quote) => <Card key={quote.id}><div className="section-heading"><div><span className="muted">{quote.id}</span><h2>{quote.title}</h2></div><Badge tone={quote.status === "Geçerli" ? "success" : quote.status === "Süresi Doldu" ? "danger" : "neutral"}>{quote.status}</Badge></div><p className="muted">Geçerlilik: {formatDate(quote.validUntil)} · {quote.lines.length} ürün çeşidi</p><p className="metric-value">{formatMoney(quote.total)}</p><div className="divider" /><Link className="button" to={`/teklifler/${quote.id}`}>Teklifi İncele</Link></Card>)}</div>}
    </div>
  );
}

export function QuoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const { data: quotes = [], isLoading } = useQuery({ queryKey: ["quotes", accountId], queryFn: () => portalService.getQuotes(accountId) });
  const { data: products = [] } = useQuery({ queryKey: ["products", accountId, "quote"], queryFn: () => portalService.getProducts(accountId) });
  const quote = quotes.find((item) => item.id === id);

  if (isLoading) return <div className="page"><LoadingState /></div>;
  if (!quote) return <div className="page"><EmptyState title="Teklif bulunamadı" description="Teklif kaldırılmış veya erişiminize kapatılmış olabilir." /></div>;

  return (
    <div className="page">
      <PageHeader title={quote.title} description={`${quote.id} · ${formatDate(quote.validUntil)} tarihine kadar geçerli`} action={<Badge tone={quote.status === "Geçerli" ? "success" : "danger"}>{quote.status}</Badge>} />
      <div className="content-grid content-grid-2">
        <Card>
          <h2>Teklif Satırları</h2>
          {quote.lines.map((line) => {
            const product = products.find((item) => item.id === line.productId);
            return product ? <div className="order-line" key={product.id}><span className="order-line-icon">{product.image}</span><div><strong>{product.name}</strong><small>{line.quantity} {product.unit} · Teklif fiyatı</small></div><strong>{formatMoney((quote.total / quote.lines.reduce((sum, item) => sum + item.quantity, 0)) * line.quantity)}</strong></div> : null;
          })}
          <div className="order-total"><span>Teklif toplamı</span><strong>{formatMoney(quote.total)}</strong></div>
        </Card>
        <Card>
          <h2>Teklifi Siparişe Dönüştür</h2>
          <p className="muted">Teklif satırları sepete aktarılır. Güncel fiyat ve stok bilgileri sipariş öncesinde tekrar doğrulanır.</p>
          <div className="notice">Teklif fiyatı tarihsel kayıttır; sepette güncel fiyat farklı olabilir.</div>
          <div className="page-actions quote-actions"><button className="button button-primary" disabled={quote.status !== "Geçerli"} onClick={() => { quote.lines.forEach((line) => addToCart(line.productId, line.quantity)); navigate("/sepet"); }}>Kabul Et ve Sepete Aktar</button><Link className="button" to="/teklifler">Tekliflere Dön</Link></div>
        </Card>
      </div>
    </div>
  );
}

