import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Package, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  const [activitiesList, setActivitiesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [statsRes, actsRes] = await Promise.all([
          api.getAdminStats(),
          api.getAdminActivities(),
        ]);
        setStatsData(statsRes);
        setActivitiesList(actsRes || []);
      } catch (err) {
        console.error("Erro ao carregar métricas administrativas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const totalPerdidos = statsData?.totalPerdidos || 0;
  const totalEncontrados = statsData?.totalEncontrados || 0;
  const totalRecuperados = statsData?.totalRecuperados || 0;
  const chartData = statsData?.chartData || [
    { month: "Jan", perdidos: 45, encontrados: 20, recuperados: 12 },
    { month: "Fev", perdidos: 52, encontrados: 28, recuperados: 18 },
    { month: "Mar", perdidos: 61, encontrados: 34, recuperados: 22 },
    { month: "Abr", perdidos: 58, encontrados: 41, recuperados: 30 },
    { month: "Mai", perdidos: 70, encontrados: 45, recuperados: 33 },
    { month: "Jun", perdidos: 82, encontrados: 55, recuperados: 42 },
    { month: "Jul", perdidos: 76, encontrados: 60, recuperados: 48 },
  ];

  const cards = [
    { label: "Ocorrências Perdidos", value: totalPerdidos.toString(), trend: "Ativo", icon: Package },
    { label: "Ocorrências Encontrados", value: totalEncontrados.toString(), trend: "Ativo", icon: Bell },
    { label: "Itens Recuperados", value: totalRecuperados.toString(), trend: "Sucesso", icon: TrendingUp },
    { label: "Total na Plataforma", value: (totalPerdidos + totalEncontrados).toString(), trend: "+100%", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Visão geral</h1>
        <p className="text-sm text-muted-foreground">Atividade da plataforma em tempo real.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {cards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <s.icon className="h-5 w-5 text-primary" />
              <Badge variant="secondary" className="text-xs">
                {s.trend}
              </Badge>
            </div>
            <p className="text-2xl font-display font-bold mt-3">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Evolução mensal</h2>
            <span className="text-xs text-muted-foreground">Últimos meses</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="perdidos" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Perdidos" />
                <Area type="monotone" dataKey="encontrados" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} name="Encontrados" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display font-bold mb-4">Atividade recente</h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-muted-foreground">A carregar atividades...</p>
            ) : (
              activitiesList.map((a) => (
                <div key={a.id} className="flex items-start gap-3 text-xs border-b border-border/50 pb-3 last:border-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      <span className="font-semibold">{a.user}</span> {a.action}
                    </p>
                    {a.target && <p className="text-muted-foreground">"{a.target}"</p>}
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))
            )}
            {!loading && activitiesList.length === 0 && (
              <p className="text-xs text-muted-foreground">Sem atividade recente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
