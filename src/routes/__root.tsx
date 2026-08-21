import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Link } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Algo correu mal</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente ou volte ao início.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Achados Luanda — Perdeu ou encontrou algo em Luanda?" },
      {
        name: "description",
        content:
          "Plataforma para reportar e reencontrar objetos perdidos em Luanda. Registe uma ocorrência e deixe as correspondências automáticas fazerem o resto.",
      },
      { property: "og:title", content: "Achados Luanda — Perdeu ou encontrou algo em Luanda?" },
      {
        property: "og:description",
        content:
          "Plataforma para reportar e reencontrar objetos perdidos em Luanda. Registe uma ocorrência e deixe as correspondências automáticas fazerem o resto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Achados Luanda — Perdeu ou encontrou algo em Luanda?" },
      {
        name: "twitter:description",
        content:
          "Plataforma para reportar e reencontrar objetos perdidos em Luanda. Registe uma ocorrência e deixe as correspondências automáticas fazerem o resto.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f71f6a06-c70e-4a20-9723-a7e6b5615f95/id-preview-92e9855e--79bad25b-55ba-4f1d-a804-219b152b1c99.lovable.app-1784287626855.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f71f6a06-c70e-4a20-9723-a7e6b5615f95/id-preview-92e9855e--79bad25b-55ba-4f1d-a804-219b152b1c99.lovable.app-1784287626855.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouter().state.location.pathname;
  const hideChrome =
    path.startsWith("/meu-espaco") ||
    path.startsWith("/admin") ||
    path === "/entrar" ||
    path === "/criar-conta";
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {!hideChrome && <Navbar />}
        <Outlet />
        {!hideChrome && <Footer />}
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
