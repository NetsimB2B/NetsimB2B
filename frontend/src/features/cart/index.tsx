import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import netsimLogo from "@/assets/netsim-logo.png";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Badge, Card, EmptyState, LoadingState } from "@/shared/components/Ui";
import { formatMoney } from "@/shared/lib/format";
import "./cart.css";

function ExcelIcon() {
  return (
    <svg className="excel-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#107c41" d="M18 3h11v26H18z" />
      <path fill="#21a366" d="M18 7h8v4h-8zm0 6h8v4h-8zm0 6h8v4h-8z" />
      <path fill="#185c37" d="M3 7.5 19 5v22L3 24.5z" />
      <path fill="#fff" d="m7.4 12 2.8-.2 1.8 3 1.9-3.3 2.8-.2-3.1 4.8 3.2 4.9-2.9-.2-2-3.3-2 3-2.8-.2 3.2-4.3z" />
    </svg>
  );
}

export function CartPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const storedLines = useCompanyContext((state) => state.cartByAccount[state.activeCariNo]);
  const lines = storedLines ?? [];
  const updateCartLine = useCompanyContext((state) => state.updateCartLine);
  const removeCartLine = useCompanyContext((state) => state.removeCartLine);
  const clearCart = useCompanyContext((state) => state.clearCart);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", accountId, "cart"],
    queryFn: () => portalService.getProducts(accountId),
  });
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => portalService.getAccounts(),
  });

  const cartLines = lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const account = accounts.find((item) => item.id === accountId);
  const subtotal = cartLines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const vat = subtotal * .2;
  const grandTotal = subtotal + vat;
  const totalQuantity = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const pendingQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const hasStockIssue = cartLines.some((line) => line.quantity > line.product.stock || line.product.stock === 0);
  const exceedsCredit = subtotal > (account?.availableCredit ?? Number.POSITIVE_INFINITY);

  async function downloadCartReport() {
    setIsExporting(true);
    setExportError("");

    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sepet Raporu", {
        views: [{ state: "normal", showGridLines: false, zoomScale: 90 }],
        pageSetup: {
          orientation: "landscape",
          fitToPage: true,
          fitToWidth: 1,
          fitToHeight: 0,
          paperSize: 9,
          margins: { left: .3, right: .3, top: .5, bottom: .5, header: .2, footer: .2 },
        },
      });

      workbook.creator = "Netsim B2B";
      workbook.company = "Netsim Yazılım";
      workbook.subject = "B2B Sepet Raporu";
      workbook.created = new Date();

      worksheet.columns = [
        { key: "index", width: 7 },
        { key: "code", width: 16 },
        { key: "name", width: 39 },
        { key: "brand", width: 17 },
        { key: "quantity", width: 12 },
        { key: "unit", width: 11 },
        { key: "unitPrice", width: 18 },
        { key: "lineTotal", width: 20 },
      ];
      worksheet.properties.defaultRowHeight = 20;

      worksheet.mergeCells("A1:C4");
      worksheet.mergeCells("D1:H2");
      worksheet.mergeCells("D3:H4");
      for (let row = 1; row <= 4; row += 1) {
        worksheet.getRow(row).height = 22;
        for (let column = 1; column <= 8; column += 1) {
          worksheet.getCell(row, column).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF263B5A" } };
        }
      }
      worksheet.getCell("D1").value = "B2B SEPET RAPORU";
      worksheet.getCell("D1").font = { name: "Calibri", size: 22, bold: true, color: { argb: "FFFFFFFF" } };
      worksheet.getCell("D1").alignment = { vertical: "bottom", horizontal: "left" };
      worksheet.getCell("D3").value = "Firma özel fiyat, stok ve satın alma özeti";
      worksheet.getCell("D3").font = { name: "Calibri", size: 11, color: { argb: "FFFFB397" } };
      worksheet.getCell("D3").alignment = { vertical: "top", horizontal: "left" };

      const logoBlob = await fetch(netsimLogo).then((response) => response.blob());
      const logoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(logoBlob);
      });
      const logoId = workbook.addImage({ base64: logoBase64, extension: "png" });
      worksheet.addImage(logoId, { tl: { col: .25, row: .3 }, ext: { width: 185, height: 66 } });

      worksheet.getRow(5).height = 9;
      worksheet.mergeCells("B6:D6");
      worksheet.mergeCells("F6:H6");
      worksheet.mergeCells("B7:D7");
      worksheet.mergeCells("F7:H7");
      worksheet.getCell("A6").value = "Bayi / Firma";
      worksheet.getCell("B6").value = account?.name ?? "—";
      worksheet.getCell("E6").value = "Cari Kodu";
      worksheet.getCell("F6").value = account?.code ?? String(accountId);
      worksheet.getCell("A7").value = "Rapor Tarihi";
      worksheet.getCell("B7").value = new Date();
      worksheet.getCell("B7").numFmt = "dd mmmm yyyy hh:mm";
      worksheet.getCell("E7").value = "Sepet Özeti";
      worksheet.getCell("F7").value = `${cartLines.length} kalem / ${totalQuantity} adet`;

      for (const rowNumber of [6, 7]) {
        const row = worksheet.getRow(rowNumber);
        row.height = 23;
        for (let column = 1; column <= 8; column += 1) {
          const cell = row.getCell(column);
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowNumber === 6 ? "FFF3F6F9" : "FFF8FAFC" } };
          cell.border = { bottom: { style: "thin", color: { argb: "FFD9DEE7" } } };
          cell.alignment = { vertical: "middle" };
          cell.font = { name: "Calibri", size: 10, color: { argb: "FF344054" } };
        }
      }
      for (const cellAddress of ["A6", "E6", "A7", "E7"]) {
        worksheet.getCell(cellAddress).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF667085" } };
      }

      worksheet.getRow(8).height = 9;
      const headerRow = worksheet.getRow(9);
      headerRow.values = ["Sıra", "Stok Kodu", "Ürün Adı", "Marka", "Miktar", "Birim", "Birim Fiyat", "Satır Toplamı"];
      headerRow.height = 28;
      headerRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF263B5A" } };
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = { right: { style: "thin", color: { argb: "FF405574" } } };
      });
      worksheet.autoFilter = { from: "A9", to: "H9" };

      cartLines.forEach(({ product, quantity }, index) => {
        const row = worksheet.addRow([
          index + 1,
          product.code,
          product.name,
          product.brand,
          quantity,
          product.unit,
          product.price,
          product.price * quantity,
        ]);
        row.height = 24;
        row.eachCell((cell, column) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFFFFFFF" : "FFF8FAFC" } };
          cell.font = { name: "Calibri", size: 10, color: { argb: "FF344054" }, bold: column === 2 || column >= 7 };
          cell.alignment = { vertical: "middle", horizontal: [1, 5, 6].includes(column) ? "center" : column >= 7 ? "right" : "left" };
          cell.border = { bottom: { style: "thin", color: { argb: "FFE4E7EC" } } };
        });
        row.getCell(7).numFmt = '₺#,##0.00';
        row.getCell(8).numFmt = '₺#,##0.00';
      });

      const firstTotalRow = 10 + cartLines.length;
      const totals = [
        ["Ara Toplam", subtotal],
        ["KDV (%20)", vat],
        ["GENEL TOPLAM", grandTotal],
      ] as const;
      totals.forEach(([label, value], index) => {
        const rowNumber = firstTotalRow + index;
        worksheet.mergeCells(`A${rowNumber}:G${rowNumber}`);
        const labelCell = worksheet.getCell(`A${rowNumber}`);
        const valueCell = worksheet.getCell(`H${rowNumber}`);
        labelCell.value = label;
        valueCell.value = value;
        labelCell.alignment = { horizontal: "right", vertical: "middle" };
        valueCell.alignment = { horizontal: "right", vertical: "middle" };
        valueCell.numFmt = '₺#,##0.00';
        const isGrandTotal = index === 2;
        for (let column = 1; column <= 8; column += 1) {
          const cell = worksheet.getCell(rowNumber, column);
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: isGrandTotal ? "FFFFF1EB" : "FFF3F6F9" } };
          cell.font = { name: "Calibri", size: isGrandTotal ? 12 : 10, bold: true, color: { argb: isGrandTotal ? "FF172033" : "FF475467" } };
          cell.border = { top: { style: isGrandTotal ? "medium" : "thin", color: { argb: isGrandTotal ? "FFFF5A1F" : "FFD9DEE7" } } };
        }
        worksheet.getRow(rowNumber).height = isGrandTotal ? 29 : 23;
      });

      const noteRow = firstTotalRow + 4;
      worksheet.mergeCells(`A${noteRow}:H${noteRow + 1}`);
      const noteCell = worksheet.getCell(`A${noteRow}`);
      noteCell.value = "Bilgilendirme: Fiyat ve stok bilgileri sipariş onayı sırasında yeniden doğrulanır. Bu belge teklif veya fatura yerine geçmez.";
      noteCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF7F3" } };
      noteCell.font = { name: "Calibri", size: 9, italic: true, color: { argb: "FF8A3B1C" } };
      noteCell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      noteCell.border = { left: { style: "medium", color: { argb: "FFFF5A1F" } } };
      worksheet.getRow(noteRow).height = 21;
      worksheet.getRow(noteRow + 1).height = 21;
      worksheet.pageSetup.printArea = `A1:H${noteRow + 1}`;
      worksheet.pageSetup.printTitlesRow = "9:9";
      worksheet.headerFooter.oddFooter = "&LNetsim Yazılım · B2B&C&F&R&P / &N";

      const buffer = await workbook.xlsx.writeBuffer();
      const url = URL.createObjectURL(new Blob([buffer as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `netsim-b2b-sepet-${accountId}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel report could not be generated", error);
      setExportError("Excel raporu oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="page cart-page">
      <header className="cart-header">
        <div>
          <span className="cart-eyebrow">Satın Alma</span>
          <h1>Sepetim</h1>
          <p>{lines.length} farklı ürün · Toplam {isLoading ? pendingQuantity : totalQuantity} adet</p>
        </div>
        {lines.length > 0 && (
          <div className="cart-header-actions">
            <button className="cart-excel-button" type="button" disabled={isExporting} onClick={downloadCartReport}><ExcelIcon /> {isExporting ? "Excel Hazırlanıyor..." : "Excel Raporu İndir"}</button>
            <button className="cart-clear-button" type="button" onClick={() => setConfirmClear(true)}>Sepeti Temizle</button>
          </div>
        )}
      </header>
      {exportError && <div className="cart-export-error" role="alert">{exportError}</div>}

      {lines.length > 0 && (
        <div className="cart-checkout-steps" aria-label="Sipariş adımları">
          <div className="active"><span>1</span><p><strong>Sepet</strong><small>Ürün ve miktar kontrolü</small></p></div>
          <i />
          <div><span>2</span><p><strong>Teslimat ve Ödeme</strong><small>Sipariş bilgileri</small></p></div>
          <i />
          <div><span>3</span><p><strong>Sipariş Onayı</strong><small>Son kontrol</small></p></div>
        </div>
      )}

      {isLoading && <LoadingState />}
      {!isLoading && !cartLines.length && (
        <Card className="cart-empty-card">
          <EmptyState title="Sepetiniz henüz boş" description="Firmanıza özel fiyatlarla ürün kataloğumuzu inceleyebilir veya ürün kodlarıyla hızlı sipariş oluşturabilirsiniz." action={<div className="cart-empty-actions"><Link className="button button-primary" to="/urunler">Ürünleri İncele</Link><Link className="button" to="/hizli-siparis">Hızlı Sipariş</Link></div>} />
        </Card>
      )}

      {!isLoading && Boolean(cartLines.length) && (
        <div className="cart-layout">
          <div className="cart-main">
            {confirmClear && (
              <div className="cart-clear-confirm" role="alert">
                <span aria-hidden="true">!</span>
                <div><strong>Tüm ürünler sepetten kaldırılsın mı?</strong><small>Bu işlem geri alınamaz.</small></div>
                <button type="button" onClick={() => setConfirmClear(false)}>Vazgeç</button>
                <button className="danger" type="button" onClick={() => { clearCart(); setConfirmClear(false); }}>Sepeti Temizle</button>
              </div>
            )}

            <Card className="cart-lines-card">
              <div className="cart-lines-heading">
                <div><h2>Sepetteki Ürünler</h2><p>Fiyat ve satılabilir stok bilgileri firmanıza özeldir.</p></div>
                <Link to="/urunler">＋ Alışverişe Devam Et</Link>
              </div>
              <div className="cart-column-headings"><span>Ürün</span><span>Birim Fiyat</span><span>Miktar</span><span>Satır Toplamı</span><span /></div>
              <div className="cart-lines">
            {cartLines.map(({ product, quantity }) => (
                  <article className={`cart-line ${quantity > product.stock ? "has-stock-error" : ""}`} key={product.id}>
                <Link className="cart-product-icon" to={`/urunler/${product.id}`} aria-label={`${product.name} detayını görüntüle`}><span>{product.image}</span><small>{product.category}</small></Link>
                <div className="cart-product-copy">
                      <div><span>{product.brand}</span><small>Stok Kodu: {product.code}</small></div>
                  <Link to={`/urunler/${product.id}`}>{product.name}</Link>
                      <div className="cart-stock-row">
                        <Badge tone={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "danger"}>{product.stock > 0 ? "● Stokta" : "Stokta Yok"}</Badge>
                        <span>{product.stock} {product.unit} satılabilir</span>
                      </div>
                </div>
                    <div className="cart-unit-price"><strong>{formatMoney(product.price)}</strong><small>+ KDV / {product.unit}</small></div>
                <div className="cart-quantity-control">
                  <button type="button" aria-label="Miktarı azalt" disabled={quantity <= 1} onClick={() => updateCartLine(product.id, Math.max(1, quantity - 1))}>−</button>
                  <input type="number" min="1" max={product.stock} value={quantity} aria-label={`${product.name} miktarı`} onChange={(event) => updateCartLine(product.id, Math.min(product.stock, Math.max(1, Number(event.target.value) || 1)))} />
                  <button type="button" aria-label="Miktarı artır" disabled={quantity >= product.stock} onClick={() => updateCartLine(product.id, quantity + 1)}>＋</button>
                </div>
                <strong className="cart-line-total">{formatMoney(product.price * quantity)}</strong>
                    <button className="remove-line" type="button" aria-label={`${product.name} ürününü kaldır`} onClick={() => removeCartLine(product.id)}>×</button>
                    {quantity > product.stock && <p className="cart-line-warning">Talep edilen miktar mevcut stoktan fazla. Miktarı güncelleyin.</p>}
                  </article>
            ))}
              </div>
            </Card>

            <div className="cart-info-panels">
              <Card><span aria-hidden="true">→</span><div><strong>Tahmini Sevkiyat</strong><p>Stoklu ürünler 1–2 iş günü içinde sevke hazırlanır.</p></div></Card>
              <Card><span aria-hidden="true">▤</span><div><strong>Ödeme Koşulu</strong><p>Cari hesabınıza tanımlı ödeme seçenekleri checkout adımında gösterilir.</p></div></Card>
              <Card><span aria-hidden="true">✓</span><div><strong>Güvenli Sipariş</strong><p>Fiyat ve stoklar sipariş onayından önce tekrar doğrulanır.</p></div></Card>
            </div>
          </div>

          <aside className="cart-sidebar">
            <Card className="cart-summary">
              <div className="cart-summary-heading"><span aria-hidden="true">▣</span><div><h2>Sipariş Özeti</h2><p>{cartLines.length} ürün kalemi</p></div></div>
              <dl>
                <div><dt>Ara toplam</dt><dd>{formatMoney(subtotal)}</dd></div>
                <div><dt>KDV (%20)</dt><dd>{formatMoney(vat)}</dd></div>
                <div><dt>Tahmini sevkiyat</dt><dd className="free-shipping">Ücretsiz</dd></div>
                <div className="cart-grand-total"><dt>Genel toplam</dt><dd>{formatMoney(grandTotal)}</dd></div>
              </dl>

              {account && (
                <div className="cart-credit">
                  <div><span>Kullanılabilir cari limit</span><strong>{formatMoney(account.availableCredit)}</strong></div>
                  <div className="cart-credit-bar"><span style={{ width: `${Math.min(100, (subtotal / account.availableCredit) * 100)}%` }} /></div>
                  <small>Sipariş sonrası kalan: {formatMoney(Math.max(0, account.availableCredit - subtotal))}</small>
                </div>
              )}

              {hasStockIssue && <div className="cart-summary-warning">Stok problemi olan ürünleri kontrol edin.</div>}
              {exceedsCredit && <div className="cart-summary-warning">Sipariş tutarı kullanılabilir cari limitinizi aşıyor.</div>}

              <Link className={`button button-primary cart-checkout-button ${(hasStockIssue || exceedsCredit) ? "is-disabled" : ""}`} aria-disabled={hasStockIssue || exceedsCredit} onClick={(event) => { if (hasStockIssue || exceedsCredit) event.preventDefault(); }} to="/checkout">Teslimat ve Ödemeye Geç →</Link>
              <Link className="cart-quote-link" to="/destek">Bu sepet için teklif isteyin</Link>
              <p className="cart-summary-note">Sipariş vermekle henüz ödeme yapmış olmazsınız.</p>
            </Card>

            <Card className="cart-support-card">
              <span aria-hidden="true">?</span>
              <div><strong>Satın alma desteği</strong><p>Ürün veya fiyatlarla ilgili yardıma mı ihtiyacınız var?</p><Link to="/destek">Destek ekibine ulaşın →</Link></div>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}

