import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, FileText, Plus, MessageSquare, Bell, User, Settings, MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/meu-espaco")({
  head: () => ({ meta: [{ title: "Meu Espaço — Achados Luanda" }] }),
  component: MyAreaLayout,
});

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/meu-espaco", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/meu-espaco/ocorrencias", label: "Minhas Ocorrências", icon: FileText },
  { to: "/publicar", label: "Nova Ocorrência", icon: Plus },
  { to: "/meu-espaco/mensagens", label: "Mensagens", icon: MessageSquare },
  { to: "/meu-espaco/notificacoes", label: "Notificações", icon: Bell },
  { to: "/meu-espaco/perfil", label: "Perfil", icon: User },
  { to: "/meu-espaco/configuracoes", label: "Configurações", icon: Settings },
];

function MyAreaLayout() {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (ready && !user) navigate({ to: "/entrar" });
  }, [ready, user, navigate]);

  if (!ready || !user) return null;

  const isActive = (item: (typeof nav)[number]) =>
    item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shrink-0"><MapPin className="h-4 w-4" /></div>
              <span className="font-display font-bold truncate">Achados.Luanda</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={isActive(item)}>
                        <Link to={item.to as "/meu-espaco"} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" /><span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-3">
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate({ to: "/" }); }} className="justify-start">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
            <SidebarTrigger />
            <span className="text-sm font-semibold">Meu Espaço</span>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild size="sm"><Link to="/publicar"><Plus className="h-4 w-4 mr-1" /> Publicar</Link></Button>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
