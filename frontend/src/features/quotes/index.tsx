import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import netsimLogo from "@/assets/netsim-logo.png";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Badge, Card, EmptyState, ErrorState, LoadingState } from "@/shared/components/Ui";
import { formatDate, formatMoney } from "@/shared/lib/format";
import "./quotes.css";

function getDaysRemaining(validUntil: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(validUntil).getTime() - today.getTime()) / 86_400_000);
}

function quoteTone(status: string) {
  return status === "Geçerli" ? "success" as const : status === "Süresi Doldu" ? "danger" as const : "neutral" as const;
}

function ExcelIcon() {
  return (
    <svg className="quote-excel-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#107c41" d="M18 3h11v26H18z" />
      <path fill="#21a366" d="M18 7h8v4h-8zm0 6h8v4h-8zm0 6h8v4h-8z" />
      <path fill="#185c37" d="M3 7.5 19 5v22L3 24.5z" />
      <path fill="#fff" d="m7.4 12 2.8-.2 1.8 3 1.9-3.3 2.8-.2-3.1 4.8 3.2 4.9-2.9-.2-2-3.3-2 3-2.8-.2 3.2-4.3z" />
    </svg>
  );
}

export function QuotesPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Tümü" | "Geçerli" | "Kabul Edildi" | "Süresi Doldu">("Tümü");
  const [sort, setSort] = useState<"newest" | "validity" | "amount">("newest");
  const { data: quotes = [], isLoading, isError } = useQuery({ queryKey: ["quotes", accountId], queryFn: () => portalService.getQuotes(accountId) });
  const visibleQuotes = useMemo(() => quotes
    .filter((quote) => {
      const term = search.trim().toLocaleLowerCase("tr-TR");
      return !term || `${quote.id} ${quote.reference} ${quote.title}`.toLocaleLowerCase("tr-TR").includes(term);
    })
    .filter((quote) => statusFilter === "Tümü" || quote.status === statusFilter)
    .sort((a, b) => {
      if (sort === "amount") return b.total - a.total;
      if (sort === "validity") return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }), [quotes, search, sort, statusFilter]);
  const validQuotes = quotes.filter((quote) => quote.status === "Geçerli");
  const expiringQuotes = validQuotes.filter((quote) => getDaysRemaining(quote.validUntil) <= 7).length;

  return (
    <div className="page quotes-page">
      <header className="quotes-header">
        <div><span className="quotes-eyebrow">Satış Teklifleri</span><h1>Tekliflerim</h1><p>Firmanıza özel hazırlanan teklifleri inceleyin ve siparişe dönüştürün.</p></div>
        <Link className="button quotes-request-button" to="/destek?type=Teklif">＋ Yeni Teklif Talebi</Link>
      </header>

      {isLoading ? <LoadingState label="Teklifler yükleniyor" /> : isError ? <ErrorState message="Teklifler şu anda yüklenemedi." /> : !quotes.length ? (
        <Card className="quotes-empty-card"><EmptyState title="Henüz teklifiniz bulunmuyor" description="İhtiyacınız olan ürünler için satış ekibimizden firma özel teklif talep edebilirsiniz." action={<Link className="button button-primary" to="/destek?type=Teklif">Teklif Talebi Oluştur</Link>} /></Card>
      ) : (
        <>
          <div className="quotes-stats">
            <Card><span>◇</span><div><small>Toplam Teklif</small><strong>{quotes.length}</strong><p>Tüm dönemler</p></div></Card>
            <Card><span className="valid">✓</span><div><small>Geçerli Teklif</small><strong>{validQuotes.length}</strong><p>Siparişe dönüştürülebilir</p></div></Card>
            <Card><span className="warning">◷</span><div><small>Süresi Yaklaşan</small><strong>{expiringQuotes}</strong><p>7 gün içinde dolacak</p></div></Card>
            <Card><span className="value">₺</span><div><small>Geçerli Teklif Tutarı</small><strong>{formatMoney(validQuotes.reduce((sum, quote) => sum + quote.total, 0))}</strong><p>KDV hariç toplam</p></div></Card>
          </div>

          <Card className="quotes-toolbar">
            <label className="quotes-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Teklif no, referans veya başlık ara..." aria-label="Tekliflerde ara" /></label>
            <div className="quotes-status-tabs">{(["Tümü", "Geçerli", "Kabul Edildi", "Süresi Doldu"] as const).map((status) => <button className={statusFilter === status ? "active" : ""} type="button" key={status} onClick={() => setStatusFilter(status)}>{status}<span>{status === "Tümü" ? quotes.length : quotes.filter((quote) => quote.status === status).length}</span></button>)}</div>
            <select className="select" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="Teklifleri sırala"><option value="newest">En yeni teklifler</option><option value="validity">Geçerlilik tarihine göre</option><option value="amount">Tutara göre</option></select>
          </Card>

          <Card className="quotes-table-card">
            <div className="quotes-table-heading"><div><h2>Teklif Listesi</h2><p>{visibleQuotes.length} kayıt gösteriliyor</p></div><span>Tutarlar KDV hariçtir</span></div>
            {!visibleQuotes.length ? <EmptyState title="Eşleşen teklif bulunamadı" description="Arama veya durum filtresini değiştirerek tekrar deneyin." /> : (
              <div className="quotes-table-wrap">
                <table className="quotes-table">
                  <thead><tr><th>Teklif / Referans</th><th>Açıklama</th><th>Teklif Tarihi</th><th>Geçerlilik</th><th>Ürün</th><th>Tutar</th><th>Durum</th><th /></tr></thead>
                  <tbody>{visibleQuotes.map((quote) => {
                    const daysRemaining = getDaysRemaining(quote.validUntil);
                    return <tr key={quote.id}>
                      <td><strong>{quote.id}</strong><small>{quote.reference}</small></td>
                      <td><Link to={`/teklifler/${quote.id}`}>{quote.title}</Link><small>{quote.salesRepresentative} tarafından hazırlandı</small></td>
                      <td><span>{formatDate(quote.createdAt)}</span></td>
                      <td><strong className={daysRemaining < 0 ? "expired" : daysRemaining <= 7 ? "expiring" : ""}>{daysRemaining < 0 ? `${Math.abs(daysRemaining)} gün önce doldu` : `${daysRemaining} gün kaldı`}</strong><small>{formatDate(quote.validUntil)}</small></td>
                      <td><span>{quote.lines.length} kalem</span><small>{quote.lines.reduce((sum, line) => sum + line.quantity, 0)} adet</small></td>
                      <td><strong className="quote-table-total">{formatMoney(quote.total)}</strong><small>+ KDV</small></td>
                      <td><Badge tone={quoteTone(quote.status)}>{quote.status}</Badge></td>
                      <td><Link className="quote-row-link" to={`/teklifler/${quote.id}`} aria-label={`${quote.id} teklifini incele`}>›</Link></td>
                    </tr>;
                  })}</tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="quotes-info-note"><span>i</span><p><strong>Teklifler hakkında</strong><small>Teklif fiyatları belirtilen geçerlilik süresince korunur. Sipariş sırasında stok durumu yeniden doğrulanır.</small></p><Link to="/destek?type=Teklif">Satış ekibine ulaşın →</Link></div>
        </>
      )}
    </div>
  );
}

export function QuoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const { data: quotes = [], isLoading, isError } = useQuery({ queryKey: ["quotes", accountId], queryFn: () => portalService.getQuotes(accountId) });
  const { data: products = [], isLoading: productsLoading } = useQuery({ queryKey: ["products", accountId, "quote"], queryFn: () => portalService.getProducts(accountId) });
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const quote = quotes.find((item) => item.id === id)!;
  const account = accounts.find((item) => item.id === accountId);

  if (isLoading || productsLoading) return <div className="page"><LoadingState /></div>;
  if (isError) return <div className="page"><ErrorState message="Teklif detayı şu anda yüklenemedi." /></div>;
  if (!quote) return <div className="page"><EmptyState title="Teklif bulunamadı" description="Teklif kaldırılmış veya erişiminize kapatılmış olabilir." /></div>;

  const daysRemaining = getDaysRemaining(quote.validUntil);
  const canAccept = quote.status === "Geçerli" && daysRemaining >= 0;
  const listTotal = quote.lines.reduce((sum, line) => sum + line.listPrice * line.quantity, 0);
  const discountTotal = listTotal - quote.total;
  const vat = quote.total * .2;
  const stockAvailable = quote.lines.every((line) => (products.find((product) => product.id === line.productId)?.stock ?? 0) >= line.quantity);

  function acceptQuote() {
    quote.lines.forEach((line) => addToCart(line.productId, line.quantity, {
      unitPrice: line.unitPrice,
      quoteId: quote.id,
    }));
    navigate(`/sepet?quote=${quote.id}`);
  }

  async function downloadQuoteReport() {
    setIsExporting(true);
    setExportError("");
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Kurumsal Teklif", {
        views: [{ state: "normal", showGridLines: false, zoomScale: 90 }],
        pageSetup: {
          orientation: "landscape",
          fitToPage: true,
          fitToWidth: 1,
          fitToHeight: 0,
          paperSize: 9,
          margins: { left: .3, right: .3, top: .45, bottom: .45, header: .2, footer: .2 },
        },
      });
      workbook.creator = "Netsim B2B";
      workbook.company = "Netsim Yazılım";
      workbook.subject = `${quote.id} numaralı kurumsal satış teklifi`;
      workbook.title = quote.title;
      workbook.created = new Date();
      worksheet.columns = [
        { width: 7 }, { width: 16 }, { width: 36 }, { width: 16 }, { width: 11 },
        { width: 12 }, { width: 17 }, { width: 12 }, { width: 18 }, { width: 20 },
      ];
      worksheet.properties.defaultRowHeight = 20;

      worksheet.mergeCells("A1:C4");
      worksheet.mergeCells("D1:J2");
      worksheet.mergeCells("D3:J4");
      for (let row = 1; row <= 4; row += 1) {
        worksheet.getRow(row).height = 22;
        for (let column = 1; column <= 10; column += 1) worksheet.getCell(row, column).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF263B5A" } };
      }
      worksheet.getCell("D1").value = "KURUMSAL SATIŞ TEKLİFİ";
      worksheet.getCell("D1").font = { name: "Calibri", size: 22, bold: true, color: { argb: "FFFFFFFF" } };
      worksheet.getCell("D1").alignment = { vertical: "bottom" };
      worksheet.getCell("D3").value = `${quote.id}  ·  ${quote.reference}  ·  ${quote.title}`;
      worksheet.getCell("D3").font = { name: "Calibri", size: 11, color: { argb: "FFFFB397" } };
      worksheet.getCell("D3").alignment = { vertical: "top" };

      const logoBlob = await fetch(netsimLogo).then((response) => response.blob());
      const logoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(logoBlob);
      });
      const logoId = workbook.addImage({ base64: logoBase64, extension: "png" });
      worksheet.addImage(logoId, { tl: { col: .25, row: .3 }, ext: { width: 185, height: 66 } });

      worksheet.getRow(5).height = 8;
      const metadata = [
        ["Müşteri / Bayi", account?.name ?? "—", "Cari Kodu", account?.code ?? String(accountId)],
        ["Teklif No", quote.id, "Talep Referansı", quote.reference],
        ["Teklif Tarihi", new Date(quote.createdAt), "Son Geçerlilik", new Date(quote.validUntil)],
        ["Müşteri Temsilcisi", quote.salesRepresentative, "Teklif Durumu", quote.status],
        ["Ödeme Koşulu", quote.paymentTerm, "Teslim Şekli", quote.deliveryTerm],
      ] as const;
      metadata.forEach((values, index) => {
        const rowNumber = 6 + index;
        worksheet.mergeCells(`B${rowNumber}:E${rowNumber}`);
        worksheet.mergeCells(`G${rowNumber}:J${rowNumber}`);
        worksheet.getCell(`A${rowNumber}`).value = values[0];
        worksheet.getCell(`B${rowNumber}`).value = values[1];
        worksheet.getCell(`F${rowNumber}`).value = values[2];
        worksheet.getCell(`G${rowNumber}`).value = values[3];
        const row = worksheet.getRow(rowNumber);
        row.height = 22;
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFF3F6F9" : "FFF8FAFC" } };
          cell.border = { bottom: { style: "thin", color: { argb: "FFD9DEE7" } } };
          cell.alignment = { vertical: "middle" };
          cell.font = { name: "Calibri", size: 9, color: { argb: "FF344054" } };
        });
        worksheet.getCell(`A${rowNumber}`).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF667085" } };
        worksheet.getCell(`F${rowNumber}`).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF667085" } };
      });
      worksheet.getCell("B8").numFmt = "dd mmmm yyyy";
      worksheet.getCell("G8").numFmt = "dd mmmm yyyy";

      worksheet.getRow(11).height = 8;
      const headerRow = worksheet.getRow(12);
      headerRow.values = ["Sıra", "Stok Kodu", "Ürün Adı", "Marka", "Miktar", "Birim", "Liste Fiyatı", "İndirim", "Teklif Fiyatı", "Satır Toplamı"];
      headerRow.height = 28;
      headerRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF263B5A" } };
        cell.font = { name: "Calibri", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = { right: { style: "thin", color: { argb: "FF405574" } } };
      });
      worksheet.autoFilter = { from: "A12", to: "J12" };

      quote.lines.forEach((line, index) => {
        const product = products.find((item) => item.id === line.productId);
        if (!product) return;
        const row = worksheet.addRow([
          index + 1, product.code, product.name, product.brand, line.quantity, product.unit,
          line.listPrice, 1 - line.unitPrice / line.listPrice, line.unitPrice, line.unitPrice * line.quantity,
        ]);
        row.height = 24;
        row.eachCell((cell, column) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFFFFFFF" : "FFF8FAFC" } };
          cell.font = { name: "Calibri", size: 9, color: { argb: "FF344054" }, bold: column === 2 || column >= 9 };
          cell.alignment = { vertical: "middle", horizontal: [1, 5, 6, 8].includes(column) ? "center" : column >= 7 ? "right" : "left" };
          cell.border = { bottom: { style: "thin", color: { argb: "FFE4E7EC" } } };
        });
        row.getCell(7).numFmt = '₺#,##0.00';
        row.getCell(8).numFmt = "0.0%";
        row.getCell(9).numFmt = '₺#,##0.00';
        row.getCell(10).numFmt = '₺#,##0.00';
        row.getCell(8).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF16875F" } };
      });

      const firstTotalRow = 13 + quote.lines.length;
      const totals = [
        ["Liste Fiyatları Toplamı", listTotal, false],
        ["Teklif İndirimi", -discountTotal, false],
        ["Ara Toplam", quote.total, false],
        ["KDV (%20)", vat, false],
        ["GENEL TOPLAM", quote.total + vat, true],
      ] as const;
      totals.forEach(([label, value, isGrand], index) => {
        const rowNumber = firstTotalRow + index;
        worksheet.mergeCells(`A${rowNumber}:I${rowNumber}`);
        worksheet.getCell(`A${rowNumber}`).value = label;
        worksheet.getCell(`J${rowNumber}`).value = value;
        worksheet.getCell(`A${rowNumber}`).alignment = { horizontal: "right", vertical: "middle" };
        worksheet.getCell(`J${rowNumber}`).alignment = { horizontal: "right", vertical: "middle" };
        worksheet.getCell(`J${rowNumber}`).numFmt = '₺#,##0.00;[Red]-₺#,##0.00';
        for (let column = 1; column <= 10; column += 1) {
          const cell = worksheet.getCell(rowNumber, column);
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: isGrand ? "FFFFF1EB" : "FFF3F6F9" } };
          cell.font = { name: "Calibri", size: isGrand ? 12 : 10, bold: true, color: { argb: isGrand ? "FF172033" : "FF475467" } };
          cell.border = { top: { style: isGrand ? "medium" : "thin", color: { argb: isGrand ? "FFFF5A1F" : "FFD9DEE7" } } };
        }
        worksheet.getRow(rowNumber).height = isGrand ? 29 : 22;
      });

      const termsRow = firstTotalRow + totals.length + 1;
      worksheet.mergeCells(`A${termsRow}:J${termsRow}`);
      worksheet.mergeCells(`A${termsRow + 1}:J${termsRow + 2}`);
      worksheet.getCell(`A${termsRow}`).value = "TİCARİ KOŞULLAR VE AÇIKLAMALAR";
      worksheet.getCell(`A${termsRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF263B5A" } };
      worksheet.getCell(`A${termsRow}`).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      worksheet.getCell(`A${termsRow}`).alignment = { vertical: "middle" };
      worksheet.getCell(`A${termsRow + 1}`).value = `Ödeme: ${quote.paymentTerm}  |  Teslimat: ${quote.deliveryTerm}\n${quote.note ?? "Fiyatlara KDV dahil değildir."}\nTeklif, ${formatDate(quote.validUntil)} tarihine kadar geçerlidir. Stok durumu sipariş onayında yeniden doğrulanır.`;
      worksheet.getCell(`A${termsRow + 1}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
      worksheet.getCell(`A${termsRow + 1}`).font = { name: "Calibri", size: 9, color: { argb: "FF475467" } };
      worksheet.getCell(`A${termsRow + 1}`).alignment = { vertical: "middle", wrapText: true };
      worksheet.getRow(termsRow).height = 24;
      worksheet.getRow(termsRow + 1).height = 28;
      worksheet.getRow(termsRow + 2).height = 28;

      const signatureRow = termsRow + 4;
      worksheet.mergeCells(`A${signatureRow}:D${signatureRow}`);
      worksheet.mergeCells(`G${signatureRow}:J${signatureRow}`);
      worksheet.getCell(`A${signatureRow}`).value = `Netsim Yazılım\nHazırlayan: ${quote.salesRepresentative}\nİmza / Kaşe`;
      worksheet.getCell(`G${signatureRow}`).value = `${account?.name ?? "Müşteri"}\nYetkili Adı Soyadı\nİmza / Kaşe`;
      for (const address of [`A${signatureRow}`, `G${signatureRow}`]) {
        worksheet.getCell(address).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF344054" } };
        worksheet.getCell(address).alignment = { vertical: "top", horizontal: "center", wrapText: true };
        worksheet.getCell(address).border = { top: { style: "thin", color: { argb: "FF98A2B3" } } };
      }
      worksheet.getRow(signatureRow).height = 52;
      worksheet.pageSetup.printArea = `A1:J${signatureRow}`;
      worksheet.pageSetup.printTitlesRow = "12:12";
      worksheet.headerFooter.oddFooter = `&LNetsim Yazılım · B2B&C${quote.id}&R&P / &N`;

      const buffer = await workbook.xlsx.writeBuffer();
      const url = URL.createObjectURL(new Blob([buffer as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `netsim-teklif-${quote.id}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Quote Excel report could not be generated", error);
      setExportError("Excel teklif raporu oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="page quote-detail-page">
      <div className="quote-print-letterhead">
        <img src={netsimLogo} alt="Netsim Yazılım" />
        <div><strong>NETSİM YAZILIM</strong><span>Kurumsal B2B Satış Teklifi</span><small>www.netsim.com.tr</small></div>
      </div>
      <nav className="quote-breadcrumb"><Link to="/dashboard">Ana Sayfa</Link><span>›</span><Link to="/teklifler">Tekliflerim</Link><span>›</span><strong>{quote.id}</strong></nav>
      <header className="quote-detail-header">
        <div><span className="quotes-eyebrow">Satış Teklifi · {quote.reference}</span><h1>{quote.title}</h1><p>{account?.name} adına hazırlanmıştır.</p></div>
        <div className="quote-detail-header-actions"><Badge tone={quoteTone(quote.status)}>{quote.status}</Badge><button className="quote-excel-button" type="button" disabled={isExporting} onClick={downloadQuoteReport}><ExcelIcon />{isExporting ? "Hazırlanıyor..." : "Excel İndir"}</button><button type="button" onClick={() => window.print()}>⎙ Yazdır / PDF</button></div>
      </header>
      {exportError && <div className="quote-export-error" role="alert">{exportError}</div>}

      <Card className="quote-overview">
        <div><span>Teklif Numarası</span><strong>{quote.id}</strong></div>
        <div><span>Teklif Tarihi</span><strong>{formatDate(quote.createdAt)}</strong></div>
        <div><span>Son Geçerlilik</span><strong>{formatDate(quote.validUntil)}</strong><small className={daysRemaining < 0 ? "expired" : ""}>{daysRemaining < 0 ? "Süresi doldu" : `${daysRemaining} gün kaldı`}</small></div>
        <div><span>Müşteri Temsilcisi</span><strong>{quote.salesRepresentative}</strong><small>Satış Departmanı</small></div>
        <div><span>Ödeme Koşulu</span><strong>{quote.paymentTerm}</strong></div>
        <div><span>Teslim Şekli</span><strong>{quote.deliveryTerm}</strong></div>
      </Card>

      <div className="quote-detail-layout">
        <div className="quote-detail-main">
          <Card className="quote-lines-card">
            <div className="quote-section-heading"><div><h2>Teklif Kalemleri</h2><p>{quote.lines.length} ürün kalemi · {quote.lines.reduce((sum, line) => sum + line.quantity, 0)} adet</p></div><span>Fiyatlar KDV hariçtir</span></div>
            <div className="quote-lines-wrap">
              <table className="quote-lines-table">
                <thead><tr><th>Ürün</th><th>Miktar</th><th>Liste Fiyatı</th><th>İndirim</th><th>Teklif Fiyatı</th><th>Satır Toplamı</th><th>Termin</th></tr></thead>
                <tbody>{quote.lines.map((line) => {
                  const product = products.find((item) => item.id === line.productId);
                  if (!product) return null;
                  const discountRate = Math.max(0, (1 - line.unitPrice / line.listPrice) * 100);
                  return <tr key={product.id}>
                    <td><div className="quote-product"><span>{product.image}</span><p><Link to={`/urunler/${product.id}`}>{product.name}</Link><small>{product.brand} · {product.code}</small></p></div></td>
                    <td><strong>{line.quantity}</strong><small>{product.unit}</small></td>
                    <td><span className="quote-list-price">{formatMoney(line.listPrice)}</span></td>
                    <td><Badge tone="success">%{discountRate.toFixed(1)}</Badge></td>
                    <td><strong>{formatMoney(line.unitPrice)}</strong></td>
                    <td><strong className="quote-line-total">{formatMoney(line.unitPrice * line.quantity)}</strong></td>
                    <td><span>{line.deliveryTime}</span><small className={product.stock >= line.quantity ? "stock-ok" : "stock-warning"}>{product.stock >= line.quantity ? "● Stok uygun" : "● Stok teyidi gerekli"}</small></td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
            <div className="quote-totals">
              <div><span>Liste fiyatları toplamı</span><strong>{formatMoney(listTotal)}</strong></div>
              <div className="discount"><span>Teklif indirimi</span><strong>− {formatMoney(discountTotal)}</strong></div>
              <div><span>Ara toplam</span><strong>{formatMoney(quote.total)}</strong></div>
              <div><span>KDV (%20)</span><strong>{formatMoney(vat)}</strong></div>
              <div className="grand"><span>Genel toplam</span><strong>{formatMoney(quote.total + vat)}</strong></div>
            </div>
          </Card>

          <div className="quote-detail-info-grid">
            <Card><span>▤</span><div><h3>Ticari Koşullar</h3><dl><div><dt>Ödeme</dt><dd>{quote.paymentTerm}</dd></div><div><dt>Teslimat</dt><dd>{quote.deliveryTerm}</dd></div><div><dt>Para Birimi</dt><dd>TRY</dd></div></dl></div></Card>
            <Card><span>i</span><div><h3>Teklif Notu</h3><p>{quote.note ?? "Bu teklife ilişkin ek bir not bulunmamaktadır."}</p></div></Card>
          </div>
          <div className="quote-print-signatures">
            <div><strong>NETSİM YAZILIM</strong><span>Hazırlayan: {quote.salesRepresentative}</span><small>İmza / Kaşe</small></div>
            <div><strong>{account?.name}</strong><span>Yetkili Adı Soyadı</span><small>İmza / Kaşe</small></div>
          </div>
        </div>

        <aside className="quote-action-sidebar">
          <Card className="quote-accept-card">
            <div className={`quote-validity-icon ${canAccept ? "" : "expired"}`}>{canAccept ? "✓" : "!"}</div>
            <h2>{canAccept ? "Teklif siparişe hazır" : "Teklifin süresi dolmuş"}</h2>
            <p>{canAccept ? `Bu fiyatlar ${formatDate(quote.validUntil)} tarihine kadar geçerlidir.` : "Güncel fiyat almak için satış temsilcinizle iletişime geçin."}</p>
            {canAccept && <div className="quote-countdown"><span>Kalan süre</span><strong>{daysRemaining} gün</strong></div>}
            <div className="quote-stock-status"><span>Stok doğrulaması</span><strong className={stockAvailable ? "ok" : "warning"}>{stockAvailable ? "✓ Uygun" : "Teyit gerekli"}</strong></div>
            {canAccept && <label className="quote-terms"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /><span>Teklif koşullarını, fiyatları ve teslimat bilgilerini okudum.</span></label>}
            <button className="button button-primary quote-accept-button" type="button" disabled={!canAccept || !termsAccepted} onClick={acceptQuote}>{canAccept ? "Teklifi Kabul Et ve Sepete Aktar" : "Teklif Süresi Doldu"}</button>
            {!canAccept && <Link className="button quote-renew-button" to={`/destek?type=Teklif&ref=${quote.id}`}>Teklif Yenileme Talebi</Link>}
            <small>Kabul sonrasında ürünler sepetinize eklenir. Siparişinizi tamamlamadan önce son kontrol yapabilirsiniz.</small>
          </Card>

          <Card className="quote-contact-card"><span>SY</span><div><small>Müşteri temsilciniz</small><strong>{quote.salesRepresentative}</strong><p>Teklifle ilgili sorularınız için destek alabilirsiniz.</p><Link to={`/destek?type=Teklif&ref=${quote.id}`}>Mesaj Gönder →</Link></div></Card>
        </aside>
      </div>
    </div>
  );
}

