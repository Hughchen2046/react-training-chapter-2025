// 匯入 React 的 useState 來管理表單狀態。
import { useState } from 'react';
// 匯入 Redux hooks 取得 dispatch 與 store 狀態。
import { useDispatch, useSelector } from 'react-redux';
// 匯入 auth 相關 thunk actions。
import { login, checkAuth, logout } from './AuthSlice';

// 定義認證測試頁元件。
// 匯出元件供路由或頁面使用。

export default function AuthRender() {
  // 取得 Redux dispatch 函式。
  const dispatch = useDispatch();
  // 從 auth slice 讀取畫面需要的狀態。
  const { token, isAuthenticated, checking, error } = useSelector((state) => state.auth);

  // 建立本地表單狀態，儲存帳號與密碼。
  const [form, setForm] = useState({
    // 初始帳號為空字串。
    username: '',
    // 初始密碼為空字串。
    password: '',
  });

  // 共用欄位變更事件處理。
  const onChange = (e) => {
    // 從事件目標取出欄位名和值。
    const { name, value } = e.target;
    // 用欄位名動態更新對應值。
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 表單送出時執行登入流程。
  const onLogin = async (e) => {
    // 阻止表單預設送出刷新頁面。
    e.preventDefault();
    // 派發登入 thunk 並等待完成。
    await dispatch(login(form));
  };

  // 回傳畫面 JSX。
  return (
    // 最外層容器，提供整體留白。
    <div style={{ padding: 24 }}>
      {/* 顯示頁面標題。 */}
      <h2>Auth RTK Test</h2>

      {/* 登入表單，送出時呼叫 onLogin。 */}
      <form onSubmit={onLogin} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        {/* 帳號輸入框，綁定 username。 */}
        <input
          name="username"
          type="email"
          placeholder="Email"
          value={form.username}
          onChange={onChange}
        />
        {/* 密碼輸入框，綁定 password。 */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
        {/* 登入按鈕，checking 時禁用。 */}
        <button type="submit" disabled={checking}>
          {/* 依 checking 顯示 loading 或登入文案。 */}
          {checking ? 'Loading...' : 'Login (Thunk)'}
        </button>
      </form>

      {/* 功能按鈕區：驗證與登出。 */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        {/* 手動觸發 checkAuth thunk。 */}
        <button onClick={() => dispatch(checkAuth())} disabled={checking}>
          {/* checkAuth 按鈕文字。 */}
          checkAuth
        </button>
        {/* 觸發 logout thunk。 */}
        <button onClick={() => dispatch(logout())} disabled={checking}>
          {/* logout 按鈕文字。 */}
          logout
        </button>
      </div>

      {/* 分隔線。 */}
      <hr style={{ margin: '16px 0' }} />
      {/* 顯示是否已登入。 */}
      <p>isAuthenticated: {String(isAuthenticated)}</p>
      {/* 顯示請求進行中狀態。 */}
      <p>checking: {String(checking)}</p>
      {/* 顯示 token 前 12 碼，避免整段外露。 */}
      <p>token: {token ? `${token.slice(0, 12)}...` : '(empty)'}</p>
      {/* 顯示錯誤訊息或 none。 */}
      <p style={{ color: 'crimson' }}>error: {error || '(none)'}</p>
    </div>
  );
}
