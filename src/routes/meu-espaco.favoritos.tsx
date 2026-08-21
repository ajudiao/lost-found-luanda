import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { occurrences } from "@/lib/mock-data";
import { OccurrenceCard } from "@/components/occurrence-card";

export const Route = createFileRoute("/meu-espaco/favoritos")({
  component: Favoritos,
});

function Favoritos() {
  const favs = occurrences.slice(1, 5);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2"><Heart className="h-6 w-6 text-primary" /> Favoritos</h1>
        <p className="text-sm text-muted-foreground">As ocorrências que guardou para acompanhar.</p>
      </div>
      {favs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Ainda não tem favoritos. Explore as ocorrências e toque no coração para guardar.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favs.map((o, i) => <OccurrenceCard key={o.id} o={o} index={i} />)}
        </div>
      )}
    </div>
  );
}
