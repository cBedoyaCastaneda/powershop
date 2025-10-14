import { useEffect, useMemo, useState } from "react";
import { userService } from "../../services/user.service";

export function useUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    userService.list().then((u) => { setUsers(u); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return users;
    return users.filter(u =>
      u.id.toLowerCase().includes(t) ||
      u.name.toLowerCase().includes(t) ||
      u.lastName.toLowerCase().includes(t)
    );
  }, [users, q]);

  const toggleActive = async (id) => {
    const updated = await userService.toggleActive(id);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  return { loading, users: filtered, setQ, q, toggleActive };
}
