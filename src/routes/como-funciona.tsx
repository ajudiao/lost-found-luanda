import { createFileRoute } from "@tanstack/react-router";
import { Search, Sparkles, Shield, Users, Bell, MapPin } from "lucide-react";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({ meta: [{ title: "Como Funciona — Achados Luanda" }] }),
  component: HowItWorks,
});

function HowItWorks() {
  const steps = [
    { icon: Search, title: "1. Registe a ocorrência", desc: "Diga se perdeu, encontrou ou quer publicar um aviso. Descreva o objeto, adicione fotos e a localização." },
    { icon: Sparkles, title: "2. Correspondências automáticas", desc: "A plataforma compara descrições, categorias e locais para sugerir possíveis correspondências." },
    { icon: Bell, title: "3. Notificações em tempo real", desc: "Receba alertas quando algo semelhante for publicado ou quando alguém contactar consigo." },
    { icon: Shield, title: "4. Recupere em segurança", desc: "Combine com o outro utilizador através dos contactos partilhados e recupere o objeto." },
  ];
  return (
    <main className="container-page py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl lg:text-5xl font-display font-bold">Como funciona</h1>
        <p className="mt-4 text-muted-foreground">Quatro passos para reencontrar o que é seu.</p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 max-w-4xl mx-auto">
        {steps.map((s) => (
          <div key={s.title} className="rounded-2xl border border-border p-6 bg-card">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground mb-4">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg">{s.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
