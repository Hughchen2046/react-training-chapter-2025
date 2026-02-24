import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../features/auth/AuthThunk';
// import { login } from '../../features/auth/AuthSlice';

const Login = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // const { success, error: notifyError } = useMessage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (token) navigate('/admin/products', { replace: true });
  }, [token]);
  const onSubmit = async (data) => {
    try {
      await dispatch(loginThunk(data));
    } catch (err) {
      console.log(err);
      // if (login.fulfilled.match(result)) {
      //   success('登入成功');
      //   navigate('/admin/products', { replace: true });
      // } else {
      //   throw new Error(result.payload || '登入失敗');
      // }
      // notifyError('登入失敗', err.message || '請稍後再試');
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
