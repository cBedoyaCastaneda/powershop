import useLocalStorage from '@hooks/useLocalStorage';
import { Navigate } from "react-router-dom";

//Verifica si inicio sesion
function AuthGuard({ children }) {
  const {GetUserLogged} = useLocalStorage()
  const logged = GetUserLogged()
  if (!logged) return <Navigate to="/login" replace />;
  return children;
}
export default AuthGuard