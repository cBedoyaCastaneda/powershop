import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import DataTable from "../../components/admin/DataTable/DataTable";
import { useOrders } from "../../hooks/api/useOrders";
import { usePagination } from "../../hooks/usePagination";
import { formatCurrency, formatDate } from "../../utils/formatters";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function AdminOrders() {
  const { loading, orders, q, setQ } = useOrders();
  const query = useQuery();
  const userQ = query.get("user") || "";
  const filtered = useMemo(() => {
    if (!userQ) return orders;
    return orders.filter(o => o.userId === userQ);
  }, [orders, userQ]);

  const { data, page, pages, setPage, total } = usePagination(filtered, 10);

  const columns = [
    { header: "ID", render: (r) => <Link to={`/admin/orders/${r.id}`}>{r.id}</Link> },
    { header: "Usuario", accessor: "userId" },
    { header: "Fecha", render: (r) => formatDate(r.createdAt) },
    { header: "Estado", accessor: "status" },
    { header: "Total", render: (r) => formatCurrency(r.totals?.grand) }
  ];

  return (
    <div>
      <h1>Órdenes</h1>
      <input
        placeholder="Filtrar por ID / estado / userId"
        value={q}
        onChange={(e) => { setQ(e.target.value); setPage(1); }}
      />
      {loading ? <p>Cargando...</p> : (
        <>
          <DataTable columns={columns} rows={data} empty="No hay órdenes" />
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
