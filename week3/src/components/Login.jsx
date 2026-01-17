import * as bootstrap from "bootstrap";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/style.css";

const apiPath = import.meta.env.VITE_API_PATH;
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  //要調整 管理驗證登入 -> 頁面重整時,axios預設headers會被清空,要從cookie中取出token並設定
  //頁面重整或載入
  //useEffect啟動
  // 檢查cookie是否有token
  //有token -> 設置axios Authorization header -> 呼叫 checkLogin API;
  //checkLogin 成功 -> 更新isAuth為 true -> 呼叫 getData API;
  //checkLogin 失敗 -> 更新isAuth為 false -> 顯示登入畫面

  //取得產品資料 API
  const getData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/${apiPath}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  // 登出
  const handleLogout = () => {
    document.cookie =
      "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete axios.defaults.headers.common["Authorization"];
    setisAuth(false);
    alert("已登出");
  };

  //登入API
  const checkLogin = async () => {
    try {
      await axios.post(`${baseUrl}/api/user/check`);
      setisAuth(true); //登入異常時設定isAuth為true
      getData(); //登入成功時呼叫getData
    } catch (error) {
      console.error(error);
      setisAuth(false); //登入異常時確保isAuth為false
    }
  };

  //確認有token,才呼叫登入API
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1]; //助教的從cookie中取出token

    if (token) {
      //如果token正確,設定axios Authorization header
      axios.defaults.headers.common["Authorization"] = token;
    }
    checkLogin(); //呼叫登入API
  }, []);

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
      setisAuth(true);
      getData();
      alert("登入成功");
    } catch (error) {
      alert("登入失敗: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      {isAuth ? (
        <div className="container-fluid p-0">
          <Navbar
            products={products} //傳遞詳細產品資料
            setProducts={setProducts} //傳遞詳細產品資料
            getData={getData} //傳遞產品資料
            onLogout={handleLogout} //傳遞登出功能
          />
        </div>
      ) : (
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
      )}
    </>
  );
}
