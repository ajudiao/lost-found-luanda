import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Bell, MapPin, Moon, Sun, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const nav = [
  { to: "/", label: "Início" },
  { to: "/perdidos", label: "Perdidos" },
  { to: "/encontrados", label: "Encontrados" },
  { to: "/avisos", label: "Avisos" },
  { to: "/como-funciona", label: "Como Funciona" },
  { to: "/contactos", label: "Contactos" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            Achados<span className="text-primary">.</span>Luanda
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Alternar tema">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 px-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "admin" ? (
                    <DropdownMenuItem asChild>
                      <Link to="/admin"><Shield className="h-4 w-4 mr-2" />Painel Admin</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to="/meu-espaco"><LayoutDashboard className="h-4 w-4 mr-2" />Meu Espaço</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />Terminar sessão
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/entrar">Entrar</Link>
            </Button>
          )}
          {user?.role !== "admin" && (
            <Button asChild size="sm" variant="default" className="hidden md:inline-flex">
              <Link to="/publicar">Publicar</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-background border-l border-border lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display font-bold">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link
                    key={n.to} to={n.to}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium ${
                      path === n.to ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60"
                    }`}
                  >
                    {n.label}
                  </Link>
                ))}
                <div className="my-3 h-px bg-border" />
                {user ? (
                  <>
                    {user.role === "admin" ? (
                      <Link to="/admin" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent/60 flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Painel Admin
                      </Link>
                    ) : (
                      <Link to="/meu-espaco" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent/60 flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Meu Espaço
                      </Link>
                    )}
                    <button onClick={() => { logout(); setOpen(false); }} className="px-4 py-3 rounded-lg text-sm font-medium text-destructive text-left flex items-center gap-2">
                      <LogOut className="h-4 w-4" /> Sair
                    </button>
                  </>
                ) : (
                  <Link to="/entrar" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent/60 flex items-center gap-2">
                    <User className="h-4 w-4" /> Entrar
                  </Link>
                )}
                {user?.role !== "admin" && (
                  <Button asChild className="mt-3">
                    <Link to="/publicar" onClick={() => setOpen(false)}>Publicar Ocorrência</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
