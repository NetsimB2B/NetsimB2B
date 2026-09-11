import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import netsimLogo from "@/assets/netsim-logo.png";
import { fetchMe, logout } from "@/features/auth/authApi";
import { useCompanyContext } from "@/features/company-context/store";
import { portalService } from "@/shared/services/portalService";

const navigation = [
  ["Genel", [["/dashboard", "Ana Sayfa"], ["/urunler", "Ürünler"], ["/hizli-siparis", "Hızlı Sipariş"], ["/favoriler", "Favoriler"]]],
  ["Satın Alma", [["/sepet", "Sepet"], ["/teklifler", "Teklifler"], ["/siparisler", "Siparişler"]]],
  ["Finans", [["/sevkiyatlar", "Sevkiyatlar"], ["/faturalar", "Faturalar"], ["/finans", "Cari Hesap"]]],
  ["Diğer", [["/duyurular", "Duyurular"], ["/bildirimler", "Bildirimler"], ["/hesabim", "Hesabım"]]],
] as const;

const UNREAD_NOTIFICATION_COUNT = 2;

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCariNo = useCompanyContext((state) => state.activeCariNo);
  const setActiveCariNo = useCompanyContext((state) => state.setActiveCariNo);
  const loadCart = useCompanyContext((state) => state.loadCart);
  const loadFavorites = useCompanyContext((state) => state.loadFavorites);
  const notificationsRead = useCompanyContext((state) => state.notificationsRead);
  const cartCount = useCompanyContext((state) =>
    (state.cartByAccount[state.activeCariNo] ?? []).reduce((sum, line) => sum + line.quantity, 0));
  const { data: allAccounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => portalService.getAccounts() });
  const { data: session } = useQuery({ queryKey: ["auth", "me"], queryFn: fetchMe, retry: false });

  // Sepet artık veritabanında tutuluyor: oturum doğrulandığında ve aktif firma
  // değiştiğinde sunucudaki güncel sepeti yükler (bkz. company-context/store.ts).
  useEffect(() => {
    if (session) void loadCart(activeCariNo);
  }, [session, activeCariNo, loadCart]);

  // Favoriler kullanıcı bazlıdır (cari/firmadan bağımsız) — yalnızca oturum doğrulandığında
  // bir kez yüklenir, firma değişiminde tekrar çekilmesine gerek yoktur.
  useEffect(() => {
    if (session) void loadFavorites();
  }, [session, loadFavorites]);
  const allowedCariNos = new Set(session?.accounts.map((account) => account.cariNo) ?? []);
  const accounts = allAccounts.filter((account) => allowedCariNos.has(account.id));
  const unreadCount = notificationsRead ? 0 : UNREAD_NOTIFICATION_COUNT;

  async function handleLogout() {
    await logout();
    void queryClient.invalidateQueries();
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
          <label className="account-select">
            <span>Cari</span>
            <select value={activeCariNo} onChange={(event) => handleAccountChange(Number(event.target.value))}>
              {accounts.map((account) => <option value={account.id} key={account.id}>{account.id} — {account.name}</option>)}
            </select>
          </label>
          <Link className="topbar-action" to="/bildirimler" aria-label={unreadCount ? `Bildirimler, ${unreadCount} okunmamış` : "Bildirimler"}>Bildirimler ({unreadCount})</Link>
          <Link className="topbar-action" to="/sepet" aria-label={`Sepet, ${cartCount} ürün`}>Sepet ({cartCount})</Link>
          <div className="profile-menu">
            <Link className="profile-link" to="/hesabim">{session?.user.displayName ?? "…"}</Link>
            <button className="logout-button" type="button" onClick={handleLogout}>Çıkış</button>
          </div>
        </header>
        <main><Outlet /></main>
      </div>
    </div>
  );
}
