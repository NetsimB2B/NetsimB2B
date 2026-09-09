import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Badge, Card, PageHeader } from "@/shared/components/Ui";
import { formatMoney } from "@/shared/lib/format";

type QuickRow = { code: string; quantity: number };

export function QuickOrderPage() {
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const addToCart = useCompanyContext((state) => state.addToCart);
  const [rows, setRows] = useState<QuickRow[]>([{ code: "", quantity: 1 }, { code: "", quantity: 1 }, { code: "", quantity: 1 }]);
  const [pasteData, setPasteData] = useState("");
  const { data: products = [] } = useQuery({ queryKey: ["products", accountId, "quick"], queryFn: () => portalService.getProducts(accountId) });
  const resolved = rows.map((row) => ({ ...row, product: products.find((product) => product.code.toLocaleUpperCase("tr-TR") === row.code.trim().toLocaleUpperCase("tr-TR")) }));
  const validRows = resolved.filter((row) => row.product && row.quantity > 0);

  function updateRow(index: number, update: Partial<QuickRow>) {
    setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, ...update } : row));
  }

  function importRows() {
    const imported = pasteData.split(/\r?\n/).filter(Boolean).map((line) => {
      const [code = "", quantity = "1"] = line.trim().split(/[\t,; ]+/);
      return { code, quantity: Math.max(1, Number(quantity) || 1) };
    });
    if (imported.length) setRows(imported);
  }

  function addValidRows() {
    validRows.forEach((row) => row.product && addToCart(row.product.id, row.quantity));
  }

  return (
    <div className="page">
      <PageHeader title="Hızlı Sipariş" description="Ürün kodlarını ve miktarları girerek sepetinizi hızla oluşturun." action={<Link className="button" to="/sepet">Sepete Git</Link>} />
      <div className="content-grid content-grid-2">
        <Card>
          <h2>Hızlı Giriş Tablosu</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Ürün Kodu</th><th>Miktar</th><th>Sonuç</th></tr></thead>
              <tbody>{resolved.map((row, index) => (
                <tr key={index}>
                  <td><input className="input" value={row.code} placeholder="MTR-001" onChange={(event) => updateRow(index, { code: event.target.value })} /></td>
                  <td><input className="input quick-quantity" type="number" min="1" value={row.quantity} onChange={(event) => updateRow(index, { quantity: Number(event.target.value) })} /></td>
                  <td>{!row.code ? <span className="muted">Bekliyor</span> : row.product ? <div><Badge tone="success">Bulundu</Badge><small className="quick-result">{row.product.name} · {formatMoney(row.product.price)}</small></div> : <Badge tone="danger">Bulunamadı</Badge>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="page-actions quick-actions"><button className="button" onClick={() => setRows((current) => [...current, { code: "", quantity: 1 }])}>Satır Ekle</button><button className="button button-primary" disabled={!validRows.length} onClick={addValidRows}>{validRows.length} Ürünü Sepete Ekle</button></div>
        </Card>
        <Card>
          <h2>Toplu Yapıştır</h2>
          <p className="muted">Excel’den ürün kodu ve miktar sütunlarını kopyalayıp buraya yapıştırabilirsiniz.</p>
          <textarea className="textarea quick-paste" value={pasteData} onChange={(event) => setPasteData(event.target.value)} placeholder={"MTR-001\t10\nBRG-6205\t25"} />
          <button className="button" onClick={importRows}>Önizlemeye Aktar</button>
          <div className="notice quick-tip">Bu ekran yalnız sepet hazırlar; doğrudan sipariş oluşturmaz.</div>
        </Card>
      </div>
    </div>
  );
}

