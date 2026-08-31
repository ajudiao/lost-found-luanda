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

export const Route = createFileRoute("/entrar")({
  head: () => ({ meta: [{ title: "Entrar — Achados Luanda" }] }),
  component: Login,
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (loginEmail: string, loginPw: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email: loginEmail, password: loginPw });
      if (res && res.user && res.token) {
        login(res.user, res.token);
        toast.success(`Bem-vindo, ${res.user.name}!`);
        navigate({ to: res.user.role === "admin" ? "/admin" : "/meu-espaco" });
        return;
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao efetuar login. Verifique as credenciais.");
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
          <h2 className="font-display text-4xl font-bold leading-tight">Reencontre o que é seu.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Uma plataforma comunitária para reunir objetos perdidos e quem os procura.
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
          <h1 className="text-2xl font-display font-bold">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground mt-1">Entre para gerir as suas ocorrências.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(email, password);
            }}
            className="mt-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="seu@email.ao"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Label>Palavra-passe</Label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Recuperar
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "A entrar..." : "Entrar"}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button asChild type="button" variant="outline" className="w-full">
              <Link to="/criar-conta">Criar Conta</Link>
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
