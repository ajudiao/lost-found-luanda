import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Bell,
  Users,
  Tag,
  MapPin,
  Flag,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Achados Luanda" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/ocorrencias", label: "Ocorrências", icon: FileText },
  { to: "/admin/avisos", label: "Avisos", icon: Bell },
  { to: "/admin/utilizadores", label: "Utilizadores", icon: Users },
  { to: "/admin/categorias", label: "Categorias", icon: Tag },
  { to: "/admin/municipios", label: "Municípios", icon: MapPin },
  { to: "/admin/denuncias", label: "Denúncias", icon: Flag },
  { to: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

function AdminLayout() {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (ready && (!user || user.role !== "admin")) navigate({ to: "/entrar" });
  }, [ready, user, navigate]);

  if (!ready || !user || user.role !== "admin") return null;

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20 shrink-0">
                <MapPin className="h-4 w-4 fill-white/20" />
              </div>
              <div className="min-w-0">
                <span className="font-display font-bold block truncate">Admin</span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.map((item) => (
                    <SidebarMenuItem key={item.to + item.label}>
                      <SidebarMenuButton asChild isActive={isActive(item.to, item.exact)}>
                        <Link to={item.to}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
            <SidebarTrigger />
            <div className="min-w-0">
              <p className="text-sm font-semibold">Painel Administrativo</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success" /> Online
              </Badge>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8 space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
