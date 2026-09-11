import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";
import { Card, EmptyState, PageHeader } from "@/shared/components/Ui";
import { formatMoney } from "@/shared/lib/format";

export function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accountId = useCompanyContext((state) => state.activeCariNo);
  const storedLines = useCompanyContext((state) => state.cartByAccount[state.activeCariNo]);
  const lines = storedLines ?? [];
  const [deliveryAddress, setDeliveryAddress] = useState("Merkez Mah. Sanayi Cad. No:12 İstanbul");
  const [paymentMethod, setPaymentMethod] = useState("30 Gün Vadeli");
  const [shippingMethod, setShippingMethod] = useState("Hazır olanı gönder");
  const [note, setNote] = useState("");
  const { data: products = [], isLoading: isPricing } = useQuery({ queryKey: ["products", accountId, "checkout"], queryFn: () => portalService.getProducts(accountId) });
  const total = lines.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    const unitPrice = line.unitPrice ?? product?.price ?? 0;
    return sum + unitPrice * line.quantity;
  }, 0);
  const mutation = useMutation({
    mutationFn: () => portalService.createOrder(accountId, { deliveryAddress, paymentMethod, shippingMethod, note }),
    onSuccess: async (order) => {
      await queryClient.invalidateQueries({ queryKey: ["orders", accountId] });
      navigate(`/siparisler/${order.id}`, { replace: true });
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!mutation.isPending) mutation.mutate();
  }

  if (!lines.length) {
    return <div className="page"><EmptyState title="Siparişe dönüştürülecek ürün yok" description="Checkout işlemine devam etmek için sepetinize ürün ekleyin." action={<Link className="button button-primary" to="/urunler">Ürünlere Git</Link>} /></div>;
  }

  return (
    <div className="page">
      <PageHeader title="Siparişi Tamamla" description="Teslimat ve ödeme bilgilerini kontrol edin." />
      <form className="cart-layout" onSubmit={submit}>
        <div className="content-grid">
          <Card>
            <h2>Teslimat Bilgileri</h2>
            <div className="form-grid">
              <div className="field"><label htmlFor="delivery">Teslimat adresi</label><select id="delivery" className="select" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)}><option>Merkez Mah. Sanayi Cad. No:12 İstanbul</option><option>Organize Sanayi Bölgesi 4. Cad. Bursa</option></select></div>
              <div className="field"><label htmlFor="shipping">Sevkiyat tercihi</label><select id="shipping" className="select" value={shippingMethod} onChange={(event) => setShippingMethod(event.target.value)}><option>Hazır olanı gönder</option><option>Tüm ürünler hazır olunca gönder</option><option>Depodan teslim alacağım</option></select></div>
            </div>
          </Card>
          <Card>
            <h2>Ödeme ve Not</h2>
            <div className="field"><label htmlFor="payment">Ödeme yöntemi</label><select id="payment" className="select" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option>30 Gün Vadeli</option><option>Havale / EFT</option><option>Peşin</option></select></div>
            <div className="field checkout-note"><label htmlFor="note">Sipariş notu</label><textarea id="note" className="textarea" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Siparişinizle ilgili notunuzu yazın" /></div>
          </Card>
          <div className="notice">Ürünlerin güncel fiyatı, satılabilir stoğu ve cari limiti sipariş oluşturulmadan önce sunucuda kontrol edilir.</div>
          {mutation.error && <div className="notice" role="alert">{mutation.error.message}</div>}
        </div>
        <Card className="cart-summary">
          <h2>Sipariş Özeti</h2>
          <div><span>Ürün çeşidi</span><strong>{lines.length}</strong></div>
          <div><span>Toplam miktar</span><strong>{lines.reduce((sum, line) => sum + line.quantity, 0)}</strong></div>
          <div className="cart-grand-total"><span>Genel toplam</span><strong>{isPricing ? "Hesaplanıyor..." : formatMoney(total)}</strong></div>
          <button className="button button-primary" type="submit" disabled={mutation.isPending || isPricing}>{mutation.isPending ? "Doğrulanıyor..." : "Siparişi Onayla"}</button>
          <Link className="button" to="/sepet">Sepete Dön</Link>
        </Card>
      </form>
    </div>
  );
}
