import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { OccurrenceCard } from "@/components/occurrence-card";
import { api } from "@/lib/api";

export const Route = createFileRoute("/perdidos")({
  head: () => ({
    meta: [
      { title: "Objetos Perdidos — Achados Luanda" },
      { name: "description", content: "Objetos perdidos em Luanda reportados pela comunidade." },
    ],
  }),
  component: () => (
    <ListingPage
      type="perdido"
      title="Objetos Perdidos"
      subtitle="Ajude alguém a reencontrar o que perdeu."
    />
  ),
});

export function ListingPage({
  type,
  title,
  subtitle,
}: {
  type: "perdido" | "encontrado" | "aviso";
  title: string;
  subtitle: string;
}) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getOccurrences({ type });
        setList(data || []);
      } catch (err) {
        console.error(`Erro ao carregar lista de ${type}:`, err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type]);

  return (
    <main className="container-page py-10 lg:py-14">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      </div>
      <SearchBar />
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">A carregar ocorrências...</div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((o, i) => (
            <OccurrenceCard key={o.id} occurrence={o} index={i} />
          ))}
        </div>
      )}
      {!loading && list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center mt-8">
          <p className="text-muted-foreground">Ainda não há ocorrências desta categoria.</p>
        </div>
      )}
    </main>
  );
}
