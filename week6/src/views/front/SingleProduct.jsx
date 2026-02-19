import { useLocation, useParams, useOutletContext } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Loading } from '../../plugins/Loading';
import { SquarePlus, SquareMinus } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const SingleProduct = () => {
  const location = useLocation(); // 獲取location狀態
  const { id } = useParams(); // 獲取url中的id
  const [product, setProduct] = useState(location.state?.productData?.product || null); //繼承location狀態取得資料
  const [loading, setLoading] = useState(!product); // 讀取loading狀態
  const [error, setError] = useState(null); // 讀取error狀態
  const [qty, setQty] = useState(1); // 購物車數量
  const [success, setSuccess] = useState(null); // 購物車成功加入
  const [cartQty, setCartQty] = useState(0); // 購物車中已有的數量
  const [cartItemId, setCartItemId] = useState(null); // 購物車項目 ID

  //  refreshCart nav購物車數量更新 + OutletContext資料
  const outletContext = useOutletContext();
  const refreshCart = outletContext?.refreshCart;

  // 獲取購物車中此商品的數量
  const getCartQty = useCallback(async () => {
    if (!id) return;

    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);

      const cartItem = response.data.data.carts.find((item) => item.product.id === id);

      if (cartItem) {
        setCartQty(cartItem.qty);
        setCartItemId(cartItem.id);
      } else {
        setCartQty(0);
        setCartItemId(null);
      }
    } catch (error) {
      console.error('獲取購物車失敗:', error);
      setCartQty(0);
      setCartItemId(null);
    }
  }, [id]);

  // 獲取購物車數量：初始載入、id 改變、success 改變時
  useEffect(() => {
    if (id) {
      getCartQty();
    }
  }, [id, success, getCartQty]); // 依賴 id, success 和 getCartQty

  useEffect(() => {
    // 如果有 location.state 的產品資料，優先使用
    if (location.state?.productData?.product && !product) {
      setProduct(location.state.productData.product);
      setLoading(false);
      return;
    }

    // 如果已經有產品資料且 ID 相同，不需要重新獲取
    if (product && product.id === id) {
      setLoading(false);
      return;
    }

    // 獲取產品資料
    const getProduct = async () => {
      try {
        setLoading(true);
        // 因為單一產品 API 不回傳 num，改為從產品列表獲取
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        const foundProduct = res.data.products.find((p) => p.id === id);

        if (foundProduct) {
          setProduct(foundProduct);
          setError(null);
        } else {
          setError('找不到該產品');
        }
      } catch (err) {
        console.error('取得產品資料失敗', err);
        setError('無法載入產品資料，請稍後再試。');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProduct();
    }
  }, [id]); // id 改變時重新獲取

  useEffect(() => {
    if (!success) return;
    MySwal.fire({
      icon: 'success',
      title: '成功加入購物車',
      showConfirmButton: false,
      timer: 1500,
    });
  }, [success]);

  // 購物車按鈕
  const addQty = () => {
    const maxAvailable = (product.num || 0) - cartQty; // 剩餘可購買數量
    if (qty < maxAvailable) {
      setQty(qty + 1);
    }
  };

  const subQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleQty = (e) => {
    const value = parseInt(e.target.value);
    const maxAvailable = (product.num || 0) - cartQty; // 剩餘可購買數量
    if (!isNaN(value) && value >= 1 && value <= maxAvailable) {
      setQty(value);
    }
  };
  const submitToCart = async () => {
    try {
      // 檢查購物車中已有的數量 + 當前要購買的數量是否超過庫存
      const totalQty = cartQty + qty;

      if (totalQty > (product.num || 0)) {
        return;
      }

      // 如果已在購物車中，使用 PUT；否則使用 POST
      if (cartItemId) {
        // 更新現有的購物車項目
        await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartItemId}`, {
          data: {
            product_id: id,
            qty: totalQty,
          },
        });
      } else {
        // 新增購物車項目
        await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
          data: {
            product_id: id,
            qty: qty,
          },
        });
      }

      // 成功送出後更新購物車數量
      if (refreshCart) {
        await refreshCart();
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
      setQty(1); // 重置數量
    } catch (error) {
      console.error('加入購物車失敗:', error);
      alert('加入購物車失敗，請稍後再試');
    }
  };

  // 多種預設拼貼佈局模式 - 必須在所有條件返回之前定義
  const layoutPatterns = [
    // 模式 1: 左大右小
    [
      { gridColumn: 'span 2', gridRow: 'span 2' }, // 左上大圖
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 右上小圖1
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 右上小圖2
      { gridColumn: 'span 1', gridRow: 'span 2' }, // 右下豎圖
      { gridColumn: 'span 2', gridRow: 'span 1' }, // 底部橫圖
    ],
    // 模式 2: 右大左小
    [
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 左上小圖1
      { gridColumn: 'span 2', gridRow: 'span 2' }, // 右上大圖
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 左中小圖2
      { gridColumn: 'span 1', gridRow: 'span 2' }, // 左下豎圖
      { gridColumn: 'span 2', gridRow: 'span 1' }, // 底部橫圖
    ],
    // 模式 3: 中央大圖
    [
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 左上小圖
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 右上小圖
      { gridColumn: 'span 2', gridRow: 'span 2' }, // 中央大圖
      { gridColumn: 'span 1', gridRow: 'span 2' }, // 右側豎圖
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 左下小圖
    ],
    // 模式 4: 上下對稱
    [
      { gridColumn: 'span 2', gridRow: 'span 1' }, // 頂部橫圖
      { gridColumn: 'span 1', gridRow: 'span 2' }, // 右側豎圖
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 中左小圖
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 中右小圖
      { gridColumn: 'span 2', gridRow: 'span 1' }, // 底部橫圖
    ],
    // 模式 5: 對角線佈局
    [
      { gridColumn: 'span 2', gridRow: 'span 2' }, // 左上大圖
      { gridColumn: 'span 1', gridRow: 'span 2' }, // 右側豎圖
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 中下小圖1
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 右下小圖2
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 底部小圖3
    ],
    // 模式 6: 平衡佈局
    [
      { gridColumn: 'span 1', gridRow: 'span 2' }, // 左側豎圖
      { gridColumn: 'span 2', gridRow: 'span 1' }, // 頂部橫圖
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 中右小圖
      { gridColumn: 'span 1', gridRow: 'span 1' }, // 中下小圖
      { gridColumn: 'span 2', gridRow: 'span 1' }, // 底部橫圖
    ],
  ];

  // 使用 useMemo 確保每次載入頁面時隨機選擇一種佈局，但在組件生命週期內保持不變
  const selectedLayout = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * layoutPatterns.length);
    return layoutPatterns[randomIndex];
  }, [product?.id]); // 避免 product 為 null 時出錯

  if (loading) {
    return (
      <div
        className="container mt-5 d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '60vh' }}
      >
        <Loading />
        <h4 className="text-secondary mt-5 fw-semibold">載入產品資料中,請稍待片刻...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="glass-card p-5">
          <h3 className="text-danger mb-3">載入失敗</h3>
          <p className="text-secondary">{error}</p>
          <a href="/product" className="btn btn-aurora mt-3">
            返回產品列表
          </a>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <div className="glass-card p-5">
          <h3 className="mb-3">沒有可用的產品資料</h3>
          <p className="text-secondary">找不到您要查看的產品。</p>
          <a href="/product" className="btn btn-aurora mt-3">
            返回產品列表
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="glass-card h-100">
            <div className="overflow-hidden rounded-3 mb-3" style={{ height: '300px' }}>
              <img
                src={product.imageUrl}
                className="w-100 image-hover-transform rounded-3 "
                style={{ height: '300px', objectFit: 'cover' }}
                alt={product.title}
              />
            </div>

            <h3 className="fw-bold mb-3">{product.title}</h3>
            <p className="text-aurora mb-3 text-gradient">{product.description}</p>
            <div className="mb-2 text-start">
              <span className="text-white">分類:</span>
              <strong className="ms-2 text-aurora">{product.category}</strong>
            </div>
            <div className="mb-2 text-start">
              <span className="text-white">單位:</span>
              <strong className="ms-2 text-aurora">{product.unit}</strong>
            </div>
            {product.starRating && (
              <div className="mb-2 text-start">
                <span className="card-text">
                  期待星級:
                  <span className="text-warning ms-2">{'★'.repeat(product.starRating)}</span>
                  <span className="text-secondary">{'☆'.repeat(5 - product.starRating)}</span>
                </span>{' '}
              </div>
            )}
            <div className="mb-2 text-start">
              <span className="text-white">原價:</span>
              <span className="ms-2 text-secondary text-decoration-line-through">
                {product.origin_price ? product.origin_price.toLocaleString() : '0'} 元
              </span>
            </div>
            <div className="mb-4 text-start">
              <strong className="text-aurora">現價:</strong>
              <span className="ms-4 fs-4 fw-bold text-gradient">
                {product.price ? product.price.toLocaleString() : '0'} 元
              </span>
            </div>

            {/* 庫存資訊 */}
            <div className="mb-3 text-start">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-white">庫存數量:</span>
                <strong className="text-aurora">{product.num || 0}</strong>
              </div>

              {cartQty > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="text-primary small">購物車中已有:</span>
                  <span className="text-warning">{cartQty}</span>
                </div>
              )}
              {cartQty > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span className="text-success small">可再購買:</span>
                  <strong className="text-success">
                    {Math.max(0, (product.num || 0) - cartQty)}
                  </strong>
                </div>
              )}
            </div>

            <div className="mb-4 d-flex justify-content-between">
              <button type="button" className="btn btn-aurora-calulate" onClick={subQty}>
                <SquareMinus />
              </button>
              <input
                type="number"
                min={1}
                max={Math.max(1, (product.num || 0) - cartQty)}
                step={1}
                className="form-control text-center"
                value={qty}
                onChange={handleQty}
              />
              <button type="button" className="btn btn-aurora-calulate" onClick={addQty}>
                <SquarePlus />
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-aurora w-100 py-3"
              onClick={submitToCart}
              disabled={cartQty >= (product.num || 0)}
            >
              {cartQty >= (product.num || 0) ? '已達庫存上限' : '立即購買'}
            </button>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="photo-grid-container">
            <div className="photo-grid">
              {product.imagesUrl &&
                product.imagesUrl.slice(0, 5).map((url, index) => {
                  return (
                    <div key={index} className="photo-grid-item" style={selectedLayout[index]}>
                      <img src={url} alt={`${product.title} ${index + 1}`} />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
