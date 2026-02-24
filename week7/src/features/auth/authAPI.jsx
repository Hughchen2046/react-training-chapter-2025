import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const API_BASE = import.meta.env.VITE_API_BASE;

const setAuthCookiesAndHeaders = (token, expired) => {
  document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
  axios.defaults.headers.common.Authorization = `${token}`;
};

const MySwal = withReactContent(Swal);

//登入
export async function signin({ username, password }) {
  // try {
  const res = await axios.post(`${API_BASE}/admin/signin`, { username, password });
  console.log('signin res:', res.data);
  const { token, expired } = res.data;
  setAuthCookiesAndHeaders(token, expired);
  return res.data; // 回傳整個 response.data，讓 Thunk 可以使用 user 資料

  //   MySwal.fire({
  //     icon: 'success',
  //     title: '登入成功',
  //     showConfirmButton: false,
  //     timer: 1500,
  //   });
  //   navigate('/admin/products', { replace: true });
  // } catch (error) {
  //   MySwal.fire({
  //     icon: 'error',
  //     title: '登入失敗',
  //     text: error.response.data.error.message,
  //   });
  // }
}

//確認使用者
export async function checkUser({ token }) {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios.post(`${API_BASE}/api/user/check`, {}, config);
  return res.data;
}

//登出
export async function logout({ token }) {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios.post(`${API_BASE}/logout`, {}, config);
  return res.data;
}

// User click login
//    ↓
// loginThunk
//    ↓
// LoginAPI : POST /admin/signin
//    ↓
// setUser(user)
