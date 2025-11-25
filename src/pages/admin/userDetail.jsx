// src/pages/admin/userDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { userService } from "../../services/user.service";
import { orderService } from "../../services/order.service";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const u = await userService.getById(id);
      const allOrders = await orderService.list();

      setUser(u);

      if (u) {
        const email = (u.email || "").toLowerCase();

        const relatedOrders = allOrders
          .filter(
            (o) => (o.userEmail || "").toLowerCase() === email
          )
          .slice(0, 10); // máximo 10

        setOrders(relatedOrders);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        Cargando usuario...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        <h1>Usuario no encontrado</h1>
        <Link
          to="/adminUsuarios"
          style={{ color: "#4fd1ff", textDecoration: "underline" }}
        >
          Volver a usuarios
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "32px" }}>
          Detalle de usuario #{user.id}
        </h1>

        <Link
          to="/adminUsuarios"
          style={{
            padding: "8px 14px",
            borderRadius: "999px",
            border: "none",
            background: "linear-gradient(90deg, #f97316, #ec4899)",
            color: "#fff",
            fontWeight: "600",
            boxShadow: "0 0 10px rgba(0,0,0,0.4)",
          }}
        >
          Volver a usuarios
        </Link>
      </div>

      {/* Datos del usuario */}
      <div
        style={{
          background: "rgba(0,0,0,0.35)",
          borderRadius: "12px",
          padding: "18px 20px",
          marginBottom: "24px",
        }}
      >
        <p>
          <b>Nombre:</b> {user.name} {user.lastName}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Estado:</b> {user.active ? "Activo" : "Inactivo"}
        </p>
        {user.createdAt && (
          <p>
            <b>Creado:</b> {user.createdAt}
          </p>
        )}
        {(user.address || user.city || user.zipCode) && (
          <p>
            <b>Dirección:</b>{" "}
            {user.address} {user.city && `, ${user.city}`}{" "}
            {user.zipCode && `, ${user.zipCode}`}
          </p>
        )}
      </div>

      {/* Órdenes del usuario */}
      <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
        Órdenes del usuario (máx. 10)
      </h2>

      {orders.length === 0 ? (
        <p>Este usuario no tiene órdenes registradas.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
                ID
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
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td
                  style={{ borderBottom: "1px solid #333", padding: "8px" }}
                >
                  <Link
                    to={`/adminOrdenes/${o.id}`}
                    style={{
                      color: "#4fd1ff",
                      textDecoration: "underline",
                    }}
                  >
                    {o.id}
                  </Link>
                </td>
                <td
                  style={{ borderBottom: "1px solid #333", padding: "8px" }}
                >
                  {o.createdAt}
                </td>
                <td
                  style={{ borderBottom: "1px solid #333", padding: "8px" }}
                >
                  {o.status}
                </td>
                <td
                  style={{ borderBottom: "1px solid #333", padding: "8px" }}
                >
                  S/ {o.totals?.total?.toFixed(2) ?? "0.00"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
