import { configureStore } from "@reduxjs/toolkit";
import { themeReducer } from "./features/themeSlice";
import { postReducer} from "./features/postSlice";
import { userReducer } from "./features/userSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    theme: themeReducer,
  },
});

export { store };
