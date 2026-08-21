import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/meu-espaco/perfil")({
  component: Perfil,
});

function Perfil() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await api.updateProfile(formData);
      if (res) {
        login({ ...user!, name: res.name, avatar: res.avatar });
        toast.success("Perfil atualizado com sucesso!");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Perfil</h1>
        <p className="text-sm text-muted-foreground">Atualize os seus dados pessoais.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary/10 text-primary grid place-items-center text-2xl font-bold">
                {(name || user?.name || "U").slice(0, 1).toUpperCase()}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center border-2 border-card cursor-pointer">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAvatarFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email || ""} disabled />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "A guardar..." : "Guardar alterações"}
          </Button>
        </div>
      </div>
    </div>
  );
}
