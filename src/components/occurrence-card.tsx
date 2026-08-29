import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Sparkles, Heart, ArrowUpRight, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { toast } from "sonner";

const typeMeta: Record<string, { label: string; className: string }> = {
  perdido: {
    label: "Perdido",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  encontrado: {
    label: "Encontrado",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  aviso: {
    label: "Aviso",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
};

const statusMeta: Record<string, { label: string; className: string }> = {
  ativo: { label: "Ativo", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  em_analise: { label: "Em análise", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  resolvido: { label: "Resolvido", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  arquivado: { label: "Arquivado", className: "bg-zinc-500/10 text-zinc-500" },
};

export function OccurrenceCard({
  o,
  occurrence,
  index = 0,
  isFavoriteInitial = false,
  onFavoriteToggle,
}: {
  o?: any;
  occurrence?: any;
  index?: number;
  isFavoriteInitial?: boolean;
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
}) {
  const item = occurrence || o;
  const { user } = useAuth();
  const [fav, setFav] = useState(isFavoriteInitial);
  const [loadingFav, setLoadingFav] = useState(false);

  if (!item) return null;

  const itemType = (item.type || "perdido").toLowerCase();
  const itemStatus = (item.status || "ativo").toLowerCase();
  const t = typeMeta[itemType] || typeMeta["perdido"];
  const s = statusMeta[itemStatus] || statusMeta["ativo"];

  const imageSrc =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : `https://picsum.photos/seed/${encodeURIComponent(item.id || "card")}/800/600`;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Inicie sessão para guardar ocorrências nos seus favoritos.");
      return;
    }

    try {
      setLoadingFav(true);
      if (fav) {
        await api.removeFavorite(item.id);
        setFav(false);
        toast.success("Removido dos favoritos.");
        if (onFavoriteToggle) onFavoriteToggle(item.id, false);
      } else {
        await api.addFavorite(item.id);
        setFav(true);
        toast.success("Adicionado aos favoritos!");
        if (onFavoriteToggle) onFavoriteToggle(item.id, true);
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar favoritos.");
    } finally {
      setLoadingFav(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="h-full"
    >
      <Link
        to="/ocorrencia/$id"
        params={{ id: item.id }}
        className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-border/80 bg-card hover:border-primary/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image & Overlay Header */}
        <div className="relative aspect-[16/11] overflow-hidden bg-muted/60">
          <img
            src={imageSrc}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badges on Image (Top Left) */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <Badge variant="outline" className={`${t.className} backdrop-blur-md font-semibold text-xs py-0.5 px-2.5 shadow-sm`}>
              {t.label}
            </Badge>
            {item.category && (
              <Badge variant="secondary" className="bg-black/40 text-white backdrop-blur-md text-[11px] font-medium border-0 py-0.5 px-2">
                {item.category}
              </Badge>
            )}
          </div>

          {/* Favorite & Match Badge (Top Right) */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            {item.matchPercent !== undefined && (
              <div className="flex items-center gap-1 rounded-full bg-primary/95 text-primary-foreground backdrop-blur-md px-2.5 py-1 text-xs font-bold shadow-md shadow-primary/20">
                <Sparkles className="h-3 w-3 animate-pulse" /> {item.matchPercent}%
              </div>
            )}

            {/* Favorite Heart Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={loadingFav}
              onClick={handleFavoriteClick}
              className={`rounded-full h-8 w-8 backdrop-blur-md transition-all duration-300 shadow-md ${
                fav
                  ? "bg-rose-500 text-white hover:bg-rose-600 scale-105"
                  : "bg-black/40 text-white hover:bg-black/60 hover:scale-110"
              }`}
              aria-label="Favoritar"
            >
              <Heart className={`h-4 w-4 transition-transform ${fav ? "fill-white" : ""}`} />
            </Button>
          </div>

          {/* Location Badge (Bottom of Image) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium z-10">
            <div className="flex items-center gap-1.5 backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-full truncate max-w-[85%] border border-white/10">
              <MapPin className="h-3.5 w-3.5 text-rose-500 fill-rose-500 shrink-0" />
              <span className="truncate">
                {item.neighborhood || "Luanda"}, {item.municipality || "Luanda"}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-bold text-base leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
            </div>

            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {/* Details & Attributes */}
          {(item.brand || item.color) && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.brand && (
                <span className="text-[10px] font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-md">
                  {item.brand}
                </span>
              )}
              {item.color && (
                <span className="text-[10px] font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-md">
                  {item.color}
                </span>
              )}
            </div>
          )}

          {/* Footer Bar */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span>{item.date ? new Date(item.date).toLocaleDateString("pt-PT") : "Recentemente"}</span>
            </div>

            <div className="flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
              <span>Detalhes</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
