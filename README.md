# Achados Luanda

> Uma plataforma comunitária para registar, procurar e devolver objectos perdidos em Luanda.

<p align="center">
  <a href="https://lost-found-luanda.vercel.app/">
    <strong>Ver live preview</strong>
  </a>
</p>

## Sobre o projecto

O **Achados Luanda** aproxima quem perdeu um objecto de quem o encontrou. A plataforma permite publicar ocorrências, pesquisar por categoria e localização, acompanhar correspondências e comunicar com outros utilizadores num só lugar.

O projecto foi pensado para uma utilização simples em dispositivos móveis e desktop, com uma área pública, um espaço privado para utilizadores autenticados e um painel de administração para moderação.

## Funcionalidades

- Publicação de objectos **perdidos**, **encontrados** e **avisos**
- Pesquisa e filtros por categoria, município e localização
- Página de detalhe com imagens, descrição e dados da ocorrência
- Sugestões de correspondências entre ocorrências
- Autenticação e gestão de perfil
- Favoritos, notificações e mensagens entre utilizadores
- Área pessoal com as ocorrências publicadas
- Painel administrativo para ocorrências, avisos, utilizadores, denúncias, categorias, municípios e configurações
- Interface responsiva em português de Angola

## Aceder à aplicação

- **Live preview:** [lost-found-luanda.vercel.app](https://lost-found-luanda.vercel.app/)
- **Backend / API:** [lostfound-backend-awq7.onrender.com](https://lostfound-backend-awq7.onrender.com/)

O frontend em produção já está configurado para consumir a API hospedada. Para desenvolvimento local, a URL da API pode ser ajustada em `src/lib/api.ts`.

## Stack tecnológica

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide](https://lucide.dev/) para ícones

## Começar localmente

### Pré-requisitos

- Node.js 18 ou superior
- npm

### Instalação

```bash
git clone <url-do-repositorio>
cd lost-found-platform
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Depois, abra a URL indicada pelo Vite no terminal, normalmente `http://localhost:5173`.

### Outros comandos

```bash
npm run build    # cria a build de produção
npm run preview  # pré-visualiza a build localmente
npm run lint     # verifica problemas de lint
```

## Estrutura principal

```text
src/
├── components/     # Componentes reutilizáveis e componentes de interface
├── hooks/          # Hooks partilhados
├── lib/            # API, autenticação, dados e utilitários
├── routes/         # Rotas da aplicação baseadas em ficheiros
├── router.tsx      # Configuração do router
└── styles.css      # Estilos globais
```

As rotas principais incluem:

| Área | Rota |
| --- | --- |
| Página inicial | `/` |
| Perdidos | `/perdidos` |
| Encontrados | `/encontrados` |
| Avisos | `/avisos` |
| Publicar ocorrência | `/publicar` |
| Área do utilizador | `/meu-espaco` |
| Administração | `/admin` |

## Arquitectura

O frontend comunica com o backend através da camada de API em `src/lib/api.ts`. Os pedidos autenticados usam tokens Bearer guardados no navegador, enquanto as rotas administrativas e a área pessoal são protegidas pela camada de autenticação da aplicação.

O backend é um serviço independente hospedado no Render e o frontend está publicado na Vercel.

## Estado do projecto

O produto encontra-se disponível online para demonstração e utilização através da [live preview](https://lost-found-luanda.vercel.app/).

## Licença

Copyright (c) 2026 Achados Luanda. Todos os direitos reservados.

É proibida a reprodução, distribuição ou modificação deste projecto sem autorização prévia dos seus detentores de direitos.