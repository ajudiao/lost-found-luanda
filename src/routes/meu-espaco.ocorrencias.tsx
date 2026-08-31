import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Eye, Trash2, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/meu-espaco/ocorrencias")({
  component: MyOccurrences,
});

const statusMeta: Record<string, { label: string; className: string }> = {
  ativo: { label: "Ativo", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  em_analise: { label: "Em análise", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  resolvido: { label: "Resolvido", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  arquivado: { label: "Arquivado", className: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20" },
};

function MyOccurrences() {
  const [mine, setMine] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"todos" | "perdido" | "encontrado" | "aviso">("todos");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await api.getUserOccurrences();
      setMine(list || []);
    } catch (err: any) {
      console.error("Erro ao carregar minhas ocorrências:", err);
      toast.error(err.message || "Erro ao carregar publicações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await api.updateStatus(id, newStatus);
      toast.success(`Estado alterado para "${newStatus.toUpperCase()}" com sucesso!`);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar estado.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem a certeza que deseja eliminar esta ocorrência?")) return;
    try {
      await api.deleteOccurrence(id);
      toast.success("Ocorrência eliminada.");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao eliminar.");
    }
  };

  const filtered = mine.filter(
    (o) =>
      (tab === "todos" || (o.type || "").toLowerCase() === tab) &&
      (o.title.toLowerCase().includes(query.toLowerCase()) ||
        o.category.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Minhas Ocorrências</h1>
          <p className="text-sm text-muted-foreground">Gerencie o estado e visibilidade das suas publicações.</p>
        </div>
        <Button asChild className="rounded-xl shadow-md">
          <Link to="/publicar">
            <Plus className="h-4 w-4 mr-1.5" /> Nova Ocorrência
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar publicações..."
            className="pl-9 rounded-xl"
          />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="rounded-xl p-1">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="perdido">Perdidos</TabsTrigger>
            <TabsTrigger value="encontrado">Encontrados</TabsTrigger>
            <TabsTrigger value="aviso">Avisos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Ocorrência</th>
                <th className="text-left px-4 py-3 font-semibold">Categoria</th>
                <th className="text-left px-4 py-3 font-semibold">Data</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-right px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    A carregar as suas ocorrências...
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const itemStatus = (o.status || "ativo").toLowerCase();
                  const s = statusMeta[itemStatus] || statusMeta["ativo"];
                  const imageSrc =
                    Array.isArray(o.images) && o.images.length > 0
                      ? o.images[0]
                      : `https://picsum.photos/seed/${encodeURIComponent(o.id)}/800/600`;

                  return (
                    <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img src={imageSrc} alt="" className="h-11 w-11 rounded-xl object-cover border border-border" />
                          <div>
                            <p className="font-semibold text-foreground line-clamp-1">{o.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {o.neighborhood || "Luanda"}, {o.municipality || "Luanda"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-medium">{o.category}</td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {o.date ? new Date(o.date).toLocaleDateString("pt-PT") : ""}
                      </td>
                      <td className="px-4 py-3.5">
                        <Select
                          value={itemStatus}
                          disabled={updatingId === o.id}
                          onValueChange={(val) => handleStatusChange(o.id, val)}
                        >
                          <SelectTrigger className="h-8 w-[130px] text-xs font-semibold rounded-lg border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="ativo">🟢 Ativo</SelectItem>
                            <SelectItem value="em_analise">🟡 Em análise</SelectItem>
                            <SelectItem value="resolvido">✅ Resolvido</SelectItem>
                            <SelectItem value="arquivado">📁 Arquivado</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {itemStatus !== "resolvido" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={updatingId === o.id}
                              onClick={() => handleStatusChange(o.id, "resolvido")}
                              className="h-8 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-500/30 rounded-lg gap-1"
                              title="Marcar este item como Resolvido / Recuperado"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="hidden sm:inline">Resolvido</span>
                            </Button>
                          )}

                          <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <Link to="/ocorrencia/$id" params={{ id: o.id }}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(o.id)}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    Nenhuma ocorrência encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
