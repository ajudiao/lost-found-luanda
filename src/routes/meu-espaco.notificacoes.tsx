import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Check, Sparkles, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/meu-espaco/notificacoes")({
  component: Notificacoes,
});

function Notificacoes() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setList(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar notificações:", err);
      toast.error(err.message || "Erro ao carregar notificações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item))
      );
      toast.success("Notificação marcada como lida.");
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar notificação.");
    }
  };

  const markAllRead = async () => {
    const unread = list.filter((item) => !item.read);
    if (unread.length === 0) {
      toast.info("Todas as notificações já estão lidas.");
      return;
    }

    try {
      await Promise.all(unread.map((n) => api.markNotificationRead(n.id)));
      setList((prev) => prev.map((item) => ({ ...item, read: true })));
      toast.success("Todas as notificações foram marcadas como lidas.");
    } catch (err: any) {
      toast.error("Erro ao marcar todas como lidas.");
    }
  };

  const unreadCount = list.filter((item) => !item.read).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" /> Notificações
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full px-2.5 text-xs">
                {unreadCount} novas
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Fique a par de correspondências, mensagens e atualizações da comunidade.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={loadNotifications} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={loading || unreadCount === 0}>
            <Check className="h-4 w-4 mr-1.5" /> Marcar tudo como lido
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card divide-y divide-border/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span>A carregar notificações...</span>
          </div>
        ) : (
          list.map((n) => {
            const descText = n.desc || n.description || "Nova notificação no sistema.";
            const timeText = n.time || (n.createdAt ? new Date(n.createdAt).toLocaleDateString("pt-PT") : "");
            const isMatch = n.title?.toLowerCase().includes("correspondência") || n.title?.toLowerCase().includes("match");
            const isMsg = n.title?.toLowerCase().includes("mensagem");

            return (
              <div
                key={n.id}
                onClick={() => !n.read && handleMarkRead(n.id)}
                className={`p-4 sm:p-5 flex gap-4 items-start transition-all cursor-pointer ${
                  n.read ? "bg-card opacity-80" : "bg-primary/5 hover:bg-primary/10"
                }`}
              >
                <div
                  className={`grid h-9 w-9 place-items-center rounded-xl shrink-0 ${
                    isMatch
                      ? "bg-amber-500/10 text-amber-600"
                      : isMsg
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {isMatch ? (
                    <Sparkles className="h-4.5 w-4.5" />
                  ) : isMsg ? (
                    <MessageSquare className="h-4.5 w-4.5" />
                  ) : (
                    <Bell className="h-4.5 w-4.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.read ? "text-foreground" : "text-primary font-bold"}`}>
                      {n.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                      {timeText}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{descText}</p>
                </div>

                {!n.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkRead(n.id);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
                    title="Marcar como lida"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })
        )}

        {!loading && list.length === 0 && (
          <div className="p-12 text-center space-y-2">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground mx-auto">
              <Bell className="h-6 w-6" />
            </div>
            <p className="font-semibold text-base">Sem notificações</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Não tem nenhuma notificação pendente de momento. Quando houver correspondências ou novidades, aparecerão aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
