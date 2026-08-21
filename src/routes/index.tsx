import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bell, MapPin, Search, Sparkles, Users, TrendingUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/search-bar";
import { OccurrenceCard } from "@/components/occurrence-card";
import { api } from "@/lib/api";
import heroImg from "@/assets/hero-illustration.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [occurrencesList, setOccurrencesList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [occs, cats] = await Promise.all([
          api.getOccurrences(),
          api.getCategories(),
        ]);
        setOccurrencesList(occs || []);
        setCategoriesList(cats || []);
      } catch (err) {
        console.error("Erro ao carregar dados da página inicial:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const avisos = occurrencesList.filter((o) => o.type === "aviso").slice(0, 3);
  const recentes = occurrencesList.slice(0, 6);

  const stats = [
    { icon: Package, label: "Ocorrências", value: occurrencesList.length > 0 ? occurrencesList.length.toString() : "1.284" },
    { icon: Sparkles, label: "Recuperados", value: "412" },
    { icon: Users, label: "Utilizadores", value: "3.560" },
    { icon: TrendingUp, label: "Taxa de sucesso", value: "68%" },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container-page pt-16 pb-24 lg:pt-24 lg:pb-32 grid gap-12 lg:grid-cols-2 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-6 py-1.5 px-3 bg-background/60 backdrop-blur">
              <span className="mr-2 h-2 w-2 rounded-full bg-success animate-pulse" />
              Plataforma comunitária • Luanda
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Perdeu ou encontrou<br />um objeto em <span className="text-primary">Luanda</span>?
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Registe uma ocorrência e deixe a plataforma ajudá-lo a encontrar correspondências automaticamente.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6">
                <Link to="/publicar">Reportar Perda <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="h-12 px-6">
                <Link to="/publicar">Reportar Encontro</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-12 px-6">
                <Link to="/avisos">Ver Avisos de Encontro</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-transparent to-success/20 blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
              <img src={heroImg} alt="Comunidade de Luanda" className="w-full h-[380px] object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="container-page -mt-12 relative z-10">
        <SearchBar />
        <div className="mt-8 flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-display font-bold">Explorar por Categoria</h2>
          <Link to="/perdidos" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {(categoriesList.length > 0 ? categoriesList : ["Eletrónicos", "Documentos", "Chaves", "Carteiras", "Bagagem"]).map((cat) => (
            <Link
              key={cat}
              to="/perdidos"
              search={{ category: cat }}
              className="rounded-2xl border border-border bg-card p-4 text-center font-medium shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="container-page py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold">Ocorrências Recentes</h2>
            <p className="text-sm text-muted-foreground">Adicionadas recentemente pela comunidade</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/perdidos">Ver Todas</Link>
          </Button>
        </div>

        {recentes.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">Nenhuma ocorrência encontrada.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentes.map((item) => (
              <OccurrenceCard key={item.id} occurrence={item} />
            ))}
          </div>
        )}
      </section>

      {/* Public Notices */}
      {avisos.length > 0 && (
        <section className="bg-muted/40 py-16 border-y border-border">
          <div className="container-page">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
              <Bell className="h-4 w-4" />
              Avisos de Encontro
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">Objetos que aguardam pelos donos</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {avisos.map((item) => (
                <OccurrenceCard key={item.id} occurrence={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="container-page py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary mx-auto mb-3">
                <s.icon className="h-6 w-6" />
              </div>
              <p className="text-3xl font-display font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
