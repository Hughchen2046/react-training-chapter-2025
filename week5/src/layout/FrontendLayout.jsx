import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

const FrontendLayout = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

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
                  <Link className="nav-link fw-semibold" to="/cart" onClick={closeNav}>CART</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-aurora ms-lg-3" to="/login" onClick={closeNav}>ACCESS</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow-1 pb-5">
        <Outlet />
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
