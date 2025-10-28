// app/features/menu/redux.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type OpenMap = Record<string, boolean>;
type CurrentSelectedMap = Record<string, boolean>;
interface MenuSliceState {
  open: OpenMap; // controla aberturas por chave
  currentSelected: CurrentSelectedMap; // controla seleção por chave
}

const initialState: MenuSliceState = {
  open: {},
  currentSelected: {},
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    // setMenuActive removido - não há mais sistema de allowed_views
    toggleOpen: (state, action: PayloadAction<{ path: string }>) => {
      const key = action.payload.path; // ex: "atendimento.mercado_livre"
      state.open[key] = !state.open[key];
    },
    setOpen: (
      state,
      action: PayloadAction<{ path: string; value: boolean }>
    ) => {
      state.open[action.payload.path] = action.payload.value;
    },
    setCurrentSelected: (
      state,
      action: PayloadAction<{ path: string; value: boolean }>
    ) => {
      state.currentSelected[action.payload.path] = action.payload.value;
    },
    setSelectedOnly: (state, action: PayloadAction<{ path: string }>) => {
      state.currentSelected = {};
      state.currentSelected[action.payload.path] = true;
    },
    closeMany: (state, action: PayloadAction<string[]>) => {
      for (const key of action.payload) {
        if (state.open[key]) state.open[key] = false;
      }
    },
  },
});

export const {
  toggleOpen,
  setOpen,
  setCurrentSelected,
  setSelectedOnly,
  closeMany,
} = menuSlice.actions;
export default menuSlice.reducer;
