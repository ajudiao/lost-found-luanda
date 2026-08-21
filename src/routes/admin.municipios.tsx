import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/municipios")({
  component: AdminMunicipios,
});

function AdminMunicipios() {
  const [municipalitiesList, setMunicipalitiesList] = useState<string[]>([]);
  const [neighborhoodsMap, setNeighborhoodsMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getLocations();
        if (res) {
          setMunicipalitiesList(res.municipalities || []);
          setNeighborhoodsMap(res.neighborhoods || {});
        }
      } catch (err) {
        console.error("Erro ao carregar municípios:", err);
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
          <h1 className="text-2xl font-display font-bold">Municípios</h1>
          <p className="text-sm text-muted-foreground">
            Áreas geográficas cobertas pela plataforma.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Novo município
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {loading ? (
          <p className="text-muted-foreground">A carregar municípios...</p>
        ) : (
          municipalitiesList.map((m) => {
            const nb = neighborhoodsMap[m] || [];
            return (
              <div key={m} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{m}</p>
                      <p className="text-xs text-muted-foreground">{nb.length} bairros mapeados</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                {nb.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {nb.map((n) => (
                      <Badge key={n} variant="outline" className="text-xs">
                        {n}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
