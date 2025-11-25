
import { useEffect, useState } from "react";
import { orderService } from "../../services/order.service";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");

  const loadOrders = async () => {
    const all = await orderService.list();
    setOrders(all);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (id) => {
    await orderService.cancel(id);
    await loadOrders();
  };

  const filtered = orders.filter((o) => {
    const text = `${o.id} ${o.status} ${o.userEmail || ""}`.toLowerCase();
    return text.includes(filter.toLowerCase());
  });

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>Órdenes</h1>

      <input
        type="text"
        placeholder="Filtrar por ID / estado / user"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          marginBottom: "15px",
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #888",
          minWidth: "260px"
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "rgba(0,0,0,0.2)"
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              ID
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Usuario (email)
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Fecha
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Estado
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Total
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr key={o.id}>
              <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                <Link
                  to={`/adminOrdenes/${o.id}`}
                  style={{ color: "#4fd1ff", textDecoration: "underline" }}
                >
                  {o.id}
                </Link>
              </td>
              <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                {o.userEmail}
              </td>
              <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                {o.createdAt}
              </td>
              <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                {o.status}
              </td>
              <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                S/ {o.totals?.total?.toFixed(2) ?? "0.00"}
              </td>
              <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                {o.status !== "CANCELLED" && (
                  <button
                    onClick={() => handleCancel(o.id)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#ff4b6e",
                      color: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" style={{ padding: "12px", textAlign: "center" }}>
                No hay órdenes registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
