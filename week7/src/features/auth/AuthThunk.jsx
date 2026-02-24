// 啟用Thunk來管理流程; 元件 dispatch(loadingStarted("auth")) => slice
// 非同步 try { await loginApi() } catch {}
// 成功：dispatch(setUser(user)) + dispatch(messages.push(success))  => slice
// 失敗：dispatch(messages.push(error)) => slice
// finally { dispatch(loadingStopped("auth")) } => slice
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setSession, clearAuth, setAuthError } from './AuthSlice';
import { loadingStarted, loadingStopped } from '../loading/LoadingSlice';
// import { messagePushed } from '../message/MessageSlice';
import { signin, checkUser, logout } from './authAPI';

//登入的流程
export const loginThunk =
  ({ username, password }) =>
  async (dispatch) => {
    dispatch(loadingStarted('auth'));

    try {
      const data = await signin({ username, password });
      const { token, uid, expired, success, message } = data || {};
      console.log('loginThunk data:', data);

      if (!success || !token) {
        const msg = message || '登入失敗';
        throw new Error(msg);
      }

      dispatch(setSession({ token, uid, expired, success, message }));
      localStorage.setItem('token', token);

      // dispatch(
      //   messagePushed({
      //     id: crypto.randomUUID(),
      //     type: 'success',
      //     text: '登入成功',
      //   })
      // );

      // ✅ 這裡「先不做 navigate」
      // 因為那是 UI 行為，下一段我們放在 component / router 做

      return { token, uid, expired, success, message }; // 讓 component 可以知道成功（可選）
    } catch (err) {
      dispatch(setAuthError(err.message || '登入失敗'));
      localStorage.removeItem('token');
      dispatch(clearAuth());
      // dispatch(
      //   messagePushed({
      //     id: crypto.randomUUID(),
      //     type: 'error',
      //     text: err?.message || '登入失敗',
      //   })
      // );

      //   throw err;
    } finally {
      dispatch(loadingStopped('auth'));
    }
  };

//剛進入網頁的確認
export const checkThunk = () => async (dispatch, getState) => {
  dispatch(loadingStarted('global'));
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(clearAuth());
      return;
    }

    await checkUser({ token });

    const state = getState();
    // console.log('checkThunk state after checkUser:', state);
    const uid = state.auth.uid;
    const success = state.auth.success;
    dispatch(setSession({ token, uid, success }));
  } catch (err) {
    console.error('checkThunk error:', err);
    dispatch(clearAuth());
    localStorage.removeItem('token');
  } finally {
    dispatch(loadingStopped('global'));
  }
};

//登出的流程
export const logoutThunk = () => async (dispatch, getState) => {
  dispatch(loadingStarted('auth'));

  try {
    const token = getState().auth.token;
    const data = await logout({ token });
    console.log('logoutThunk data:', data);
    dispatch(clearAuth());
    localStorage.removeItem('token');

    // dispatch(
    //   messagePushed({
    //     id: crypto.randomUUID(),
    //     type: "success",
    //     text: "已登出",
    //   })
    // );
  } catch (err) {
    console.error('logoutThunk error:', err);
    // dispatch(
    //   messagePushed({
    //     id: crypto.randomUUID(),
    //     type: "error",
    //     text: err?.message || "登出失敗",
    //   })
    // );
    // throw err;
  } finally {
    dispatch(loadingStopped('auth'));
  }
};
