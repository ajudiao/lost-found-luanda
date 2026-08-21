import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "./perdidos";

export const Route = createFileRoute("/encontrados")({
  head: () => ({
    meta: [
      { title: "Objetos Encontrados — Achados Luanda" },
      { name: "description", content: "Objetos encontrados em Luanda prontos a serem devolvidos." },
    ],
  }),
  component: () => (
    <ListingPage
      type="encontrado"
      title="Objetos Encontrados"
      subtitle="Reportes de objetos achados por cidadãos em Luanda."
    />
  ),
});
