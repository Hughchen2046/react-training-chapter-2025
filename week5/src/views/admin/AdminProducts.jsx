import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const API_BASE = "https://ec-course-api.hexschool.io/v2"

const AdminProduct = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = `${token}`;

    const checkAdmin = async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
  
      } catch (err) {
        navigate("/");
        alert(err.response.data.message);
      }
    };
    checkAdmin();
  }, [navigate]);

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-black text-gradient">INVENTORY MODELS</h2>
        <button className="btn btn-aurora">
          + ADD NEW MODEL
        </button>
      </div>

      <div className="glass-table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>MODEL NAME</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th className="text-center">STATUS</th>
              <th className="text-end">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "NEBULA HYPERION", cat: "Hypercar", price: "2,450,000", status: "Active" },
              { name: "AURORA SPECTRE", cat: "Luxury GT", price: "1,890,000", status: "In Stock" },
              { name: "CYBER GLIDE", cat: "Concept", price: "5,200,000", status: "Draft" }
            ].map((prod, idx) => (
              <tr key={idx}>
                <td className="fw-bold text-white">{prod.name}</td>
                <td>{prod.cat}</td>
                <td><span className="text-aurora fw-bold">${prod.price}</span></td>
                <td className="text-center">
                  <span className={`badge ${prod.status === 'Active' ? 'bg-success' : prod.status === 'Draft' ? 'bg-secondary' : 'bg-info'} bg-opacity-10 text-opacity-100 border border-current`}>
                    {prod.status}
                  </span>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-sm btn-aurora-outline border-opacity-10">EDIT</button>
                    <button className="btn btn-sm btn-outline-danger border-opacity-10">DELETE</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 d-flex justify-content-between align-items-center px-2">
        <span className="text-secondary small">Showing 3 of 12 registered models</span>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-aurora-outline disabled">PREV</button>
          <button className="btn btn-sm btn-aurora-outline">NEXT</button>
        </div>
      </div>
    </div>
  );
};


export default AdminProduct;