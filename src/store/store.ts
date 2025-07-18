import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { validitySlice } from "./validities/validitySlice";

export const store = configureStore({
  reducer: {
    validity: validitySlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Definir el tipo de estado de la tienda
export type RootState = ReturnType<typeof store.getState>;

// Definir el tipo de AppDispatch
export type AppDispatch = typeof store.dispatch;

// Definir el tipo de Thunk
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
