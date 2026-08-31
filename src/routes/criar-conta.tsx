import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/criar-conta")({
  head: () => ({ meta: [{ title: "Criar Conta — Achados Luanda" }] }),
  component: Register,
});

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (password !== confirm) {
      toast.error("As palavras-passe não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res && res.user && res.token) {
        login(res.user, res.token);
        toast.success("Conta criada com sucesso!");
        navigate({ to: "/meu-espaco" });
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 gradient-hero border-r border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-lg">Achados.Luanda</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold leading-tight">Junte-se à comunidade.</h1>
          <p className="mt-4 text-muted-foreground max-w-md">
            Crie a sua conta e receba correspondências automáticas quando algo seu for encontrado.
          </p>
        </motion.div>
        <p className="text-xs text-muted-foreground">© 2026 Achados Luanda</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-lg">Achados.Luanda</span>
          </Link>
          <h2 className="text-2xl font-display font-bold">Criar conta</h2>
          <p className="text-sm text-muted-foreground mt-1">É rápido e gratuito.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="O seu nome"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.ao"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw">Palavra-passe</Label>
              <div className="relative">
                <Input
                  id="pw"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Mostrar palavra-passe"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw2">Confirmar palavra-passe</Label>
              <Input
                id="pw2"
                type={showPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "A criar..." : "Criar Conta"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button asChild type="button" variant="outline" className="w-full">
              <Link to="/entrar">Já tenho conta</Link>
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
