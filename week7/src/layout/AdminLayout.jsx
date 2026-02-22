import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-vh-100 d-flex">
      <div className="aurora-bg">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>

      {/* Sidebar */}
      <aside className="glass-sidebar d-none d-lg-flex flex-column p-4" style={{ width: '280px' }}>
        <div className="mb-5 px-3">
          <h2 className="text-gradient fw-black h3 mb-0">AURA 後台</h2>
          <span className="text-secondary small fw-bold">管理介面</span>
        </div>

        <nav className="nav flex-column gap-2">
          <NavLink 
            className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}
            to="/admin/products"
          >
            產品管理系統
          </NavLink>
          <NavLink 
            className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}
            to="/admin/orders"
          >
            訂單管理系統
          </NavLink>
        </nav>

        <div className="mt-auto px-3 border-top border-white border-opacity-10 pt-4">
          <NavLink to="/" className="text-secondary small text-decoration-none hover-white transition-colors">
            ← 返回前台首頁
          </NavLink>
        </div>
      </aside>

      
      <main className="flex-grow-1 p-4 p-lg-5 overflow-auto">
        <header className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="fw-black h2 mb-0">管理者介面</h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-md-block">
              <span className="d-block fw-bold small">ADMINISTRATOR</span>
              <span className="text-aurora small">權限核可</span>
            </div>
            <div className="rounded-circle bg-white bg-opacity-10 border border-white border-opacity-10" style={{ width: '45px', height: '45px' }}></div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
