import { createSlice } from "@reduxjs/toolkit";
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload.id;
      const exists = state.items.some(p => p.id === id);
      state.items = exists ? state.items.filter(p => p.id !== id) : [...state.items, action.payload];
    }
  }
});
export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;