import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, MapPin, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/avisos")({
  component: AdminAvisos,
});

function AdminAvisos() {
  const [avisos, setAvisos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAvisos() {
      try {
        setLoading(true);
        const list = await api.getOccurrences({ type: "aviso" });
        setAvisos(list || []);
      } catch (err) {
        console.error("Erro ao carregar avisos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAvisos();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Avisos de Encontro</h1>
        <p className="text-sm text-muted-foreground">Publicações de avisos moderadas pela plataforma.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-muted-foreground">A carregar avisos...</p>
        ) : (
          avisos.map((a) => {
            const imageSrc =
              Array.isArray(a.images) && a.images.length > 0
                ? a.images[0]
                : `https://picsum.photos/seed/${encodeURIComponent(a.id)}/800/600`;

            return (
              <div key={a.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="aspect-video bg-muted overflow-hidden">
                  <img src={imageSrc} alt={a.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary border-0">
                      <Bell className="h-3 w-3 mr-1" /> Aviso
                    </Badge>
                    <span className="text-xs text-muted-foreground">{a.id}</span>
                  </div>
                  <h3 className="font-semibold truncate">{a.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {a.municipality}, {a.neighborhood}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {a.date}
                  </p>
                  <Button asChild size="sm" variant="outline" className="w-full mt-2">
                    <Link to="/ocorrencia/$id" params={{ id: a.id }}>
                      <Eye className="h-3 w-3 mr-1" /> Ver detalhes
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}

        {!loading && avisos.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Ainda não há avisos publicados.
          </div>
        )}
      </div>
    </div>
  );
}
