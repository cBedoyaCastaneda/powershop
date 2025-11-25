import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LS_REGISTERED = "ps_registered_users_v1";

const getRegisteredUsers = () => {
  const raw = localStorage.getItem(LS_REGISTERED);
  return raw ? JSON.parse(raw) : [];
};

const saveRegisteredUsers = (list) => {
  localStorage.setItem(LS_REGISTERED, JSON.stringify(list));
};

export default function UsersRegistered() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUsers(getRegisteredUsers());
  }, []);

  const toggleActive = (id) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, active: !u.active } : u
    );
    setUsers(updated);
    saveRegisteredUsers(updated);
  };

  const filtered = users.filter((u) => {
    const text = `${u.id} ${u.name} ${u.lastname} ${u.username}`.toLowerCase();
    return text.includes(q.toLowerCase());
  });

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      {/* Título + botón volver */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "32px" }}>Usuarios registrados</h1>

        <button
          onClick={() => navigate("/admin/users")}
          style={{
            padding: "8px 14px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #f97316, #ec4899)",
            color: "#fff",
            fontWeight: "600",
            boxShadow: "0 0 10px rgba(0,0,0,0.4)",
          }}
        >
          Volver a usuarios con orden
        </button>
      </div>

      <input
        placeholder="Filtrar por ID / nombre / apellido"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          marginBottom: "15px",
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #888",
          minWidth: "260px",
          background: "rgba(0,0,0,0.35)",
          color: "#fff",
        }}
      />

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
              Nombre
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Usuario
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Contraseña
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Estado
            </th>
            <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td
                colSpan={6}
                style={{ padding: "12px", textAlign: "center" }}
              >
                No hay usuarios registrados
              </td>
            </tr>
          )}

          {filtered.map((u) => (
            <tr key={u.id}>
              <td
                style={{ borderBottom: "1px solid #333", padding: "8px" }}
              >
                {u.id}
              </td>
              <td
                style={{ borderBottom: "1px solid #333", padding: "8px" }}
              >
                {u.name} {u.lastname}
              </td>
              <td
                style={{ borderBottom: "1px solid #333", padding: "8px" }}
              >
                {u.username}
              </td>
              <td
                style={{ borderBottom: "1px solid #333", padding: "8px" }}
              >
                {u.password}
              </td>
              <td
                style={{ borderBottom: "1px solid #333", padding: "8px" }}
              >
                {u.active ? "Activo" : "Inactivo"}
              </td>
              <td
                style={{ borderBottom: "1px solid #333", padding: "8px" }}
              >
                <button
                  onClick={() => toggleActive(u.id)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    background: u.active ? "#ff4b6e" : "#21c55d",
                    color: "#fff",
                  }}
                >
                  {u.active ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px", textAlign: "right" }}>
        Total: {users.length}
      </div>
    </div>
  );
}
