import * as bootstrap from "bootstrap";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const dataFormat = {
  id: "",
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: false,
  imagesUrl: [],
};

const apiPath = import.meta.env.VITE_API_PATH;
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Navbar({ products, setProducts, getData, onLogout }) {
  const [tempProduct, setTempProduct] = useState(null);
  const modalRef = useRef(null);
  const dataModalRef = useRef(null);
  const handleDelete = async (id) => {
    if (!window.confirm("確定要刪除此產品嗎?")) return;
    try {
      await axios.delete(`${baseUrl}/api/${apiPath}/admin/product/${id}`);
      alert("刪除成功");
      getData();
    } catch (error) {
      alert("刪除失敗: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    dataModalRef.current = new bootstrap.Modal(modalRef.current);
    document
      .querySelector("#addDataModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  const openDataModal = () => {
    dataModalRef.current.show();
  };

  const closeDataModal = () => {
    dataModalRef.current.hide();
  };

  return (
    <>
      <div className="row m-0">
        <div
          className="col-2 fw-bold nav flex-column justify-content-start nav-pills me-3 py-2 px-3 gap-2 fs-5 border-end vh-100 bg-nav-theme position-fixed top-0 start-0"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          <button
            className="nav-link active"
            id="v-pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-pills-home"
            type="button"
            role="tab"
            aria-controls="v-pills-home"
            aria-selected="true"
          >
            Home
          </button>
          <button
            className="nav-link"
            id="v-car-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-car-profile"
            type="button"
            role="tab"
            aria-controls="v-car-profile"
            aria-selected="false"
          >
            車輛管理頁面
          </button>
          <button
            className="nav-link"
            id="v-pills-messages-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-pills-messages"
            type="button"
            role="tab"
            aria-controls="v-pills-messages"
            aria-selected="false"
          >
            Messages
          </button>
          <button
            className="nav-link"
            id="v-pills-settings-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-pills-settings"
            type="button"
            role="tab"
            aria-controls="v-pills-settings"
            aria-selected="false"
          >
            Settings
          </button>
          <button
            className="nav-link mt-auto btn btn-danger btn-hover-white"
            type="button"
            onClick={onLogout}
          >
            登出
          </button>
        </div>
        <div className="tab-content col-10 offset-2" id="v-pills-tabContent">
          <div
            className="tab-pane fade show active p-5"
            id="v-pills-home"
            role="tabpanel"
            aria-labelledby="v-pills-home-tab"
            tabIndex="0"
          >
            <ol className="text-light text-start">
              <li>
                <h5 className="border-bottom">Week2 updated 1/10 "資料導入"</h5>
              </li>
              <li>
                <h5 className="border-bottom">
                  Week3 updated 1/16 "車輛管理頁面"
                </h5>
              </li>
            </ol>
          </div>
          <div
            className="tab-pane fade"
            id="v-car-profile"
            role="tabpanel"
            aria-labelledby="v-car-profile-tab"
            tabIndex="0"
          >
            <div className="row mt-5">
              <div className="col-12">
                <h2 className="text-light mb-3">Latest Arrivals for Sale</h2>
                <button
                  className=" position-fixed z-1 fw-bold top-0 end-0 my-3 me-3 btn btn-light"
                  onClick={() => openDataModal()}
                >
                  新增產品資料
                </button>
                <div className="d-flex justify-content-center gap-2 mb-4">
                  <div className="f-box bg-success rounded-1"></div>
                  <div className="f-box bg-light rounded-1"></div>
                  <div className="f-box bg-danger rounded-1"></div>
                </div>
                <div className="row">
                  {products && products.length > 0 ? (
                    products.map((item) => (
                      <div key={item.id} className="col-4 mb-3">
                        <div className="position-relative mb-2">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="images px-3"
                            onClick={() => setTempProduct(item)}
                          />
                          <button
                            className="btn btn-primary me-3 fw-bold position-absolute bottom-0 end-0"
                            onClick={() => setTempProduct(item)}
                          >
                            詳細資訊
                          </button>
                        </div>

                        <h5 className="text-light mb-2">{item.title}</h5>
                        <p className="text-light mb-2">
                          售價: {item.price.toLocaleString()} 元
                        </p>
                        <span
                          className={
                            item.is_enabled
                              ? "badge fs-6 py-2 bg-warning mb-3"
                              : "badge fs-6 py-2 bg-danger mb-3"
                          }
                        >
                          {item.is_enabled ? "啟用中:有庫存" : "未啟用:缺貨中"}
                        </span>
                        <br />
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Basic mixed styles example"
                        >
                          <button type="button" className="btn btn-success">
                            編輯
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            刪除
                          </button>
                        </div>
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
          <div
            className="tab-pane fade"
            id="v-pills-messages"
            role="tabpanel"
            aria-labelledby="v-pills-messages-tab"
            tabIndex="0"
          >
            <h5 className="text-light">建構中無資料</h5>
          </div>
          <div
            className="tab-pane fade"
            id="v-pills-settings"
            role="tabpanel"
            aria-labelledby="v-pills-settings-tab"
            tabIndex="0"
          >
            <h5 className="text-light">建構中無資料</h5>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="addDataModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="addDataModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-xl fw-bold modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header bg-primary">
              <h1 className="modal-title fs-6 fw-bold" id="addDataModalLabel">
                新增產品資訊
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => closeDataModal()}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="imageUrl"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img className="img-fluid" alt="主圖" />
                  </div>
                  <div>
                    <div className="mb-2">
                      <input type="text" />
                      <img className="img-preview mb-2" />
                    </div>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-outline-primary btn-sm w-100">
                        新增圖片
                      </button>
                      <button className="btn btn-outline-danger btn-sm w-100">
                        取消圖片
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary fw-bold"
                data-bs-dismiss="modal"
                onClick={() => closeDataModal()}
              >
                取消
              </button>
              <button type="submit" className="btn btn-primary fw-bold">
                送出
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
