import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  PackageX,
  PackageCheck,
  Bell,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/publicar")({
  head: () => ({ meta: [{ title: "Publicar Ocorrência — Achados Luanda" }] }),
  component: Publish,
});

const steps = ["Tipo", "Detalhes", "Localização", "Imagens", "Contacto"];

function Publish() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<string>("perdido");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [featuresStr, setFeaturesStr] = useState("");

  const [municipality, setMunicipality] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [municipalitiesList, setMunicipalitiesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadOptions() {
      try {
        const [cats, locs] = await Promise.all([api.getCategories(), api.getLocations()]);
        setCategoriesList(cats || []);
        setMunicipalitiesList(locs?.municipalities || []);
      } catch (err) {
        console.error("Erro ao carregar opções:", err);
      }
    }
    loadOptions();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!title || !category || !municipality || !neighborhood || !location) {
      toast.error("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", type.toUpperCase());
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      if (brand) formData.append("brand", brand);
      if (model) formData.append("model", model);
      if (color) formData.append("color", color);
      if (featuresStr) {
        const featuresArr = featuresStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        formData.append("features", JSON.stringify(featuresArr));
      }
      formData.append("municipality", municipality);
      formData.append("neighborhood", neighborhood);
      formData.append("location", location);
      formData.append("date", new Date(date).toISOString());
      if (phone) formData.append("contactPhone", phone);
      if (whatsapp) formData.append("contactWhatsapp", whatsapp);
      if (email) formData.append("contactEmail", email);

      for (const file of files) {
        formData.append("files", file);
      }

      await api.createOccurrence(formData);
      toast.success("Ocorrência publicada com sucesso!");
      navigate({ to: "/meu-espaco" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao publicar ocorrência.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-page py-10 lg:py-14 max-w-3xl">
      <h1 className="text-3xl font-display font-bold">Publicar Ocorrência</h1>
      <p className="text-muted-foreground mt-1">Preencha os passos abaixo. É rápido.</p>

      {/* Progress */}
      <div className="mt-8 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold shrink-0 ${
                i < step
                  ? "bg-success text-success-foreground"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 ${i < step ? "bg-success" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-5 text-xs text-muted-foreground">
        {steps.map((l) => (
          <span key={l} className="truncate">
            {l}
          </span>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 lg:p-8 min-h-[24rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div className="space-y-3">
                <h2 className="font-display text-xl font-bold">O que aconteceu?</h2>
                {[
                  {
                    id: "perdido",
                    label: "Perdi um objeto",
                    desc: "Reporte algo que perdeu.",
                    icon: PackageX,
                  },
                  {
                    id: "encontrado",
                    label: "Encontrei um objeto",
                    desc: "Reporte algo que encontrou.",
                    icon: PackageCheck,
                  },
                  {
                    id: "aviso",
                    label: "Criar Aviso de Encontro",
                    desc: "Publique um aviso público.",
                    icon: Bell,
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setType(opt.id)}
                    className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                      type === opt.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:bg-accent/40"
                    }`}
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <opt.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">{opt.label}</p>
                      <p className="text-sm text-muted-foreground">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Detalhes do objeto</h2>
                <div>
                  <Label>Título *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex.: iPhone 14 Pro preto"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Categoria *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {(categoriesList.length > 0
                          ? categoriesList
                          : ["Eletrónicos", "Documentos", "Chaves", "Carteiras"]
                        ).map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cor</Label>
                    <Input
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="Ex.: Preto"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Marca</Label>
                    <Input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ex.: Apple"
                    />
                  </div>
                  <div>
                    <Label>Modelo</Label>
                    <Input
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Ex.: iPhone 14 Pro"
                    />
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva com o máximo de detalhe..."
                  />
                </div>
                <div>
                  <Label>Características (separadas por vírgula)</Label>
                  <Input
                    value={featuresStr}
                    onChange={(e) => setFeaturesStr(e.target.value)}
                    placeholder="Ex.: risca no ecrã, capa transparente"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Localização</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Município *</Label>
                    <Select value={municipality} onValueChange={setMunicipality}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {(municipalitiesList.length > 0
                          ? municipalitiesList
                          : ["Luanda", "Belas", "Talatona", "Viana", "Cazenga"]
                        ).map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Bairro *</Label>
                    <Input
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ex.: Talatona"
                    />
                  </div>
                </div>
                <div>
                  <Label>Local aproximado *</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex.: Perto do Belas Shopping"
                  />
                </div>
                <div>
                  <Label>Data</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Fotografias</h2>
                <label
                  htmlFor="file-upload-input"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-10 cursor-pointer hover:bg-accent/40 transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Clique para carregar imagens</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG até 5MB (máx 5 fotos)</p>
                  <input
                    id="file-upload-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {previews.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-muted"
                      >
                        <img
                          src={src}
                          alt={`Preview ${i}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs opacity-90 hover:opacity-100 shadow"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Como podem contactá-lo?</h2>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+244 923 000 000"
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+244 923 000 000"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.ao"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between pt-6 border-t border-border">
          <Button variant="outline" onClick={prev} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={next}>
              Próximo <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={loading}>
              {loading ? "A carregar imagens & publicar..." : "Concluir & Publicar"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
