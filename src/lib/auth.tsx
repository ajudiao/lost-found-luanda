import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { setToken, api } from "./api";

export type Role = "utilizador" | "admin";
export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  token?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (u: AuthUser, token?: string) => void;
  logout: () => void;
  ready: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "achados-luanda-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initAuth() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser(parsed);
          // Tenta validar no backend se o token for válido
          api
            .getMe()
            .then((res) => {
              if (res?.user) {
                const updated = { ...parsed, ...res.user };
                setUser(updated);
                localStorage.setItem(KEY, JSON.stringify(updated));
              }
            })
            .catch(() => {});
        }
      } catch {}
      setReady(true);
    }
    initAuth();
  }, []);

  const login = (u: AuthUser, token?: string) => {
    if (token) {
      setToken(token);
    }
    setUser(u);
    try {
      localStorage.setItem(KEY, JSON.stringify(u));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  };

  return <Ctx.Provider value={{ user, login, logout, ready }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
