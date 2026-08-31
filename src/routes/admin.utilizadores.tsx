import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Shield, User as UserIcon, Trash2, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/utilizadores")({
  component: AdminUtilizadores,
});

function AdminUtilizadores() {
  const [q, setQ] = useState("");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminUsers();
      setUsersList(data || []);
    } catch (err) {
      console.error("Erro ao carregar utilizadores:", err);
      toast.error("Erro ao carregar utilizadores da API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "UTILIZADOR" : "ADMIN";
    try {
      await api.updateUserRole(id, newRole);
      toast.success("Papel do utilizador alterado com sucesso na base de dados.");
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Erro ao alterar papel.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este utilizador da base de dados?")) return;
    try {
      await api.deleteUser(id);
      toast.success("Utilizador eliminado com sucesso da base de dados.");
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Erro ao eliminar utilizador.");
    }
  };

  const filtered = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          Utilizadores{" "}
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Database className="h-3 w-3 mr-1" /> NeonDB API
          </Badge>
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerir contas e permissões em tempo real na base de dados.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar utilizador por nome ou email..."
          className="pl-9"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilizador</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead className="hidden sm:table-cell">Ocorrências</TableHead>
              <TableHead className="hidden lg:table-cell">Registado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  A carregar utilizadores da API...
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {u.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium block">{u.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground block">
                          {u.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    {u.role === "admin" ? (
                      <Badge className="bg-primary/10 text-primary border-0">
                        <Shield className="h-3 w-3 mr-1" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <UserIcon className="h-3 w-3 mr-1" /> Utilizador
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{u.occurrences}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                    {u.joined}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleRole(u.id, u.role)}
                      >
                        {u.role === "admin" ? "Tornar Utilizador" : "Tornar Admin"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum utilizador encontrado na base de dados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
