import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderService } from "../../services/order.service";
import { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function OrderDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderService.getById(id).then(setOrder);
  }, [id]);

  if (!order) return <p>Orden no encontrada</p>;

  const cancel = async () => {
    if (order.status === "CANCELLED") return;
    const upd = await orderService.cancel(order.id);
    setOrder(upd);
    // regresar al listado si quieres:
    // nav("/admin/orders");
  };

  return (
    <div>
      <button onClick={() => nav(-1)}>← Volver</button>
      <h1>Orden #{order.id}</h1>
      <p><b>Usuario:</b> {order.userId}</p>
      <p><b>Fecha:</b> {formatDate(order.createdAt)}</p>
      <p><b>Estado:</b> {order.status}</p>

      <h3>Ítems</h3>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
        <tbody>
          {order.items.map((it, i) => (
            <tr key={i}>
              <td>{it.name || it.productId}</td>
              <td>{it.qty}</td>
              <td>{formatCurrency(it.price)}</td>
              <td>{formatCurrency(it.price * it.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Totales</h3>
      <p>Subtotal: {formatCurrency(order.totals.subtotal)}</p>
      <p>Envío: {formatCurrency(order.totals.shipping)}</p>
      <p><b>Total: {formatCurrency(order.totals.grand)}</b></p>

      <button onClick={cancel} disabled={order.status === "CANCELLED"}>
        {order.status === "CANCELLED" ? "Orden cancelada" : "Cancelar orden"}
      </button>
    </div>
  );
}
