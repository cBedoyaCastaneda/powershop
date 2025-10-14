// ...importaciones previas
import Users from "../pages/admin/users";
import Orders from "../pages/admin/orders";
import OrderDetail from "../pages/admin/orderDetail";

// dentro de tu definición de rutas:
{
  path: "/admin",
  element: <AdminLayout />,        // tu guard/maquetado
  children: [
    // ...otras rutas de admin (Alumno 4)
    { path: "users", element: <Users /> },
    { path: "orders", element: <Orders /> },
    { path: "orders/:id", element: <OrderDetail /> }
  ]
}
