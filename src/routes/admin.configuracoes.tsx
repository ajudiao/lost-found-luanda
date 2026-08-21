import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminConfiguracoes,
});

function AdminConfiguracoes() {
  const [requireModeration, setRequireModeration] = useState(false);
  const [minMatchPercent, setMinMatchPercent] = useState(60);
  const [searchRadiusKm, setSearchRadiusKm] = useState(15);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.getAdminSettings();
        if (data) {
          setRequireModeration(Boolean(data.requireModeration));
          if (data.minMatchPercent) setMinMatchPercent(data.minMatchPercent);
          if (data.searchRadiusKm) setSearchRadiusKm(data.searchRadiusKm);
        }
      } catch (err) {
        console.error("Erro ao carregar configurações:", err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateAdminSettings({
        requireModeration,
        minMatchPercent: Number(minMatchPercent),
        searchRadiusKm: Number(searchRadiusKm),
      });
      toast.success("Configurações salvas com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground">Preferências gerais e regras de moderação.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 max-w-3xl">
        <div>
          <h2 className="font-display font-bold">Moderação</h2>
          <p className="text-xs text-muted-foreground">Controle de publicações e denúncias.</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">Aprovação manual de ocorrências</p>
            <p className="text-xs text-muted-foreground">
              Rever cada publicação (status EM_ANALISE) antes de ficar visível publicamente.
            </p>
          </div>
          <Switch
            checked={requireModeration}
            onCheckedChange={setRequireModeration}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 max-w-3xl">
        <div>
          <h2 className="font-display font-bold">Correspondências</h2>
          <p className="text-xs text-muted-foreground">Sensibilidade do algoritmo de matching.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Limite mínimo de similaridade (%)</Label>
            <Input
              type="number"
              value={minMatchPercent}
              onChange={(e) => setMinMatchPercent(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Raio de busca (km)</Label>
            <Input
              type="number"
              value={searchRadiusKm}
              onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end max-w-3xl">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? "A guardar..." : "Guardar alterações"}
        </Button>
      </div>
    </div>
  );
}
