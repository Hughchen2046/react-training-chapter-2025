import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const setAuthCookiesAndHeaders = (token, expired) => {
  document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
  axios.defaults.headers.common.Authorization = `${token}`;
};

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

      navigate("/admin/products");
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="glass-card text-center">
            <h1 className="h2 fw-bold text-gradient mb-4">MEMBER ACCESS</h1>
            <p className="text-secondary small mb-5">Enter your credentials to manage your collection.</p>
            
            <form id="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 text-start">
                <label className="text-secondary small fw-semibold mb-2 ms-2">EMAIL ADDRESS</label>
                <input
                  type="email"
                  className={`glass-input ${errors.username ? "border-danger" : ""}`}
                  placeholder="name@auramotors.com"
                  {...register("username", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.username && (
                  <div className="text-danger small mt-1 ms-2">{errors.username.message}</div>
                )}
              </div>

              <div className="mb-5 text-start">
                <label className="text-secondary small fw-semibold mb-2 ms-2">PASSPHRASE</label>
                <input
                  type="password"
                  className={`glass-input ${errors.password ? "border-danger" : ""}`}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <div className="text-danger small mt-1 ms-2">{errors.password.message}</div>
                )}
              </div>

              <button
                className="btn btn-aurora w-100 py-3 mb-4"
                type="submit"
              >
                AUTHORIZE
              </button>

              <div className="d-flex justify-content-between align-items-center">
                <span className="text-secondary small">Unauthorized access is strictly monitored.</span>
              </div>
            </form>
          </div>
          <p className="mt-5 text-center text-secondary opacity-50 small">&copy; 2025 AURA MOTORS - VELOCITY REDEFINED</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
