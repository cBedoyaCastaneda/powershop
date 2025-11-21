import { GetUserLogged } from "../utils/storage";
import { Navigate } from "react-router-dom";

//Verifica si es admin
function AdminGuard({ children }) {
  const logged = GetUserLogged()
  if (!logged || logged.tipo != "administrador") return <Navigate to="/login" replace />;
  console.log("Pasaste")
  return children;
}
export default AdminGuard