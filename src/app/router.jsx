// ...importaciones previas
import AdminLayout from "@components/layout/adminLayout";
import MainLayout from "@components/layout/mainLayout";
import ProductDetail from "@components/products/productDetail/productDetail";
import AdminGuard from "@guards/AdminGuard";
import AuthGuard from "@guards/AuthGuard";
import AdminCategories from "@pages/admin/categories";
import AdminDashboard from "@pages/admin/dashboard";
import AdminOrderDetail from "@pages/admin/orderDetail";
import AdminOrders from "@pages/admin/orders";
import AdminProductEdit from "@pages/admin/productEdit";
import AdminProducts from "@pages/admin/products";
import AdminUsers from "@pages/admin/users";
import UsersRegistered from "@pages/admin/usersRegistered";
import Checkout from "@pages/checkout";
import RecuperarContraseña from "@pages/forgotPassword";
import Home from "@pages/home";
import Login from "@pages/login";
import Profile from "../pages/user/profile";
import NotFound from "@pages/notFound";
import Unauthorized from "@pages/unauthorized";
import OrderSuccess from "@pages/orderSuccess";
import Registro from "@pages/register";
import { createBrowserRouter } from "react-router-dom";
import AdminUsersDetail from "../pages/admin/userDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "login", element:<Login />},
      { path: "profile", element:<Profile />},
      { path: "registro", element:<Registro />},
      { path: "recuperar-contraseña", element:<RecuperarContraseña />},
      { path: "product/:id", element:<ProductDetail />},
      { path: "*", element:<NotFound />}
    ]
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { path: "checkout", element:<Checkout />},
      { path: "compra-finalizada", element:<OrderSuccess />},
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
      { path: "", element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "users/:id", element: <AdminUsersDetail /> },
      { path: "usersRegistered", element: <UsersRegistered /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "orders/:id", element: <AdminOrderDetail /> },
      { path: "products", element: <AdminProducts /> },
      { path: "products/:id", element: <AdminProductEdit /> },
      { path: "*", element:<Unauthorized />}
    ]
  }
])

export default router