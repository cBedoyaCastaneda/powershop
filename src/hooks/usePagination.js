import { useMemo, useState } from "react";

export function usePagination(list = [], perPage = 10) {
  const [page, setPage] = useState(1);
  const { data, pages, total } = useMemo(() => {
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    return { data: list.slice(start, start + perPage), pages, total };
  }, [list, perPage, page]);
  return { page, setPage, data, pages, total };
}
