import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "./perdidos";

export const Route = createFileRoute("/avisos")({
  head: () => ({
    meta: [
      { title: "Avisos de Encontro — Achados Luanda" },
      {
        name: "description",
        content: "Avisos públicos de objetos encontrados em locais comunitários de Luanda.",
      },
    ],
  }),
  component: () => (
    <ListingPage
      type="aviso"
      title="Avisos de Encontro"
      subtitle="Avisos comunitários de objetos encontrados e retidos em postos e estabelecimentos."
    />
  ),
});
