import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/categorias")({
  component: AdminCategorias,
});

function AdminCategorias() {
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getCategories();
        setCategoriesList(data || []);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground">Gestão de categorias de ocorrências.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Nova categoria
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-muted-foreground">A carregar categorias...</p>
        ) : (
          categoriesList.map((c) => (
            <div
              key={c}
              className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{c}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Ativo
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
