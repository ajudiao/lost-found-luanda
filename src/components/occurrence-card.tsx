import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeMeta: Record<string, { label: string; className: string }> = {
  perdido: { label: "Perdido", className: "bg-destructive/10 text-destructive border-destructive/20" },
  encontrado: { label: "Encontrado", className: "bg-success/10 text-success border-success/20" },
  aviso: { label: "Aviso", className: "bg-warning/15 text-warning-foreground border-warning/30" },
};

const statusMeta: Record<string, string> = {
  ativo: "Ativo",
  em_analise: "Em análise",
  resolvido: "Resolvido",
  arquivado: "Arquivado",
};

export function OccurrenceCard({
  o,
  occurrence,
  index = 0,
}: {
  o?: any;
  occurrence?: any;
  index?: number;
}) {
  const item = occurrence || o;
  if (!item) return null;

  const itemType = (item.type || "perdido").toLowerCase();
  const itemStatus = (item.status || "ativo").toLowerCase();
  const t = typeMeta[itemType] || typeMeta["perdido"];
  const imageSrc =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : `https://picsum.photos/seed/${encodeURIComponent(item.id || "card")}/800/600`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        to="/ocorrencia/$id"
        params={{ id: item.id }}
        className="group block overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl hover:-translate-y-0.5 transition-all"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imageSrc}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="outline" className={`${t.className} backdrop-blur-md`}>
              {t.label}
            </Badge>
          </div>
          {item.matchPercent !== undefined && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-xs font-semibold border border-border">
              <Sparkles className="h-3 w-3 text-primary" /> {item.matchPercent}%
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold leading-tight line-clamp-1">{item.title}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {item.neighborhood || "Luanda"}, {item.municipality || "Luanda"}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {item.date ? new Date(item.date).toLocaleDateString("pt-PT") : ""}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{item.category}</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">{statusMeta[itemStatus] || itemStatus}</span>
            <span className="text-xs font-semibold text-primary group-hover:underline">
              Ver detalhes →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
