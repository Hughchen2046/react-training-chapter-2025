import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  global: 0,
  auth: 0,
  editing: 0,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    loadingStarted(state, action) {
      const key = action.payload;
      if (!key) return;
      state[key] = (state[key] ?? 0) + 1;
    },
    loadingStopped(state, action) {
      const key = action.payload;
      if (!key || state[key] <= 0) return;
      state[key] = (state[key] ?? 0) - 1;
    },
  },
});

export const { loadingStarted, loadingStopped } = loadingSlice.actions;
export default loadingSlice.reducer;

export const stateIsLoading = (key) => (state) => (state.loading[key] ?? 0) > 0;
