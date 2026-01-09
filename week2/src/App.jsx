import { useState, useEffect } from "react";
import axios from "axios";
import "./assets/style.css";

const apiPath = import.meta.env.VITE_API_PATH;
const baseUrl = import.meta.env.VITE_BASE_URL;

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  // 檢查登入狀態
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      axios.defaults.headers.common.Authorization = token;
      checkLoginStatus();
    }
  }, []);

  const checkLoginStatus = async () => {
    try {
      await axios.post(`${baseUrl}/api/user/check`);
      setisAuth(true);
      getData();
    } catch (error) {
      console.error("自動登入失敗", error);
    }
  };

  async function checkLogin() {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];
      axios.defaults.headers.common.Authorization = token;

      await axios.post(`${baseUrl}/api/user/check`);
      alert("用戶已登入成功");
    } catch (error) {
      alert("驗證帳號失敗");
      console.error(error);
    }
  }

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/${apiPath}/admin/products`,
      );
      setProducts(response.data.products);
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;

      axios.defaults.headers.common.Authorization = `${token}`;

      getData();

      setisAuth(true);
    } catch (error) {
      alert(
        "登入失敗: " +
          (error.response?.data?.message || "網路錯誤或伺服器異常"),
      );
    }
  };

  return (
    <>
      {isAuth ? (
        <div className="container">
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary my-2"
              type="button"
              id="check"
              onClick={checkLogin}
            >
              確認是否登入成功?
            </button>
          </div>

          <div className="row mt-5">
            <div className="col-12">
              <h2 className="text-light mb-3">Latest Arrivals for Sale</h2>
              <div className="d-flex justify-content-center gap-2 mb-4">
                <div className="f-box bg-success rounded-1"></div>
                <div className="f-box bg-light rounded-1"></div>
                <div className="f-box bg-danger rounded-1"></div>
              </div>
              <div className="row">
                {products && products.length > 0 ? (
                  products.map((item) => (
                    <div key={item.id} className="col-4 mb-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="images mb-2"
                      />
                      <h3 className="text-light mb-2">{item.title}</h3>
                      <p className="text-light mb-2" style={{ height: "50px" }}>
                        {item.description}
                      </p>
                      <span className="badge bg-danger">
                        {item.is_enabled ? "有現貨庫存" : "缺貨中"}
                      </span>
                      <br />
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => setTempProduct(item)}
                      >
                        詳細資訊
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-light"> 沒有任何資料 </div>
                )}
              </div>
            </div>

            {tempProduct && (
              <div
                className="modal show d-block"
                tabIndex={-1}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                onClick={() => setTempProduct(null)}
              >
                <div
                  className="modal-dialog modal-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-content border-0 shadow-lg bg-dark text-light">
                    <div className="modal-header border-secondary">
                      <h5 className="modal-title">{tempProduct.title}</h5>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="modal"
                        onClick={() => setTempProduct(null)}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6">
                          <img
                            src={tempProduct.imageUrl}
                            className="img-fluid rounded mb-3"
                            alt={`${tempProduct.title}產品圖`}
                          />
                          <h5 className="mt-2">更多圖片：</h5>
                          <div className="d-flex flex-wrap gap-2">
                            {tempProduct.imagesUrl.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                className="rounded"
                                style={{
                                  height: "100px",
                                  width: "100px",
                                  objectFit: "cover",
                                }}
                                alt={`${tempProduct.title}第${index + 1}張圖片`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <span className="rounded-pill bg-warning p-2 mb-5">
                            {tempProduct.category}
                          </span>
                          <p className="card-text mt-3 text-start">
                            <strong>商品描述：</strong>
                            {tempProduct.description}
                          </p>
                          <p className="card-text text-start">
                            <strong>商品內容：</strong>
                            {tempProduct.content}
                          </p>
                          <div className="h4 mt-4">
                            <del className="text-secondary h6">
                              ${tempProduct.origin_price?.toLocaleString()}
                            </del>
                            <span className="ms-2 fw-bold text-danger">
                              ${tempProduct.price?.toLocaleString()} 元
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-secondary">
                      <button
                        type="button"
                        className="btn btn-outline-light"
                        onClick={() => setTempProduct(null)}
                      >
                        關閉
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="text-light mb-3">Super Car Shops</h1>
            <div className="d-flex justify-content-center gap-2 mb-3">
              <div className="f-box bg-success rounded-1"></div>
              <div className="f-box bg-light rounded-1"></div>
              <div className="f-box bg-danger rounded-1"></div>
            </div>
            <h2 className="h3 mb-3 font-weight-normal text-light">
              尊貴的客戶,請先登入...
            </h2>
            <div className="col-8">
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
                  className="btn btn-lg btn-silver w-100 mt-3"
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
      )}
    </>
  );
}

export default App;
