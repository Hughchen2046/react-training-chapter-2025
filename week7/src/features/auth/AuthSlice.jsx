// 匯入 RTK 的非同步 thunk 與 slice 建立工具。
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// 匯入 axios 進行 HTTP 請求。
import axios from 'axios';

// 讀取環境變數中的 API Base URL。
const API_BASE = import.meta.env.VITE_API_BASE;
// 集中管理 token 的 cookie 鍵名。
const TOKEN_KEY = 'hexToken';

// 從 cookie 字串中解析出 token。
const getTokenFromCookie = () =>
  // 用正則取出 hexToken 對應值，沒有就回傳空字串。
  document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

// 將 token 與過期時間寫入 cookie。
const setTokenCookie = (token, expired) => {
  // 寫入可跨頁使用的 token cookie 並設定 expires。
  document.cookie = `${TOKEN_KEY}=${token}; expires=${new Date(expired).toUTCString()}; path=/;`;
};

// 清除 token cookie。
const clearTokenCookie = () => {
  // 以過去時間覆蓋同名 cookie，讓瀏覽器刪除它。
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
};

// 統一設定 axios 預設 Authorization 標頭。
const setAxiosAuthHeader = (token) => {
  // 若有 token，之後請求都自動帶上。
  if (token) {
    // 寫入全域 Authorization。
    axios.defaults.headers.common.Authorization = token;
  } else {
    // 若無 token，移除全域 Authorization。
    delete axios.defaults.headers.common.Authorization;
  }
};

// 建立登入 thunk，處理登入流程與狀態回傳。
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  // 進入錯誤可控的請求區塊。
  try {
    // 送出帳密到後端登入 API。
    const res = await axios.post(`${API_BASE}/admin/signin`, credentials);
    // 從回應資料解構 token 與過期時間。
    const { token, expired } = res.data;
    // 將 token 寫入 cookie。
    setTokenCookie(token, expired);
    // 將 token 設到 axios 預設標頭。
    setAxiosAuthHeader(token);
    // 回傳 reducer 需要的 payload。
    return { token };
  } catch (err) {
    // 登入失敗時主動清除殘留 cookie。
    clearTokenCookie();
    // 登入失敗時同步移除 axios 預設標頭。
    setAxiosAuthHeader('');
    // 失敗時回傳可顯示給 UI 的錯誤訊息。
    return rejectWithValue(
      err.response?.data?.message || err.response?.data?.error?.message || 'Login failed'
    );
  }
});

// 建立驗證登入狀態 thunk。
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  // 嘗試驗證既有 token。
  try {
    // 先從 cookie 取得 token。
    const token = getTokenFromCookie();
    // 沒 token 直接視為未登入。
    if (!token) throw new Error('No token');

    // 把 token 掛上請求標頭。
    setAxiosAuthHeader(token);
    // 呼叫後端驗證 API 確認 token 有效。
    await axios.post(`${API_BASE}/api/user/check`);
    // 驗證成功就回傳 token。
    return { token };
  } catch (err) {
    // 驗證失敗先清除 cookie。
    clearTokenCookie();
    // 同步清除 axios 預設標頭。
    setAxiosAuthHeader('');
    // 回傳失敗訊息給 rejected reducer。
    return rejectWithValue(err.response?.data?.message || err.message || 'Auth check failed');
  }
});

// 建立登出 thunk。
export const logout = createAsyncThunk('auth/logout', async () => {
  // 清除 token cookie。
  clearTokenCookie();
  // 清除 axios 預設標頭。
  setAxiosAuthHeader('');
  // 回傳成功旗標。
  return true;
});

// 定義 auth slice 的初始狀態。
const initialState = {
  // 預設沒有 token。
  token: '',
  // 預設未登入。
  isAuthenticated: false,
  // 預設不在請求中。
  checking: false,
  // 預設無錯誤。
  error: null,
};

// 建立 auth slice。
const AuthSlice = createSlice({
  // slice 名稱。
  name: 'auth',
  // 套用初始狀態。
  initialState,
  // 目前無同步 reducers。
  reducers: {},
  // 使用 extraReducers 監聽 thunk 各階段。
  extraReducers: (builder) => {
    // 以 builder 串接各 action 處理器。
    builder
      // login 送出中：開啟 loading 並清錯誤。
      .addCase(login.pending, (state) => {
        // 顯示處理中。
        state.checking = true;
        // 清掉舊錯誤。
        state.error = null;
      })
      // login 成功：寫入 token 並標記已登入。
      .addCase(login.fulfilled, (state, action) => {
        // 關閉 loading。
        state.checking = false;
        // 儲存 token 到狀態。
        state.token = action.payload.token;
        // 標記為已登入。
        state.isAuthenticated = true;
      })
      // login 失敗：清空登入狀態並寫錯誤。
      .addCase(login.rejected, (state, action) => {
        // 關閉 loading。
        state.checking = false;
        // 清空 token。
        state.token = '';
        // 標記為未登入。
        state.isAuthenticated = false;
        // 儲存錯誤訊息。
        state.error = action.payload || 'Login failed';
      })

      // checkAuth 送出中：開啟 loading 並清錯誤。
      .addCase(checkAuth.pending, (state) => {
        // 顯示處理中。
        state.checking = true;
        // 清掉舊錯誤。
        state.error = null;
      })
      // checkAuth 成功：維持登入狀態。
      .addCase(checkAuth.fulfilled, (state, action) => {
        // 關閉 loading。
        state.checking = false;
        // 更新 token。
        state.token = action.payload.token;
        // 標記已登入。
        state.isAuthenticated = true;
      })
      // checkAuth 失敗：重置登入狀態並寫錯誤。
      .addCase(checkAuth.rejected, (state, action) => {
        // 關閉 loading。
        state.checking = false;
        // 清空 token。
        state.token = '';
        // 標記未登入。
        state.isAuthenticated = false;
        // 儲存錯誤訊息。
        state.error = action.payload || 'Auth check failed';
      })

      // logout 成功：清空所有登入資訊。
      .addCase(logout.fulfilled, (state) => {
        // 關閉 loading。
        state.checking = false;
        // 清空 token。
        state.token = '';
        // 標記未登入。
        state.isAuthenticated = false;
        // 清除錯誤訊息。
        state.error = null;
      });
  },
});

// 匯出 reducer 給 store 註冊。
export default AuthSlice.reducer;
