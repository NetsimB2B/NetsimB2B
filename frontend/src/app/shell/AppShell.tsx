import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  ["/dashboard", "Gösterge Paneli"],
  ["/urunler", "Ürünler"],
  ["/hizli-siparis", "Hızlı Sipariş"],
  ["/sepet", "Sepetim"],
  ["/teklifler", "Tekliflerim"],
  ["/siparisler", "Siparişlerim"],
] as const;

export function AppShell() {
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
        </header>
        <main><Outlet /></main>
      </div>
    </div>
  );
}

