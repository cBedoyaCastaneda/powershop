const LS_USERS = "ps_users_v1";

const ensureUsers = () => {
  const raw = localStorage.getItem(LS_USERS);
  if (!raw) {
    const seed = [
      { id: "u1", name: "Ana", lastName: "Pérez", email: "ana@site.com", active: true, createdAt: "2025-10-01" },
      { id: "u2", name: "Bruno", lastName: "López", email: "bruno@site.com", active: false, createdAt: "2025-10-08" },
      { id: "u3", name: "Carmen", lastName: "Soto", email: "carmen@site.com", active: true, createdAt: "2025-10-10" },
      { id: "u4", name: "Diego", lastName: "Ramos", email: "diego@site.com", active: true, createdAt: "2025-10-12" }
    ];
    localStorage.setItem(LS_USERS, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
};

export const userService = {
  list() {
    return Promise.resolve(ensureUsers());
  },
  getById(id) {
    const users = ensureUsers();
    return Promise.resolve(users.find(u => u.id === id) || null);
  },
  toggleActive(id) {
    const users = ensureUsers().map(u => (u.id === id ? { ...u, active: !u.active } : u));
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    return Promise.resolve(users.find(u => u.id === id));
  }
};
