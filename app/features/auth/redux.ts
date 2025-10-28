import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IBaseUsuario, type IUsuario } from "../user/typings";

export interface IAuthState {
  loading: boolean;
  user: IBaseUsuario | IUsuario | null;
  error: string | null;
  success: boolean;
}

const initialState: IAuthState = {
  loading: false,
  user: {} as IBaseUsuario | IUsuario | null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<IBaseUsuario | IUsuario>) {
      state.user = action.payload;
      state.success = true;
      state.loading = false;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.success = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
