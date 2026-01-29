import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const handleViewMore = async(id) => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      navigate(`/product/${id}`, { state: { productData: res.data } });
      // console.log(res.data.product);
    } catch (error) {
      console.error("取得產品資料失敗", error);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        // console.log(res.data.products);
        setProducts(res.data.products);
      } catch (error) {
        console.error("取得產品資料失敗", error);
      }
    };
  
    getProduct();
  }, []);

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-3 fw-bold fw-black text-gradient mb-3">尊爵收藏</h1>
        <p className="text-secondary fs-5">頂級品味，極速領域的典藏之作。</p>
      </div>

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-lg-4 col-md-6" key={product.id}>
            <div className="glass-card h-100 d-flex flex-column">
              <div className="overflow-hidden round-24 mb-4 aspect-ratio-gold">
                <img
                  src={product.imageUrl}
                  className="car-card-img transition-transform duration-500 hover-scale-110"
                  alt={product.title}
                  style={{ transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
              </div>
              <div className="flex-grow-1 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3 className="h4 mb-0">{product.title}</h3>
                  <span className="badge bg-warning bg-opacity-70 text-aurora border border-white border-opacity-10">{product.is_enabled ? "在庫" : "缺貨"}</span>
                </div>
                <p className="text-info text-start small mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="text-start mb-4 mt-auto">
                                              {product.starRating && (
                              <p className="card-text">
                                期待星級:
                                <span className="text-warning ms-2">
                                  {"★".repeat(product.starRating)}
                                </span>
                                <span className="text-secondary">
                                  {"☆".repeat(5 - product.starRating)}
                                </span>
                              </p>
                            )}
                  <span className="text-info small d-block">預估售價</span>
                  <span className="fs-4 fw-bold text-gradient">${product.origin_price.toLocaleString()}</span>
                </div>
                <button
                  className="btn btn-aurora w-auto"
                  onClick={() => handleViewMore(product.id)}
                >
                  DISCOVER
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
