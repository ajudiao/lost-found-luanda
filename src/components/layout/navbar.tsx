import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, MapPin, Moon, Sun, User, LogOut, LayoutDashboard, Shield, Plus, Sparkles } from "lucide-react";
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    <header className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div
        className={`max-w-6xl mx-auto pointer-events-auto rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-background/85 dark:bg-zinc-950/85 backdrop-blur-xl border border-border/80 shadow-xl shadow-black/5 dark:shadow-black/50 py-2 px-3 sm:px-4"
            : "bg-background/70 dark:bg-zinc-950/70 backdrop-blur-lg border border-border/40 shadow-md py-2.5 px-4"
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-red-500/30 transition-transform group-hover:scale-105">
              <MapPin className="h-4.5 w-4.5 fill-white/20" />
            </div>
            <span className="font-display text-base sm:text-lg font-extrabold tracking-tight">
              Achados<span className="text-red-600">.</span>Luanda
            </span>
          </Link>

          {/* Floating Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-muted/40 dark:bg-zinc-900/60 p-1 rounded-full border border-border/40">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "text-primary-foreground bg-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/80 dark:hover:bg-zinc-800/80"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDark}
              className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Alternar tema"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <>
                <Link to="/meu-espaco/notificacoes">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full gap-2 px-2 h-8 border border-border/60">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline text-xs font-semibold max-w-[90px] truncate">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-border">
                    <DropdownMenuLabel className="p-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === "admin" ? (
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link to="/admin"><Shield className="h-4 w-4 mr-2 text-primary" />Painel Admin</Link>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link to="/meu-espaco"><LayoutDashboard className="h-4 w-4 mr-2 text-primary" />Meu Espaço</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="rounded-xl cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />Terminar sessão
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild size="sm" variant="ghost" className="rounded-full text-xs font-semibold h-8 px-3">
                <Link to="/entrar">Entrar</Link>
              </Button>
            )}

            {user?.role !== "admin" && (
              <Button asChild size="sm" className="rounded-full text-xs font-semibold h-8 px-3.5 shadow-md shadow-primary/25 hover:shadow-primary/40 transition-all">
                <Link to="/publicar">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Publicar
                </Link>
              </Button>
            )}

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full h-8 w-8"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden pointer-events-auto"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-background dark:bg-zinc-950 border-l border-border p-6 shadow-2xl lg:hidden overflow-y-auto pointer-events-auto flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20">
                      <MapPin className="h-4 w-4 fill-white/20" />
                    </div>
                    <span className="font-display font-bold text-base">Achados.Luanda</span>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col gap-1">
                  {nav.map((n) => {
                    const active = path === n.to;
                    return (
                      <Link
                        key={n.to}
                        to={n.to}
                        onClick={() => setOpen(false)}
                        className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        {n.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-border space-y-3">
                {user ? (
                  <>
                    {user.role === "admin" ? (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-accent flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4 text-primary" /> Painel Admin
                      </Link>
                    ) : (
                      <Link
                        to="/meu-espaco"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-accent flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" /> Meu Espaço Pessoal
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setOpen(false); }}
                      className="w-full px-4 py-3 rounded-2xl text-sm font-semibold text-destructive hover:bg-destructive/10 text-left flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Terminar Sessão
                    </button>
                  </>
                ) : (
                  <Link
                    to="/entrar"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-accent flex items-center gap-2"
                  >
                    <User className="h-4 w-4" /> Entrar na Conta
                  </Link>
                )}

                {user?.role !== "admin" && (
                  <Button asChild className="w-full rounded-2xl h-11">
                    <Link to="/publicar" onClick={() => setOpen(false)}>
                      <Plus className="h-4 w-4 mr-1.5" /> Publicar Ocorrência
                    </Link>
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
