import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setAllPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const getPosts = (state) => state.post;
export const { setAllPosts} = postSlice.actions;
export const postReducer = postSlice.reducer
