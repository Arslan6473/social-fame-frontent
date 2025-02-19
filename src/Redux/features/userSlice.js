import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? null,
  edit: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage?.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage?.removeItem("user");
    },
    updateProfile: (state, action) => {
      state.edit = action.payload;
    }
  },
});

export const getUser = (state) => state.user;
export const { login, logout, updateProfile} = userSlice.actions;
export const userReducer = userSlice.reducer;
