import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { OccurrenceCard } from "@/components/occurrence-card";
import { api } from "@/lib/api";

export const Route = createFileRoute("/meu-espaco/favoritos")({
  component: Favoritos,
});

function Favoritos() {
  const [favs, setFavs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getFavorites();
        setFavs(data || []);
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" /> Favoritos
          </h1>
          <p className="text-sm text-muted-foreground">A carregar ocorrências guardadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary" /> Favoritos
        </h1>
        <p className="text-sm text-muted-foreground">As ocorrências que guardou para acompanhar.</p>
      </div>
      {favs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Ainda não tem favoritos. Explore as ocorrências na plataforma e guarde as que desejar.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favs.map((o, i) => (
            <OccurrenceCard key={o.id} occurrence={o} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
