import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/municipios")({
  component: AdminMunicipios,
});

function AdminMunicipios() {
  const [fullList, setFullList] = useState<any[]>([]);
  const [municipalitiesList, setMunicipalitiesList] = useState<string[]>([]);
  const [neighborhoodsMap, setNeighborhoodsMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [newMunName, setNewMunName] = useState("");
  const [newNeighborhoods, setNewNeighborhoods] = useState("");

  const [addingNeighborhoodMun, setAddingNeighborhoodMun] = useState<string | null>(null);
  const [newSingleNeighborhood, setNewSingleNeighborhood] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getLocations();
      if (res) {
        setMunicipalitiesList(res.municipalities || []);
        setNeighborhoodsMap(res.neighborhoods || {});
        setFullList(res.fullList || []);
      }
    } catch (err) {
      console.error("Erro ao carregar municípios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    if (!newMunName.trim()) {
      toast.error("Por favor insira o nome do município.");
      return;
    }

    try {
      const nbArray = newNeighborhoods
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await api.createMunicipality(newMunName.trim(), nbArray);
      toast.success(`Município "${newMunName}" criado com sucesso.`);
      setNewMunName("");
      setNewNeighborhoods("");
      setOpenCreate(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar município.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja eliminar o município "${name}"?`)) return;

    try {
      await api.deleteMunicipality(id);
      toast.success("Município eliminado com sucesso.");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao eliminar município.");
    }
  };

  const handleAddNeighborhood = async (munName: string) => {
    if (!newSingleNeighborhood.trim()) return;

    const currentNbs = neighborhoodsMap[munName] || [];
    if (currentNbs.includes(newSingleNeighborhood.trim())) {
      toast.error("Este bairro já existe.");
      return;
    }

    const updatedNbs = [...currentNbs, newSingleNeighborhood.trim()];
    const munObj = fullList.find((m) => m.name === munName);

    try {
      if (munObj) {
        await api.updateMunicipality(munObj.id, undefined, updatedNbs);
      } else {
        await api.createMunicipality(munName, updatedNbs);
      }
      toast.success("Bairro adicionado!");
      setNewSingleNeighborhood("");
      setAddingNeighborhoodMun(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao adicionar bairro.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Municípios & Bairros</h1>
          <p className="text-sm text-muted-foreground">
            Áreas geográficas cobertas pela plataforma em Luanda.
          </p>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Novo município
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Município</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Nome do Município</Label>
                <Input
                  placeholder="Ex.: Talatona"
                  value={newMunName}
                  onChange={(e) => setNewMunName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Bairros (separados por vírgula)</Label>
                <Input
                  placeholder="Ex.: Benfica, Camama, Cidade Universitária"
                  value={newNeighborhoods}
                  onChange={(e) => setNewNeighborhoods(e.target.value)}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Guardar Município
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <p className="text-muted-foreground">A carregar municípios...</p>
        ) : (
          municipalitiesList.map((m) => {
            const nb = neighborhoodsMap[m] || [];
            const munObj = fullList.find((item) => item.name === m);

            return (
              <div key={m} className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-base">{m}</p>
                      <p className="text-xs text-muted-foreground">{nb.length} bairros mapeados</p>
                    </div>
                  </div>
                  {munObj && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(munObj.id, m)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                  {nb.map((n) => (
                    <Badge key={n} variant="outline" className="text-xs">
                      {n}
                    </Badge>
                  ))}
                </div>

                {addingNeighborhoodMun === m ? (
                  <div className="flex gap-2 pt-2">
                    <Input
                      size={1}
                      className="h-8 text-xs"
                      placeholder="Novo bairro..."
                      value={newSingleNeighborhood}
                      onChange={(e) => setNewSingleNeighborhood(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddNeighborhood(m)}
                    />
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleAddNeighborhood(m)}
                    >
                      Adicionar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs"
                      onClick={() => setAddingNeighborhoodMun(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                    onClick={() => {
                      setAddingNeighborhoodMun(m);
                      setNewSingleNeighborhood("");
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Adicionar Bairro
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
