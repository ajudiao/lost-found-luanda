import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";

export function SearchBar({ big = false }: { big?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [municipalitiesList, setMunicipalitiesList] = useState<string[]>([]);

  useEffect(() => {
    async function loadFilters() {
      try {
        const [cats, locs] = await Promise.all([
          api.getCategories(),
          api.getLocations(),
        ]);
        setCategoriesList(cats || []);
        setMunicipalitiesList(locs?.municipalities || []);
      } catch (err) {
        console.error("Erro ao carregar filtros da barra de pesquisa:", err);
      }
    }
    loadFilters();
  }, []);

  return (
    <div className="w-full">
      <div
        className={`flex items-stretch gap-2 rounded-2xl border border-border bg-background/80 backdrop-blur-xl shadow-sm ${
          big ? "p-2" : "p-1.5"
        }`}
      >
        <div className="flex-1 flex items-center gap-3 px-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ex.: Perdi um iPhone preto em Talatona"
            className={`border-0 shadow-none focus-visible:ring-0 px-0 bg-transparent ${
              big ? "h-12 text-base" : "h-10"
            }`}
          />
        </div>
        <Button
          variant="outline"
          size={big ? "lg" : "default"}
          onClick={() => setOpen((s) => !s)}
          className="shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Filtros</span>
        </Button>
        <Button size={big ? "lg" : "default"} className="shrink-0">
          <span className="hidden sm:inline">Pesquisar</span>
          <Search className="h-4 w-4 sm:hidden" />
        </Button>
      </div>
      {open && (
        <div className="mt-3 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5 animate-fade-in">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Município" />
            </SelectTrigger>
            <SelectContent>
              {(municipalitiesList.length > 0
                ? municipalitiesList
                : ["Luanda", "Belas", "Talatona", "Viana"]
              ).map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Bairro" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="perdido">Perdido</SelectItem>
              <SelectItem value="encontrado">Encontrado</SelectItem>
              <SelectItem value="aviso">Aviso</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" />
        </div>
      )}
    </div>
  );
}
