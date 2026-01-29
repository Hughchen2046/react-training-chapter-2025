import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const FrontendLayout = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [numCart, setNumCart] = useState(0);

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };
  
  const getCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // console.log(response.data.data.carts);
      setNumCart(response.data.data.carts.length);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getCart();
  }, []);

  const closeNav = () => {
    setIsNavExpanded(false);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="aurora-bg">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>
      
      <header className="sticky-top">
        <nav className="navbar navbar-expand-lg navbar-dark navbar-aurora py-3 px-4">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold fs-3 text-gradient" to="/" onClick={closeNav}>
              AURAMOTORS
            </Link>
            <Link className="ms-auto me-4 d-lg-none nav-link fw-semibold p-0" to="/cart" onClick={closeNav}>
            <div className="cart-icon-sm p-2 rounded-circle d-flex justify-content-center align-items-center position-relative">
              <ShoppingBag size={24} />
              <span className="position-absolute top-0 p-2 start-100 translate-middle badge rounded-pill bg-danger" style={{lineHeight: '1'}}>{numCart}</span></div></Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              onClick={toggleNav}
              aria-controls="navbarNav"
              aria-expanded={isNavExpanded}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse justify-content-end ${isNavExpanded ? 'show' : ''}`} id="navbarNav">
              <ul className="navbar-nav gap-3">
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/" onClick={closeNav}>HOME</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/product" onClick={closeNav}>MODELS</Link>
                </li>

                <li className="nav-item">
                  <Link className="btn btn-aurora ms-lg-3" to="/login" onClick={closeNav}>ACCESS</Link>
                </li>
                <li className="nav-item ms-lg-3">
                  <Link className="nav-link fw-semibold p-0" to="/cart" onClick={closeNav}><div className="cart-icon p-2 rounded-circle position-relative"><ShoppingBag size={28} /><span className="position-absolute top-0 p-2 start-100 translate-middle badge rounded-pill bg-danger d-none d-lg-block" style={{lineHeight: '1'}}>{numCart}</span></div></Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow-1 pb-5">
        <Outlet context={{ refreshCart: getCart }} />
      </main>

      <footer className="py-5 border-top border-secondary border-opacity-25 mt-5">
        <div className="container text-center">
          <h2 className="text-gradient mb-4">AURAMOTORS</h2>
          <p className="text-secondary small">© 2026 AURA MOTORS. BRINGING THE FUTURE OF VELOCITY.</p>
        </div>
      </footer>
    </div>
  );
};

export default FrontendLayout;
