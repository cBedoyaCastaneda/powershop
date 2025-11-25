import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LS_AUTH = "ps_auth_v1";
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(LS_AUTH);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(LS_AUTH, JSON.stringify(user));
    else localStorage.removeItem(LS_AUTH);
  }, [user]);

  const login = async ({ username, password }) => {
    // 🔐 Credenciales especiales del ADMIN
    if (username === "admin" && password === "12345") {
      const adminUser = { id: "admin", name: "Administrador", role: "admin" };
      setUser(adminUser);
      return { ok: true, user: adminUser };
    }
    // usuario común (opcional para tus pruebas)
    return { ok: false, message: "Credenciales inválidas" };
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({
    user, isAuthenticated: !!user, isAdmin: user?.tipo === "administrador", login, logout
  }), [user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
