import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

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
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAllRead = async () => {
    for (const n of list.filter((item) => !item.read)) {
      try {
        await api.markNotificationRead(n.id);
      } catch {}
    }
    loadNotifications();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" /> Notificações
          </h1>
          <p className="text-sm text-muted-foreground">Fique a par de tudo o que acontece.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <Check className="h-4 w-4 mr-1" /> Marcar tudo como lido
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">A carregar notificações...</div>
        ) : (
          list.map((n) => (
            <div
              key={n.id}
              className="p-4 flex gap-3 items-start hover:bg-muted/30 transition-colors"
            >
              <div
                className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  n.read ? "bg-muted" : "bg-primary"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
              </div>
            </div>
          ))
        )}

        {!loading && list.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Sem notificações de momento.
          </div>
        )}
      </div>
    </div>
  );
}
