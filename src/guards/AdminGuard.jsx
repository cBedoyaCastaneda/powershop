import useLocalStorage from '@hooks/useLocalStorage';
import { Navigate } from "react-router-dom";

//Verifica si inicio sesion el administrador
function AuthGuard({ children }) {
  const {GetUserLogged} = useLocalStorage()
  const logged = GetUserLogged()
  if (!logged || logged.tipo !== "administrador") return <Navigate to="/login" replace />;
  return children;
}
export default AuthGuard