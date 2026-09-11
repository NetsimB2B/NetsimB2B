import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addCartLine, clearServerCart, deleteCartLine, fetchCartLines, updateCartLineQuantity } from "@/shared/api/cartApi";
import { addFavorite, fetchFavorites, removeFavorite } from "@/shared/api/favoritesApi";
import type { CartLine } from "@/shared/types/portal";

type CompanyContextState = {
  activeCariNo: number;
  cartByAccount: Record<number, CartLine[]>;
  favorites: number[];
  notificationsRead: boolean;
  setActiveCariNo: (cariNo: number) => void;
  loadCart: (cariNo: number) => Promise<void>;
  addToCart: (productId: number, quantity?: number, options?: { unitPrice?: number; quoteId?: string }) => void;
  updateCartLine: (productId: number, quantity: number) => void;
  removeCartLine: (productId: number) => void;
  clearCart: (accountId?: number) => void;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (productId: number) => void;
  markNotificationsRead: () => void;
};

// Sepet artık B2B veritabanında (B2B_CARTS/B2B_CART_LINES) tutuluyor. Bu store, sunucudan
// yüklenen sepeti (loadCart) yerel bir önbellek olarak tutar: aksiyonlar önce anında UI
// güncellemesi için local state'i günceller (optimistic), ardından sunucuya senkronize
// edilir. Senkronizasyon başarısız olursa şimdilik yalnızca konsola loglanır — geri alma
// (rollback) yapılmıyor (bkz. docs/implementation-status.md → Known TODO).
export const useCompanyContext = create<CompanyContextState>()(
  persist(
    (set, get) => ({
      activeCariNo: 1001,
      cartByAccount: {},
      favorites: [],
      notificationsRead: false,
      setActiveCariNo: (activeCariNo) => set({ activeCariNo }),
      loadCart: async (cariNo) => {
        try {
          const lines = await fetchCartLines(cariNo);
          set((state) => ({ cartByAccount: { ...state.cartByAccount, [cariNo]: lines } }));
        } catch (error) {
          console.error("Sepet sunucudan yüklenemedi", error);
        }
      },
      addToCart: (productId, quantity = 1, options) => {
        const cariNo = get().activeCariNo;
        const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
        set((state) => {
          const cart = state.cartByAccount[cariNo] ?? [];
          const existing = cart.find((line) => line.productId === productId);
          const nextCart = existing
            ? cart.map((line) => line.productId === productId
              ? {
                  ...line,
                  quantity: line.quantity + safeQuantity,
                  unitPrice: options?.unitPrice ?? line.unitPrice,
                  quoteId: options?.quoteId ?? line.quoteId,
                }
              : line)
            : [...cart, {
                productId,
                quantity: safeQuantity,
                ...(options?.unitPrice != null ? { unitPrice: options.unitPrice } : {}),
                ...(options?.quoteId ? { quoteId: options.quoteId } : {}),
              }];
          return { cartByAccount: { ...state.cartByAccount, [cariNo]: nextCart } };
        });
        void addCartLine(cariNo, { stokNo: productId, quantity: safeQuantity, unitPrice: options?.unitPrice, quoteId: options?.quoteId })
          .catch((error) => console.error("Ürün sepete eklenirken sunucu hatası", error));
      },
      updateCartLine: (productId, quantity) => {
        const cariNo = get().activeCariNo;
        const safeQuantity = Number.isFinite(quantity) ? Math.max(0, quantity) : 0;
        set((state) => ({
          cartByAccount: {
            ...state.cartByAccount,
            [cariNo]: (state.cartByAccount[cariNo] ?? [])
              .map((line) => line.productId === productId ? { ...line, quantity: safeQuantity } : line)
              .filter((line) => line.quantity > 0),
          },
        }));
        void updateCartLineQuantity(cariNo, productId, safeQuantity)
          .catch((error) => console.error("Sepet miktarı güncellenirken sunucu hatası", error));
      },
      removeCartLine: (productId) => {
        const cariNo = get().activeCariNo;
        set((state) => ({
          cartByAccount: {
            ...state.cartByAccount,
            [cariNo]: (state.cartByAccount[cariNo] ?? []).filter((line) => line.productId !== productId),
          },
        }));
        void deleteCartLine(cariNo, productId)
          .catch((error) => console.error("Ürün sepetten kaldırılırken sunucu hatası", error));
      },
      clearCart: (accountId) => {
        const cariNo = accountId ?? get().activeCariNo;
        set((state) => ({ cartByAccount: { ...state.cartByAccount, [cariNo]: [] } }));
        void clearServerCart(cariNo)
          .catch((error) => console.error("Sepet temizlenirken sunucu hatası", error));
      },
      loadFavorites: async () => {
        try {
          const favorites = await fetchFavorites();
          set({ favorites });
        } catch (error) {
          console.error("Favoriler sunucudan yüklenemedi", error);
        }
      },
      toggleFavorite: (productId) => {
        const isFavorite = get().favorites.includes(productId);
        set((state) => ({
          favorites: isFavorite
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        }));
        const request = isFavorite ? removeFavorite(productId) : addFavorite(productId);
        void request.catch((error) => console.error("Favori sunucu senkronizasyonu başarısız", error));
      },
      markNotificationsRead: () => set({ notificationsRead: true }),
    }),
    {
      name: "netsim-b2b:portal-state",
      storage: createJSONStorage(() => localStorage),
      // cartByAccount ve favorites artık sunucu kaynaklı (bkz. loadCart/loadFavorites) —
      // yerelde saklanmazlar, aksi halde farklı cihaz/sekmelerde bayat veri görünebilir.
      partialize: (state) => ({
        activeCariNo: state.activeCariNo,
        notificationsRead: state.notificationsRead,
      }),
    },
  ),
);

