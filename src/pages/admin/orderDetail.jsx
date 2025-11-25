import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../../services/order.service";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const load = async () => {
      const o = await orderService.getById(id);
      setOrder(o);
    };
    load();
  }, [id]);

  if (!order) {
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        Cargando orden...
      </div>
    );
  }

  const { shipping, totals, items } = order;

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        Detalle de Orden #{order.id}
      </h1>
      <p style={{ marginBottom: "4px" }}>
        <b>Fecha:</b> {order.createdAt}
      </p>
      <p style={{ marginBottom: "12px" }}>
        <b>Estado:</b> {order.status}
      </p>

      <h2 style={{ fontSize: "22px", marginTop: "20px", marginBottom: "8px" }}>
        Información de entrega
      </h2>
      <p>
        <b>Destinatario:</b> {shipping?.fullName}
      </p>
      <p>
        <b>Dirección:</b>{" "}
        {shipping
          ? `${shipping.address}, ${shipping.city}, ${shipping.zipCode}`
          : ""}
      </p>
      <p>
        <b>Email:</b> {shipping?.email}
      </p>

      <h2 style={{ fontSize: "22px", marginTop: "24px", marginBottom: "8px" }}>
        Productos del pedido
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          background: "rgba(0,0,0,0.25)"
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Producto
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Cantidad
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Precio
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                {it.name}
              </td>
              <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                {it.quantity}
              </td>
              <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                S/ {it.price.toFixed(2)}
              </td>
              <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                S/ {it.subtotal.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: "22px", marginBottom: "6px" }}>Resumen del pago</h2>
      <p>
        <b>Subtotal:</b> S/ {totals.subtotal.toFixed(2)}
      </p>
      <p>
        <b>IGV:</b> S/ {totals.igv.toFixed(2)}
      </p>
      <p>
        <b>Envío:</b> S/ {totals.shipping.toFixed(2)}
      </p>
      <p style={{ marginTop: "6px", fontSize: "20px" }}>
        <b>Total:</b> S/ {totals.total.toFixed(2)}
      </p>
    </div>
  );
};

export default OrderDetail;
