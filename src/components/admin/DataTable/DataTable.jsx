import React from "react";

export default function DataTable({ columns = [], rows = [], empty = "Sin datos" }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }} border="1" cellPadding="6">
      <thead>
        <tr>{columns.map((c) => <th key={c.key || c.header}>{c.header}</th>)}</tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr><td colSpan={columns.length}>{empty}</td></tr>
        )}
        {rows.map((r, idx) => (
          <tr key={r.id || idx}>
            {columns.map((c) => <td key={c.key || c.header}>{c.render ? c.render(r) : r[c.accessor]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
