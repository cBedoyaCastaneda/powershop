// ...importaciones previas
import { createBrowserRouter } from "react-router-dom";
import AdminGuard from "../guards/AdminGuard";
import AdminLayout from "../components/layout/adminLayout";
import MainLayout from "../components/layout/mainLayout";
import Home from "../pages/home"
import Login from "../pages/login"
import AdminUsers from "../pages/admin/users";
import AdminOrders from "../pages/admin/orders";
import ProductDetail from "../components/products/productDetail/productDetail";
import Checkout from "../pages/checkout";
import Registro from "../pages/register";
import RecuperarContraseña from "../pages/forgotPassword";
import OrderSuccess from "../pages/orderSuccess";
import AdminOrderDetail from "../pages/admin/orderDetail";
import AdminProducts from "../pages/admin/products";
import AdminProductEdit from "../pages/admin/productEdit";
import AdminDashboard from "../pages/admin/dashboard";
import AdminCategories from "../pages/admin/categories";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "login", element:<Login />},
      { path: "registro", element:<Registro />},
      { path: "recuperar-contraseña", element:<RecuperarContraseña />},
      { path: "product/:id", element:<ProductDetail />},
      { path: "checkout", element:<Checkout />},
      { path: "compra-finalizada", element:<OrderSuccess />}
    ]
  },
  {
    path: "/admin",
      element: (
        <AdminGuard>
            <AdminLayout />
        </AdminGuard>
      ),
    children: [
      { path: "categories", element: <AdminCategories /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "orders/:id", element: <AdminOrderDetail /> },
      { path: "products", element: <AdminProducts /> },
      { path: "products/:id", element: <AdminProductEdit /> },
      { path: "users", element: <AdminUsers /> }
    ]
  }
])

export default router