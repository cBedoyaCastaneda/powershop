import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './profile.css'
function Profile() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar usuario guardado después del login
    const storedUser = localStorage.getItem("usuarioLogueado");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    // Convertir string a JSON
    const userData = JSON.parse(storedUser);
    setUsuario(userData);
  }, [navigate]);

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="profile-container">
      <h2>👤 Mi Perfil</h2>

      <div className="profile-card">
        <p><strong>Nombre:</strong> {usuario.nombre || "No registrado"}</p>
        <p><strong>Apellido:</strong> {usuario.apellido || "No registrado"}</p>
        <p><strong>Usuario:</strong> {usuario.usuario || "Sin usuario"}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Dirección:</strong> {usuario.direccion || "Sin dirección"}</p>

        {usuario.esAdmin ? (
          <p className="admin-badge">⭐ Administrador</p>
        ) : (
          <p className="user-badge">Usuario estándar</p>
        )}

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("usuarioLogueado");
            navigate("/login");
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Profile;
