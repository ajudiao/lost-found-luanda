import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Bell, MapPin, Search, Sparkles, Users, TrendingUp, Package,
  Smartphone, FileText, Key, Wallet, Briefcase, Car, Dog, Watch, Laptop, Shirt, Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/search-bar";
import { OccurrenceCard } from "@/components/occurrence-card";
import { api } from "@/lib/api";
import heroImg from "@/assets/hero-illustration.png";
import luandaCityHero from "@/assets/luanda-bay-hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const defaultCategories = [
  { name: "Eletrónicos", icon: Smartphone, emoji: "📱" },
  { name: "Documentos", icon: FileText, emoji: "📄" },
  { name: "Chaves", icon: Key, emoji: "🔑" },
  { name: "Carteiras", icon: Wallet, emoji: "👛" },
  { name: "Bagagem", icon: Briefcase, emoji: "🧳" },
  { name: "Veículos", icon: Car, emoji: "🚗" },
  { name: "Animais", icon: Dog, emoji: "🐕" },
  { name: "Acessórios", icon: Watch, emoji: "⌚" },
  { name: "Informática", icon: Laptop, emoji: "💻" },
  { name: "Vestuário", icon: Shirt, emoji: "👕" },
];

const categoryIconMap: Record<string, { icon: any; emoji: string }> = {
  "eletrónicos": { icon: Smartphone, emoji: "📱" },
  "documentos": { icon: FileText, emoji: "📄" },
  "chaves": { icon: Key, emoji: "🔑" },
  "carteiras": { icon: Wallet, emoji: "👛" },
  "bagagem": { icon: Briefcase, emoji: "🧳" },
  "veículos": { icon: Car, emoji: "🚗" },
  "animais": { icon: Dog, emoji: "🐕" },
  "acessórios": { icon: Watch, emoji: "⌚" },
  "informática": { icon: Laptop, emoji: "💻" },
  "vestuário": { icon: Shirt, emoji: "👕" },
};

