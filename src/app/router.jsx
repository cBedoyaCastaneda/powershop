import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AdminGuard from "../guards/AdminGuard";
import AdminLayout from "../components/layout/AdminLayout"; // tu layout
// Páginas Admin
import AdminDashboard from "../pages/admin/Dashboard";      // (14)
import Users from "../pages/admin/users";                   // (15)
import Orders from "../pages/admin/orders";                 // (20)
import OrderDetail from "../pages/admin/orderDetail";       // (21)
import Products from "../pages/admin/Products";             // (17)
import ProductEdit from "../pages/admin/ProductEdit";       // (19)
import Categories from "../pages/admin/Categories";         // (22)
import CategoryAdd from "../pages/admin/CategoryAdd";       // (23)
import Login from "../pages/login";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/login", element: <Login /> },
      // …rutas públicas (home, etc.)
      {
        element: <AdminGuard />, // 👈 protege todo lo de admin
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },   // 14
              { path: "users", element: <Users /> },          // 15–16 (usa lo que ya te di)
              { path: "orders", element: <Orders /> },        // 20
              { path: "orders/:id", element: <OrderDetail /> },
              { path: "products", element: <Products /> },    // 17
              { path: "products/:id", element: <ProductEdit /> }, // 19
              { path: "categories", element: <Categories /> },    // 22
              { path: "categories/new", element: <CategoryAdd /> } // 23
            ]
          }
        ]
      }
    ]
  }
]);

