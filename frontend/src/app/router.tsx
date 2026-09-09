import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/app/shell/AppShell";
import { CartPage } from "@/features/cart";
import { DashboardPage } from "@/features/dashboard";
import { OrdersPage } from "@/features/orders";
import { ProductsPage } from "@/features/products";
import { QuickOrderPage } from "@/features/quick-order";
import { QuotesPage } from "@/features/quotes";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/urunler", element: <ProductsPage /> },
      { path: "/hizli-siparis", element: <QuickOrderPage /> },
      { path: "/sepet", element: <CartPage /> },
      { path: "/teklifler", element: <QuotesPage /> },
      { path: "/siparisler", element: <OrdersPage /> },
    ],
  },
]);