function Index() {
  const [occurrencesList, setOccurrencesList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>(defaultCategories);
  const [publicStats, setPublicStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [occs, cats, statsRes] = await Promise.all([
          api.getOccurrences(),
          api.getCategories(),
          api.getPublicStats().catch(() => null),
        ]);
        setOccurrencesList(occs || []);
        if (statsRes) setPublicStats(statsRes);

        if (Array.isArray(cats) && cats.length > 0) {
          const mapped = cats.map((catName: string) => {
            const lower = catName.toLowerCase();
            const found = categoryIconMap[lower] || { icon: Package, emoji: "📦" };
            return {
              name: catName,
              icon: found.icon,
              emoji: found.emoji,
            };
          });
          setCategoriesList(mapped);
        }
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
    { icon: Package, label: "Ocorrências", value: publicStats?.totalOccurrences !== undefined ? publicStats.totalOccurrences.toString() : "0" },
    { icon: Sparkles, label: "Recuperados", value: publicStats?.resolvedOccurrences !== undefined ? publicStats.resolvedOccurrences.toString() : "0" },
    { icon: Users, label: "Utilizadores", value: publicStats?.totalUsers !== undefined ? publicStats.totalUsers.toString() : "0" },
    { icon: TrendingUp, label: "Taxa de sucesso", value: publicStats?.successRate || "0%" },
  ];

  // Triplicar lista para movimento fluido e contínuo
  const marqueeItems = [...categoriesList, ...categoriesList, ...categoriesList];

  return (
    <main>
      {/* Hero com Foto Nítida da Baía de Luanda */}
      <section className="relative overflow-hidden min-h-[680px] flex flex-col justify-between border-b border-border/40 -mt-16 sm:-mt-20 pt-24 sm:pt-32 pb-10 sm:pb-14">
        {/* Foto de Fundo 100% Nítida sem Gradientes Brancos */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={luandaCityHero}
            alt="Baía de Luanda"
            className="w-full h-full object-cover object-center opacity-100 scale-100 transition-all duration-300"
          />
        </div>

        <div className="container-page pt-4 pb-10 grid gap-12 lg:grid-cols-2 items-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-6 py-1.5 px-3.5 bg-zinc-950/85 backdrop-blur-md border-red-500/50 text-white shadow-xl">
              <span className="mr-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Plataforma comunitária • Luanda 🇦🇴
            </Badge>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Perdeu ou encontrou<br />um objeto em <span className="text-blue-400 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">Luanda</span>?
            </h1>

            <p className="mt-6 text-lg text-zinc-100 max-w-xl font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              Registe uma ocorrência e deixe a plataforma ajudá-lo a encontrar correspondências automaticamente.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6 shadow-xl shadow-blue-900/40 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30">
                <Link to="/publicar">Reportar Perda <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="h-12 px-6 rounded-2xl backdrop-blur-md bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700/80 shadow-lg">
                <Link to="/publicar">Reportar Encontro</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-12 px-6 rounded-2xl bg-zinc-950/60 hover:bg-zinc-900/90 text-white backdrop-blur-md border border-zinc-800/80">
                <Link to="/avisos">Ver Avisos de Encontro</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 via-transparent to-red-500/10 blur-xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img src={heroImg} alt="Comunidade de Luanda" className="w-full h-[380px] object-cover rounded-3xl" />
            </div>
          </motion.div>
        </div>

        {/* Input de Pesquisa 100% integrado por cima da Foto com margem inferior */}
        <div className="container-page relative z-10 pt-4 pb-4">
          <SearchBar />
        </div>
      </section>

      {/* Dynamic Moving Marquee Categories */}
      <section className="container-page pt-10 relative z-10 space-y-8">

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold leading-none">Explorar por Categoria</h2>
                <p className="text-xs text-muted-foreground mt-1">Passe o cursor para pausar o movimento contínuo</p>
              </div>
            </div>
            <Link to="/perdidos" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Infinite Moving Marquee Container */}
          <div className="relative overflow-hidden py-2 group">
            {/* Fade Out Edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

            <motion.div
              className="flex gap-4 w-max cursor-grab active:cursor-grabbing"
              animate={{ x: ["0%", "-33.333%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
              whileHover={{ animationPlayState: "paused" }}
            >
              {marqueeItems.map((cat, idx) => {
                const Icon = cat.icon || Package;
                return (
                  <Link
                    key={`${cat.name}-${idx}`}
                    to="/perdidos"
                    search={{ category: cat.name }}
                    className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-border/80 bg-card/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all duration-300 group/card shrink-0"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-all duration-300 text-lg shadow-inner">
                      {cat.emoji ? cat.emoji : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-sm text-foreground group-hover/card:text-primary transition-colors whitespace-nowrap">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">Explorar itens →</span>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="container-page py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold">Ocorrências Recentes</h2>
            <p className="text-sm text-muted-foreground">Adicionadas recentemente pela comunidade</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/perdidos">Ver Todas</Link>
          </Button>
        </div>

        {recentes.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">Nenhuma ocorrência encontrada.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentes.map((item, i) => (
              <OccurrenceCard key={item.id} occurrence={item} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Notices Carousel/List */}
      {avisos.length > 0 && (
        <section className="bg-muted/40 py-16 border-y border-border">
          <div className="container-page">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge variant="outline" className="mb-2 bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Avisos de Encontro
                </Badge>
                <h2 className="text-2xl font-display font-bold">Utilidade Pública</h2>
              </div>
              <Button asChild variant="ghost" className="rounded-xl">
                <Link to="/avisos">Ver Todos os Avisos →</Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {avisos.map((item, i) => (
                <OccurrenceCard key={item.id} occurrence={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Real Statistics Section */}
      <section className="container-page py-20">
        <div className="rounded-3xl bg-zinc-950 text-white p-8 md:p-12 relative overflow-hidden border border-zinc-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {stats.map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-900 border border-zinc-800 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="font-display text-3xl font-extrabold text-white tracking-tight">{s.value}</p>
                <p className="text-sm text-zinc-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
