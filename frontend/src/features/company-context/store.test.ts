import { beforeEach, describe, expect, it } from "vitest";
import { useCompanyContext } from "./store";

describe("company scoped cart", () => {
  beforeEach(() => {
    useCompanyContext.setState({ activeCariNo: 1001, cartByAccount: {}, orders: [], favorites: [] });
  });

  it("keeps carts separate for each account", () => {
    useCompanyContext.getState().addToCart(1, 2);
    useCompanyContext.getState().setActiveCariNo(1002);
    useCompanyContext.getState().addToCart(2, 1);

    const state = useCompanyContext.getState();
    expect(state.cartByAccount[1001]).toEqual([{ productId: 1, quantity: 2 }]);
    expect(state.cartByAccount[1002]).toEqual([{ productId: 2, quantity: 1 }]);
  });
});
