import useLocalStorage from '@hooks/useLocalStorage';
import { Navigate } from "react-router-dom";

//Verifica si NO inicio sesion
function GuestGuard({ children }) {
  const {GetUserLogged} = useLocalStorage()
  const logged = GetUserLogged()
  if (logged) return <Navigate to="/home" replace />;
  return children;
}
export default GuestGuard