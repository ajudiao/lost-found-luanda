import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Phone, Mail, MessageCircle, Share2, Flag, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OccurrenceCard } from "@/components/occurrence-card";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/ocorrencia/$id")({
  head: () => ({
    meta: [{ title: "Detalhe da Ocorrência — Achados Luanda" }],
  }),
  component: Detail,
});

function Detail() {
  const { id } = useParams({ from: "/ocorrencia/$id" });
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reporting, setReporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getOccurrence(id);
        setItem(data);
      } catch (err) {
        console.error("Erro ao carregar detalhe da ocorrência:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleReport = async () => {
    if (!item) return;
    const reason = prompt("Motivo da denúncia:");
    if (!reason) return;

    try {
      setReporting(true);
      await api.createReport(item.id, reason);
      toast.success("Denúncia enviada aos administradores.");
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar denúncia.");
    } finally {
      setReporting(false);
    }
  };

  const handleStartChat = async () => {
    if (!item?.userId) return;
    try {
      await api.startConversation(item.userId, item.id);
      navigate({ to: "/meu-espaco/mensagens" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao iniciar conversa no chat.");
    }
  };

  if (loading) {
    return (
      <main className="container-page py-24 text-center">
        <p className="text-muted-foreground">A carregar detalhes...</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">Ocorrência não encontrada</h1>
        <Button asChild className="mt-4">
          <Link to="/">Voltar à Página Inicial</Link>
        </Button>
      </main>
    );
  }

  const matches = item.matches || [];
  const imageSrc =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : `https://picsum.photos/seed/${encodeURIComponent(item.id)}/800/600`;

  return (
    <main className="container-page py-8 lg:py-12">
      <Link
        to="/perdidos"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-2 grid-cols-4">
            <div className="col-span-4 aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
              <img src={imageSrc} alt={item.title} className="w-full h-full object-cover" />
            </div>
            {Array.isArray(item.images) &&
              item.images.slice(1, 5).map((src: string, i: number) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
          </motion.div>

          <div className="rounded-2xl border border-border p-6 bg-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge className="mb-2" variant="outline">
                  {item.type === "perdido" ? "Perdido" : item.type === "encontrado" ? "Encontrado" : "Aviso"}
                </Badge>
                <h1 className="text-3xl font-display font-bold">{item.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">Publicado por {item.author}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copiado!");
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleReport} disabled={reporting}>
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-lg">Descrição</h3>
              <p className="text-muted-foreground whitespace-pre-line">{item.description}</p>

              {(item.brand || item.model || item.color) && (
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4 text-sm">
                  {item.brand && <div><span className="text-muted-foreground">Marca:</span> <p className="font-semibold">{item.brand}</p></div>}
                  {item.model && <div><span className="text-muted-foreground">Modelo:</span> <p className="font-semibold">{item.model}</p></div>}
                  {item.color && <div><span className="text-muted-foreground">Cor:</span> <p className="font-semibold">{item.color}</p></div>}
                </div>
              )}

              {Array.isArray(item.features) && item.features.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">Características:</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.features.map((f: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Corresponding Matches */}
          {matches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-display font-bold">Correspondências Sugeridas</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {matches.map((m: any) => (
                  <OccurrenceCard key={m.id} occurrence={m} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border p-6 bg-card space-y-4">
            <h3 className="font-display font-bold text-lg">Localização & Data</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{item.location}, {item.neighborhood}, {item.municipality}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <span>{item.date ? new Date(item.date).toLocaleDateString("pt-PT") : ""}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-6 bg-card space-y-4">
            <h3 className="font-display font-bold text-lg">Contactar Autor</h3>

            {item.userId && (
              <Button onClick={handleStartChat} className="w-full gap-2">
                <MessageSquare className="h-4 w-4" /> Enviar Mensagem no Chat
              </Button>
            )}

            {item.contact && (
              <div className="space-y-3 pt-2 border-t border-border">
                {item.contact.phone && (
                  <a href={`tel:${item.contact.phone}`} className="flex items-center gap-3 text-sm hover:text-primary">
                    <Phone className="h-4 w-4 text-primary shrink-0" /> {item.contact.phone}
                  </a>
                )}
                {item.contact.whatsapp && (
                  <a href={`https://wa.me/${item.contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm hover:text-primary">
                    <MessageCircle className="h-4 w-4 text-success shrink-0" /> WhatsApp: {item.contact.whatsapp}
                  </a>
                )}
                {item.contact.email && (
                  <a href={`mailto:${item.contact.email}`} className="flex items-center gap-3 text-sm hover:text-primary">
                    <Mail className="h-4 w-4 text-primary shrink-0" /> {item.contact.email}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
