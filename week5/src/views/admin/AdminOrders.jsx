const AdminOrders = () => {
  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-black text-gradient">ACQUISITION ORDERS</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-aurora-outline btn-sm">EXPORT CSV</button>
          <button className="btn btn-aurora-outline btn-sm">PRINT LOGS</button>
        </div>
      </div>

      <div className="glass-table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CLIENT</th>
              <th>ACQUISITION</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th className="text-end">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "#TX-9901", client: "Viktor V.", item: "NEBULA HYPERION", date: "2025/01/22", status: "Processing", total: "2,572,500" },
              { id: "#TX-9902", client: "Elena S.", item: "AURORA SPECTRE", date: "2025/01/23", status: "Delivered", total: "1,984,500" },
            ].map((order, idx) => (
              <tr key={idx}>
                <td className="font-monospace text-aurora">{order.id}</td>
                <td>
                  <span className="d-block fw-bold text-white">{order.client}</span>
                  <span className="text-secondary small">Verified Buyer</span>
                </td>
                <td>{order.item}</td>
                <td>{order.date}</td>
                <td>
                  <span className={`badge ${order.status === 'Processing' ? 'bg-warning' : 'bg-success'} bg-opacity-10 text-opacity-100 border border-current`}>
                    {order.status}
                  </span>
                </td>
                <td className="text-end fw-bold text-white">${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
