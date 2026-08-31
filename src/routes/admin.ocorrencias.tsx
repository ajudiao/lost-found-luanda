import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Trash2, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/ocorrencias")({
  component: AdminOcorrencias,
});

function AdminOcorrencias() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("todos");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getOccurrences({ status: "all" });
      setList(res || []);
    } catch (err) {
      console.error("Erro ao carregar ocorrências admin:", err);
      toast.error("Erro ao carregar ocorrências da API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateStatus(id, newStatus);
      toast.success(`Estado alterado para ${newStatus}.`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao alterar estado.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar definitivamente esta ocorrência da base de dados?")) return;
    try {
      await api.deleteOccurrence(id);
      toast.success("Ocorrência eliminada com sucesso da base de dados.");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao eliminar.");
    }
  };

  const filtered = list.filter(
    (o) =>
      (type === "todos" || (o.type || "").toLowerCase() === type) &&
      (q === "" || o.title.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            Ocorrências{" "}
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Database className="h-3 w-3 mr-1" /> NeonDB API
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerir e moderar todas as ocorrências registadas em tempo real na base de dados.
          </p>
        </div>
        <Badge variant="secondary">{filtered.length} resultados</Badge>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar por título..."
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="perdido">Perdido</SelectItem>
            <SelectItem value="encontrado">Encontrado</SelectItem>
            <SelectItem value="aviso">Aviso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID (NeonDB)</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead className="hidden lg:table-cell">Município</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  A carregar ocorrências da API...
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {o.id.length > 12 ? `${o.id.slice(0, 8)}...` : o.id}
                  </TableCell>
                  <TableCell className="font-medium max-w-[220px] truncate">{o.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {o.category}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {o.municipality}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {(o.status || "").replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link to="/ocorrencia/$id" params={{ id: o.id }}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-success"
                        title="Aprovar/Ativar"
                        onClick={() => handleUpdateStatus(o.id, "ATIVO")}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-warning"
                        title="Colocar Em Análise"
                        onClick={() => handleUpdateStatus(o.id, "EM_ANALISE")}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        title="Eliminar"
                        onClick={() => handleDelete(o.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma ocorrência encontrada na base de dados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
