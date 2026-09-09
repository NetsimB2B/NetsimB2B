import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearMockSession } from "@/features/auth/mockAuth";

const navigation = [
  ["/dashboard", "Gösterge Paneli"],
  ["/urunler", "Ürünler"],
  ["/hizli-siparis", "Hızlı Sipariş"],
  ["/sepet", "Sepetim"],
  ["/teklifler", "Tekliflerim"],
  ["/siparisler", "Siparişlerim"],
] as const;

export function AppShell() {
  const navigate = useNavigate();

  function handleLogout() {
    clearMockSession();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Netsim <span>B2B</span></div>
        <nav aria-label="Ana menü">
          {navigation.map(([to, label]) => (
            <NavLink key={to} to={to}>{label}</NavLink>
          ))}
        </nav>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>Aktif firma</span>
          <button type="button">Örnek Bayi A.Ş. ▾</button>
          <button className="logout-button" type="button" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </header>
        <main><Outlet /></main>
      </div>
    </div>
  );
}

