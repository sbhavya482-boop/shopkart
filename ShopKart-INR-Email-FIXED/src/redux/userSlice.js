import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: { profile: null },
  reducers: {
    login(state, action) { state.profile = action.payload; },
    logout(state) { state.profile = null; }
  }
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;