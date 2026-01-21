import ProductModal from "./ProductModal";
import Pagination from "./Pagination";

export default function Navbar({
  products,
  pageInfo,
  getData,
  onLogout,
  onOpenModal,
  onDetail,
  detailProduct,
  modalMode,
  isModalOpen,
  modalProduct,
  onCloseModal,
  onUpdateProduct,
  onDeleteProduct,
  onInputChange,
  onImageChange,
  onAddImage,
  onRemoveImage,
  onFileUpload,
}) {
  return (
    <>
      <div className="row m-0">
        {/* Sidebar */}
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
          >
            車輛管理頁面
          </button>
          <button
            className="nav-link mt-auto btn btn-danger text-white"
            type="button"
            onClick={onLogout}
          >
            登出
          </button>
        </div>

        {/* Main Content */}
        <div className="tab-content col-10 offset-2" id="v-pills-tabContent">
          <div
            className="tab-pane fade show active p-5"
            id="v-pills-home"
            role="tabpanel"
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
              <li>
                <h5 className="border-bottom">
                  Week4 updated 1/21 "建立分頁及 Modal 元件＋串接圖片上傳 API
                  功能以及新增一個自訂欄位"
                </h5>
              </li>
            </ol>
          </div>

          <div className="tab-pane fade" id="v-car-profile" role="tabpanel">
            <div className="row mt-5">
              <div className="col-12 p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="text-light">Latest Arrivals for Sale</h2>
                  <button
                    className="btn btn-primary fw-bold"
                    onClick={() => onOpenModal(null, "create")}
                  >
                    新增產品資料
                  </button>
                </div>

                <div className="row">
                  {products && products.length > 0 ? (
                    products.map((item) => (
                      <div key={item.id} className="col-md-4 mb-4">
                        <div className="card bg-dark text-light border-secondary h-100">
                          <div className="position-relative">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="card-img-top object-fit-cover"
                              style={{ height: "200px" }}
                              onClick={() => onDetail(item)}
                            />
                            <button
                              className="btn btn-light fw-bold btn-sm position-absolute bottom-0 end-0 m-2"
                              onClick={() => onDetail(item)}
                            >
                              詳細資訊
                            </button>
                          </div>
                          <div className="card-body">
                            <h5 className="card-title">{item.title}</h5>
                            <p className="card-text">
                              售價: {item.price.toLocaleString()} 元
                            </p>
                            {item.starRating && (
                              <p className="card-text">
                                期待星級:
                                <span className="text-warning ms-2">
                                  {"★".repeat(item.starRating)}
                                </span>
                                <span className="text-secondary">
                                  {"☆".repeat(5 - item.starRating)}
                                </span>
                              </p>
                            )}
                            <span
                              className={`badge py-2 px-2 ${item.is_enabled ? "bg-success" : "bg-danger"}`}
                            >
                              {item.is_enabled ? "庫存中" : "已售罄"}
                            </span>
                          </div>
                          <div className="card-footer border-secondary d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-warning btn-sm flex-fill"
                              onClick={() => onOpenModal(item, "edit")}
                            >
                              編輯
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm flex-fill"
                              onClick={() => onOpenModal(item, "delete")}
                            >
                              刪除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-light text-center py-5">
                      {" "}
                      沒有任何資料{" "}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <Pagination pageInfo={pageInfo} onPageChange={getData} />
              </div>

              {/* Detail Modal (Partial Overlay) */}
              {detailProduct && (
                <div
                  className="modal show d-block"
                  tabIndex={-1}
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
                  onClick={() => onDetail(null)}
                >
                  <div
                    className="modal-dialog modal-lg modal-dialog-centered"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-content border-0 shadow-lg bg-dark text-light">
                      <div className="modal-header border-secondary">
                        <h5 className="modal-title">{detailProduct.title}</h5>
                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          onClick={() => onDetail(null)}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-6">
                            <img
                              src={detailProduct.imageUrl}
                              className="img-fluid rounded mb-3"
                              alt={detailProduct.title}
                            />
                            {detailProduct.imagesUrl?.length > 0 && (
                              <div className="d-flex flex-wrap gap-2">
                                {detailProduct.imagesUrl.map((url, index) => (
                                  <img
                                    key={index}
                                    src={url}
                                    className="rounded"
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <span className="badge bg-warning text-dark mb-3">
                              {detailProduct.category}
                            </span>
                            <p>
                              <strong>商品描述：</strong>
                              {detailProduct.description}
                            </p>
                            <p>
                              <strong>商品內容：</strong>
                              {detailProduct.content}
                            </p>
                            {detailProduct.starRating && (
                              <p>
                                <strong>商品星級：</strong>
                                <span className="text-warning">
                                  {"★".repeat(detailProduct.starRating)}
                                </span>
                              </p>
                            )}
                            <div className="h4">
                              <del className="text-secondary h6">
                                ${detailProduct.origin_price?.toLocaleString()}
                              </del>
                              <span className="ms-2 fw-bold text-danger">
                                ${detailProduct.price?.toLocaleString()} 元
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        mode={modalMode}
        tempProduct={modalProduct}
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
        onInputChange={onInputChange}
        onImageChange={onImageChange}
        onAddImage={onAddImage}
        onRemoveImage={onRemoveImage}
        onFileUpload={onFileUpload}
      />
    </>
  );
}
