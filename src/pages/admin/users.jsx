import { Link } from "react-router-dom";
import DataTable from "../../components/admin/DataTable/DataTable";
import { useUsers } from "../../hooks/api/useUsers";
import { usePagination } from "../../hooks/usePagination";

export default function AdminUsers() {
  const { loading, users, q, setQ, toggleActive } = useUsers();
  const { data, page, pages, setPage, total } = usePagination(users, 10);

  const columns = [
    { header: "ID", render: (r) => <Link to={`/admin/orders?user=${r.id}`}>{r.id}</Link> },
    { header: "Nombre", render: (r) => `${r.name} ${r.lastName}` },
    { header: "Email", accessor: "email" },
    { header: "Estado", render: (r) => (r.active ? "Activo" : "Inactivo") },
    { header: "Acciones", render: (r) => (
        <button onClick={() => toggleActive(r.id)}>{r.active ? "Desactivar" : "Activar"}</button>
      ) }
  ];

  return (
    <div>
      <h1>Usuarios</h1>
      <input
        placeholder="Filtrar por ID / nombre / apellido"
        value={q}
        onChange={(e) => { setQ(e.target.value); setPage(1); }}
      />
      {loading ? <p>Cargando...</p> : (
        <>
          <DataTable columns={columns} rows={data} empty="No hay usuarios" />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button key={n} disabled={n === page} onClick={() => setPage(n)}>{n}</button>
            ))}
            <span style={{ marginLeft: "auto" }}>Total: {total}</span>
          </div>
        </>
      )}
    </div>
  );
}
