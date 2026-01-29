import { useState } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  // Mock data for UI demonstration
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "NEBULA HYPERION",
      price: 2450000,
      qty: 1,
      imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "AURORA SPECTRE",
      price: 1890000,
      qty: 1,
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    }
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="container mt-5">
      <div className="row g-5">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h1 className="display-4 fw-black text-gradient mb-0">YOUR COLLECTION</h1>
            <span className="text-secondary">{cartItems.length} ITEMS</span>
          </div>

          {cartItems.length > 0 ? (
            <div className="d-flex flex-column gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="glass-card p-3">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <img src={item.imageUrl} alt={item.title} className="img-fluid rounded-3" />
                    </div>
                    <div className="col-md-5">
                      <h4 className="fw-bold mb-1">{item.title}</h4>
                      <p className="text-secondary small mb-0">Custom Aurora Configuration</p>
                    </div>
                    <div className="col-md-2 text-md-center">
                      <div className="d-flex align-items-center justify-content-md-center gap-2">
                        <button className="btn btn-sm btn-outline-secondary border-opacity-25 text-white">-</button>
                        <span>{item.qty}</span>
                        <button className="btn btn-sm btn-outline-secondary border-opacity-25 text-white">+</button>
                      </div>
                    </div>
                    <div className="col-md-2 text-md-end">
                      <span className="fw-bold text-gradient">${item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <Link to="/product" className="btn btn-aurora-outline">
                  ← CONTINUE BROWSING
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card text-center py-5">
              <h3 className="mb-4">Empty Collection</h3>
              <Link to="/product" className="btn btn-aurora">EXPLORE MODELS</Link>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="glass-card sticky-top" style={{ top: '100px' }}>
            <h3 className="fw-bold mb-4">SUMMARY</h3>
            
            <div className="d-flex justify-content-between mb-3">
              <span className="text-secondary">Subtotal</span>
              <span className="fw-semibold">${subtotal.toLocaleString()}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-4">
              <span className="text-secondary">Tax (5%)</span>
              <span className="fw-semibold">${tax.toLocaleString()}</span>
            </div>
            
            <div className="border-top border-white border-opacity-10 pt-4 mb-5">
              <div className="d-flex justify-content-between align-items-end">
                <span className="fs-5">Total Est.</span>
                <span className="fs-3 fw-bold text-gradient">${total.toLocaleString()}</span>
              </div>
            </div>
            
            <button className="btn btn-aurora w-100 py-3 fw-bold">
              PROCEED TO ACQUISITION
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-secondary small mb-0">Secure delivery to 50+ destinations worldwide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
