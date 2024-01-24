// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import persistedUserReducer from "./store/userSlice"; // Update the path

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    
  },
});

const persistor = persistStore(store);

export { store, persistor };
