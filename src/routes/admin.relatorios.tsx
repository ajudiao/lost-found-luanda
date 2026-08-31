import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/relatorios")({
  component: AdminRelatorios,
});

const reports = [
  {
    title: "Relatório mensal de ocorrências",
    desc: "Detalhe de todas as ocorrências do mês",
    date: "Julho 2026",
  },
  { title: "Taxa de recuperação", desc: "Objetos devolvidos vs. reportados", date: "Julho 2026" },
  { title: "Atividade de utilizadores", desc: "Novos cadastros e engajamento", date: "Julho 2026" },
  {
    title: "Distribuição geográfica",
    desc: "Concentração de ocorrências por município",
    date: "Julho 2026",
  },
];

function AdminRelatorios() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await api.getAdminStats();
        setStatsData(data);
      } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const chartData = statsData?.chartData || [
    { month: "Jan", perdidos: 45, encontrados: 20, recuperados: 12 },
    { month: "Fev", perdidos: 52, encontrados: 28, recuperados: 18 },
    { month: "Mar", perdidos: 61, encontrados: 34, recuperados: 22 },
    { month: "Abr", perdidos: 58, encontrados: 41, recuperados: 30 },
    { month: "Mai", perdidos: 70, encontrados: 45, recuperados: 33 },
    { month: "Jun", perdidos: 82, encontrados: 55, recuperados: 42 },
    { month: "Jul", perdidos: 76, encontrados: 60, recuperados: 48 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Análises e exportação de dados.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display font-bold mb-4">Tendência global</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="perdidos"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Perdidos"
                />
                <Line
                  type="monotone"
                  dataKey="encontrados"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Encontrados"
                />
                <Line
                  type="monotone"
                  dataKey="recuperados"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Recuperados"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display font-bold mb-4">Recuperações</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="recuperados"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  name="Recuperados"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="font-display font-bold">Relatórios disponíveis</h2>
        </div>
        <div className="divide-y divide-border">
          {reports.map((r) => (
            <div key={r.title} className="p-5 flex items-center gap-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.desc} · {r.date}
                </p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-3 w-3 mr-1" /> Exportar
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
