import { Outlet } from "react-router-dom"
import './adminLayout.css'
const AdminLayout = () => {
    return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li><a href="/admin/categories">Categorías</a></li>
            <li><a href="/admin/dashboard">Dashboard</a></li>
            <li><a href="/admin/orders">Órdenes</a></li>
            <li><a href="/admin/products">Productos</a></li>
            <li><a href="/admin/users">Usuarios</a></li>
            <li><a href="/">Volver a tienda</a></li>
          </ul>
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );

}
export default AdminLayout