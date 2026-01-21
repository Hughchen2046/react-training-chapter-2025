import { useState } from "react";
import axios from "axios";
import "../assets/style.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Login({ setIsAuth, getData }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;
      setIsAuth(true);
      getData();
      alert("登入成功");
    } catch (error) {
      alert("登入失敗: " + (error.response?.data?.message || "網路錯誤"));
    }
  };

  return (
    <div className="container-fluid login">
      <div className="row">
        <div className="col-12 rounded-5 p-5 dark-blur-frame">
          <h1 className="text-light mb-3">Super Car Shops</h1>
          <div className="d-flex justify-content-center gap-2 mb-3">
            <div className="f-box bg-success rounded-1"></div>
            <div className="f-box bg-light rounded-1"></div>
            <div className="f-box bg-danger rounded-1"></div>
          </div>
          <h2 className="h3 mb-3 font-weight-normal text-light">
            尊貴的客戶,請先登入...
          </h2>
          <div>
            <form id="form" className="form-signin" onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  placeholder="name@example.com"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
              <button
                className="btn btn-lg text-white btn-gray w-100 mt-3"
                type="submit"
              >
                登入
              </button>
            </form>
          </div>
        </div>
        <p className="mt-5 mb-3 text-muted text-light">
          &copy; 2025~∞ - 六角學院
        </p>
      </div>
    </div>
  );
}
