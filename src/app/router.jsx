// ...importaciones previas
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "@components/layout/adminLayout";
import MainLayout from "@components/layout/mainLayout";
import Home from "@pages/home"
import Login from "@pages/login"
import AdminUsers from "@pages/admin/users";
import AdminOrders from "@pages/admin/orders";
import ProductDetail from "@components/products/productDetail/productDetail";
import Checkout from "@pages/checkout";
import Registro from "@pages/register";
import RecuperarContraseña from "@pages/forgotPassword";
import NotFound from "@pages/notFound";
import OrderSuccess from "@pages/orderSuccess";
import AdminOrderDetail from "@pages/admin/orderDetail";
import AdminProducts from "@pages/admin/products";
import AdminProductEdit from "@pages/admin/productEdit";
import AdminDashboard from "@pages/admin/dashboard";
import AdminCategories from "@pages/admin/categories";
import AdminGuard from "@guards/AdminGuard";

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
    path: "/",
    element: (
      <MainLayout />
    ),
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "login", element:<Login />},
      { path: "registro", element:<Registro />},
      { path: "recuperar-contraseña", element:<RecuperarContraseña />},
      { path: "product/:id", element:<ProductDetail />},
      { path: "checkout", element:<Checkout />},
      { path: "compra-finalizada", element:<OrderSuccess />},
      { path: "*", element:<NotFound />}
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
      { path: "categories", element: <AdminCategories /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "orders/:id", element: <AdminOrderDetail /> },
      { path: "products", element: <AdminProducts /> },
      { path: "products/:id", element: <AdminProductEdit /> },
      { path: "*", element:<NotFound />}
    ]
  }
])

export default router