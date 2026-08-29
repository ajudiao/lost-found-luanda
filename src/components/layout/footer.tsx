import { Link } from "@tanstack/react-router";
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, MessageCircle, Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-100 border-t border-zinc-800/80 mt-24 relative overflow-hidden">
      {/* Decorative gradient glow at the top edge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="container-page pt-16 pb-12 relative z-10">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/30 transition-transform group-hover:scale-105">
                <MapPin className="h-5 w-5 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-extrabold tracking-tight text-white">
                  Achados<span className="text-red-500">.Luanda</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                  Comunidade de Luanda 🇦🇴
                </span>
              </div>
            </Link>

            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              A plataforma comunitária oficial para registar, procurar e recuperar objetos e documentos perdidos ou encontrados em Luanda.
            </p>

            {/* Quick Action Badge */}
            <div className="pt-2">
              <Link
                to="/publicar"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary-foreground bg-primary/90 hover:bg-primary px-3.5 py-2 rounded-xl transition-all shadow-md hover:shadow-primary/20"
              >
                Publicar Nova Ocorrência <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Plataforma
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/perdidos" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Objetos Perdidos
                </Link>
              </li>
              <li>
                <Link to="/encontrados" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Objetos Encontrados
                </Link>
              </li>
              <li>
                <Link to="/avisos" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Avisos Comunitários
                </Link>
              </li>
              <li>
                <Link to="/publicar" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Reportar Perda ou Achado
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Account Links */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Recursos & Suporte
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/como-funciona" className="hover:text-white transition-colors">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link to="/meu-espaco" className="hover:text-white transition-colors">
                  Meu Espaço Pessoal
                </Link>
              </li>
              <li>
                <Link to="/contactos" className="hover:text-white transition-colors">
                  Contactar Suporte
                </Link>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-zinc-500 pt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Moderação e Segurança</span>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Contactos
            </h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <a
                  href="mailto:suporte@achadosluanda.ao"
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:border-primary group-hover:text-primary transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs truncate">suporte@achadosluanda.ao</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+244923000000"
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:border-primary group-hover:text-primary transition-colors">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs">+244 923 000 000</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-zinc-400">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span>Luanda, Angola</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="mt-5 pt-3 border-t border-zinc-900">
              <p className="text-xs font-medium text-zinc-400 mb-2.5">Siga-nos nas redes:</p>
              <div className="flex gap-2">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: MessageCircle, href: "https://wa.me/244923000000", label: "WhatsApp" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <s.icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Achados Luanda. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            <span>Feito com</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>para a cidade de Luanda 🇦🇴</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
