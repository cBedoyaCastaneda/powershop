export const formatCurrency = (n) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(n || 0));

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("es-PE", { year: "numeric", month: "2-digit", day: "2-digit" });
