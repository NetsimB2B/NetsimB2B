import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Badge, Card, EmptyState, ErrorState, LoadingState, PageHeader } from "@/shared/components/Ui";
import { formatDate, formatMoney } from "@/shared/lib/format";
import "./favorites.css";
import "./shipments.css";

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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { data = [], isLoading, isError } = useQuery({ queryKey: ["shipments", accountId], queryFn: () => portalService.getShipments(accountId) });
  const visible = useMemo(() => data.filter((shipment) => {
    const term = search.trim().toLocaleLowerCase("tr-TR");
    return (!term || `${shipment.id} ${shipment.orderId} ${shipment.trackingNo} ${shipment.carrier}`.toLocaleLowerCase("tr-TR").includes(term)) && (!status || shipment.status === status);
  }), [data, search, status]);
  const preparing = data.filter((item) => item.status === "Hazırlanıyor").length;
  const inTransit = data.filter((item) => item.status === "Yolda").length;
  const delivered = data.filter((item) => item.status === "Teslim Edildi").length;

  return <div className="page shipments-page">
    <header className="shipments-header"><div><span className="shipments-eyebrow">Lojistik Operasyonları</span><h1>Sevkiyatlar</h1><p>Siparişlerinizin depo çıkışından teslimata kadar tüm lojistik sürecini takip edin.</p></div><Link className="button shipments-support-button" to="/destek">Teslimat Desteği</Link></header>
    {isLoading ? <LoadingState label="Sevkiyatlar yükleniyor" /> : isError ? <ErrorState message="Sevkiyat bilgileri şu anda yüklenemedi." /> : !data.length ? <Card className="shipments-empty"><EmptyState title="Aktif sevkiyat bulunmuyor" description="Siparişleriniz sevkiyata hazırlandığında takip bilgileri burada görüntülenecektir." /></Card> : <>
      <div className="shipment-stats">
        <Card><span>▤</span><div><small>Toplam Sevkiyat</small><strong>{data.length}</strong><p>Tüm lojistik kayıtları</p></div></Card>
        <Card><span className="preparing">◷</span><div><small>Hazırlanıyor</small><strong>{preparing}</strong><p>Depo operasyonunda</p></div></Card>
        <Card><span className="transit">➜</span><div><small>Yolda</small><strong>{inTransit}</strong><p>Dağıtım sürecinde</p></div></Card>
        <Card><span className="delivered">✓</span><div><small>Teslim Edildi</small><strong>{delivered}</strong><p>Tamamlanan teslimatlar</p></div></Card>
      </div>
      <Card className="shipments-toolbar"><label className="shipments-search"><span>⌕</span><input aria-label="Sevkiyat ara" placeholder="Sevkiyat, sipariş veya takip numarası ara..." value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="select" aria-label="Sevkiyat durumu" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tüm durumlar</option><option>Hazırlanıyor</option><option>Yolda</option><option>Teslim Edildi</option></select></Card>
      <div className="shipments-list-heading"><div><h2>Sevkiyat Listesi</h2><p>{visible.length} kayıt gösteriliyor</p></div><span>Bilgiler lojistik sistemiyle güncellenir</span></div>
      {!visible.length ? <Card><EmptyState title="Eşleşen sevkiyat bulunamadı" description="Arama veya durum filtresini değiştirerek tekrar deneyin." /></Card> : <div className="shipment-list">{visible.map((item) => {
        const progress = item.status === "Teslim Edildi" ? 100 : item.status === "Yolda" ? 66 : 25;
        return <Card className="shipment-card" key={item.id}>
          <div className="shipment-card-top"><div className="shipment-icon">▣</div><div><span>{item.id}</span><h2>{item.orderId}</h2><small>Takip No: {item.trackingNo}</small></div><Badge tone={item.status === "Teslim Edildi" ? "success" : item.status === "Yolda" ? "warning" : "neutral"}>{item.status}</Badge></div>
          <div className="shipment-route"><div><span>Çıkış Noktası</span><strong>{item.origin}</strong><small>{formatDate(item.date)}</small></div><div className="shipment-route-line"><i style={{ width: `${progress}%` }} /><b style={{ left: `${Math.min(progress, 96)}%` }}>▸</b></div><div><span>Varış Noktası</span><strong>{item.destination}</strong><small>Tahmini: {formatDate(item.estimatedDelivery)}</small></div></div>
          <div className="shipment-card-meta"><div><span>Taşıyıcı</span><strong>{item.carrier}</strong></div><div><span>Paket</span><strong>{item.packageCount} koli/palet</strong></div><div><span>Toplam Ağırlık</span><strong>{item.totalWeight.toLocaleString("tr-TR")} kg</strong></div><div><span>Araç</span><strong>{item.vehiclePlate ?? "Planlanıyor"}</strong></div><Link to={`/sevkiyatlar/${item.id}`}>Sevkiyatı İncele ›</Link></div>
        </Card>;
      })}</div>}
      <div className="shipments-info"><span>i</span><p><strong>Teslimat planınızda değişiklik mi var?</strong><small>Adres veya teslimat zamanı değişikliği için sevkiyat çıkışından önce destek ekibine ulaşın.</small></p><Link to="/destek">Talep oluştur →</Link></div>
    </>}
  </div>;
}

