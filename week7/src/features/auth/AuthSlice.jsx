import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  uid: null,
  expired: null,
  success: null,
  message: null,
  error: null,
};
// token, uid, expired, success, message：登入成功後存資料，沒登入null
// error：登入失敗

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action) {
      const { token, uid, expired, success, message } = action.payload || {};
      state.token = token ?? null;
      state.uid = uid ?? null;
      state.expired = expired ?? null;
      state.success = success ?? null;
      state.message = message ?? null;
      state.error = null;
    },
    clearAuth(state) {
      state.token = null;
      state.uid = null;
      state.expired = null;
      state.success = null;
      state.message = null;
      state.error = null;
    },
    setAuthError(state, action) {
      state.error = action.payload ?? '登入失敗';
    },
  },
});

export const { setSession, clearAuth, setAuthError } = authSlice.actions;
export default authSlice.reducer;
