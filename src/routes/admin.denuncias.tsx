import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flag, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/denuncias")({
  component: AdminDenuncias,
});

function AdminDenuncias() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminReports();
      setReports(data || []);
    } catch (err) {
      console.error("Erro ao carregar denúncias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleResolve = async (id: string, action: "APROVAR" | "SUSPENDER" | "REJEITAR") => {
    try {
      await api.resolveReport(id, action);
      toast.success("Denúncia atualizada com sucesso.");
      loadReports();
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar denúncia.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Denúncias</h1>
        <p className="text-sm text-muted-foreground">Reportes enviados por utilizadores.</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-muted-foreground">A carregar denúncias...</p>
        ) : (
          reports.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-border bg-card p-5 flex items-start gap-4"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/10 text-destructive shrink-0">
                <Flag className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
                  <Badge variant="outline">{d.occurrenceTitle}</Badge>
                  {d.status === "pendente" ? (
                    <Badge className="bg-warning/10 text-warning border-0">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Pendente
                    </Badge>
                  ) : (
                    <Badge className="bg-success/10 text-success border-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Resolvido
                    </Badge>
                  )}
                </div>
                <p className="mt-1 font-medium">{d.reason}</p>
                <p className="text-xs text-muted-foreground">
                  Reportado por {d.reportedBy} · {d.date}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {d.status === "pendente" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(d.id, "SUSPENDER")}
                    >
                      Suspender Ocorrência
                    </Button>
                    <Button size="sm" onClick={() => handleResolve(d.id, "APROVAR")}>
                      Marcar Resolvido
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}

        {!loading && reports.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Sem denúncias pendentes.
          </div>
        )}
      </div>
    </div>
  );
}
