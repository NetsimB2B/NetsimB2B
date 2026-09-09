import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine, Order } from "@/shared/types/portal";

type CompanyContextState = {
  activeCariNo: number;
  cartByAccount: Record<number, CartLine[]>;
  orders: Order[];
  favorites: number[];
  notificationsRead: boolean;
  setActiveCariNo: (cariNo: number) => void;
  addToCart: (productId: number, quantity?: number) => void;
  updateCartLine: (productId: number, quantity: number) => void;
  removeCartLine: (productId: number) => void;
  clearCart: (accountId?: number) => void;
  createOrder: (order: Order) => void;
  toggleFavorite: (productId: number) => void;
  markNotificationsRead: () => void;
};

export const useCompanyContext = create<CompanyContextState>()(
  persist(
    (set) => ({
      activeCariNo: 1001,
      cartByAccount: {},
      orders: [],
      favorites: [],
      notificationsRead: false,
      setActiveCariNo: (activeCariNo) => set({ activeCariNo }),
      addToCart: (productId, quantity = 1) =>
        set((state) => {
          const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
          const cart = state.cartByAccount[state.activeCariNo] ?? [];
          const existing = cart.find((line) => line.productId === productId);
          const nextCart = existing
            ? cart.map((line) => line.productId === productId
              ? { ...line, quantity: line.quantity + safeQuantity }
              : line)
            : [...cart, { productId, quantity: safeQuantity }];
          return { cartByAccount: { ...state.cartByAccount, [state.activeCariNo]: nextCart } };
        }),
      updateCartLine: (productId, quantity) =>
        set((state) => {
          const safeQuantity = Number.isFinite(quantity) ? Math.max(0, quantity) : 0;
          return {
            cartByAccount: {
              ...state.cartByAccount,
              [state.activeCariNo]: (state.cartByAccount[state.activeCariNo] ?? [])
                .map((line) => line.productId === productId ? { ...line, quantity: safeQuantity } : line)
                .filter((line) => line.quantity > 0),
            },
          };
        }),
      removeCartLine: (productId) =>
        set((state) => ({
          cartByAccount: {
            ...state.cartByAccount,
            [state.activeCariNo]: (state.cartByAccount[state.activeCariNo] ?? [])
              .filter((line) => line.productId !== productId),
          },
        })),
      clearCart: (accountId) =>
        set((state) => {
          const targetAccountId = accountId ?? state.activeCariNo;
          return { cartByAccount: { ...state.cartByAccount, [targetAccountId]: [] } };
        }),
      createOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      toggleFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        })),
      markNotificationsRead: () => set({ notificationsRead: true }),
    }),
    {
      name: "netsim-b2b:portal-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

