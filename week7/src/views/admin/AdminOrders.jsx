

const AdminOrders = () => {
  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-black text-gradient">訂單管理系統</h2>
      </div>

      <div className="glass-table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>編號</th>
              <th>客戶ID</th>
              <th>訂單ID</th>
              <th>訂單日期</th>
              <th>訂單狀態</th>
              <th className="text-end">訂單金額</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "1", client: "ASDASD.", item: "DSADASD", date: "2025/01/22", status: "已處理", total: "2,572,500" },
              { id: "2", client: "DASDASD", item: "ADASDASD", date: "2025/01/23", status: "未處理", total: "1,984,500" },
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
