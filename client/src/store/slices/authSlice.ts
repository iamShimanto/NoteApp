import { createSlice } from "@reduxjs/toolkit";

interface user {
  id: string;
  fullName: string;
  email: string;
}

const storedUser = JSON.parse(localStorage.getItem("userData") as any);

const initialState: { user: user | null } = {
  user: storedUser ? storedUser : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("userData");
    },
  },
});

export const { loggedUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
