import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Loading } from "../../plugins/Loading";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const SingleProduct = () => {
  const location = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState(location.state?.productData?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 如果已經有產品資料（從 state 傳遞），就不需要再次獲取
    if (product) {
      setLoading(false);
      return;
    }

    // 從 API 獲取產品資料
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
        console.log("從 API 獲取產品資料:", res.data.product);
        setProduct(res.data.product);
        setError(null);
      } catch (err) {
        console.error("取得產品資料失敗", err);
        setError("無法載入產品資料，請稍後再試。");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, product]);

  if (loading) {
    return (
      <div className="container mt-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <Loading />
        <h4 className="text-secondary mt-5 fw-semibold">載入產品資料中,請稍待片刻...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="glass-card p-5">
          <h3 className="text-danger mb-3">⚠️ 載入失敗</h3>
          <p className="text-secondary">{error}</p>
          <a href="/product" className="btn btn-aurora mt-3">返回產品列表</a>
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
          <a href="/product" className="btn btn-aurora mt-3">返回產品列表</a>
        </div>
      </div>
    );
  }

  // 多種預設拼貼佈局模式
  const layoutPatterns = [
    // 模式 1: 左大右小
    [
      { gridColumn: 'span 2', gridRow: 'span 2' },  // 左上大圖
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 右上小圖1
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 右上小圖2
      { gridColumn: 'span 1', gridRow: 'span 2' },  // 右下豎圖
      { gridColumn: 'span 2', gridRow: 'span 1' },  // 底部橫圖
    ],
    // 模式 2: 右大左小
    [
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 左上小圖1
      { gridColumn: 'span 2', gridRow: 'span 2' },  // 右上大圖
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 左中小圖2
      { gridColumn: 'span 1', gridRow: 'span 2' },  // 左下豎圖
      { gridColumn: 'span 2', gridRow: 'span 1' },  // 底部橫圖
    ],
    // 模式 3: 中央大圖
    [
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 左上小圖
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 右上小圖
      { gridColumn: 'span 2', gridRow: 'span 2' },  // 中央大圖
      { gridColumn: 'span 1', gridRow: 'span 2' },  // 右側豎圖
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 左下小圖
    ],
    // 模式 4: 上下對稱
    [
      { gridColumn: 'span 2', gridRow: 'span 1' },  // 頂部橫圖
      { gridColumn: 'span 1', gridRow: 'span 2' },  // 右側豎圖
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 中左小圖
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 中右小圖
      { gridColumn: 'span 2', gridRow: 'span 1' },  // 底部橫圖
    ],
    // 模式 5: 對角線佈局
    [
      { gridColumn: 'span 2', gridRow: 'span 2' },  // 左上大圖
      { gridColumn: 'span 1', gridRow: 'span 2' },  // 右側豎圖
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 中下小圖1
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 右下小圖2
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 底部小圖3
    ],
    // 模式 6: 平衡佈局
    [
      { gridColumn: 'span 1', gridRow: 'span 2' },  // 左側豎圖
      { gridColumn: 'span 2', gridRow: 'span 1' },  // 頂部橫圖
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 中右小圖
      { gridColumn: 'span 1', gridRow: 'span 1' },  // 中下小圖
      { gridColumn: 'span 2', gridRow: 'span 1' },  // 底部橫圖
    ],
  ];

  // 使用 useMemo 確保每次載入頁面時隨機選擇一種佈局，但在組件生命週期內保持不變
  const selectedLayout = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * layoutPatterns.length);
    return layoutPatterns[randomIndex];
  }, [product.id]); // 當產品 ID 改變時重新選擇佈局

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
            /></div>

            <h3 className="fw-bold mb-3">{product.title}</h3>
            <p className="text-aurora mb-3 text-gradient">
              {product.description}
            </p>
            <div className="mb-2">
              <span className="text-white">分類:</span> 
              <strong className="ms-2 text-aurora">{product.category}</strong>
            </div>
            <div className="mb-2">
              <span className="text-white">單位:</span> 
              <strong className="ms-2 text-aurora">{product.unit}</strong>
            </div>
            <div className="mb-2">
              <span className="text-white">原價:</span> 
              <span className="ms-2 text-secondary text-decoration-line-through">{product.origin_price} 元</span>
            </div>
            <div className="mb-4">
              <strong className="text-aurora">現價:</strong> 
              <span className="ms-2 fs-4 fw-bold text-gradient">{product.price} 元</span>
            </div>
            <button className="btn btn-aurora w-100 py-3">立即購買</button>
          </div>
        </div>
        
        <div className="col-lg-8">
          <div className="photo-grid-container">
            <div className="photo-grid">
              {product.imagesUrl && product.imagesUrl.slice(0, 5).map((url, index) => {
                return (
                  <div 
                    key={index} 
                    className="photo-grid-item"
                    style={selectedLayout[index]}
                  >
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
