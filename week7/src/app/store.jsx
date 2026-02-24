import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/AuthSlice.jsx';
import loadingSlice from '../features/loading/LoadingSlice.jsx';
// import messageReducer from '../features/message/messageSlice.jsx';

export const store = configureStore({
  reducer: {
    // 必要加入 reducer, 這裡的 reducer 算是一個集合管理器，將 slice 匯入後統一進行管理
    auth: authSlice,
    loading: loadingSlice,
    // message: messageReducer,
  },
  devTools: import.meta.env.DEV, // 啟用devTools, Vite: 開發模式開啟，production 關閉
});
export default store;
