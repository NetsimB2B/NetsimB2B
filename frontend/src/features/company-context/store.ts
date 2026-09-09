import { create } from "zustand";

type CompanyContextState = {
  activeCariNo: number | null;
  setActiveCariNo: (cariNo: number) => void;
};

export const useCompanyContext = create<CompanyContextState>((set) => ({
  activeCariNo: null,
  setActiveCariNo: (activeCariNo) => set({ activeCariNo }),
}));

