import { Link } from "@tanstack/react-router";
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-24">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold">Achados.Luanda</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            A plataforma que ajuda os luandenses a reencontrarem o que perderam.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Plataforma</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/perdidos" className="hover:text-foreground">Perdidos</Link></li>
            <li><Link to="/encontrados" className="hover:text-foreground">Encontrados</Link></li>
            <li><Link to="/avisos" className="hover:text-foreground">Avisos</Link></li>
            <li><Link to="/publicar" className="hover:text-foreground">Publicar</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Ajuda</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/como-funciona" className="hover:text-foreground">Como funciona</Link></li>
            <li><Link to="/contactos" className="hover:text-foreground">Contactos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> ola@achadosluanda.ao</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +244 900 000 000</li>
          </ul>
          <div className="flex gap-2 mt-4">
            {[Facebook, Instagram, Twitter].map((I, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-accent">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-4 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 Achados Luanda. Todos os direitos reservados.</span>
          <span>Feito com dedicação em Luanda 🇦🇴</span>
        </div>
      </div>
    </footer>
  );
}
