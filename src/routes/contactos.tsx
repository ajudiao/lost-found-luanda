import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contactos")({
  head: () => ({ meta: [{ title: "Contactos — Achados Luanda" }] }),
  component: Contact,
});

function Contact() {
  return (
    <main className="container-page py-16">
      <div className="grid gap-10 lg:grid-cols-2 max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl font-display font-bold">Fale connosco</h1>
          <p className="mt-3 text-muted-foreground">Estamos disponíveis para ajudar utilizadores, autoridades e parceiros.</p>
          <div className="mt-8 space-y-4">
            {[
              { icon: Mail, label: "Email", value: "ola@achadosluanda.ao" },
              { icon: Phone, label: "Telefone", value: "+244 900 000 000" },
              { icon: MapPin, label: "Escritório", value: "Rua da Missão, Luanda" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-3 rounded-xl border border-border p-4 bg-card">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><c.icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="font-medium">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Mensagem enviada! (simulação)"); }}
          className="rounded-2xl border border-border p-6 bg-card space-y-4"
        >
          <h2 className="font-display font-bold text-xl">Envie uma mensagem</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Nome" required />
            <Input type="email" placeholder="Email" required />
          </div>
          <Input placeholder="Assunto" />
          <Textarea placeholder="A sua mensagem" rows={5} required />
          <Button className="w-full" size="lg">Enviar</Button>
        </form>
      </div>
    </main>
  );
}
