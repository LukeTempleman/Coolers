import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoolerStatusEnum } from "../lib/constants";

export interface DateRange {
  start: string; // ISO date string
  end: string;   // ISO date string
}

export interface FiltersState {
  location: string;
  merchant?: string;
  status?: string;
  coordinates: [number, number]; // [latitude, longitude]
  coolerModel?: string;
}

interface InitialStateTypes {
  filters: FiltersState;
  isFiltersFullOpen: boolean;
  viewMode: "grid" | "list";
}

export const initialState: InitialStateTypes = {
  filters: {
    location: "Johannesburg",
    merchant: "",
    status: "",
    coolerModel: "",
    coordinates: [28.074,-26.210],
  },
  isFiltersFullOpen: false,
  viewMode: "grid"
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setFilters, resetFilters, toggleFiltersFullOpen, setViewMode } = globalSlice.actions;

export default globalSlice.reducer;
