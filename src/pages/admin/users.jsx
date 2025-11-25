import { Link, useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/api/useUsers";
import { usePagination } from "../../hooks/usePagination";


export default function AdminUsers() {
  const { loading, users, q, setQ, toggleActive } = useUsers();
  const { data, page, pages, setPage, total } = usePagination(users, 10);
  const navigate = useNavigate();
  
  const handleFilterChange = (e) => {
    setQ(e.target.value);
    setPage(1);
  };

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      {/* Título + botón a usuarios registrados */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "32px" }}>Usuarios con Orden</h1>

        <button
          onClick={() => navigate("/admin/usersRegistered")}
          style={{
            padding: "8px 14px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background:
              "linear-gradient(90deg, #22c55e, #06b6d4)",
            color: "#fff",
            fontWeight: "600",
            boxShadow: "0 0 10px rgba(0,0,0,0.4)",
          }}
        >
          Ver usuarios registrados
        </button>
      </div>

      <input
        placeholder="Filtrar por ID / nombre / apellido"
        value={q}
        onChange={handleFilterChange}
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

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
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
                  Email
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
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ padding: "12px", textAlign: "center" }}
                  >
                    No hay usuarios
                  </td>
                </tr>
              )}

              {data.map((u) => (
                <tr key={u.id}>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    <Link
                      to={`/adminUsuarios/${u.id}`}
                      style={{
                        color: "#4fd1ff",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      {u.id}
                    </Link>
                  </td>

                  <td
                    style={{ borderBottom: "1px solid #333", padding: "8px" }}
                  >
                    {u.name} {u.lastName}
                  </td>
                  <td
                    style={{ borderBottom: "1px solid #333", padding: "8px" }}
                  >
                    {u.email}
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

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                disabled={n === page}
                onClick={() => setPage(n)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: n === page ? "default" : "pointer",
                  background: n === page ? "#4b5563" : "#1f2937",
                  color: "#fff",
                  opacity: n === page ? 0.6 : 1,
                }}
              >
                {n}
              </button>
            ))}

            <span style={{ marginLeft: "auto" }}>Total: {total}</span>
          </div>
        </>
      )}
    </div>
  );
}
