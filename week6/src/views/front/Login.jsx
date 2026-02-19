import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const API_BASE = import.meta.env.VITE_API_BASE;

const setAuthCookiesAndHeaders = (token, expired) => {
  document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
  axios.defaults.headers.common.Authorization = `${token}`;
};

const MySwal = withReactContent(Swal);

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, data);
      const { token, expired } = response.data;
      setAuthCookiesAndHeaders(token, expired);

      MySwal.fire({
        icon: 'success',
        title: '登入成功',
        showConfirmButton: false,
        timer: 1500,
      });

      navigate('/admin/products', { replace: true });
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: '登入失敗',
        text: error.response.data.error.message,
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="glass-card text-center">
            <h1 className="h2 fw-bold text-gradient mb-4">貴賓登入</h1>
            <p className="text-secondary small mb-5">請輸入您的登入資訊</p>

            <form id="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 text-start">
                <label className="text-secondary small fw-semibold mb-2 ms-2">EMAIL ADDRESS</label>
                <input
                  type="email"
                  className={`glass-input ${errors.username ? 'border-danger' : ''}`}
                  placeholder="name@auramotors.com"
                  {...register('username', {
                    required: '必填，請輸入 Email',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email 格式錯誤',
                    },
                  })}
                />
                {errors.username && (
                  <div className="text-danger small mt-1 ms-2">{errors.username.message}</div>
                )}
              </div>

              <div className="mb-5 text-start">
                <label className="text-secondary small fw-semibold mb-2 ms-2">PASSWORD</label>
                <input
                  type="password"
                  className={`glass-input ${errors.password ? 'border-danger' : ''}`}
                  placeholder="••••••••"
                  {...register('password', {
                    required: '必填，請輸入密碼',
                    minLength: {
                      value: 8,
                      message: '密碼至少 8 個字元',
                    },
                  })}
                />
                {errors.password && (
                  <div className="text-danger small mt-1 ms-2">{errors.password.message}</div>
                )}
              </div>

              <button className="btn btn-aurora w-100 py-3 mb-4" type="submit">
                登入
              </button>

              <div className="d-flex justify-content-between align-items-center">
                <span className="text-secondary small">無法登入？ 請聯繫客服</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
