import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorage from '@hooks/useLocalStorage';

function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [userLogged, setUserLogged] = useState(null);
  const navigate = useNavigate();
  const {GetUserLogged} = useLocalStorage()
  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    setUserLogged(GetUserLogged())

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  
  function UserLogout() {
    localStorage.removeItem("usuarioLogueado")
    window.location.reload();
  }

  if (!userLogged) return (
    <Link to="/login">
      <User stroke="white" />
    </Link>
  )
  else return (
    <div className="user-menu-container" ref={menuRef}>
      <button
        className="user-menu-btn"
        onClick={() => setOpen((prev) => !prev)}
      >
        <User stroke="white" />
        {userLogged && userLogged.nombre}
      </button>

      {open && (
        <div className="user-menu-panel">
          <ul className="user-menu-list">
            <li>
              <Link to="/">Perfil</Link>
            </li>
            <li>
              <Link to="/">Ver Compras</Link>
            </li>
            <li>
              <p onClick={UserLogout}>Cerrar Sesion</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
export default UserMenu;