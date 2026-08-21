import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Send, Search, ArrowLeft, UserPlus, X, Sparkles, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/meu-espaco/mensagens")({
  component: Mensagens,
});

function Mensagens() {
  const [conversationsList, setConversationsList] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [draft, setDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [loading, setLoading] = useState(true);

  // New Chat Modal state
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const loadConversations = async (targetIdToSelect?: string) => {
    try {
      setLoading(true);
      const data = await api.getConversations();
      setConversationsList(data || []);
      if (data && data.length > 0) {
        if (targetIdToSelect) {
          setActiveId(targetIdToSelect);
        } else if (!activeId) {
          setActiveId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar conversas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    async function loadMsgs() {
      try {
        const msgs = await api.getMessages(activeId!);
        setMessagesList(msgs || []);
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
      }
    }
    loadMsgs();
  }, [activeId]);

  // Carregar sugestões imediatamente ao abrir o modal ou ao pesquisar
  useEffect(() => {
    if (!showNewChatModal) return;
    const timer = setTimeout(async () => {
      try {
        setSearchingUsers(true);
        const users = await api.searchUsers(userSearchTerm.trim());
        setSearchResults(users || []);
      } catch (err) {
        console.error("Erro ao pesquisar utilizadores:", err);
      } finally {
        setSearchingUsers(false);
      }
    }, userSearchTerm ? 250 : 0);
    return () => clearTimeout(timer);
  }, [userSearchTerm, showNewChatModal]);

  const handleStartChatWithUser = async (targetUserId: string) => {
    try {
      const conv = await api.startConversation(targetUserId);
      setShowNewChatModal(false);
      setUserSearchTerm("");
      await loadConversations(conv.id);
      setActiveId(conv.id);
      setMobileView("chat");
      toast.success("Conversa iniciada!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao iniciar conversa.");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;
    const text = draft.trim();
    setDraft("");

    try {
      const newMsg = await api.sendMessage(activeId, text);
      setMessagesList((prev) => [...prev, newMsg]);
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar mensagem.");
    }
  };

  const filteredConversations = conversationsList.filter((c) => {
    const term = searchQuery.toLowerCase().trim();
    const nameMatch = c.user?.name?.toLowerCase().includes(term);
    const emailMatch = c.user?.email?.toLowerCase().includes(term);
    const titleMatch = c.occurrenceTitle?.toLowerCase().includes(term);
    return nameMatch || emailMatch || titleMatch;
  });

  const currentConv = conversationsList.find((c) => c.id === activeId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Mensagens</h1>
          <p className="text-sm text-muted-foreground">
            Converse com utilizadores e responda a ocorrências.
          </p>
        </div>
        <Button onClick={() => setShowNewChatModal(true)} className="gap-2">
          <UserPlus className="h-4 w-4" /> Nova Conversa
        </Button>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] rounded-2xl border border-border bg-card overflow-hidden h-[calc(100vh-12rem)] min-h-[500px]">
        <aside
          className={`${
            mobileView === "list" ? "flex" : "hidden"
          } lg:flex border-b lg:border-b-0 lg:border-r border-border flex-col min-h-0`}
        >
          <div className="p-3 border-b border-border flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar conversas..."
                className="pl-9"
              />
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setShowNewChatModal(true)}
              title="Iniciar Nova Conversa"
              className="shrink-0"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <p className="p-4 text-xs text-muted-foreground">A carregar conversas...</p>
            ) : (
              filteredConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveId(c.id);
                    setMobileView("chat");
                  }}
                  className={`w-full text-left px-3 py-3 border-b border-border hover:bg-muted/40 transition-colors ${
                    activeId === c.id ? "lg:bg-muted/50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-semibold shrink-0">
                      {c.user?.name?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="font-medium truncate">{c.user?.name}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {c.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                      {c.occurrenceTitle && (
                        <p className="text-[10px] text-primary mt-0.5 truncate">
                          Sobre: {c.occurrenceTitle}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
            {!loading && filteredConversations.length === 0 && (
              <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
                <p>Nenhuma conversa encontrada.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowNewChatModal(true)}
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> Buscar utilizador
                </Button>
              </div>
            )}
          </div>
        </aside>

        <section
          className={`${
            mobileView === "chat" ? "flex" : "hidden"
          } lg:flex flex-col min-w-0 min-h-0`}
        >
          {currentConv ? (
            <>
              <header className="px-3 sm:px-4 py-3 border-b border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileView("list")}
                    className="lg:hidden p-1 -ml-1 rounded-md hover:bg-muted shrink-0"
                    aria-label="Voltar"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-semibold shrink-0">
                    {currentConv.user?.name?.slice(0, 2).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium leading-tight truncate">{currentConv.user?.name}</p>
                    {currentConv.occurrenceTitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        Sobre: {currentConv.occurrenceTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botão de Nova Conversa visível diretamente no cabeçalho do Chat */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowNewChatModal(true)}
                  className="gap-1.5 shrink-0"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Nova Conversa</span>
                </Button>
              </header>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-muted/20 min-h-0">
                {messagesList.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm break-words ${
                        m.fromMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border"
                      }`}
                    >
                      <p>{m.text}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          m.fromMe ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2 shrink-0">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  className="flex-1 min-w-0"
                />
                <Button type="submit" size="icon" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-3">
              <p>Selecione uma conversa ou inicie um novo chat com um utilizador.</p>
              <Button onClick={() => setShowNewChatModal(true)} variant="outline">
                <UserPlus className="h-4 w-4 mr-2" /> Nova Conversa
              </Button>
            </div>
          )}
        </section>
      </div>

      {/* Modal Inteligente para Buscar Utilizador e Sugestões */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold font-display flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" /> Nova Conversa
              </h2>
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setUserSearchTerm("");
                }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="Pesquisar por nome ou email (ex.: maria@example.ao)..."
                className="pl-9"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span className="flex items-center gap-1 font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {userSearchTerm.trim() ? "Resultados da pesquisa" : "Sugestões de utilizadores"}
              </span>
              <span>{searchResults.length} pessoas</span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {searchingUsers ? (
                <p className="p-6 text-center text-xs text-muted-foreground">A pesquisar utilizadores...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleStartChatWithUser(u.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/40 text-left transition-colors group"
                  >
                    {u.avatar ? (
                      <img src={u.avatar} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-bold shrink-0">
                        {u.name?.slice(0, 2).toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{u.name}</p>
                        {u.role === "admin" && (
                          <Badge variant="outline" className="text-[10px] py-0 bg-primary/5 text-primary border-primary/20">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      {u.occurrencesCount > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {u.occurrencesCount} ocorrência{u.occurrencesCount > 1 ? "s" : ""} publicada{u.occurrencesCount > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="secondary" className="shrink-0 group-hover:bg-primary group-hover:text-primary-foreground">
                      <MessageCircle className="h-3.5 w-3.5 mr-1" /> Conversar
                    </Button>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold">Nenhum utilizador encontrado com "{userSearchTerm}".</p>
                  <p>Verifique se escreveu o email ou nome corretamente.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