export function ShipmentDetailPage() {
  const { id } = useParams();
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const { data: shipments = [], isLoading, isError } = useQuery({ queryKey: ["shipments", accountId], queryFn: () => portalService.getShipments(accountId) });
  const { data: orders = [] } = useQuery({ queryKey: ["orders", accountId, "shipment"], queryFn: () => portalService.getOrders(accountId) });
  const { data: products = [], isLoading: productsLoading } = useQuery({ queryKey: ["products", accountId, "shipment"], queryFn: () => portalService.getProducts(accountId) });
  const shipment = shipments.find((item) => item.id === id)!;
  const order = orders.find((item) => item.id === shipment?.orderId);
  const lines = order?.lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ ...line, product }] : [];
  }) ?? [];

  if (isLoading || productsLoading) return <div className="page"><LoadingState /></div>;
  if (isError) return <div className="page"><ErrorState message="Sevkiyat detayı şu anda yüklenemedi." /></div>;
  if (!shipment) return <div className="page"><EmptyState title="Sevkiyat bulunamadı" description="Bu sevkiyat aktif firma hesabına ait olmayabilir." /></div>;
  const currentEvent = [...shipment.events].reverse().find((event) => event.completed);

  return <div className="page shipment-detail-page">
    <nav className="shipment-breadcrumb"><Link to="/dashboard">Ana Sayfa</Link><span>›</span><Link to="/sevkiyatlar">Sevkiyatlar</Link><span>›</span><strong>{shipment.id}</strong></nav>
    <header className="shipment-detail-header"><div><span className="shipments-eyebrow">Sevkiyat Detayı · {shipment.trackingNo}</span><h1>{shipment.id}</h1><p>{shipment.orderId} numaralı siparişe ait lojistik takip kaydı.</p></div><div><Badge tone={shipment.status === "Teslim Edildi" ? "success" : "warning"}>{shipment.status}</Badge><button type="button" onClick={() => window.print()}>⎙ Yazdır / PDF</button></div></header>

    <Card className="shipment-progress-card">
      {["Hazırlanıyor", "Araç Yüklendi", "Yolda", "Teslim Edildi"].map((step, index) => {
        const activeIndex = shipment.status === "Teslim Edildi" ? 3 : shipment.status === "Yolda" ? 2 : 0;
        return <div className={index <= activeIndex ? "complete" : ""} key={step}><span>{index < activeIndex ? "✓" : index + 1}</span><p><strong>{step}</strong><small>{index <= activeIndex ? "Tamamlandı / aktif" : "Bekleniyor"}</small></p></div>;
      })}
    </Card>

    <div className="shipment-detail-layout">
      <div className="shipment-detail-main">
        <Card className="shipment-journey-card"><div className="shipment-section-heading"><div><h2>Teslimat Rotası</h2><p>Planlanan lojistik güzergâhı</p></div><span>{shipment.carrier}</span></div><div className="shipment-journey"><div><i>●</i><p><span>Çıkış</span><strong>{shipment.origin}</strong><small>{formatDate(shipment.date)}</small></p></div><b /><div><i>◆</i><p><span>Varış</span><strong>{shipment.destination}</strong><small>{shipment.deliveredAt ? `Teslim: ${formatDate(shipment.deliveredAt)}` : `Tahmini: ${formatDate(shipment.estimatedDelivery)}`}</small></p></div></div></Card>
        <Card className="shipment-events-card"><div className="shipment-section-heading"><div><h2>Sevkiyat Hareketleri</h2><p>Lojistik sisteminden alınan son durumlar</p></div><span>Canlı takip</span></div><div className="shipment-events">{shipment.events.map((event, index) => <div className={event.completed ? "completed" : ""} key={`${event.date}-${event.title}`}><span>{event.completed ? "✓" : index + 1}</span><p><strong>{event.title}</strong><small>{event.location}</small></p><time>{formatDate(event.date)}<small>{new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(new Date(event.date))}</small></time></div>)}</div></Card>
        <Card className="shipment-items-card"><div className="shipment-section-heading"><div><h2>Sevk Edilen Ürünler</h2><p>{lines.length} ürün kalemi · {lines.reduce((sum, line) => sum + line.quantity, 0)} adet</p></div><Link to={`/siparisler/${shipment.orderId}`}>Siparişi görüntüle →</Link></div><div className="shipment-items">{lines.map(({ product, quantity }) => <div key={product.id}><span>{product.image}</span><p><strong>{product.name}</strong><small>{product.brand} · {product.code}</small></p><b>{quantity} {product.unit}</b></div>)}</div></Card>
      </div>
      <aside className="shipment-detail-sidebar">
        <Card className="shipment-current-card"><div className="shipment-current-icon">{shipment.status === "Teslim Edildi" ? "✓" : "➜"}</div><span>Güncel Durum</span><h2>{currentEvent?.title ?? shipment.status}</h2><p>{currentEvent?.location}</p><div><span>Tahmini teslimat</span><strong>{formatDate(shipment.estimatedDelivery)}</strong></div><div><span>Takip numarası</span><strong>{shipment.trackingNo}</strong></div></Card>
        <Card className="shipment-package-card"><h3>Taşıma Bilgileri</h3><dl><div><dt>Taşıyıcı</dt><dd>{shipment.carrier}</dd></div><div><dt>Paket / Palet</dt><dd>{shipment.packageCount}</dd></div><div><dt>Toplam ağırlık</dt><dd>{shipment.totalWeight.toLocaleString("tr-TR")} kg</dd></div><div><dt>Araç plakası</dt><dd>{shipment.vehiclePlate ?? "Planlanıyor"}</dd></div><div><dt>Sürücü</dt><dd>{shipment.driverName ?? "Planlanıyor"}</dd></div></dl></Card>
        <Card className="shipment-contact-card"><span>☎</span><div><strong>Teslimat desteği</strong><p>Sevkiyatınızla ilgili değişiklik ve sorularınız için bize ulaşın.</p><Link to="/destek">Destek talebi oluştur →</Link></div></Card>
      </aside>
    </div>
  </div>;
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
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "low-stock">("all");
  const [sort, setSort] = useState<"name" | "price-asc" | "price-desc">("name");
  const [selected, setSelected] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [addedMessage, setAddedMessage] = useState("");
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products", accountId, "favorites"], queryFn: () => portalService.getProducts(accountId) });
  const items = products.filter((product) => favorites.includes(product.id));

  const visibleItems = useMemo(() => items
    .filter((product) => {
      const term = search.trim().toLocaleLowerCase("tr-TR");
      return !term || `${product.name} ${product.code} ${product.brand}`.toLocaleLowerCase("tr-TR").includes(term);
    })
    .filter((product) => stockFilter === "all" || (stockFilter === "in-stock" ? product.stock > 0 : product.stock > 0 && product.stock <= 10))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name, "tr");
    }), [items, search, sort, stockFilter]);

  const selectableItems = visibleItems.filter((product) => product.stock > 0);
  const selectedItems = selectableItems.filter((product) => selected.includes(product.id));
  const selectedTotal = selectedItems.reduce((sum, product) => sum + product.price * (quantities[product.id] ?? 1), 0);
  const lowStockCount = items.filter((product) => product.stock > 0 && product.stock <= 10).length;
  const outOfStockCount = items.filter((product) => product.stock === 0).length;

  function updateQuantity(productId: number, quantity: number, stock: number) {
    setQuantities((current) => ({ ...current, [productId]: Math.min(stock, Math.max(1, quantity || 1)) }));
  }

  function addProduct(productId: number) {
    addToCart(productId, quantities[productId] ?? 1);
    setAddedMessage("Ürün sepetinize eklendi.");
    window.setTimeout(() => setAddedMessage(""), 1600);
  }

  function addSelectedProducts() {
    selectedItems.forEach((product) => addToCart(product.id, quantities[product.id] ?? 1));
    setAddedMessage(`${selectedItems.length} ürün sepetinize eklendi.`);
    setSelected([]);
    window.setTimeout(() => setAddedMessage(""), 1800);
  }

  function removeFavorite(productId: number) {
    toggleFavorite(productId);
    setSelected((current) => current.filter((id) => id !== productId));
  }

  return (
    <div className="page favorites-page">
      <header className="favorites-header">
        <div>
          <span className="favorites-eyebrow">Kişisel Ürün Listeniz</span>
          <h1>Favorilerim</h1>
          <p>Sık satın aldığınız ürünleri yönetin ve hızlıca yeniden sipariş verin.</p>
        </div>
        <Link className="button favorites-catalog-link" to="/urunler">＋ Katalogdan Ürün Ekle</Link>
      </header>

      {isLoading ? <LoadingState label="Favori ürünler yükleniyor" /> : !items.length ? (
        <Card className="favorites-empty-card">
          <EmptyState title="Favori ürününüz henüz yok" description="Sık kullandığınız ürünleri favorilerinize ekleyerek tekrar sipariş süreçlerinizi hızlandırabilirsiniz." action={<Link className="button button-primary" to="/urunler">Ürün Kataloğunu İncele</Link>} />
        </Card>
      ) : (
        <>
          <div className="favorites-stats">
            <Card><span className="favorites-stat-icon">♥</span><div><small>Toplam Favori</small><strong>{items.length}</strong><p>Kayıtlı ürün</p></div></Card>
            <Card><span className="favorites-stat-icon available">✓</span><div><small>Stokta Hazır</small><strong>{items.length - outOfStockCount}</strong><p>Hemen sipariş verilebilir</p></div></Card>
            <Card><span className="favorites-stat-icon warning">!</span><div><small>Kritik Stok</small><strong>{lowStockCount}</strong><p>10 adetten az kalan</p></div></Card>
            <Card><span className="favorites-stat-icon value">₺</span><div><small>Liste Değeri</small><strong>{formatMoney(items.reduce((sum, product) => sum + product.price, 0))}</strong><p>Her üründen 1 adet</p></div></Card>
          </div>

          <Card className="favorites-toolbar">
            <label className="favorites-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ürün adı, stok kodu veya marka ara..." aria-label="Favorilerde ara" /></label>
            <div className="favorites-filter-tabs" aria-label="Stok filtresi">
              <button className={stockFilter === "all" ? "active" : ""} type="button" onClick={() => setStockFilter("all")}>Tümü <span>{items.length}</span></button>
              <button className={stockFilter === "in-stock" ? "active" : ""} type="button" onClick={() => setStockFilter("in-stock")}>Stokta <span>{items.length - outOfStockCount}</span></button>
              <button className={stockFilter === "low-stock" ? "active" : ""} type="button" onClick={() => setStockFilter("low-stock")}>Kritik Stok <span>{lowStockCount}</span></button>
            </div>
            <select className="select" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="Favorileri sırala">
              <option value="name">Ürün adına göre</option>
              <option value="price-asc">Fiyat: Artan</option>
              <option value="price-desc">Fiyat: Azalan</option>
            </select>
          </Card>

          {addedMessage && <div className="favorites-success" role="status">✓ {addedMessage}</div>}

          {selected.length > 0 && (
            <div className="favorites-bulk-bar">
              <div><span>{selectedItems.length}</span><p><strong>ürün seçildi</strong><small>Seçili toplam: {formatMoney(selectedTotal)} + KDV</small></p></div>
              <button type="button" onClick={() => setSelected([])}>Seçimi Temizle</button>
              <button className="button button-primary" type="button" disabled={!selectedItems.length} onClick={addSelectedProducts}>Seçilenleri Sepete Ekle</button>
            </div>
          )}

          <Card className="favorites-list-card">
            <div className="favorites-list-heading">
              <label><input type="checkbox" checked={selectableItems.length > 0 && selectableItems.every((product) => selected.includes(product.id))} onChange={(event) => setSelected(event.target.checked ? selectableItems.map((product) => product.id) : [])} /><span>Tümünü seç</span></label>
              <p>{visibleItems.length} ürün gösteriliyor</p>
            </div>

            {!visibleItems.length ? <EmptyState title="Eşleşen ürün bulunamadı" description="Arama veya stok filtresini değiştirerek tekrar deneyin." /> : (
              <div className="favorites-list">
                {visibleItems.map((product) => {
                  const quantity = quantities[product.id] ?? 1;
                  return (
                    <article className={`favorite-product-row ${selected.includes(product.id) ? "selected" : ""}`} key={product.id}>
                      <label className="favorite-select"><input type="checkbox" disabled={!product.stock} checked={selected.includes(product.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, product.id] : current.filter((id) => id !== product.id))} /><span className="sr-only">Ürünü seç</span></label>
                      <Link className="favorite-product-visual" to={`/urunler/${product.id}`}><span>{product.image}</span><small>{product.category}</small></Link>
                      <div className="favorite-product-info">
                        <div><span>{product.brand}</span><small>Stok Kodu: {product.code}</small></div>
                        <Link to={`/urunler/${product.id}`}>{product.name}</Link>
                        <div className="favorite-stock"><Badge tone={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "danger"}>{product.stock > 0 ? "● Stokta" : "Stokta Yok"}</Badge><span>{product.stock} {product.unit} satılabilir</span></div>
                      </div>
                      <div className="favorite-price"><small>Firmanıza özel</small><strong>{formatMoney(product.price)}</strong><span>+ KDV / {product.unit}</span></div>
                      <div className="favorite-quantity"><label>Miktar</label><div><button type="button" disabled={quantity <= 1} onClick={() => updateQuantity(product.id, quantity - 1, product.stock)}>−</button><input type="number" min="1" max={product.stock} disabled={!product.stock} value={quantity} onChange={(event) => updateQuantity(product.id, Number(event.target.value), product.stock)} aria-label={`${product.name} miktarı`} /><button type="button" disabled={!product.stock || quantity >= product.stock} onClick={() => updateQuantity(product.id, quantity + 1, product.stock)}>＋</button></div></div>
                      <div className="favorite-line-total"><small>Toplam</small><strong>{formatMoney(product.price * quantity)}</strong></div>
                      <div className="favorite-actions"><button className="button button-primary" type="button" disabled={!product.stock} onClick={() => addProduct(product.id)}>Sepete Ekle</button><button className="favorite-remove" type="button" onClick={() => removeFavorite(product.id)} aria-label={`${product.name} ürününü favorilerden çıkar`}>♥</button></div>
                    </article>
                  );
                })}
              </div>
            )}
          </Card>

          <div className="favorites-note"><span aria-hidden="true">i</span><p><strong>Fiyat ve stok bilgisi</strong><small>Favori ürün fiyatları aktif firmanıza özeldir ve sipariş onayından önce yeniden doğrulanır.</small></p><Link to="/hizli-siparis">Hızlı Siparişe Git →</Link></div>
        </>
      )}
    </div>
  );
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
