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

const saveUsers = (users) => {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
};

// pequeña ayuda para separar el nombre completo
const splitFullName = (fullName = "") => {
  const parts = fullName.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return { name: "", lastName: "" };
  const [name, ...rest] = parts;
  return { name, lastName: rest.join(" ") };
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
    saveUsers(users);
    return Promise.resolve(users.find(u => u.id === id));
  },

  // 🔹 NUEVO: crear o actualizar usuario a partir del formulario de checkout
  createOrUpdateFromCheckout(formData) {
    const users = ensureUsers();

    const email = (formData.email || "").trim().toLowerCase();
    const { name, lastName } = splitFullName(formData.fullName || "");

    const index = users.findIndex(
      u => (u.email || "").toLowerCase() === email
    );

    let updatedUsers;

    if (index !== -1) {
      // ya existe usuario con ese email → actualizamos datos básicos
      updatedUsers = users.map((u, i) =>
        i === index
          ? {
              ...u,
              name: name || u.name,
              lastName: lastName || u.lastName,
              address: formData.address,
              city: formData.city,
              zipCode: formData.zipCode
            }
          : u
      );
    } else {
      // no existe → creamos un nuevo usuario
      const newUser = {
        id: `u${users.length + 1}`,
        name: name || "Cliente",
        lastName: lastName,
        email: formData.email,
        active: true,
        createdAt: new Date().toISOString().slice(0, 10),
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode
      };
      updatedUsers = [...users, newUser];
    }

    saveUsers(updatedUsers);

    return Promise.resolve(
      updatedUsers.find(u => (u.email || "").toLowerCase() === email)
    );
  }
};
