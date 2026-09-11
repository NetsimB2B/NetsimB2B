import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";
import netsimLogo from "@/assets/netsim-logo.png";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { CompanyLogo } from "@/shared/components/CompanyLogo";
import { Badge, Card, EmptyState, ErrorState, LoadingState } from "@/shared/components/Ui";
import { formatDate, formatMoney } from "@/shared/lib/format";
import type { Account, AccountTransaction, Invoice, Product } from "@/shared/types/portal";
import "./favorites.css";
import "./shipments.css";
import "./invoices.css";
import "./finance.css";
import "./portal-misc.css";

function ExcelIcon() {
  return (
    <svg className="invoice-excel-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#107c41" d="M18 3h11v26H18z" />
      <path fill="#21a366" d="M18 7h8v4h-8zm0 6h8v4h-8zm0 6h8v4h-8z" />
      <path fill="#185c37" d="M3 7.5 19 5v22L3 24.5z" />
      <path fill="#fff" d="m7.4 12 2.8-.2 1.8 3 1.9-3.3 2.8-.2-3.1 4.8 3.2 4.9-2.9-.2-2-3.3-2 3-2.8-.2 3.2-4.3z" />
    </svg>
  );
}

async function loadNetsimLogoBase64() {
  const logoBlob = await fetch(netsimLogo).then((response) => response.blob());
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(logoBlob);
  });
}

