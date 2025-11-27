import { useState, useEffect } from "react";
import { usePagination } from "@hooks/usePagination";
import useUsers from "@hooks/api/useUsers"

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: ""
  });
  
  const filteredUsers = users.filter(u => 
    u.id.toString().includes(q.toLowerCase()) ||
    (u.nombre && u.nombre.toLowerCase().includes(q.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(q.toLowerCase()))
  );
  
  const { data, page, pages, setPage, total } = usePagination(filteredUsers, 10);
  const { GetUsers, CreateUser, DeleteUser } = useUsers()
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await GetUsers()
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setQ(e.target.value);
    setPage(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    
    try {
      const response = await DeleteUser(id)
      if (response.ok) {
        alert("Usuario eliminado correctamente");
        fetchUsers();
      } else {
        alert("Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar usuario");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.password) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await CreateUser(JSON.stringify(formData))
      if (response.ok) {
        alert("Usuario creado correctamente");
        setShowCreateModal(false);
        setFormData({ nombre: "", email: "", password: "" });
        fetchUsers();
      } else {
        alert("Error al crear usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear usuario");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "32px" }}>Usuarios</h1>
        
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #22c55e, #06b6d4)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          ➕ Crear Usuario
        </button>
      </div>

      <input
        placeholder="Filtrar por ID / nombre / email"
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
                <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>ID</th>
                <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>Nombre</th>
                <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>Email</th>
                <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "12px", textAlign: "center" }}>
                    No hay usuarios
                  </td>
                </tr>
              )}

              {data.map((u) => (
                <tr key={u.id}>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    {u.id}
                  </td>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    {u.nombre || "Sin nombre"}
                  </td>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    {u.email || "Sin email"}
                  </td>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    <button
                      onClick={() => handleViewUser(u)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        background: "#3b82f6",
                        color: "#fff",
                        marginRight: "8px",
                        fontSize: "13px",
                      }}
                    >
                      👁️ Ver
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    >
                      🗑️ Eliminar
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

      {/* Modal Ver Usuario */}
      {showModal && selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#1f2937",
              padding: "30px",
              borderRadius: "12px",
              minWidth: "400px",
              maxWidth: "500px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>
              Detalles del Usuario
            </h2>
            
            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#9ca3af" }}>ID:</strong>
              <p style={{ marginTop: "5px", fontSize: "16px" }}>{selectedUser.id}</p>
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#9ca3af" }}>Nombre:</strong>
              <p style={{ marginTop: "5px", fontSize: "16px" }}>
                {selectedUser.nombre || "Sin nombre"}
              </p>
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#9ca3af" }}>Email:</strong>
              <p style={{ marginTop: "5px", fontSize: "16px" }}>
                {selectedUser.email || "Sin email"}
              </p>
            </div>

            {selectedUser.createdAt && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "#9ca3af" }}>Fecha de creación:</strong>
                <p style={{ marginTop: "5px", fontSize: "16px" }}>
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </p>
              </div>
            )}
            
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#4b5563",
                color: "#fff",
                width: "100%",
                fontSize: "14px",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal Crear Usuario */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: "#1f2937",
              padding: "30px",
              borderRadius: "12px",
              minWidth: "400px",
              maxWidth: "500px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>
              Crear Nuevo Usuario
            </h2>
            
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#9ca3af" }}>
                  Nombre:
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #4b5563",
                    background: "#374151",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#9ca3af" }}>
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #4b5563",
                    background: "#374151",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#9ca3af" }}>
                  Contraseña:
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #4b5563",
                    background: "#374151",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    background: "linear-gradient(90deg, #22c55e, #06b6d4)",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    background: "#4b5563",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}