import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import netsimLogo from "@/assets/netsim-logo.png";
import { clearMockSession } from "@/features/auth/mockAuth";
import { useCompanyContext } from "@/features/company-context/store";
import { CompanyLogo } from "@/shared/components/CompanyLogo";
import { portalService } from "@/shared/services/portalService";

const navigation = [
  ["Ana Menü", [["/dashboard", "Gösterge Paneli"]]],
  ["Alışveriş", [["/urunler", "Ürünler"], ["/hizli-siparis", "Hızlı Sipariş"], ["/favoriler", "Favoriler"], ["/sepet", "Sepetim"]]],
  ["Ticari İşlemler", [["/teklifler", "Tekliflerim"], ["/siparisler", "Siparişlerim"], ["/sevkiyatlar", "Sevkiyatlar"], ["/faturalar", "Faturalar"]]],
  ["Finans", [["/finans", "Cari Hesap"]]],
  ["Diğer", [["/duyurular", "Duyurular"], ["/bildirimler", "Bildirimler"], ["/hesabim", "Hesabım"]]],
] as const;

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCariNo = useCompanyContext((state) => state.activeCariNo);
  const setActiveCariNo = useCompanyContext((state) => state.setActiveCariNo);
  const cartCount = useCompanyContext((state) =>
    (state.cartByAccount[state.activeCariNo] ?? []).reduce((sum, line) => sum + line.quantity, 0));
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const activeAccount = accounts.find((account) => account.id === activeCariNo);

  function handleLogout() {
    clearMockSession();
    navigate("/login", { replace: true });
  }

  function handleAccountChange(cariNo: number) {
    setActiveCariNo(cariNo);
    void queryClient.invalidateQueries();
    if (location.pathname === "/checkout") navigate("/sepet", { replace: true });
  }

  return (
    <div className="app-shell">
      {mobileOpen && <button className="sidebar-backdrop" aria-label="Menüyü kapat" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-head">
          <Link className="brand sidebar-brand" to="/dashboard" aria-label="Netsim B2B gösterge paneli">
            <img src={netsimLogo} alt="" />
          </Link>
          <button className="sidebar-close" type="button" aria-label="Menüyü kapat" onClick={() => setMobileOpen(false)}>×</button>
        </div>
        <nav aria-label="Ana menü">
          {navigation.map(([group, links]) => (
            <div className="nav-group" key={group}>
              <span className="nav-group-label">{group}</span>
              {links.map(([to, label]) => (
                <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}>
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-support">
          <span>Yardıma mı ihtiyacınız var?</span>
          <Link to="/destek">Destek Merkezi</Link>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button className="menu-button" type="button" aria-label="Menüyü aç" onClick={() => setMobileOpen(true)}>☰</button>
          <div className="topbar-spacer" />
          {activeAccount && (
            <CompanyLogo
              className="topbar-company-logo"
              name={activeAccount.name}
              logoUrl={activeAccount.logoUrl}
              color={activeAccount.brandColor}
            />
          )}
          <label className="account-select">
            <span>Aktif firma</span>
            <select value={activeCariNo} onChange={(event) => handleAccountChange(Number(event.target.value))}>
              {accounts.map((account) => <option value={account.id} key={account.id}>{account.name}</option>)}
            </select>
          </label>
          <Link className="topbar-icon" to="/bildirimler" aria-label="Bildirimler">●</Link>
          <Link className="topbar-cart" to="/sepet" aria-label={`Sepet, ${cartCount} ürün`}>Sepet <strong>{cartCount}</strong></Link>
          <div className="profile-menu">
            <Link className="profile-link" to="/hesabim">
              <span className="avatar">BA</span>
              <span className="profile-copy"><strong>Burak Admin</strong><small>Satın Alma</small></span>
            </Link>
            <button className="logout-button" type="button" onClick={handleLogout}>Çıkış</button>
          </div>
        </header>
        <main><Outlet /></main>
      </div>
    </div>
  );
}

