import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import orderReducer from "./orderSlice";
import userReducer from "./userSlice";

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    user: userReducer
  },
  preloadedState: {
    cart: load("shopkart-cart", { items: [] }),
    wishlist: load("shopkart-wishlist", { items: [] }),
    orders: load("shopkart-orders", { items: [] }),
    user: load("shopkart-user", { profile: null })
  }
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("shopkart-cart", JSON.stringify(state.cart));
  localStorage.setItem("shopkart-wishlist", JSON.stringify(state.wishlist));
  localStorage.setItem("shopkart-orders", JSON.stringify(state.orders));
  localStorage.setItem("shopkart-user", JSON.stringify(state.user));
});