import { useEffect, useRef } from "react";

export default function ProductModal({
  mode,
  tempProduct,
  isOpen,
  onClose,
  onUpdateProduct,
  onInputChange,
  onImageChange,
  onAddImage,
  onRemoveImage,
  onDeleteProduct,
  onFileUpload,
}) {
  const modalRef = useRef(null);
  const bsModal = useRef(null);

  useEffect(() => {
    if (modalRef.current && !bsModal.current) {
      bsModal.current = new bootstrap.Modal(modalRef.current, {
        backdrop: "static",
        keyboard: false,
      });

      // 監聽 modal 隱藏事件，確保 backdrop 被清除
      modalRef.current.addEventListener('hidden.bs.modal', () => {
        // 移除所有 backdrop
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        // 恢復 body 的 overflow
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      });
    }

    // 清理函數
    return () => {
      if (bsModal.current) {
        bsModal.current.hide();
        bsModal.current.dispose();
        bsModal.current = null;
      }
      // 確保清除所有 backdrop
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      bsModal.current?.show();
    } else {
      bsModal.current?.hide();
    }
  }, [isOpen]);

  return (
    <div
      className="modal fade"
      ref={modalRef}
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div
        className={`modal-dialog ${mode === "delete" ? "modal-dialog-centered" : "modal-xl modal-dialog-centered modal-dialog-scrollable"}`}
      >
        <div className="modal-content border-0 shadow-lg">
          <div
            className={`modal-header ${mode === "delete" ? "bg-danger" : mode === "create" ? "bg-primary" : "bg-warning"} text-white`}
          >
            <h5 className="modal-title" id="productModalLabel">
              {mode === "create" && "新增產品"}
              {mode === "edit" && "編輯產品"}
              {mode === "delete" && "刪除產品"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {mode === "delete" ? (
              <p className="h4">
                是否刪除{" "}
                <span className="text-danger fw-bold">
                  {tempProduct?.title}
                </span>
                ？ (刪除後將無法恢復)
              </p>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      主圖網址
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      value={tempProduct?.imageUrl || ""}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="file-to-upload" className="form-label">
                      或者是 上傳圖片
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="file-to-upload"
                      onChange={onFileUpload}
                    />
                  </div>
                  {tempProduct?.imageUrl && (
                    <img
                      src={tempProduct.imageUrl}
                      alt="主圖"
                      className="img-fluid mb-3 rounded"
                    />
                  )}

                  {/* 多圖新增 */}
                  <div className="mb-3">
                    <label className="form-label">其他圖片</label>
                    {tempProduct?.imagesUrl?.map((url, index) => (
                      <div key={index} className="mb-2">
                        <input
                          type="text"
                          className="form-control mb-1"
                          placeholder={`圖片網址 ${index + 1}`}
                          value={url}
                          onChange={(e) => onImageChange(e, index)}
                        />
                        {url && (
                          <img
                            src={url}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2 rounded"
                          />
                        )}
                      </div>
                    ))}
                    <div className="d-flex gap-2">
                      {(!tempProduct?.imagesUrl ||
                        tempProduct.imagesUrl.length < 5) && (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={onAddImage}
                        >
                          新增圖片
                        </button>
                      )}
                      {tempProduct?.imagesUrl?.length > 0 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={() => onRemoveImage()}
                        >
                          取消最後一張
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      placeholder="請輸入標題"
                      value={tempProduct?.title || ""}
                      onChange={onInputChange}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="category"
                        name="category"
                        placeholder="請輸入分類"
                        value={tempProduct?.category || ""}
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="unit"
                        name="unit"
                        placeholder="請輸入單位"
                        value={tempProduct?.unit || ""}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="origin_price"
                        name="origin_price"
                        placeholder="請輸入原價"
                        min="0"
                        value={tempProduct?.origin_price || ""}
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        placeholder="請輸入售價"
                        min="0"
                        value={tempProduct?.price || ""}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      placeholder="請輸入產品描述"
                      value={tempProduct?.description || ""}
                      onChange={onInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      className="form-control"
                      id="content"
                      name="content"
                      rows="3"
                      placeholder="請輸入說明內容"
                      value={tempProduct?.content || ""}
                      onChange={onInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="is_enabled"
                        name="is_enabled"
                        checked={!!tempProduct?.is_enabled}
                        onChange={onInputChange}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否有庫存
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="starRating" className="form-label">
                      期待商品星級 (1-5)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="starRating"
                      name="starRating"
                      min="1"
                      max="5"
                      placeholder="請輸入星級"
                      value={tempProduct?.starRating || ""}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-top bg-light">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              取消
            </button>
            {mode === "delete" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={onDeleteProduct}
              >
                確認刪除
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onUpdateProduct}
              >
                確認
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
