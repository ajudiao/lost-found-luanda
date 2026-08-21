import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/meu-espaco/configuracoes")({
  component: Configuracoes,
});

function Configuracoes() {
  const [prefs, setPrefs] = useState({
    emailMatches: true,
    emailMessages: true,
    pushAll: false,
    weekly: true,
    publicProfile: false,
  });
  const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v }));

  const rows: { key: keyof typeof prefs; title: string; desc: string }[] = [
    { key: "emailMatches", title: "Correspondências por email", desc: "Receba um email quando algo parecido com o que perdeu for publicado." },
    { key: "emailMessages", title: "Mensagens por email", desc: "Notifique-me quando alguém responder a uma ocorrência minha." },
    { key: "pushAll", title: "Notificações push", desc: "Ativar notificações no navegador." },
    { key: "weekly", title: "Resumo semanal", desc: "Um resumo com o que aconteceu na sua zona." },
    { key: "publicProfile", title: "Perfil público", desc: "Permitir que outros utilizadores vejam o meu perfil." },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground">Personalize a sua experiência.</p>
      </div>

      <section className="rounded-2xl border border-border bg-card divide-y divide-border">
        {rows.map((r) => (
          <div key={r.key} className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
            <Switch checked={prefs[r.key]} onCheckedChange={set(r.key)} />
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <h2 className="font-display font-bold">Segurança</h2>
          <p className="text-xs text-muted-foreground">Altere a sua senha.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cur">Senha atual</Label>
            <Input id="cur" type="password" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new">Nova senha</Label>
            <Input id="new" type="password" />
          </div>
        </div>
        <div className="flex justify-end"><Button>Atualizar senha</Button></div>
      </section>

      <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-destructive">Eliminar conta</h2>
          <p className="text-xs text-muted-foreground">Esta ação é permanente e não pode ser desfeita.</p>
        </div>
        <Button variant="destructive">Eliminar conta</Button>
      </section>
    </div>
  );
}
