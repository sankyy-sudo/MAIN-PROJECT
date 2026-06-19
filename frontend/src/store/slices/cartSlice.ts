import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { RootState } from "..";

export interface CartProduct {
  id: string;
  name: string;
  sku: string;
  images: string[];
  retailPrice: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  _id?: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: CartProduct;
}

interface CartPayload {
  cart: {
    id: string;
    _id?: string;
    items: CartItem[];
  };
}

interface CartState {
  cartId: string | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
  coupon: { code: string; discountAmount: number } | null;
}

const initialState: CartState = {
  cartId: null,
  items: [],
  loading: false,
  error: null,
  coupon: null
};

const extractCart = (response: { data: { data: CartPayload } }) =>
  response.data.data.cart;

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const response = await api.get("/cart");
  return extractCart(response);
});

export const addToCart = createAsyncThunk(
  "cart/add",
  async (payload: { productId: string; quantity: number }) => {
    const response = await api.post("/cart/items", payload);
    return extractCart(response);
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async (payload: { cartItemId: string; quantity: number }) => {
    const response = await api.patch(`/cart/items/${payload.cartItemId}`, {
      quantity: payload.quantity
    });
    return extractCart(response);
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async (payload: { cartItemId: string }) => {
    const response = await api.delete(`/cart/items/${payload.cartItemId}`);
    return extractCart(response);
  }
);

export const clearCart = createAsyncThunk("cart/clear", async () => {
  const response = await api.delete("/cart");
  return extractCart(response);
});

export const mergeCart = createAsyncThunk("cart/merge", async () => {
  const response = await api.post("/cart/merge");
  return extractCart(response);
});

const applyCart = (state: CartState, cart: CartPayload["cart"]) => {
  state.cartId = cart.id || cart._id || null;
  state.items = cart.items || [];
  state.loading = false;
  state.error = null;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCoupon(
      state,
      action: PayloadAction<{ code: string; discountAmount: number } | null>
    ) {
      state.coupon = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        (state, action: PayloadAction<CartPayload["cart"]>) => {
          applyCart(state, action.payload);
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.error?.message || "Cart request failed";
        }
      );
  }
});

export const { setCoupon } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectSubtotal = (state: RootState) =>
  state.cart.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectDiscount = (state: RootState) =>
  state.cart.coupon?.discountAmount || 0;

export default cartSlice.reducer;
