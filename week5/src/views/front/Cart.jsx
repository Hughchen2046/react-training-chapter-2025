import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import { Loading } from "../../plugins/Loading";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);  //購物車資料
  const [isLoading, setIsLoading] = useState(true);  //載入等待狀態
  
  //  refreshCart nav購物車數量更新 + OutletContext資料
  const outletContext = useOutletContext();
  const refreshCart = outletContext?.refreshCart;

  // 獲取購物車資料
  const getCart = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCartItems(response.data.data.carts);
    } catch (error) {
      console.error("獲取購物車失敗:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新購物車數量
  const updateCartQty = async (cartId, currentQty, change, maxQty) => {
    const newQty = currentQty + change;
    
    // 驗證數量範圍
    if (newQty < 1 || newQty > maxQty) {
      return;
    }
    
    // 渲染畫面
    const previousCartItems = [...cartItems];
    setCartItems(cartItems.map(item => 
      item.id === cartId ? { ...item, qty: newQty } : item
    ));

    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, {
        data: {
          product_id: cartId,
          qty: newQty
        }
      });
      // 成功後重新獲取購物車（確保資料同步）
      await getCart();
      
      // 更新nav購物車數量
      if (refreshCart) {
        await refreshCart();
      }
    } catch (error) {
      console.error("更新購物車失敗:", error);
      // 失敗時恢復原本的資料
      setCartItems(previousCartItems);
      alert("更新失敗，請稍後再試");
    }
  };

  // 刪除購物車項目
  const [deleteItemId, setDeleteItemId] = useState(null);

  const handleDeleteClick = (cartId) => {
    setDeleteItemId(cartId);
  };

  //確認刪除動作
  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${deleteItemId}`);
      await getCart();
      setDeleteItemId(null); // 關閉 modal
      
      // 更新nav購物車數量
      if (refreshCart) {
        await refreshCart();
      }
    } catch (error) {
      console.error("刪除失敗:", error);
      alert("刪除失敗，請稍後再試");
    }
  };

  //取消刪除
  const cancelDelete = () => {
    setDeleteItemId(null);
  };

  useEffect(() => {
    getCart();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="container mt-5">
      <div className="row g-5">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h1 className="display-4 fw-bold fw-black text-gradient mb-0">收藏清單</h1>
            {!isLoading && <span className="text-secondary">{cartItems.length} 個品項</span>}
          </div>

          {isLoading ? (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
              <Loading />
              <h4 className="text-secondary mt-5 fw-semibold">載入購物車資料中...</h4>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="d-flex flex-column gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="glass-card p-3">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <img src={item.product.imageUrl} alt={item.product.title} className="img-fluid rounded-3" />
                    </div>
                    <div className="col-md-4">
                      <h4 className="fw-bold mb-1">{item.product.title}</h4>
                      <p className="mx-auto text-secondary small mb-0" style={{  width: '200px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{item.product.content}</p>
                    </div>
                    <div className="col-md-2 text-md-center">
                      <div className="d-flex flex-column align-items-end gap-2">
                      <div className="d-flex align-items-center justify-content-around gap-3 w-100">
                        <button 
                          className="btn btn-sm btn-outline-primary border-opacity-25 text-white" 
                          onClick={() => updateCartQty(item.id, item.qty, -1, item.product.num)}
                          disabled={item.qty <= 1}
                        >
                          -
                        </button>
                        <span>{item.qty}</span>
                        <button 
                          className="btn btn-sm btn-outline-primary border-opacity-25 text-white" 
                          onClick={() => updateCartQty(item.id, item.qty, +1, item.product.num)}
                          disabled={item.qty >= item.product.num}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-secondary border-opacity-25 opacity-75 text-danger"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        刪除
                      </button>
                      
                      </div>
                    </div>
                    <div className="col-md-3 text-md-end">
                      <span className="fw-bold text-gradient">NT${item.final_total.toLocaleString()}</span>
                      
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <Link to="/product" className="btn btn-aurora-outline">
                  ← 繼續瀏覽
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card text-center py-5">
              <h3 className="mb-4">購物車是空的</h3>
              <Link to="/product" className="btn btn-aurora">立即選購</Link>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="glass-card sticky-top" style={{ top: '100px' }}>
            <h3 className="fw-bold mb-4">訂單摘要</h3>
            
            <div className="d-flex justify-content-between mb-3">
              <span className="text-secondary">稅前</span>
              <span className="fw-semibold">NT$ {subtotal.toLocaleString()}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-4">
              <span className="text-secondary">Tax (5%)</span>
              <span className="fw-semibold">NT$ {tax.toLocaleString()}</span>
            </div>
            
            <div className="border-top border-white border-opacity-10 pt-4 mb-5">
              <div className="d-flex justify-content-between align-items-end">
                <span className="fs-5">總計</span>
                <span className="fs-3 fw-bold text-gradient">NT$ {total.toLocaleString()}</span>
              </div>
            </div>
            
            <button className="btn btn-aurora w-100 py-3 fw-bold">
              立即下單
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-secondary small mb-0">下單後將由專人與您聯繫後續事宜</p>
            </div>
          </div>
        </div>
      </div>
      

      
      {deleteItemId && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card">
              <div className="modal-header border-0">
                <h5 className="modal-title text-gradient">確認刪除</h5>
                <button type="button" className="btn-close btn-close-white" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p className="text-secondary mb-0">確定要刪除此商品嗎？此操作無法復原。</p>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-outline-secondary" onClick={cancelDelete}>
                  取消
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  確認刪除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
