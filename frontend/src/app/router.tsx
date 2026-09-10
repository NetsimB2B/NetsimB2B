import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/app/shell/AppShell";
import { CartPage } from "@/features/cart";
import { CheckoutPage } from "@/features/checkout";
import { AccountPage, AnnouncementsPage, FavoritesPage, FinancePage, InvoiceDetailPage, InvoicesPage, NotificationsPage, ShipmentDetailPage, ShipmentsPage, SupportPage } from "@/features/commerce";
import { DashboardPage } from "@/features/dashboard";
import { LoginPage } from "@/features/auth/LoginPage";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { OrderDetailPage, OrdersPage } from "@/features/orders";
import { ProductDetailPage, ProductsPage } from "@/features/products";
import { QuickOrderPage } from "@/features/quick-order";
import { QuoteDetailPage, QuotesPage } from "@/features/quotes";
import { NotFoundPage, RouteErrorPage } from "@/shared/components/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/urunler", element: <ProductsPage /> },
      { path: "/urunler/:id", element: <ProductDetailPage /> },
      { path: "/hizli-siparis", element: <QuickOrderPage /> },
      { path: "/favoriler", element: <FavoritesPage /> },
      { path: "/sepet", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/teklifler", element: <QuotesPage /> },
      { path: "/teklifler/:id", element: <QuoteDetailPage /> },
      { path: "/siparisler", element: <OrdersPage /> },
      { path: "/siparisler/:id", element: <OrderDetailPage /> },
      { path: "/sevkiyatlar", element: <ShipmentsPage /> },
      { path: "/sevkiyatlar/:id", element: <ShipmentDetailPage /> },
      { path: "/faturalar", element: <InvoicesPage /> },
      { path: "/faturalar/:id", element: <InvoiceDetailPage /> },
      { path: "/finans", element: <FinancePage /> },
      { path: "/duyurular", element: <AnnouncementsPage /> },
      { path: "/bildirimler", element: <NotificationsPage /> },
      { path: "/hesabim", element: <AccountPage /> },
      { path: "/destek", element: <SupportPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

