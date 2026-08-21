import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { OccurrenceCard } from "@/components/occurrence-card";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export const Route = createFileRoute("/meu-espaco/")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const [mine, setMine] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userOccs, userNotifs] = await Promise.all([
          api.getUserOccurrences(),
          api.getNotifications(),
        ]);
        setMine(userOccs || []);
        setNotifs(userNotifs || []);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard do utilizador:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalMinhas = mine.length;
  const emAnalise = mine.filter((o) => (o.status || "").toLowerCase() === "em_analise").length;
  const resolvidos = mine.filter((o) => (o.status || "").toLowerCase() === "resolvido").length;

  const stats = [
    { label: "Minhas ocorrências", value: totalMinhas, hint: "publicadas por si" },
    { label: "Em análise", value: emAnalise, hint: "aguardam moderação" },
    { label: "Notificações", value: notifs.filter((n) => !n.read).length, hint: "não lidas" },
    { label: "Recuperados", value: resolvidos, hint: "resolvidos com sucesso" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Olá, {user?.name || "Utilizador"} 👋</h1>
        <p className="text-muted-foreground text-sm">Aqui está o resumo da sua atividade.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-display font-bold mt-1">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.hint}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display font-bold text-lg">As minhas publicações recentes</h2>
          {loading ? (
            <p className="text-muted-foreground">A carregar...</p>
          ) : mine.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Ainda não publicou nenhuma ocorrência.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {mine.slice(0, 4).map((o, i) => (
                <OccurrenceCard key={o.id} occurrence={o} index={i} />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display font-bold mb-4">Notificações</h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-xs text-muted-foreground">A carregar...</p>
            ) : (
              notifs.slice(0, 4).map((n) => (
                <div key={n.id} className="flex gap-3">
                  <div
                    className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      n.read ? "bg-muted" : "bg-primary"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.desc}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))
            )}
            {!loading && notifs.length === 0 && (
              <p className="text-xs text-muted-foreground">Sem notificações.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
