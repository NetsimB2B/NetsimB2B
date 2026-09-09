import { useMemo, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Badge, Card, LoadingState } from "@/shared/components/Ui";
import { formatMoney } from "@/shared/lib/format";
import "./quick-order.css";

type QuickRow = { id: number; code: string; quantity: number };

let nextRowId = 1;

function createRow(code = "", quantity = 1): QuickRow {
  return { id: nextRowId++, code, quantity };
}

export function QuickOrderPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const storedCart = useCompanyContext((state) => state.cartByAccount[state.activeCariNo]);
  const [rows, setRows] = useState<QuickRow[]>(() => Array.from({ length: 5 }, () => createRow()));
  const [pasteData, setPasteData] = useState("");
  const [mode, setMode] = useState<"manual" | "bulk">("manual");
  const [importMessage, setImportMessage] = useState("");
  const [added, setAdded] = useState(false);
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products", accountId, "quick"], queryFn: () => portalService.getProducts(accountId) });
  const cartCount = (storedCart ?? []).reduce((sum, line) => sum + line.quantity, 0);

  const resolved = useMemo(() => rows.map((row) => {
    const normalizedCode = row.code.trim().toLocaleUpperCase("tr-TR");
    const product = products.find((item) => item.code.toLocaleUpperCase("tr-TR") === normalizedCode);
    const status = !normalizedCode
      ? "empty"
      : !product
        ? "not-found"
        : row.quantity <= 0
          ? "invalid-quantity"
          : row.quantity > product.stock
            ? "insufficient-stock"
            : "valid";
    return { ...row, product, status };
  }), [products, rows]);

  const validRows = resolved.filter((row) => row.status === "valid" && row.product);
  const invalidRows = resolved.filter((row) => row.code.trim() && row.status !== "valid");
  const subtotal = validRows.reduce((sum, row) => sum + (row.product?.price ?? 0) * row.quantity, 0);
  const vat = subtotal * .2;
  const totalQuantity = validRows.reduce((sum, row) => sum + row.quantity, 0);

  function updateRow(id: number, update: Partial<QuickRow>) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, ...update } : row));
  }

  function parseImport(value: string) {
    return value.split(/\r?\n/).filter((line) => line.trim()).map((line) => {
      const [code = "", quantity = "1"] = line.trim().split(/[\t,; ]+/);
      return createRow(code, Math.max(1, Number(quantity) || 1));
    });
  }

  function importRows() {
    const imported = parseImport(pasteData);
    if (!imported.length) {
      setImportMessage("Aktarılacak geçerli bir satır bulunamadı.");
      return;
    }
    setRows(imported);
    setImportMessage(`${imported.length} satır önizlemeye aktarıldı.`);
    setMode("manual");
  }

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result ?? "");
      const imported = parseImport(content);
      if (imported.length) {
        setRows(imported);
        setPasteData(content);
        setImportMessage(`${file.name} dosyasından ${imported.length} satır aktarıldı.`);
        setMode("manual");
      } else {
        setImportMessage("Dosyada aktarılabilir ürün satırı bulunamadı.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function downloadTemplate() {
    const content = "URUN_KODU;MIKTAR\nMTR-001;10\nBRG-6205;25\n";
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "netsim-hizli-siparis-sablonu.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function addValidRows() {
    validRows.forEach((row) => row.product && addToCart(row.product.id, row.quantity));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function addSuggestedProduct(code: string) {
    const emptyRow = rows.find((row) => !row.code.trim());
    if (emptyRow) {
      updateRow(emptyRow.id, { code, quantity: 1 });
    } else {
      setRows((current) => [...current, createRow(code)]);
    }
    setMode("manual");
  }

  return (
    <div className="page quick-order-page">
      <header className="quick-order-header">
        <div>
          <span className="quick-order-eyebrow">Toplu Satın Alma</span>
          <h1>Hızlı Sipariş</h1>
          <p>Ürün kodlarını girin veya listenizi yükleyin; fiyat ve stokları anında doğrulayın.</p>
        </div>
        <Link className="quick-cart-link" to="/sepet"><span aria-hidden="true">▣</span><div><small>Sepetiniz</small><strong>{cartCount} ürün</strong></div><b>→</b></Link>
      </header>

      <div className="quick-order-steps" aria-label="Sipariş adımları">
        <div className="active"><span>1</span><p><strong>Ürünleri girin</strong><small>Kod ve miktar</small></p></div>
        <i />
        <div><span>2</span><p><strong>Sepeti kontrol edin</strong><small>Fiyat ve stok</small></p></div>
        <i />
        <div><span>3</span><p><strong>Siparişi tamamlayın</strong><small>Teslimat ve ödeme</small></p></div>
      </div>

      <div className="quick-order-layout">
        <div className="quick-order-main">
          <Card className="quick-entry-card">
            <div className="quick-entry-tabs">
              <button className={mode === "manual" ? "active" : ""} type="button" onClick={() => setMode("manual")}><span aria-hidden="true">≡</span> Hızlı Giriş</button>
              <button className={mode === "bulk" ? "active" : ""} type="button" onClick={() => setMode("bulk")}><span aria-hidden="true">⇧</span> Excel / CSV Aktar</button>
            </div>

            {mode === "manual" ? (
              <>
                <div className="quick-entry-heading">
                  <div><h2>Ürün giriş tablosu</h2><p>Stok kodunu yazdığınızda ürün bilgileri otomatik doğrulanır.</p></div>
                  <button type="button" onClick={() => setRows(Array.from({ length: 5 }, () => createRow()))}>Tabloyu temizle</button>
                </div>

                {isLoading ? <LoadingState label="Ürün bilgileri yükleniyor" /> : (
                  <div className="quick-table-wrap">
                    <table className="quick-order-table">
                      <thead><tr><th>#</th><th>Ürün Kodu</th><th>Ürün Bilgisi</th><th>Stok</th><th>Miktar</th><th>Birim Fiyat</th><th>Toplam</th><th aria-label="İşlem" /></tr></thead>
                      <tbody>
                        {resolved.map((row, index) => (
                          <tr className={row.status !== "empty" ? `row-${row.status}` : ""} key={row.id}>
                            <td><span className="quick-row-number">{index + 1}</span></td>
                            <td>
                              <input
                                className="quick-code-input"
                                list="quick-product-codes"
                                value={row.code}
                                placeholder="Örn. MTR-001"
                                aria-label={`${index + 1}. satır ürün kodu`}
                                onChange={(event) => updateRow(row.id, { code: event.target.value })}
                              />
                            </td>
                            <td>
                              {row.product ? (
                                <div className="quick-product-info"><span aria-hidden="true">{row.product.image}</span><p><strong>{row.product.name}</strong><small>{row.product.brand} · {row.product.unit}</small></p></div>
                              ) : row.code ? <span className="quick-error-text">Ürün kodu bulunamadı</span> : <span className="quick-placeholder">Ürün bekleniyor</span>}
                            </td>
                            <td>
                              {row.product ? <Badge tone={row.product.stock >= row.quantity ? "success" : "danger"}>{row.product.stock} {row.product.unit}</Badge> : <span className="quick-placeholder">—</span>}
                            </td>
                            <td>
                              <div className="quick-quantity-control">
                                <button type="button" disabled={row.quantity <= 1} onClick={() => updateRow(row.id, { quantity: Math.max(1, row.quantity - 1) })}>−</button>
                                <input type="number" min="1" value={row.quantity} aria-label={`${index + 1}. satır miktarı`} onChange={(event) => updateRow(row.id, { quantity: Math.max(1, Number(event.target.value) || 1) })} />
                                <button type="button" onClick={() => updateRow(row.id, { quantity: row.quantity + 1 })}>＋</button>
                              </div>
                            </td>
                            <td>{row.product ? <strong className="quick-money">{formatMoney(row.product.price)}</strong> : <span className="quick-placeholder">—</span>}</td>
                            <td>{row.product ? <strong className="quick-line-total">{formatMoney(row.product.price * row.quantity)}</strong> : <span className="quick-placeholder">—</span>}</td>
                            <td><button className="quick-remove-row" type="button" aria-label={`${index + 1}. satırı sil`} onClick={() => setRows((current) => current.length === 1 ? [createRow()] : current.filter((item) => item.id !== row.id))}>×</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <datalist id="quick-product-codes">{products.map((product) => <option value={product.code} key={product.id}>{product.name}</option>)}</datalist>
                  </div>
                )}

                <div className="quick-table-footer">
                  <button className="quick-add-row" type="button" onClick={() => setRows((current) => [...current, createRow()])}>＋ Yeni Satır Ekle</button>
                  <div><span>{validRows.length} geçerli satır</span>{invalidRows.length > 0 && <strong>{invalidRows.length} satır düzeltilmeli</strong>}</div>
                </div>
              </>
            ) : (
              <div className="bulk-import-panel">
                <div className="bulk-import-heading"><div><h2>Excel veya CSV listenizi aktarın</h2><p>İlk sütunda ürün kodu, ikinci sütunda miktar bulunmalıdır.</p></div><button type="button" onClick={downloadTemplate}>↓ Örnek şablonu indir</button></div>
                <label className="bulk-drop-zone">
                  <input type="file" accept=".csv,.txt" onChange={handleFileUpload} />
                  <span aria-hidden="true">⇧</span>
                  <strong>CSV dosyanızı seçin</strong>
                  <small>veya ürün listesini aşağıdaki alana yapıştırın</small>
                  <b>Dosya Seç</b>
                </label>
                <div className="bulk-divider"><span>veya</span></div>
                <label className="bulk-paste-label">Ürün listesini yapıştırın <small>Her satır: Ürün Kodu [TAB] Miktar</small></label>
                <textarea className="bulk-paste-area" value={pasteData} onChange={(event) => setPasteData(event.target.value)} placeholder={"MTR-001\t10\nBRG-6205\t25\nDRV-220\t3"} />
                {importMessage && <p className="bulk-message">{importMessage}</p>}
                <div className="bulk-actions"><button className="button" type="button" onClick={() => setPasteData("")}>Temizle</button><button className="button button-primary" type="button" disabled={!pasteData.trim()} onClick={importRows}>Listeyi Doğrula →</button></div>
              </div>
            )}
          </Card>

          <Card className="quick-suggestions">
            <div><span aria-hidden="true">↻</span><p><strong>Sık sipariş verilen ürünler</strong><small>Tek tıkla giriş tablosuna ekleyin</small></p></div>
            <nav aria-label="Sık sipariş edilen ürünler">
              {products.filter((product) => product.featured).slice(0, 3).map((product) => (
                <button type="button" key={product.id} onClick={() => addSuggestedProduct(product.code)}><span>{product.image}</span><p><strong>{product.code}</strong><small>{product.name}</small></p><b>＋</b></button>
              ))}
            </nav>
          </Card>
        </div>

        <aside className="quick-order-sidebar">
          <Card className="quick-summary">
            <div className="quick-summary-heading"><span aria-hidden="true">▣</span><div><h2>Sipariş Özeti</h2><p>Sepete eklenecek ürünler</p></div></div>
            <dl>
              <div><dt>Geçerli ürün satırı</dt><dd>{validRows.length}</dd></div>
              <div><dt>Toplam ürün adedi</dt><dd>{totalQuantity}</dd></div>
              <div><dt>Ara toplam</dt><dd>{formatMoney(subtotal)}</dd></div>
              <div><dt>KDV (%20)</dt><dd>{formatMoney(vat)}</dd></div>
              <div className="quick-summary-total"><dt>Genel toplam</dt><dd>{formatMoney(subtotal + vat)}</dd></div>
            </dl>
            {invalidRows.length > 0 && <div className="quick-validation-warning"><span>!</span><p><strong>{invalidRows.length} satır kontrol edilmeli</strong><small>Hatalı satırlar sepete eklenmez.</small></p></div>}
            <button className={`button button-primary quick-submit ${added ? "is-added" : ""}`} type="button" disabled={!validRows.length} onClick={addValidRows}>{added ? "✓ Sepete Eklendi" : `${validRows.length} Satırı Sepete Ekle`}</button>
            <p className="quick-summary-note">Fiyat ve stok bilgileri sipariş onayında yeniden kontrol edilir.</p>
          </Card>

          <Card className="quick-assurance">
            <h3>Güvenli B2B alışveriş</h3>
            <div><span>✓</span><p><strong>Firmanıza özel fiyatlar</strong><small>Aktif cari hesabınıza göre</small></p></div>
            <div><span>✓</span><p><strong>Anlık stok kontrolü</strong><small>Satılabilir miktarlar doğrulanır</small></p></div>
            <div><span>✓</span><p><strong>Sipariş öncesi onay</strong><small>Sepette düzenleme yapabilirsiniz</small></p></div>
            <Link to="/destek">Yardıma mı ihtiyacınız var? →</Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}