async function downloadInvoiceListReport(options: {
  account?: Account;
  accountId: number;
  invoices: Invoice[];
  products: Product[];
  openTotal: number;
  overdueTotal: number;
  paidTotal: number;
}) {
  const { account, accountId, invoices, products, openTotal, overdueTotal, paidTotal } = options;
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Netsim B2B";
  workbook.company = "Netsim Yazılım";
  workbook.subject = "Kurumsal Fatura Raporu";
  workbook.title = "Fatura Portföy Raporu";
  workbook.created = new Date();

  const logoId = workbook.addImage({ base64: await loadNetsimLogoBase64(), extension: "png" });
  const money = '₺#,##0.00';
  const navy = "FF263B5A";
  const orange = "FFFF5A1F";

  const summary = workbook.addWorksheet("Fatura Özeti", {
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
  summary.columns = [
    { width: 7 }, { width: 16 }, { width: 22 }, { width: 28 }, { width: 14 },
    { width: 14 }, { width: 14 }, { width: 16 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 13 },
  ];
  summary.properties.defaultRowHeight = 20;
  summary.mergeCells("A1:C4");
  summary.mergeCells("D1:L2");
  summary.mergeCells("D3:L4");
  for (let row = 1; row <= 4; row += 1) {
    summary.getRow(row).height = 22;
    for (let column = 1; column <= 12; column += 1) {
      summary.getCell(row, column).fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
    }
  }
  summary.getCell("D1").value = "KURUMSAL FATURA PORTFÖY RAPORU";
  summary.getCell("D1").font = { name: "Calibri", size: 22, bold: true, color: { argb: "FFFFFFFF" } };
  summary.getCell("D1").alignment = { vertical: "bottom" };
  summary.getCell("D3").value = "E-fatura, vade ve tahsilat durumu özeti";
  summary.getCell("D3").font = { name: "Calibri", size: 11, color: { argb: "FFFFB397" } };
  summary.addImage(logoId, { tl: { col: .25, row: .3 }, ext: { width: 185, height: 66 } });

  summary.getRow(5).height = 8;
  const meta = [
    ["Bayi / Firma", account?.name ?? "—", "Cari Kodu", account?.code ?? String(accountId)],
    ["Rapor Tarihi", new Date(), "Kayıt Sayısı", `${invoices.length} fatura`],
    ["Açık Bakiye", openTotal, "Vadesi Geçen", overdueTotal],
    ["Ödenen Toplam", paidTotal, "Kalan Borç", openTotal + overdueTotal],
  ] as const;
  meta.forEach((values, index) => {
    const rowNumber = 6 + index;
    summary.mergeCells(`B${rowNumber}:E${rowNumber}`);
    summary.mergeCells(`G${rowNumber}:L${rowNumber}`);
    summary.getCell(`A${rowNumber}`).value = values[0];
    summary.getCell(`B${rowNumber}`).value = values[1];
    summary.getCell(`F${rowNumber}`).value = values[2];
    summary.getCell(`G${rowNumber}`).value = values[3];
    const row = summary.getRow(rowNumber);
    row.height = 22;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFF3F6F9" : "FFF8FAFC" } };
      cell.border = { bottom: { style: "thin", color: { argb: "FFD9DEE7" } } };
      cell.alignment = { vertical: "middle" };
      cell.font = { name: "Calibri", size: 9, color: { argb: "FF344054" } };
    });
    summary.getCell(`A${rowNumber}`).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF667085" } };
    summary.getCell(`F${rowNumber}`).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF667085" } };
  });
  summary.getCell("B7").numFmt = "dd mmmm yyyy hh:mm";
  summary.getCell("B8").numFmt = money;
  summary.getCell("G8").numFmt = money;
  summary.getCell("B9").numFmt = money;
  summary.getCell("G9").numFmt = money;

  summary.getRow(10).height = 8;
  const header = summary.getRow(11);
  header.values = ["Sıra", "Fatura No", "E-Fatura UUID", "Açıklama", "Sipariş No", "Fatura Tarihi", "Vade", "Ödeme Koşulu", "Ödenen", "Kalan", "Toplam", "Durum"];
  header.height = 28;
  header.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
    cell.font = { name: "Calibri", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle" };
    cell.border = { right: { style: "thin", color: { argb: "FF405574" } } };
  });
  summary.autoFilter = { from: "A11", to: "L11" };

  invoices.forEach((invoice, index) => {
    const row = summary.addRow([
      index + 1,
      invoice.id,
      invoice.eInvoiceUuid ?? "—",
      invoice.description,
      invoice.orderId ?? "—",
      new Date(invoice.date),
      new Date(invoice.dueDate),
      invoice.paymentTerm,
      invoice.paidAmount,
      invoice.remainingAmount,
      invoice.total,
      invoice.status,
    ]);
    row.height = 24;
    row.eachCell((cell, column) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFFFFFFF" : "FFF8FAFC" } };
      cell.font = { name: "Calibri", size: 9, color: { argb: "FF344054" }, bold: column === 2 || column >= 9 };
      cell.alignment = { vertical: "middle", horizontal: [1, 12].includes(column) ? "center" : column >= 9 && column <= 11 ? "right" : "left" };
      cell.border = { bottom: { style: "thin", color: { argb: "FFE4E7EC" } } };
    });
    row.getCell(6).numFmt = "dd.mm.yyyy";
    row.getCell(7).numFmt = "dd.mm.yyyy";
    row.getCell(9).numFmt = money;
    row.getCell(10).numFmt = money;
    row.getCell(11).numFmt = money;
    if (invoice.status === "Vadesi Geçti") row.getCell(12).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FFB42318" } };
    if (invoice.status === "Ödendi") row.getCell(12).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF16875F" } };
    if (invoice.status === "Açık") row.getCell(12).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FFB66B00" } };
  });

  const totalsRow = 12 + invoices.length;
  summary.mergeCells(`A${totalsRow}:H${totalsRow}`);
  summary.getCell(`A${totalsRow}`).value = "GENEL TOPLAM";
  summary.getCell(`I${totalsRow}`).value = invoices.reduce((sum, item) => sum + item.paidAmount, 0);
  summary.getCell(`J${totalsRow}`).value = invoices.reduce((sum, item) => sum + item.remainingAmount, 0);
  summary.getCell(`K${totalsRow}`).value = invoices.reduce((sum, item) => sum + item.total, 0);
  summary.getCell(`L${totalsRow}`).value = `${invoices.length} kayıt`;
  for (let column = 1; column <= 12; column += 1) {
    const cell = summary.getCell(totalsRow, column);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF1EB" } };
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF172033" } };
    cell.border = { top: { style: "medium", color: { argb: orange } } };
    cell.alignment = { vertical: "middle", horizontal: column >= 9 && column <= 11 ? "right" : column === 1 ? "right" : "center" };
  }
  summary.getCell(`I${totalsRow}`).numFmt = money;
  summary.getCell(`J${totalsRow}`).numFmt = money;
  summary.getCell(`K${totalsRow}`).numFmt = money;
  summary.getRow(totalsRow).height = 28;

  const noteRow = totalsRow + 2;
  summary.mergeCells(`A${noteRow}:L${noteRow + 1}`);
  summary.getCell(`A${noteRow}`).value = "Bilgilendirme: Bu rapor bilgilendirme amaçlıdır. Resmi e-fatura belgesi GİB / e-fatura sistemi üzerinden geçerlidir. Tutarlar KDV dahildir.";
  summary.getCell(`A${noteRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF7F3" } };
  summary.getCell(`A${noteRow}`).font = { name: "Calibri", size: 9, italic: true, color: { argb: "FF8A3B1C" } };
  summary.getCell(`A${noteRow}`).alignment = { vertical: "middle", wrapText: true };
  summary.getCell(`A${noteRow}`).border = { left: { style: "medium", color: { argb: orange } } };
  summary.pageSetup.printArea = `A1:L${noteRow + 1}`;
  summary.pageSetup.printTitlesRow = "11:11";
  summary.headerFooter.oddFooter = "&LNetsim Yazılım · B2B&CFatura Portföy Raporu&R&P / &N";

  const linesSheet = workbook.addWorksheet("Fatura Kalemleri", {
    views: [{ state: "normal", showGridLines: false, zoomScale: 90 }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, paperSize: 9 },
  });
  linesSheet.columns = [
    { width: 7 }, { width: 16 }, { width: 14 }, { width: 16 }, { width: 34 },
    { width: 14 }, { width: 10 }, { width: 10 }, { width: 14 }, { width: 10 }, { width: 14 }, { width: 16 },
  ];
  linesSheet.mergeCells("A1:L1");
  linesSheet.getCell("A1").value = "FATURA KALEM DETAYLARI";
  linesSheet.getCell("A1").font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
  linesSheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
  linesSheet.getCell("A1").alignment = { vertical: "middle" };
  linesSheet.getRow(1).height = 32;

  const lineHeader = linesSheet.getRow(3);
  lineHeader.values = ["Sıra", "Fatura No", "Durum", "Stok Kodu", "Ürün Adı", "Marka", "Miktar", "Birim", "Birim Fiyat", "KDV %", "KDV Tutarı", "Satır Toplamı"];
  lineHeader.height = 26;
  lineHeader.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
    cell.font = { name: "Calibri", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle" };
  });
  linesSheet.autoFilter = { from: "A3", to: "L3" };

  let lineIndex = 0;
  invoices.forEach((invoice) => {
    invoice.lines.forEach((line) => {
      const product = products.find((item) => item.id === line.productId);
      if (!product) return;
      lineIndex += 1;
      const net = line.unitPrice * line.quantity;
      const tax = net * (line.taxRate / 100);
      const row = linesSheet.addRow([
        lineIndex, invoice.id, invoice.status, product.code, product.name, product.brand,
        line.quantity, product.unit, line.unitPrice, line.taxRate / 100, tax, net + tax,
      ]);
      row.height = 22;
      row.eachCell((cell, column) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: lineIndex % 2 === 0 ? "FFF8FAFC" : "FFFFFFFF" } };
        cell.font = { name: "Calibri", size: 9, color: { argb: "FF344054" }, bold: column === 2 || column === 12 };
        cell.alignment = { vertical: "middle", horizontal: [1, 7, 8, 10].includes(column) ? "center" : column >= 9 ? "right" : "left" };
        cell.border = { bottom: { style: "thin", color: { argb: "FFE4E7EC" } } };
      });
      row.getCell(9).numFmt = money;
      row.getCell(10).numFmt = "0%";
      row.getCell(11).numFmt = money;
      row.getCell(12).numFmt = money;
    });
  });

  const paymentSheet = workbook.addWorksheet("Ödeme Durumu", {
    views: [{ state: "normal", showGridLines: false, zoomScale: 100 }],
  });
  paymentSheet.columns = [{ width: 18 }, { width: 12 }, { width: 18 }, { width: 18 }];
  paymentSheet.mergeCells("A1:D1");
  paymentSheet.getCell("A1").value = "ÖDEME DURUMU ÖZETİ";
  paymentSheet.getCell("A1").font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
  paymentSheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
  paymentSheet.getRow(1).height = 32;
  const payHeader = paymentSheet.getRow(3);
  payHeader.values = ["Durum", "Adet", "Toplam Tutar", "Kalan Borç"];
  payHeader.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
  });
  (["Açık", "Vadesi Geçti", "Ödendi"] as const).forEach((status, index) => {
    const group = invoices.filter((item) => item.status === status);
    const row = paymentSheet.addRow([
      status,
      group.length,
      group.reduce((sum, item) => sum + item.total, 0),
      group.reduce((sum, item) => sum + item.remainingAmount, 0),
    ]);
    row.eachCell((cell, column) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFFFFFFF" : "FFF8FAFC" } };
      cell.font = { name: "Calibri", size: 10, bold: column === 1, color: { argb: "FF344054" } };
      cell.alignment = { vertical: "middle", horizontal: column === 1 ? "left" : "right" };
    });
    row.getCell(3).numFmt = money;
    row.getCell(4).numFmt = money;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `netsim-fatura-portfoy-${account?.code ?? accountId}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function downloadInvoiceDetailReport(options: {
  account?: Account;
  accountId: number;
  invoice: Invoice;
  products: Product[];
}) {
  const { account, accountId, invoice, products } = options;
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Fatura Detayı", {
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
  workbook.subject = `${invoice.id} numaralı kurumsal satış faturası`;
  workbook.title = invoice.id;
  workbook.created = new Date();
  worksheet.columns = [
    { width: 7 }, { width: 16 }, { width: 36 }, { width: 16 }, { width: 11 },
    { width: 11 }, { width: 16 }, { width: 12 }, { width: 16 }, { width: 18 },
  ];
  worksheet.properties.defaultRowHeight = 20;
  const money = '₺#,##0.00';
  const navy = "FF263B5A";

  worksheet.mergeCells("A1:C4");
  worksheet.mergeCells("D1:J2");
  worksheet.mergeCells("D3:J4");
  for (let row = 1; row <= 4; row += 1) {
    worksheet.getRow(row).height = 22;
    for (let column = 1; column <= 10; column += 1) {
      worksheet.getCell(row, column).fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
    }
  }
  worksheet.getCell("D1").value = "KURUMSAL SATIŞ FATURASI";
  worksheet.getCell("D1").font = { name: "Calibri", size: 22, bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getCell("D1").alignment = { vertical: "bottom" };
  worksheet.getCell("D3").value = `${invoice.id}  ·  ${invoice.eInvoiceUuid ?? "E-Fatura"}  ·  ${invoice.status}`;
  worksheet.getCell("D3").font = { name: "Calibri", size: 11, color: { argb: "FFFFB397" } };
  const logoId = workbook.addImage({ base64: await loadNetsimLogoBase64(), extension: "png" });
  worksheet.addImage(logoId, { tl: { col: .25, row: .3 }, ext: { width: 185, height: 66 } });

  worksheet.getRow(5).height = 8;
  const metadata = [
    ["Müşteri / Bayi", account?.name ?? "—", "Cari Kodu", account?.code ?? String(accountId)],
    ["Fatura No", invoice.id, "E-Fatura UUID", invoice.eInvoiceUuid ?? "—"],
    ["Fatura Tarihi", new Date(invoice.date), "Vade Tarihi", new Date(invoice.dueDate)],
    ["Sipariş No", invoice.orderId ?? "—", "Ödeme Koşulu", invoice.paymentTerm],
    ["Durum", invoice.status, "Para Birimi", invoice.currency],
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
  headerRow.values = ["Sıra", "Stok Kodu", "Ürün Adı", "Marka", "Miktar", "Birim", "Birim Fiyat", "KDV %", "KDV Tutarı", "Satır Toplamı"];
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
    cell.font = { name: "Calibri", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle" };
    cell.border = { right: { style: "thin", color: { argb: "FF405574" } } };
  });
  worksheet.autoFilter = { from: "A12", to: "J12" };

  invoice.lines.forEach((line, index) => {
    const product = products.find((item) => item.id === line.productId);
    if (!product) return;
    const net = line.unitPrice * line.quantity;
    const tax = net * (line.taxRate / 100);
    const row = worksheet.addRow([
      index + 1, product.code, product.name, product.brand, line.quantity, product.unit,
      line.unitPrice, line.taxRate / 100, tax, net + tax,
    ]);
    row.height = 24;
    row.eachCell((cell, column) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFFFFFFF" : "FFF8FAFC" } };
      cell.font = { name: "Calibri", size: 9, color: { argb: "FF344054" }, bold: column === 2 || column >= 9 };
      cell.alignment = { vertical: "middle", horizontal: [1, 5, 6, 8].includes(column) ? "center" : column >= 7 ? "right" : "left" };
      cell.border = { bottom: { style: "thin", color: { argb: "FFE4E7EC" } } };
    });
    row.getCell(7).numFmt = money;
    row.getCell(8).numFmt = "0%";
    row.getCell(9).numFmt = money;
    row.getCell(10).numFmt = money;
  });

  const firstTotalRow = 13 + invoice.lines.length;
  const totals = [
    ["Ara Toplam (KDV Hariç)", invoice.taxExcluded, false],
    ["KDV", invoice.taxAmount, false],
    ["GENEL TOPLAM", invoice.total, true],
    ["Ödenen Tutar", invoice.paidAmount, false],
    ["KALAN BORÇ", invoice.remainingAmount, true],
  ] as const;
  totals.forEach(([label, value, highlight], index) => {
    const rowNumber = firstTotalRow + index;
    worksheet.mergeCells(`A${rowNumber}:I${rowNumber}`);
    worksheet.getCell(`A${rowNumber}`).value = label;
    worksheet.getCell(`J${rowNumber}`).value = value;
    worksheet.getCell(`A${rowNumber}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`J${rowNumber}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`J${rowNumber}`).numFmt = money;
    for (let column = 1; column <= 10; column += 1) {
      const cell = worksheet.getCell(rowNumber, column);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: highlight ? "FFFFF1EB" : "FFF3F6F9" } };
      cell.font = { name: "Calibri", size: highlight ? 12 : 10, bold: true, color: { argb: highlight ? "FF172033" : "FF475467" } };
      cell.border = { top: { style: highlight ? "medium" : "thin", color: { argb: highlight ? "FFFF5A1F" : "FFD9DEE7" } } };
    }
    worksheet.getRow(rowNumber).height = highlight ? 29 : 22;
  });

  const infoRow = firstTotalRow + totals.length + 1;
  worksheet.mergeCells(`A${infoRow}:J${infoRow}`);
  worksheet.mergeCells(`A${infoRow + 1}:J${infoRow + 2}`);
  worksheet.getCell(`A${infoRow}`).value = "FATURA AÇIKLAMASI VE TİCARİ NOTLAR";
  worksheet.getCell(`A${infoRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
  worksheet.getCell(`A${infoRow}`).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getCell(`A${infoRow + 1}`).value = `${invoice.description}\nÖdeme koşulu: ${invoice.paymentTerm}\nBu belge Netsim B2B portalından üretilmiş kurumsal rapordur. Resmi e-fatura GİB sistemindeki UUID ile eşleşir.`;
  worksheet.getCell(`A${infoRow + 1}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
  worksheet.getCell(`A${infoRow + 1}`).font = { name: "Calibri", size: 9, color: { argb: "FF475467" } };
  worksheet.getCell(`A${infoRow + 1}`).alignment = { vertical: "middle", wrapText: true };
  worksheet.getRow(infoRow).height = 24;
  worksheet.getRow(infoRow + 1).height = 28;
  worksheet.getRow(infoRow + 2).height = 28;

  const signatureRow = infoRow + 4;
  worksheet.mergeCells(`A${signatureRow}:D${signatureRow}`);
  worksheet.mergeCells(`G${signatureRow}:J${signatureRow}`);
  worksheet.getCell(`A${signatureRow}`).value = "NETSİM YAZILIM\nMuhasebe / Finans\nİmza / Kaşe";
  worksheet.getCell(`G${signatureRow}`).value = `${account?.name ?? "Müşteri"}\nYetkili Adı Soyadı\nİmza / Kaşe`;
  for (const address of [`A${signatureRow}`, `G${signatureRow}`]) {
    worksheet.getCell(address).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF344054" } };
    worksheet.getCell(address).alignment = { vertical: "top", horizontal: "center", wrapText: true };
    worksheet.getCell(address).border = { top: { style: "thin", color: { argb: "FF98A2B3" } } };
  }
  worksheet.getRow(signatureRow).height = 52;
  worksheet.pageSetup.printArea = `A1:J${signatureRow}`;
  worksheet.pageSetup.printTitlesRow = "12:12";
  worksheet.headerFooter.oddFooter = `&LNetsim Yazılım · B2B&C${invoice.id}&R&P / &N`;

  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `netsim-fatura-${invoice.id}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function FinancePage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"Tümü" | AccountTransaction["documentType"]>("Tümü");
  const [statusFilter, setStatusFilter] = useState<"Tümü" | AccountTransaction["status"]>("Tümü");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const { data: accounts = [], isLoading: accountsLoading } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const { data: transactions = [], isLoading: txLoading, isError } = useQuery({
    queryKey: ["account-transactions", accountId],
    queryFn: () => portalService.getAccountTransactions(accountId),
  });
  const { data: invoices = [] } = useQuery({ queryKey: ["invoices", accountId], queryFn: () => portalService.getInvoices(accountId) });
  const account = accounts.find((item) => item.id === accountId);
  const isLoading = accountsLoading || txLoading;

  const creditLimit = (account?.balance ?? 0) + (account?.availableCredit ?? 0);
  const usedCredit = account?.balance ?? 0;
  const usageRatio = creditLimit > 0 ? Math.min(100, Math.round((usedCredit / creditLimit) * 100)) : 0;

  const visible = useMemo(() => transactions.filter((item) => {
    const term = search.trim().toLocaleLowerCase("tr-TR");
    return (!term || `${item.document} ${item.description} ${item.documentType}`.toLocaleLowerCase("tr-TR").includes(term))
      && (typeFilter === "Tümü" || item.documentType === typeFilter)
      && (statusFilter === "Tümü" || item.status === statusFilter);
  }), [transactions, search, typeFilter, statusFilter]);

  const periodDebit = transactions.reduce((sum, item) => sum + item.debit, 0);
  const periodCredit = transactions.reduce((sum, item) => sum + item.credit, 0);
  const openInvoices = invoices.filter((item) => item.status !== "Ödendi");
  const openInvoiceTotal = openInvoices.reduce((sum, item) => sum + item.remainingAmount, 0);

  async function handleExport() {
    if (!account) return;
    setIsExporting(true);
    setExportError("");
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Netsim B2B";
      workbook.company = "Netsim Yazılım";
      workbook.subject = "Cari Hesap Ekstresi";
      workbook.title = `${account.code} Cari Ekstre`;
      workbook.created = new Date();
      const logoId = workbook.addImage({ base64: await loadNetsimLogoBase64(), extension: "png" });
      const money = '₺#,##0.00';
      const navy = "FF263B5A";
      const orange = "FFFF5A1F";

      const sheet = workbook.addWorksheet("Cari Ekstre", {
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
      sheet.columns = [
        { width: 7 }, { width: 13 }, { width: 13 }, { width: 16 }, { width: 12 },
        { width: 34 }, { width: 14 }, { width: 14 }, { width: 16 }, { width: 14 },
      ];
      sheet.mergeCells("A1:C4");
      sheet.mergeCells("D1:J2");
      sheet.mergeCells("D3:J4");
      for (let row = 1; row <= 4; row += 1) {
        sheet.getRow(row).height = 22;
        for (let column = 1; column <= 10; column += 1) {
          sheet.getCell(row, column).fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
        }
      }
      sheet.getCell("D1").value = "CARİ HESAP EKSTRESİ";
      sheet.getCell("D1").font = { name: "Calibri", size: 22, bold: true, color: { argb: "FFFFFFFF" } };
      sheet.getCell("D1").alignment = { vertical: "bottom" };
      sheet.getCell("D3").value = `${account.name} · ${account.code} · Risk Grubu ${account.riskGroup ?? "—"}`;
      sheet.getCell("D3").font = { name: "Calibri", size: 11, color: { argb: "FFFFB397" } };
      sheet.addImage(logoId, { tl: { col: .25, row: .3 }, ext: { width: 185, height: 66 } });

      sheet.getRow(5).height = 8;
      const meta = [
        ["Cari Ünvan", account.name, "Cari Kodu", account.code],
        ["Vergi No", account.taxNumber ?? "—", "Ödeme Koşulu", account.paymentTerm ?? "—"],
        ["Güncel Bakiye", account.balance, "Kullanılabilir Limit", account.availableCredit],
        ["Kredi Limiti", creditLimit, "Vadesi Geçen", account.overdueAmount],
        ["Rapor Tarihi", new Date(), "Hareket Sayısı", `${visible.length} kayıt`],
      ] as const;
      meta.forEach((values, index) => {
        const rowNumber = 6 + index;
        sheet.mergeCells(`B${rowNumber}:E${rowNumber}`);
        sheet.mergeCells(`G${rowNumber}:J${rowNumber}`);
        sheet.getCell(`A${rowNumber}`).value = values[0];
        sheet.getCell(`B${rowNumber}`).value = values[1];
        sheet.getCell(`F${rowNumber}`).value = values[2];
        sheet.getCell(`G${rowNumber}`).value = values[3];
        const row = sheet.getRow(rowNumber);
        row.height = 22;
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFF3F6F9" : "FFF8FAFC" } };
          cell.border = { bottom: { style: "thin", color: { argb: "FFD9DEE7" } } };
          cell.alignment = { vertical: "middle" };
          cell.font = { name: "Calibri", size: 9, color: { argb: "FF344054" } };
        });
        sheet.getCell(`A${rowNumber}`).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF667085" } };
        sheet.getCell(`F${rowNumber}`).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF667085" } };
      });
      sheet.getCell("B8").numFmt = money;
      sheet.getCell("G8").numFmt = money;
      sheet.getCell("B9").numFmt = money;
      sheet.getCell("G9").numFmt = money;
      sheet.getCell("B10").numFmt = "dd mmmm yyyy hh:mm";

      sheet.getRow(11).height = 8;
      const header = sheet.getRow(12);
      header.values = ["Sıra", "Tarih", "Vade", "Belge No", "Tür", "Açıklama", "Borç", "Alacak", "Bakiye", "Durum"];
      header.height = 28;
      header.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
        cell.font = { name: "Calibri", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle" };
      });
      sheet.autoFilter = { from: "A12", to: "J12" };

      visible.forEach((item, index) => {
        const row = sheet.addRow([
          index + 1,
          new Date(item.date),
          item.dueDate ? new Date(item.dueDate) : "—",
          item.document,
          item.documentType,
          item.description,
          item.debit || null,
          item.credit || null,
          item.balanceAfter,
          item.status,
        ]);
        row.height = 23;
        row.eachCell((cell, column) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFFFFFFF" : "FFF8FAFC" } };
          cell.font = { name: "Calibri", size: 9, color: { argb: "FF344054" }, bold: column === 4 || column === 9 };
          cell.alignment = { vertical: "middle", horizontal: [1, 5, 10].includes(column) ? "center" : column >= 7 && column <= 9 ? "right" : "left" };
          cell.border = { bottom: { style: "thin", color: { argb: "FFE4E7EC" } } };
        });
        row.getCell(2).numFmt = "dd.mm.yyyy";
        if (item.dueDate) row.getCell(3).numFmt = "dd.mm.yyyy";
        row.getCell(7).numFmt = money;
        row.getCell(8).numFmt = money;
        row.getCell(9).numFmt = money;
        if (item.status === "Vadesi Geçti") row.getCell(10).font = { name: "Calibri", size: 9, bold: true, color: { argb: "FFB42318" } };
      });

      const totalsRow = 13 + visible.length;
      sheet.mergeCells(`A${totalsRow}:F${totalsRow}`);
      sheet.getCell(`A${totalsRow}`).value = "DÖNEM TOPLAMI";
      sheet.getCell(`G${totalsRow}`).value = visible.reduce((sum, item) => sum + item.debit, 0);
      sheet.getCell(`H${totalsRow}`).value = visible.reduce((sum, item) => sum + item.credit, 0);
      sheet.getCell(`I${totalsRow}`).value = account.balance;
      sheet.getCell(`J${totalsRow}`).value = "Güncel";
      for (let column = 1; column <= 10; column += 1) {
        const cell = sheet.getCell(totalsRow, column);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF1EB" } };
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF172033" } };
        cell.border = { top: { style: "medium", color: { argb: orange } } };
        cell.alignment = { vertical: "middle", horizontal: column >= 7 && column <= 9 ? "right" : column === 1 ? "right" : "center" };
      }
      sheet.getCell(`G${totalsRow}`).numFmt = money;
      sheet.getCell(`H${totalsRow}`).numFmt = money;
      sheet.getCell(`I${totalsRow}`).numFmt = money;
      sheet.getRow(totalsRow).height = 28;

      const noteRow = totalsRow + 2;
      sheet.mergeCells(`A${noteRow}:J${noteRow + 1}`);
      sheet.getCell(`A${noteRow}`).value = "Bu ekstre bilgilendirme amaçlıdır. Resmi cari mutabakat için Netsim finans birimiyle iletişime geçiniz. Bakiyeler KDV dahil hesaplanmıştır.";
      sheet.getCell(`A${noteRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF7F3" } };
      sheet.getCell(`A${noteRow}`).font = { name: "Calibri", size: 9, italic: true, color: { argb: "FF8A3B1C" } };
      sheet.getCell(`A${noteRow}`).alignment = { vertical: "middle", wrapText: true };
      sheet.getCell(`A${noteRow}`).border = { left: { style: "medium", color: { argb: orange } } };
      sheet.pageSetup.printArea = `A1:J${noteRow + 1}`;
      sheet.pageSetup.printTitlesRow = "12:12";
      sheet.headerFooter.oddFooter = `&LNetsim Yazılım · B2B&C${account.code} Cari Ekstre&R&P / &N`;

      const aging = workbook.addWorksheet("Yaşlandırma", { views: [{ state: "normal", showGridLines: false }] });
      aging.columns = [{ width: 22 }, { width: 16 }, { width: 16 }];
      aging.mergeCells("A1:C1");
      aging.getCell("A1").value = "ALACAK YAŞLANDIRMA ÖZETİ";
      aging.getCell("A1").font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
      aging.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
      aging.getRow(1).height = 32;
      const agingHeader = aging.getRow(3);
      agingHeader.values = ["Kategori", "Tutar", "Oran"];
      agingHeader.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      });
      const agingRows = [
        ["Vadesi gelmemiş açık", Math.max(0, openInvoiceTotal - account.overdueAmount)],
        ["Vadesi geçen", account.overdueAmount],
        ["Kullanılabilir limit", account.availableCredit],
        ["Toplam kredi limiti", creditLimit],
      ] as const;
      agingRows.forEach(([label, value], index) => {
        const row = aging.addRow([label, value, creditLimit ? value / creditLimit : 0]);
        row.eachCell((cell, column) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: index % 2 === 0 ? "FFFFFFFF" : "FFF8FAFC" } };
          cell.font = { name: "Calibri", size: 10, bold: column === 1 };
          cell.alignment = { vertical: "middle", horizontal: column === 1 ? "left" : "right" };
        });
        row.getCell(2).numFmt = money;
        row.getCell(3).numFmt = "0.0%";
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const url = URL.createObjectURL(new Blob([buffer as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `netsim-cari-ekstre-${account.code}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Finance Excel report could not be generated", error);
      setExportError("Cari ekstre Excel raporu oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsExporting(false);
    }
  }

  if (isLoading) return <div className="page"><LoadingState label="Cari hesap yükleniyor" /></div>;
  if (isError || !account) return <div className="page"><ErrorState message="Cari hesap bilgileri şu anda yüklenemedi." /></div>;

  return (
    <div className="page finance-page">
      <header className="finance-header">
        <div>
          <span className="finance-eyebrow">Finans & Cari Yönetimi</span>
          <h1>Cari Hesabım</h1>
          <p>{account.name} · {account.code} cari hesabının bakiye, limit ve hareket özeti.</p>
        </div>
        <div className="finance-header-actions">
          <button className="finance-excel-button" type="button" disabled={isExporting} onClick={handleExport}>
            <ExcelIcon /> {isExporting ? "Hazırlanıyor..." : "Excel Ekstre İndir"}
          </button>
          <button type="button" onClick={() => window.print()}>⎙ Yazdır / PDF</button>
          <Link className="button" to="/faturalar">Faturalara Git</Link>
        </div>
      </header>
      {exportError && <div className="finance-export-error" role="alert">{exportError}</div>}

      <Card className="finance-account-card">
        <div className="finance-account-identity">
          <span className="finance-account-badge" style={{ background: account.brandColor }}>{account.code.slice(-2)}</span>
          <div>
            <strong>{account.name}</strong>
            <small>Vergi No: {account.taxNumber ?? "—"} · {account.address ?? "—"}</small>
          </div>
        </div>
        <div className="finance-account-meta">
          <div><span>Ödeme Koşulu</span><strong>{account.paymentTerm ?? "—"}</strong></div>
          <div><span>Risk Grubu</span><strong>{account.riskGroup ? `Grup ${account.riskGroup}` : "—"}</strong></div>
          <div><span>Hesap Yöneticisi</span><strong>{account.accountManager ?? "—"}</strong></div>
          <div><span>Son Tahsilat</span><strong>{account.lastPaymentDate ? formatDate(account.lastPaymentDate) : "—"}</strong><small>{account.lastPaymentAmount ? formatMoney(account.lastPaymentAmount) : ""}</small></div>
        </div>
      </Card>

      <div className="finance-stats">
        <Card><span>₺</span><div><small>Güncel Bakiye</small><strong>{formatMoney(account.balance)}</strong><p>Borç bakiyesi</p></div></Card>
        <Card><span className="limit">▣</span><div><small>Kredi Limiti</small><strong>{formatMoney(creditLimit)}</strong><p>Toplam açık hesap limiti</p></div></Card>
        <Card><span className="available">✓</span><div><small>Kullanılabilir Limit</small><strong>{formatMoney(account.availableCredit)}</strong><p>Sipariş için kalan</p></div></Card>
        <Card><span className="overdue">!</span><div><small>Vadesi Geçen</small><strong>{formatMoney(account.overdueAmount)}</strong><p>Acil ödeme gereken</p></div></Card>
      </div>

      <div className="finance-mid-grid">
        <Card className="finance-usage-card">
          <div className="finance-section-heading"><div><h2>Limit Kullanımı</h2><p>Açık hesap risk görünümü</p></div><strong>%{usageRatio}</strong></div>
          <div className="finance-usage-bar"><i style={{ width: `${usageRatio}%` }} /></div>
          <div className="finance-usage-legend">
            <span><b>Kullanılan</b><strong>{formatMoney(usedCredit)}</strong></span>
            <span><b>Kalan</b><strong>{formatMoney(account.availableCredit)}</strong></span>
            <span><b>Toplam Limit</b><strong>{formatMoney(creditLimit)}</strong></span>
          </div>
        </Card>
        <Card className="finance-period-card">
          <div className="finance-section-heading"><div><h2>Dönem Özeti</h2><p>Listelenen hareketler</p></div></div>
          <dl>
            <div><dt>Toplam Borç</dt><dd>{formatMoney(periodDebit)}</dd></div>
            <div><dt>Toplam Alacak</dt><dd>{formatMoney(periodCredit)}</dd></div>
            <div><dt>Net Hareket</dt><dd>{formatMoney(periodDebit - periodCredit)}</dd></div>
            <div><dt>Açık Fatura</dt><dd>{openInvoices.length} adet · {formatMoney(openInvoiceTotal)}</dd></div>
          </dl>
        </Card>
        <Card className="finance-aging-card">
          <div className="finance-section-heading"><div><h2>Yaşlandırma</h2><p>Alacak dağılımı</p></div></div>
          <div className="finance-aging-rows">
            <div><span>Vadesi gelmemiş</span><strong>{formatMoney(Math.max(0, openInvoiceTotal - account.overdueAmount))}</strong></div>
            <div className="danger"><span>Vadesi geçen</span><strong>{formatMoney(account.overdueAmount)}</strong></div>
            <div><span>Kapalı / ödenen</span><strong>{formatMoney(invoices.filter((item) => item.status === "Ödendi").reduce((sum, item) => sum + item.total, 0))}</strong></div>
          </div>
        </Card>
      </div>

      <Card className="finance-toolbar">
        <label className="finance-search">
          <span>⌕</span>
          <input aria-label="Hareket ara" placeholder="Belge no veya açıklama ara..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <select className="select" aria-label="Belge türü" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)}>
          <option value="Tümü">Tüm belgeler</option>
          <option>Fatura</option>
          <option>Tahsilat</option>
          <option>İade</option>
          <option>Dekont</option>
          <option>Çek</option>
        </select>
        <select className="select" aria-label="Durum" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
          <option value="Tümü">Tüm durumlar</option>
          <option>Açık</option>
          <option>Kapalı</option>
          <option>Vadesi Geçti</option>
          <option>Kısmi</option>
        </select>
      </Card>

      <Card className="finance-table-card">
        <div className="finance-section-heading padded">
          <div><h2>Hesap Hareketleri / Ekstre</h2><p>{visible.length} kayıt · bakiyeler hareket sonrası</p></div>
          <span>Borç artırır · Alacak azaltır</span>
        </div>
        {!visible.length ? <EmptyState title="Hareket bulunamadı" description="Arama veya filtreleri değiştirerek tekrar deneyin." /> : (
          <div className="finance-table-wrap">
            <table className="finance-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Belge</th>
                  <th>Tür</th>
                  <th>Açıklama</th>
                  <th>Vade</th>
                  <th>Borç</th>
                  <th>Alacak</th>
                  <th>Bakiye</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{formatDate(item.date)}</strong></td>
                    <td>
                      {item.relatedInvoiceId ? <Link to={`/faturalar/${item.relatedInvoiceId}`}>{item.document}</Link> : <strong>{item.document}</strong>}
                    </td>
                    <td><span className={`finance-type finance-type-${item.documentType}`}>{item.documentType}</span></td>
                    <td><span>{item.description}</span></td>
                    <td><span>{item.dueDate ? formatDate(item.dueDate) : "—"}</span></td>
                    <td><strong className={item.debit ? "debit" : ""}>{item.debit ? formatMoney(item.debit) : "—"}</strong></td>
                    <td><strong className={item.credit ? "credit" : ""}>{item.credit ? formatMoney(item.credit) : "—"}</strong></td>
                    <td><strong className="balance">{formatMoney(item.balanceAfter)}</strong></td>
                    <td><Badge tone={item.status === "Kapalı" ? "success" : item.status === "Vadesi Geçti" ? "danger" : item.status === "Açık" ? "warning" : "neutral"}>{item.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>Dönem toplamı</td>
                  <td>{formatMoney(visible.reduce((sum, item) => sum + item.debit, 0))}</td>
                  <td>{formatMoney(visible.reduce((sum, item) => sum + item.credit, 0))}</td>
                  <td>{formatMoney(account.balance)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      <div className="finance-bottom-grid">
        <Card className="finance-open-invoices">
          <div className="finance-section-heading"><div><h2>Açık Faturalar</h2><p>Ödeme bekleyen belgeler</p></div><Link to="/faturalar">Tümü →</Link></div>
          {!openInvoices.length ? <EmptyState title="Açık fatura yok" description="Tüm faturalarınız ödenmiş görünüyor." /> : (
            <div className="finance-open-list">
              {openInvoices.map((invoice) => (
                <Link key={invoice.id} to={`/faturalar/${invoice.id}`}>
                  <div>
                    <strong>{invoice.id}</strong>
                    <small>Vade: {formatDate(invoice.dueDate)} · {invoice.status}</small>
                  </div>
                  <b>{formatMoney(invoice.remainingAmount)}</b>
                </Link>
              ))}
            </div>
          )}
        </Card>
        <Card className="finance-support-card">
          <span>₺</span>
          <div>
            <h3>Mutabakat ve Ödeme</h3>
            <p>Cari mutabakat, dekont veya ödeme bildirimi için finans ekibinize ulaşabilirsiniz.</p>
            <dl>
              <div><dt>Hesap yöneticisi</dt><dd>{account.accountManager ?? "—"}</dd></div>
              <div><dt>Ödeme koşulu</dt><dd>{account.paymentTerm ?? "—"}</dd></div>
            </dl>
            <Link className="button button-primary" to="/destek">Ödeme Bildirimi Gönder</Link>
          </div>
        </Card>
      </div>

      <div className="finance-info">
        <span>i</span>
        <p>
          <strong>Cari ekstre hakkında</strong>
          <small>Hareket bakiyeleri işlem anındaki cari durumu yansıtır. Resmi mutabakat için Excel ekstre indirip finans birimine iletebilirsiniz.</small>
        </p>
        <Link to="/destek">Destek talebi →</Link>
      </div>
    </div>
  );
}

export function ShipmentsPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { data = [], isLoading, isError } = useQuery({ queryKey: ["shipments", accountId], queryFn: () => portalService.getShipments(accountId) });
  const visible = useMemo(() => data.filter((shipment) => {
    const term = search.trim().toLocaleLowerCase("tr-TR");
    return (!term || `${shipment.id} ${shipment.orderId ?? ""} ${shipment.trackingNo ?? ""} ${shipment.carrier ?? ""}`.toLocaleLowerCase("tr-TR").includes(term)) && (!status || shipment.status === status);
  }), [data, search, status]);
  const preparing = data.filter((item) => item.status === "Hazırlanıyor").length;
  const inTransit = data.filter((item) => item.status === "Yolda").length;
  const delivered = data.filter((item) => item.status === "Teslim Edildi").length;

  return <div className="page shipments-page">
    <header className="shipments-header"><div><span className="shipments-eyebrow">Lojistik Operasyonları</span><h1>Sevkiyatlar</h1><p>Siparişlerinizin depo çıkışından teslimata kadar tüm lojistik sürecini takip edin.</p></div><Link className="button shipments-support-button" to="/destek?type=Sevkiyat">Teslimat Desteği</Link></header>
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
          <div className="shipment-card-top"><div className="shipment-icon">▣</div><div><span>{item.id}</span><h2>{item.orderId ? <Link to={`/siparisler/${item.orderId}`}>{item.orderId}</Link> : "—"}</h2><small>Takip No: {item.trackingNo ?? "—"}</small></div><Badge tone={item.status === "Teslim Edildi" ? "success" : item.status === "Yolda" ? "warning" : "neutral"}>{item.status}</Badge></div>
          <div className="shipment-route"><div><span>Çıkış Noktası</span><strong>{item.origin ?? "—"}</strong><small>{formatDate(item.date)}</small></div><div className="shipment-route-line"><i style={{ width: `${progress}%` }} /><b style={{ left: `${Math.min(progress, 96)}%` }}>▸</b></div><div><span>Varış Noktası</span><strong>{item.destination ?? "—"}</strong><small>Tahmini: {formatDate(item.estimatedDelivery)}</small></div></div>
          <div className="shipment-card-meta"><div><span>Taşıyıcı</span><strong>{item.carrier ?? "—"}</strong></div><div><span>Araç</span><strong>{item.vehiclePlate ?? "Planlanıyor"}</strong></div><Link to={`/sevkiyatlar/${item.id}`}>Sevkiyatı İncele ›</Link></div>
        </Card>;
      })}</div>}
      <div className="shipments-info"><span>i</span><p><strong>Teslimat planınızda değişiklik mi var?</strong><small>Adres veya teslimat zamanı değişikliği için sevkiyat çıkışından önce destek ekibine ulaşın.</small></p><Link to="/destek?type=Sevkiyat">Talep oluştur →</Link></div>
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
    <header className="shipment-detail-header"><div><span className="shipments-eyebrow">Sevkiyat Detayı · {shipment.trackingNo ?? "—"}</span><h1>{shipment.id}</h1><p>{shipment.orderId ? <Link to={`/siparisler/${shipment.orderId}`}>{shipment.orderId}</Link> : "—"} numaralı siparişe ait lojistik takip kaydı{order?.invoiceId ? <> · Fatura: <Link to={`/faturalar/${order.invoiceId}`}>{order.invoiceId}</Link></> : null}.</p></div><div><Badge tone={shipment.status === "Teslim Edildi" ? "success" : "warning"}>{shipment.status}</Badge><button type="button" onClick={() => window.print()}>⎙ Yazdır / PDF</button></div></header>

    <Card className="shipment-progress-card">
      {["Hazırlanıyor", "Araç Yüklendi", "Yolda", "Teslim Edildi"].map((step, index) => {
        const activeIndex = shipment.status === "Teslim Edildi" ? 3 : shipment.status === "Yolda" ? 2 : 0;
        return <div className={index <= activeIndex ? "complete" : ""} key={step}><span>{index < activeIndex ? "✓" : index + 1}</span><p><strong>{step}</strong><small>{index <= activeIndex ? "Tamamlandı / aktif" : "Bekleniyor"}</small></p></div>;
      })}
    </Card>

    <div className="shipment-detail-layout">
      <div className="shipment-detail-main">
        <Card className="shipment-journey-card"><div className="shipment-section-heading"><div><h2>Teslimat Rotası</h2><p>Planlanan lojistik güzergâhı</p></div><span>{shipment.carrier ?? "—"}</span></div><div className="shipment-journey"><div><i>●</i><p><span>Çıkış</span><strong>{shipment.origin ?? "—"}</strong><small>{formatDate(shipment.date)}</small></p></div><b /><div><i>◆</i><p><span>Varış</span><strong>{shipment.destination ?? "—"}</strong><small>{shipment.deliveredAt ? `Teslim: ${formatDate(shipment.deliveredAt)}` : `Tahmini: ${formatDate(shipment.estimatedDelivery)}`}</small></p></div></div></Card>
        <Card className="shipment-events-card"><div className="shipment-section-heading"><div><h2>Sevkiyat Hareketleri</h2><p>Lojistik sisteminden alınan son durumlar</p></div><span>Canlı takip</span></div><div className="shipment-events">{shipment.events.map((event, index) => <div className={event.completed ? "completed" : ""} key={`${event.date}-${event.title}`}><span>{event.completed ? "✓" : index + 1}</span><p><strong>{event.title}</strong><small>{event.location ?? "—"}</small></p><time>{formatDate(event.date)}<small>{new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(new Date(event.date))}</small></time></div>)}</div></Card>
        <Card className="shipment-items-card"><div className="shipment-section-heading"><div><h2>Sevk Edilen Ürünler</h2><p>{lines.length} ürün kalemi · {lines.reduce((sum, line) => sum + line.quantity, 0)} adet</p></div><span>{order?.invoiceId ? <><Link to={`/siparisler/${shipment.orderId}`}>Sipariş →</Link>{" · "}<Link to={`/faturalar/${order.invoiceId}`}>Fatura →</Link></> : <Link to={`/siparisler/${shipment.orderId}`}>Siparişi görüntüle →</Link>}</span></div><div className="shipment-items">{lines.map(({ product, quantity }) => <div key={product.id}><span>{product.image}</span><p><strong>{product.name}</strong><small>{product.brand} · {product.code}</small></p><b>{quantity} {product.unit}</b></div>)}</div></Card>
      </div>
      <aside className="shipment-detail-sidebar">
        <Card className="shipment-current-card"><div className="shipment-current-icon">{shipment.status === "Teslim Edildi" ? "✓" : "➜"}</div><span>Güncel Durum</span><h2>{currentEvent?.title ?? shipment.status}</h2><p>{currentEvent?.location}</p><div><span>Tahmini teslimat</span><strong>{formatDate(shipment.estimatedDelivery)}</strong></div><div><span>Takip numarası</span><strong>{shipment.trackingNo ?? "—"}</strong></div>{order?.invoiceId && <div><span>Fatura</span><strong><Link to={`/faturalar/${order.invoiceId}`}>{order.invoiceId}</Link></strong></div>}</Card>
        <Card className="shipment-package-card"><h3>Taşıma Bilgileri</h3><dl><div><dt>Taşıyıcı</dt><dd>{shipment.carrier ?? "—"}</dd></div><div><dt>Araç plakası</dt><dd>{shipment.vehiclePlate ?? "Planlanıyor"}</dd></div><div><dt>Sürücü</dt><dd>{shipment.driverName ?? "Planlanıyor"}</dd></div></dl></Card>
        <Card className="shipment-contact-card"><span>☎</span><div><strong>Teslimat desteği</strong><p>Sevkiyatınızla ilgili değişiklik ve sorularınız için bize ulaşın.</p><Link to={`/destek?type=Sevkiyat&ref=${shipment.id}`}>Destek talebi oluştur →</Link></div></Card>
      </aside>
    </div>
  </div>;
}

export function InvoicesPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"Tümü" | "Açık" | "Vadesi Geçti" | "Ödendi">("Tümü");
  const [sort, setSort] = useState<"newest" | "due" | "amount">("newest");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const { data = [], isLoading, isError } = useQuery({ queryKey: ["invoices", accountId], queryFn: () => portalService.getInvoices(accountId) });
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const { data: products = [] } = useQuery({ queryKey: ["products", accountId, "invoice-export"], queryFn: () => portalService.getProducts(accountId) });
  const account = accounts.find((item) => item.id === accountId);

  const visible = useMemo(() => data
    .filter((invoice) => {
      const term = search.trim().toLocaleLowerCase("tr-TR");
      return (!term || `${invoice.id} ${invoice.orderId ?? ""} ${invoice.eInvoiceUuid ?? ""} ${invoice.description}`.toLocaleLowerCase("tr-TR").includes(term))
        && (status === "Tümü" || invoice.status === status);
    })
    .sort((a, b) => {
      if (sort === "amount") return b.remainingAmount - a.remainingAmount || b.total - a.total;
      if (sort === "due") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }), [data, search, sort, status]);

  const openTotal = data.filter((item) => item.status === "Açık").reduce((sum, item) => sum + item.remainingAmount, 0);
  const overdueTotal = data.filter((item) => item.status === "Vadesi Geçti").reduce((sum, item) => sum + item.remainingAmount, 0);
  const paidTotal = data.filter((item) => item.status === "Ödendi").reduce((sum, item) => sum + item.total, 0);

  async function handleExport() {
    setIsExporting(true);
    setExportError("");
    try {
      await downloadInvoiceListReport({
        account,
        accountId,
        invoices: visible.length ? visible : data,
        products,
        openTotal,
        overdueTotal,
        paidTotal,
      });
    } catch (error) {
      console.error("Invoice Excel report could not be generated", error);
      setExportError("Excel fatura raporu oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="page invoices-page">
      <header className="invoices-header">
        <div>
          <span className="invoices-eyebrow">Finans & Faturalama</span>
          <h1>Faturalar</h1>
          <p>E-faturalarınızı, vade durumlarını ve kalan borç bakiyelerinizi yönetin.</p>
        </div>
        <div className="invoices-header-actions">
          {Boolean(data.length) && (
            <button className="invoice-excel-button" type="button" disabled={isExporting} onClick={handleExport}>
              <ExcelIcon /> {isExporting ? "Hazırlanıyor..." : "Excel Raporu İndir"}
            </button>
          )}
          <Link className="button invoices-finance-link" to="/finans">Cari Hesabı Görüntüle</Link>
        </div>
      </header>
      {exportError && <div className="invoice-export-error" role="alert">{exportError}</div>}

      {isLoading ? <LoadingState label="Faturalar yükleniyor" /> : isError ? <ErrorState message="Faturalar şu anda yüklenemedi." /> : !data.length ? (
        <Card className="invoices-empty"><EmptyState title="Fatura bulunmuyor" description="Firmanıza ait fatura kesildiğinde burada listelenecektir." /></Card>
      ) : (
        <>
          <div className="invoice-stats">
            <Card><span>▤</span><div><small>Toplam Fatura</small><strong>{data.length}</strong><p>Tüm dönemler</p></div></Card>
            <Card><span className="open">◯</span><div><small>Açık Bakiye</small><strong>{formatMoney(openTotal)}</strong><p>Vadesi gelmemiş borç</p></div></Card>
            <Card><span className="overdue">!</span><div><small>Vadesi Geçen</small><strong>{formatMoney(overdueTotal)}</strong><p>Ödeme bekleyen tutar</p></div></Card>
            <Card><span className="paid">✓</span><div><small>Ödenen</small><strong>{formatMoney(paidTotal)}</strong><p>Kapanmış faturalar</p></div></Card>
          </div>

          <Card className="invoices-toolbar">
            <label className="invoices-search">
              <span>⌕</span>
              <input aria-label="Fatura ara" placeholder="Fatura no, sipariş veya e-fatura UUID ara..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </label>
            <div className="invoices-status-tabs">
              {(["Tümü", "Açık", "Vadesi Geçti", "Ödendi"] as const).map((item) => (
                <button className={status === item ? "active" : ""} type="button" key={item} onClick={() => setStatus(item)}>
                  {item}
                  <span>{item === "Tümü" ? data.length : data.filter((invoice) => invoice.status === item).length}</span>
                </button>
              ))}
            </div>
            <select className="select" aria-label="Sıralama" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
              <option value="newest">En yeni faturalar</option>
              <option value="due">Vadeye göre</option>
              <option value="amount">Kalan tutara göre</option>
            </select>
          </Card>

          <Card className="invoices-table-card">
            <div className="invoices-table-heading">
              <div><h2>Fatura Listesi</h2><p>{visible.length} kayıt gösteriliyor</p></div>
              <span>Tutarlar KDV dahildir</span>
            </div>
            {!visible.length ? <EmptyState title="Eşleşen fatura bulunamadı" description="Arama veya durum filtresini değiştirerek tekrar deneyin." /> : (
              <div className="invoices-table-wrap">
                <table className="invoices-table">
                  <thead>
                    <tr>
                      <th>Fatura / E-Fatura</th>
                      <th>Açıklama</th>
                      <th>Fatura Tarihi</th>
                      <th>Vade</th>
                      <th>Ödenen / Kalan</th>
                      <th>Toplam</th>
                      <th>Durum</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((invoice) => {
                      const daysToDue = Math.ceil((new Date(invoice.dueDate).getTime() - Date.now()) / 86_400_000);
                      return (
                        <tr key={invoice.id}>
                          <td>
                            <Link to={`/faturalar/${invoice.id}`}>{invoice.id}</Link>
                          </td>
                          <td>
                            <strong>{invoice.description}</strong>
                            <small>{invoice.orderId ? <>Sipariş: <Link to={`/siparisler/${invoice.orderId}`}>{invoice.orderId}</Link></> : "Manuel fatura"} · {invoice.paymentTerm}</small>
                          </td>
                          <td><strong>{formatDate(invoice.date)}</strong></td>
                          <td>
                            <strong className={invoice.status === "Vadesi Geçti" ? "overdue" : daysToDue <= 7 && invoice.status !== "Ödendi" ? "soon" : ""}>
                              {formatDate(invoice.dueDate)}
                            </strong>
                            <small>
                              {invoice.status === "Ödendi" ? "Ödeme tamamlandı" : invoice.status === "Vadesi Geçti" ? `${Math.abs(daysToDue)} gün gecikmiş` : `${daysToDue} gün kaldı`}
                            </small>
                          </td>
                          <td>
                            <strong>{formatMoney(invoice.paidAmount)}</strong>
                            <small>Kalan: {formatMoney(invoice.remainingAmount)}</small>
                          </td>
                          <td><strong className="invoice-table-total">{formatMoney(invoice.total)}</strong></td>
                          <td><Badge tone={invoice.status === "Ödendi" ? "success" : invoice.status === "Vadesi Geçti" ? "danger" : "warning"}>{invoice.status}</Badge></td>
                          <td><Link className="invoice-row-link" to={`/faturalar/${invoice.id}`}>İncele ›</Link></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="invoices-info">
            <span>i</span>
            <p>
              <strong>Ödeme ve e-fatura desteği</strong>
              <small>Vadesi gelen faturalar için cari hesabınızdan hareketleri takip edebilir, ödeme bildirimi için finans ekibine ulaşabilirsiniz.</small>
            </p>
            <Link to="/finans">Cari hareketler →</Link>
          </div>
        </>
      )}
    </div>
  );
}

export function InvoiceDetailPage() {
  const { id } = useParams();
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const { data: invoices = [], isLoading, isError } = useQuery({ queryKey: ["invoices", accountId], queryFn: () => portalService.getInvoices(accountId) });
  const { data: products = [], isLoading: productsLoading } = useQuery({ queryKey: ["products", accountId, "invoice"], queryFn: () => portalService.getProducts(accountId) });
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const { data: shipments = [] } = useQuery({ queryKey: ["shipments", accountId, "invoice"], queryFn: () => portalService.getShipments(accountId) });
  const invoice = invoices.find((item) => item.id === id)!;
  const account = accounts.find((item) => item.id === accountId);
  const relatedShipment = invoice?.orderId ? shipments.find((item) => item.orderId === invoice.orderId) : undefined;
  const lines = invoice?.lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ ...line, product }] : [];
  }) ?? [];

  if (isLoading || productsLoading) return <div className="page"><LoadingState /></div>;
  if (isError) return <div className="page"><ErrorState message="Fatura detayı şu anda yüklenemedi." /></div>;
  if (!invoice) return <div className="page"><EmptyState title="Fatura bulunamadı" description="Bu fatura aktif firma hesabına ait olmayabilir." /></div>;

  const daysToDue = Math.ceil((new Date(invoice.dueDate).getTime() - Date.now()) / 86_400_000);
  const paidRatio = invoice.total > 0 ? Math.round((invoice.paidAmount / invoice.total) * 100) : 0;

  async function handleExport() {
    setIsExporting(true);
    setExportError("");
    try {
      await downloadInvoiceDetailReport({ account, accountId, invoice, products });
    } catch (error) {
      console.error("Invoice detail Excel report could not be generated", error);
      setExportError("Excel fatura raporu oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="page invoice-detail-page">
      <nav className="invoice-breadcrumb">
        <Link to="/dashboard">Ana Sayfa</Link><span>›</span>
        <Link to="/faturalar">Faturalar</Link><span>›</span>
        <strong>{invoice.id}</strong>
      </nav>

      <header className="invoice-detail-header">
        <div>
          <span className="invoices-eyebrow">Satış Faturası</span>
          <h1>{invoice.id}</h1>
          <p>{account?.name} adına düzenlenmiştir · {invoice.description}</p>
        </div>
        <div>
          <Badge tone={invoice.status === "Ödendi" ? "success" : invoice.status === "Vadesi Geçti" ? "danger" : "warning"}>{invoice.status}</Badge>
          <button className="invoice-excel-button" type="button" disabled={isExporting} onClick={handleExport}>
            <ExcelIcon /> {isExporting ? "Hazırlanıyor..." : "Excel İndir"}
          </button>
          <button type="button" onClick={() => window.print()}>⎙ Yazdır / PDF</button>
          <Link className="button" to="/finans">Cari Hesaba Git</Link>
        </div>
      </header>
      {exportError && <div className="invoice-export-error" role="alert">{exportError}</div>}

      <Card className="invoice-overview">
        <div><span>Fatura Tarihi</span><strong>{formatDate(invoice.date)}</strong></div>
        <div><span>Vade Tarihi</span><strong>{formatDate(invoice.dueDate)}</strong><small className={invoice.status === "Vadesi Geçti" ? "overdue" : ""}>{invoice.status === "Ödendi" ? "Ödendi" : invoice.status === "Vadesi Geçti" ? `${Math.abs(daysToDue)} gün gecikmiş` : `${daysToDue} gün kaldı`}</small></div>
        <div><span>Ödeme Koşulu</span><strong>{invoice.paymentTerm}</strong></div>
        <div><span>Sipariş No</span><strong>{invoice.orderId ? <Link to={`/siparisler/${invoice.orderId}`}>{invoice.orderId}</Link> : "—"}</strong></div>
        <div><span>Para Birimi</span><strong>{invoice.currency}</strong></div>
      </Card>

      <div className="invoice-detail-layout">
        <div className="invoice-detail-main">
          <Card className="invoice-lines-card">
            <div className="invoice-section-heading">
              <div><h2>Fatura Kalemleri</h2><p>{lines.length} ürün · {lines.reduce((sum, line) => sum + line.quantity, 0)} adet</p></div>
              <span>Birim fiyatlar KDV hariçtir</span>
            </div>
            <div className="invoice-lines-wrap">
              <table className="invoice-lines-table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Miktar</th>
                    <th>Birim Fiyat</th>
                    <th>KDV</th>
                    <th>Satır Toplamı</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map(({ product, quantity, unitPrice, taxRate }) => {
                    const lineNet = unitPrice * quantity;
                    const lineTax = lineNet * (taxRate / 100);
                    return (
                      <tr key={`${product.id}-${unitPrice}`}>
                        <td>
                          <div className="invoice-product">
                            <span>{product.image}</span>
                            <p>
                              <Link to={`/urunler/${product.id}`}>{product.name}</Link>
                              <small>{product.brand} · {product.code}</small>
                            </p>
                          </div>
                        </td>
                        <td><strong>{quantity}</strong><small>{product.unit}</small></td>
                        <td><strong>{formatMoney(unitPrice)}</strong></td>
                        <td><strong>%{taxRate}</strong><small>{formatMoney(lineTax)}</small></td>
                        <td><strong className="invoice-line-total">{formatMoney(lineNet + lineTax)}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="invoice-totals">
              <div><span>Ara toplam (KDV hariç)</span><strong>{formatMoney(invoice.taxExcluded)}</strong></div>
              <div><span>KDV</span><strong>{formatMoney(invoice.taxAmount)}</strong></div>
              <div className="grand"><span>Genel toplam</span><strong>{formatMoney(invoice.total)}</strong></div>
            </div>
          </Card>

          <div className="invoice-info-grid">
            <Card>
              <span>▤</span>
              <div>
                <h3>E-Fatura Bilgileri</h3>
                <dl>
                  <div><dt>Fatura No</dt><dd>{invoice.id}</dd></div>
                  <div><dt>Senaryo</dt><dd>Temel Fatura</dd></div>
                </dl>
              </div>
            </Card>
            <Card>
              <span>₺</span>
              <div>
                <h3>Ödeme Özeti</h3>
                <dl>
                  <div><dt>Ödenen</dt><dd>{formatMoney(invoice.paidAmount)}</dd></div>
                  <div><dt>Kalan</dt><dd>{formatMoney(invoice.remainingAmount)}</dd></div>
                  <div><dt>Ödeme oranı</dt><dd>%{paidRatio}</dd></div>
                </dl>
              </div>
            </Card>
          </div>
        </div>

        <aside className="invoice-detail-sidebar">
          <Card className="invoice-status-card">
            <div className={`invoice-status-icon ${invoice.status === "Ödendi" ? "paid" : invoice.status === "Vadesi Geçti" ? "overdue" : ""}`}>
              {invoice.status === "Ödendi" ? "✓" : invoice.status === "Vadesi Geçti" ? "!" : "◯"}
            </div>
            <h2>{invoice.status === "Ödendi" ? "Fatura ödendi" : invoice.status === "Vadesi Geçti" ? "Ödeme gecikmiş" : "Ödeme bekleniyor"}</h2>
            <p>{invoice.status === "Ödendi" ? "Bu faturanın tamamı tahsil edilmiştir." : `Kalan borç bakiyesi ${formatMoney(invoice.remainingAmount)}.`}</p>
            <div className="invoice-progress">
              <span>Tahsilat oranı</span>
              <strong>%{paidRatio}</strong>
              <i><b style={{ width: `${paidRatio}%` }} /></i>
            </div>
            <div><span>Vade</span><strong>{formatDate(invoice.dueDate)}</strong></div>
            <div><span>Kalan tutar</span><strong>{formatMoney(invoice.remainingAmount)}</strong></div>
            {invoice.status !== "Ödendi" && <Link className="button button-primary" to={`/destek?type=${encodeURIComponent("Ödeme")}&ref=${invoice.id}`}>Ödeme Bildirimi Gönder</Link>}
            {invoice.orderId && <Link className="button invoice-secondary-button" to={`/siparisler/${invoice.orderId}`}>Siparişi Görüntüle</Link>}
            {relatedShipment && <Link className="button invoice-secondary-button" to={`/sevkiyatlar/${relatedShipment.id}`}>Sevkiyatı Görüntüle</Link>}
          </Card>

          <Card className="invoice-contact-card">
            <span>₺</span>
            <div>
              <small>Finans destek</small>
              <strong>Netsim Muhasebe</strong>
              <p>Fatura ve tahsilat sorularınız için finans ekibine ulaşın.</p>
              <Link to={`/destek?type=${encodeURIComponent("Ödeme")}&ref=${invoice.id}`}>Destek talebi oluştur →</Link>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
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
  const items = [
    { id: "n1", title: "Sipariş B2B-2026-1002 yola çıktı", body: "Sevkiyat SVK-2026-0088 dağıtım merkezinden çıktı. Tahmini teslimat 11 Eylül.", at: "2026-09-09T08:30:00Z", href: "/sevkiyatlar/SVK-2026-0088", unread: true },
    { id: "n2", title: "FTR-2026-1482 hazır", body: "Satış faturanız e-fatura olarak kesildi. Vade: 8 Ekim 2026.", at: "2026-09-08T16:10:00Z", href: "/faturalar/FTR-2026-1482", unread: true },
    { id: "n3", title: "Sipariş B2B-2026-1002 hazırlanmaya başladı", body: "Depo operasyonu başladı. Sevkiyat oluşturulduğunda bilgilendirileceksiniz.", at: "2026-09-08T10:20:00Z", href: "/siparisler/B2B-2026-1002", unread: false },
    { id: "n4", title: "Eylül motor kampanyası yayınlandı", body: "Seçili motor ve sürücülerde firmanıza özel fiyatlar 30 Eylül’e kadar geçerlidir.", at: "2026-09-05T09:00:00Z", href: "/duyurular", unread: false },
  ];

  return (
    <div className="page">
      <header className="portal-misc-header">
        <div>
          <span className="portal-misc-eyebrow">Portal Bildirimleri</span>
          <h1>Bildirimler</h1>
          <p>Sipariş, sevkiyat, fatura ve kampanya güncellemeleri.</p>
        </div>
        <button className="button" type="button" onClick={markRead}>Tümünü Okundu İşaretle</button>
      </header>
      <div className="notification-list">
        {items.map((item) => {
          const showUnread = !read && item.unread;
          return (
            <Link className={`card notification-item${showUnread ? " unread" : ""}`} to={item.href} key={item.id}>
              <span className={showUnread ? "notification-dot" : ""} aria-hidden="true" />
              <div className="notification-body">
                <strong>{item.title}</strong>
                <p>{item.body}</p>
                <small>{formatDate(item.at)} · {new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(new Date(item.at))}</small>
              </div>
              <span className="notification-arrow" aria-hidden="true">›</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AnnouncementsPage() {
  const announcements = [
    { id: "a1", badge: "Kampanya" as const, tone: "warning" as const, title: "Motor ve sürücülerde Eylül avantajları", body: "Seçili ürünlerde firmanıza özel fiyatlar 30 Eylül’e kadar geçerlidir. Katalogdan kampanya ürünlerini inceleyin.", date: "2026-09-01", cta: "Ürünleri İncele", href: "/urunler" },
    { id: "a2", badge: "Bilgilendirme" as const, tone: "neutral" as const, title: "Hafta sonu sevkiyat planı", body: "Cumartesi günü depo teslimatları 09.00–13.00 saatleri arasında yapılacaktır. Aktif sevkiyatlarınızı takip edin.", date: "2026-09-04", cta: "Sevkiyatları Gör", href: "/sevkiyatlar" },
    { id: "a3", badge: "Kampanya" as const, tone: "warning" as const, title: "Teklif yenileme fırsatı", body: "Süresi dolmak üzere olan teklifleriniz için satış ekibimizden güncel fiyat talep edebilirsiniz.", date: "2026-09-06", cta: "Teklifleri Aç", href: "/teklifler" },
  ];

  return (
    <div className="page">
      <header className="portal-misc-header">
        <div>
          <span className="portal-misc-eyebrow">Firma Duyuruları</span>
          <h1>Duyurular ve Kampanyalar</h1>
          <p>Firmanıza özel güncel bilgilendirmeler ve ticari fırsatlar.</p>
        </div>
      </header>
      <div className="announcement-grid">
        {announcements.map((item) => (
          <Card className="announcement-card" key={item.id}>
            <div className="announcement-card-top">
              <Badge tone={item.tone}>{item.badge}</Badge>
              <small className="muted">{formatDate(item.date)}</small>
            </div>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
            <Link className="button button-primary" to={item.href}>{item.cta} →</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AccountPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const { data: accounts = [], isLoading, isError } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const account = accounts.find((item) => item.id === accountId);

  if (isLoading) return <div className="page"><LoadingState label="Hesap bilgileri yükleniyor" /></div>;
  if (isError || !account) return <div className="page"><ErrorState message="Hesap bilgileri şu anda yüklenemedi." /></div>;

  return (
    <div className="page">
      <header className="portal-misc-header">
        <div>
          <span className="portal-misc-eyebrow">Hesap Yönetimi</span>
          <h1>Hesabım</h1>
          <p>Kullanıcı, firma ve ticari koşullarınızı görüntüleyin.</p>
        </div>
      </header>

      <Card className="account-hero">
        <CompanyLogo name={account.name} logoUrl={account.logoUrl} color={account.brandColor} />
        <div className="account-hero-copy">
          <strong>{account.name}</strong>
          <small>{account.code} · Risk grubu {account.riskGroup ?? "—"} · {account.currency}</small>
        </div>
      </Card>

      <div className="account-sections">
        <Card className="account-section">
          <h2>Kullanıcı</h2>
          <dl className="detail-list">
            <div><dt>Ad Soyad</dt><dd>Burak Admin</dd></div>
            <div><dt>E-posta</dt><dd>demo@netsim.com</dd></div>
            <div><dt>Rol</dt><dd>Satın Alma</dd></div>
          </dl>
        </Card>

        <Card className="account-section">
          <h2>Firma</h2>
          <dl className="detail-list">
            <div><dt>Firma</dt><dd>{account.name}</dd></div>
            <div><dt>Cari Kodu</dt><dd>{account.code}</dd></div>
            <div><dt>Vergi No</dt><dd>{account.taxNumber ?? "—"}</dd></div>
            <div><dt>Adres</dt><dd>{account.address ?? "—"}</dd></div>
          </dl>
        </Card>

        <Card className="account-section">
          <h2>Ticari Koşullar</h2>
          <dl className="detail-list">
            <div><dt>Ödeme koşulu</dt><dd>{account.paymentTerm ?? "—"}</dd></div>
            <div><dt>Risk grubu</dt><dd>{account.riskGroup ?? "—"}</dd></div>
            <div><dt>Hesap yöneticisi</dt><dd>{account.accountManager ?? "—"}</dd></div>
            <div><dt>Cari bakiye</dt><dd>{formatMoney(account.balance)}</dd></div>
            <div><dt>Kullanılabilir limit</dt><dd>{formatMoney(account.availableCredit)}</dd></div>
            <div><dt>Para birimi</dt><dd>{account.currency}</dd></div>
          </dl>
        </Card>

        <Card className="account-section">
          <h2>Hızlı Linkler</h2>
          <div className="account-quick-links">
            <Link className="button" to="/finans">Cari / Finans</Link>
            <Link className="button" to="/faturalar">Faturalar</Link>
            <Link className="button" to="/destek">Destek</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

const SUPPORT_TYPES = ["Sipariş", "Sevkiyat", "Ödeme", "Teklif", "Teknik Destek", "İade"] as const;

const DEMO_TICKETS = [
  { id: "DST-2026-1042", type: "Sevkiyat", subject: "Teslimat saati değişikliği", ref: "SVK-2026-0088", href: "/sevkiyatlar/SVK-2026-0088", status: "Açık", at: "2026-09-09" },
  { id: "DST-2026-1031", type: "Ödeme", subject: "FTR-2026-1482 ödeme bildirimi", ref: "FTR-2026-1482", href: "/faturalar/FTR-2026-1482", status: "Yanıtlandı", at: "2026-09-08" },
  { id: "DST-2026-1018", type: "Teklif", subject: "TKL-2026-0142 yenileme talebi", ref: "TKL-2026-0142", href: "/teklifler/TKL-2026-0142", status: "Kapalı", at: "2026-09-02" },
];

export function SupportPage() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type") ?? "";
  const refParam = searchParams.get("ref") ?? "";
  const resolvedType = SUPPORT_TYPES.includes(typeParam as (typeof SUPPORT_TYPES)[number]) ? typeParam : "Teknik Destek";
  const [ticketType, setTicketType] = useState(resolvedType);
  const [subject, setSubject] = useState(refParam ? `${resolvedType} talebi · ${refParam}` : "");
  const [message, setMessage] = useState(refParam ? `Referans: ${refParam}\n\n` : "");
  const [ticketId, setTicketId] = useState("");
  const [prefillKey, setPrefillKey] = useState(`${typeParam}|${refParam}`);

  if (`${typeParam}|${refParam}` !== prefillKey) {
    setPrefillKey(`${typeParam}|${refParam}`);
    setTicketType(resolvedType);
    setSubject(refParam ? `${resolvedType} talebi · ${refParam}` : "");
    setMessage(refParam ? `Referans: ${refParam}\n\n` : "");
    setTicketId("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const suffix = String(1000 + Math.floor(Math.random() * 9000));
    setTicketId(`DST-2026-${suffix}`);
  }

  return (
    <div className="page">
      <header className="portal-misc-header">
        <div>
          <span className="portal-misc-eyebrow">Müşteri Destek</span>
          <h1>Destek Merkezi</h1>
          <p>Sipariş, sevkiyat, ödeme ve teklif taleplerinizi Netsim ekibine iletin.</p>
        </div>
      </header>

      <div className="support-layout">
        <Card>
          {ticketId ? (
            <div className="support-success">
              <Badge tone="success">Talep alındı</Badge>
              <strong>{ticketId}</strong>
              <p className="muted">Demo destek talebiniz kaydedildi. Gerçek backend bağlandığında destek ekibine iletilecektir.</p>
              <div className="account-quick-links">
                <button className="button" type="button" onClick={() => { setTicketId(""); setSubject(""); setMessage(""); }}>Yeni talep</button>
                <Link className="button button-primary" to="/dashboard">Panele dön</Link>
              </div>
            </div>
          ) : (
            <form className="content-grid" onSubmit={submit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="support-subject">Konu</label>
                  <input id="support-subject" className="input" required value={subject} onChange={(event) => setSubject(event.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="support-type">Talep türü</label>
                  <select id="support-type" className="select" value={ticketType} onChange={(event) => setTicketType(event.target.value)}>
                    {SUPPORT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>
              {refParam && (
                <div className="field">
                  <label htmlFor="support-ref">Referans</label>
                  <input id="support-ref" className="input" readOnly value={refParam} />
                </div>
              )}
              <div className="field">
                <label htmlFor="support-message">Açıklama</label>
                <textarea id="support-message" className="textarea" required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} />
              </div>
              <button className="button button-primary" type="submit">Talep Oluştur</button>
            </form>
          )}
        </Card>

        <aside>
          <Card className="account-section">
            <h2>Son Talepler</h2>
            <div className="support-ticket-list">
              {DEMO_TICKETS.map((ticket) => (
                <Link className="card support-ticket-card" to={ticket.href} key={ticket.id}>
                  <div className="support-ticket-card-top">
                    <strong>{ticket.id}</strong>
                    <Badge tone={ticket.status === "Açık" ? "warning" : ticket.status === "Yanıtlandı" ? "success" : "neutral"}>{ticket.status}</Badge>
                  </div>
                  <p>{ticket.subject}</p>
                  <small>{ticket.type} · {ticket.ref} · {formatDate(ticket.at)}</small>
                </Link>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

