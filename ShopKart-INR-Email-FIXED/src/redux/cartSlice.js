import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find(i => i.id === product.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...product, quantity: 1 });
    },
    increment(state, action) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrement(state, action) {
      const item = state.items.find(i => i.id === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) state.items = state.items.filter(i => i.id !== action.payload);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearCart(state) { state.items = []; }
  }
});
export const { addToCart, increment, decrement, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;