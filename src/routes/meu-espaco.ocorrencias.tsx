import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/meu-espaco/ocorrencias")({
  component: MyOccurrences,
});

const statusLabels: Record<string, string> = {
  ativo: "Ativo",
  em_analise: "Em análise",
  resolvido: "Resolvido",
  arquivado: "Arquivado",
};

function MyOccurrences() {
  const [mine, setMine] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"todos" | "perdido" | "encontrado" | "aviso">("todos");

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await api.getUserOccurrences();
      setMine(list || []);
    } catch (err) {
      console.error("Erro ao carregar minhas ocorrências:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          <p className="text-sm text-muted-foreground">Gerencie as suas publicações.</p>
        </div>
        <Button asChild>
          <Link to="/publicar">
            <Plus className="h-4 w-4 mr-1" /> Nova Ocorrência
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar..."
            className="pl-9"
          />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="perdido">Perdidos</TabsTrigger>
            <TabsTrigger value="encontrado">Encontrados</TabsTrigger>
            <TabsTrigger value="aviso">Avisos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Ocorrência</th>
                <th className="text-left px-4 py-3 font-medium">Categoria</th>
                <th className="text-left px-4 py-3 font-medium">Data</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-right px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    A carregar as suas ocorrências...
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const imageSrc =
                    Array.isArray(o.images) && o.images.length > 0
                      ? o.images[0]
                      : `https://picsum.photos/seed/${encodeURIComponent(o.id)}/800/600`;

                  return (
                    <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={imageSrc} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium">{o.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {o.id} · {o.municipality}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{o.category}</td>
                      <td className="px-4 py-3">{o.date}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {statusLabels[o.status] || o.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button asChild variant="ghost" size="icon">
                            <Link to="/ocorrencia/$id" params={{ id: o.id }}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(o.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
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
