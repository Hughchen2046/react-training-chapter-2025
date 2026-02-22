import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../plugins/Loading';
import ProductModal from './ProductModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
const AdminProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null); //分頁資訊
  const [currentPage, setCurrentPage] = useState(1); //目前頁面
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [modalProduct, setModalProduct] = useState(null);

  const MySwal = withReactContent(Swal);

  // 預設產品資料格式
  const dataFormat = {
    title: '',
    category: '',
    origin_price: 0,
    price: 0,
    unit: '',
    description: '',
    content: '',
    is_enabled: 1,
    imageUrl: '',
    imagesUrl: [],
  };

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = `${token}`;

    const checkAdmin = async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
      } catch (err) {
        navigate('/');
        MySwal.fire({
          icon: 'error',
          title: '權限不足',
          text: err.response.data.message,
        });
      }
    };
    checkAdmin();
  }, [navigate]);

  const getProducts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      // console.log(res.data);
      setProducts(res.data);
      setPagination(res.data.pagination); //分頁資訊
      setCurrentPage(page); //目前頁面
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: 'error',
        title: '取得產品資料失敗',
        text: err.response?.data?.message || '網路錯誤',
      });
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const openModal = (product, mode) => {
    setModalMode(mode);
    setModalProduct(product ? { ...product, imagesUrl: product.imagesUrl || [] } : dataFormat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 處理輸入變更
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModalProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  // 處理圖片 URL 變更
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    setModalProduct((prev) => {
      const newImagesUrl = [...prev.imagesUrl];
      newImagesUrl[index] = value;
      return { ...prev, imagesUrl: newImagesUrl };
    });
  };

  // 新增圖片欄位
  const handleAddImage = () => {
    setModalProduct((prev) => ({
      ...prev,
      imagesUrl: [...prev.imagesUrl, ''],
    }));
  };

  // 移除圖片欄位
  const handleRemoveImage = () => {
    setModalProduct((prev) => {
      const restImages = [...(prev.imagesUrl || [])];
      restImages.pop();
      return { ...prev, imagesUrl: restImages };
    });
  };

  // 檔案上傳
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file-to-upload', file);

    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData);
      const imageUrl = res.data.imageUrl;
      setModalProduct((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
      MySwal.fire({
        icon: 'success',
        title: '上傳成功',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: '上傳失敗',
        text: error.response?.data?.message || '網路錯誤',
      });
    }
  };

  // 更新或新增產品
  const handleUpdateProduct = async () => {
    let api = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = 'post';

    if (modalMode === 'edit') {
      api = `${API_BASE}/api/${API_PATH}/admin/product/${modalProduct.id}`;
      method = 'put';
    }

    const payload = {
      data: {
        ...modalProduct,
        origin_price: Number(modalProduct.origin_price),
        price: Number(modalProduct.price),
        starRating: Number(modalProduct.starRating || 5),
      },
    };

    try {
      setLoading(true);
      const res = await axios[method](api, payload);
      MySwal.fire({
        icon: 'success',
        title: modalMode === 'edit' ? '更新成功' : '新增成功',
        text: res.data.message,
      });
      closeModal();
      getProducts(currentPage);
      setLoading(false);
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: 'error',
        title: modalMode === 'edit' ? '更新失敗' : '新增失敗',
        text: err.response?.data?.message || '編輯失敗',
      });
      setLoading(false);
    }
  };

  // 刪除產品
  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${modalProduct.id}`
      );
      MySwal.fire({
        icon: 'success',
        title: '刪除成功',
        text: res.data.message,
      });
      closeModal();
      getProducts(currentPage);
      setLoading(false);
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: 'error',
        title: '刪除失敗',
        text: err.response?.data?.message || '刪除失敗',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts(currentPage);
  }, []);

  return loading ? (
    <div>
      <Loading />
    </div>
  ) : (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-black text-gradient">車款管理</h2>
          <button className="btn btn-aurora" onClick={() => openModal(null, 'create')}>
            + 新增車款
          </button>
        </div>

        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th className="text-center">車款名稱</th>
                <th className="text-center">車款類別</th>
                <th className="text-center">原價</th>
                <th className="text-center">價格</th>
                <th className="text-center">狀態</th>
                <th className="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {(products.products || []).map((product) => (
                <tr key={product.id}>
                  <td className="fw-bold text-white">{product.title}</td>
                  <td>{product.category}</td>
                  <td>
                    <span className="text-aurora fw-bold">${product.origin_price}</span>
                  </td>
                  <td>
                    <span className="text-aurora fw-bold">${product.price}</span>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge ${product.is_enabled === 0 ? 'text-secondary border-secondary' : 'text-success border-success'} bg-opacity-10 text-opacity-100 border border-current`}
                    >
                      {product.is_enabled === 0 ? '未上架' : '已上架'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-aurora-outline border-opacity-10"
                        onClick={() => openModal(product, 'edit')}
                      >
                        編輯
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger border-opacity-10"
                        onClick={() => openModal(product, 'delete')}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分頁控制 */}
        {pagination && (
          <div className="mt-4 d-flex justify-content-between align-items-center px-2">
            <span className="text-secondary small">
              第 {pagination.current_page} 頁，共 {pagination.total_pages} 頁
            </span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-aurora-outline"
                onClick={() => getProducts(currentPage - 1)}
                disabled={!pagination.has_pre} //分頁資訊有has_pre的設定
              >
                上一頁
              </button>
              <button
                className="btn btn-sm btn-aurora-outline"
                onClick={() => getProducts(currentPage + 1)}
                disabled={!pagination.has_next} //分頁資訊有has_next的設定
              >
                下一頁
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductModal
        mode={modalMode}
        tempProduct={modalProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        onFileUpload={handleFileUpload}
      />
    </>
  );
};

export default AdminProduct;
