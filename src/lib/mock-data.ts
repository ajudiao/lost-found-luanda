export type OccurrenceType = "perdido" | "encontrado" | "aviso";
export type OccurrenceStatus = "ativo" | "em_analise" | "resolvido" | "arquivado";

export interface Occurrence {
  id: string;
  type: OccurrenceType;
  title: string;
  description: string;
  category: string;
  brand?: string;
  model?: string;
  color?: string;
  features?: string[];
  municipality: string;
  neighborhood: string;
  location: string;
  date: string;
  status: OccurrenceStatus;
  images: string[];
  matchPercent?: number;
  contact: { phone?: string; whatsapp?: string; email?: string };
  author: string;
}

export const categories = [
  "Eletrónicos",
  "Documentos",
  "Chaves",
  "Carteiras",
  "Bagagem",
  "Vestuário",
  "Joias",
  "Animais",
  "Outros",
];

export const municipalities = [
  "Luanda",
  "Belas",
  "Cazenga",
  "Cacuaco",
  "Viana",
  "Talatona",
  "Kilamba Kiaxi",
  "Icolo e Bengo",
];

export const neighborhoods: Record<string, string[]> = {
  Luanda: ["Ingombota", "Maianga", "Rangel", "Sambizanga", "Samba"],
  Belas: ["Benfica", "Futungo", "Morro Bento", "Talatona"],
  Talatona: ["Condomínio Jardins", "Camama", "Nova Vida"],
  Cazenga: ["Cazenga Sede", "Hoji-ya-Henda", "Tala Hady"],
  Cacuaco: ["Cacuaco Sede", "Kikolo", "Sequele"],
  Viana: ["Viana Sede", "Zango", "Estalagem"],
  "Kilamba Kiaxi": ["Kilamba", "Golfe", "Palanca"],
  "Icolo e Bengo": ["Catete", "Bom Jesus"],
};

const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

export const occurrences: Occurrence[] = [
  {
    id: "OC-1001",
    type: "perdido",
    title: "iPhone 14 Pro preto",
    description:
      "Perdi o meu iPhone 14 Pro cor preta na zona de Talatona, próximo do Belas Shopping. Tem capa transparente e um autocolante de cão pequeno na parte de trás.",
    category: "Eletrónicos",
    brand: "Apple",
    model: "iPhone 14 Pro",
    color: "Preto",
    features: ["Capa transparente", "Autocolante de cão"],
    municipality: "Belas",
    neighborhood: "Talatona",
    location: "Belas Shopping, entrada principal",
    date: "2026-07-14",
    status: "ativo",
    images: [img("iphone1"), img("iphone2"), img("iphone3")],
    matchPercent: 92,
    contact: { phone: "+244 923 456 789", whatsapp: "+244 923 456 789", email: "maria@example.ao" },
    author: "Maria S.",
  },
  {
    id: "OC-1002",
    type: "encontrado",
    title: "Carteira de couro castanha",
    description:
      "Encontrei esta carteira no autocarro da linha 108. Contém documentos em nome de um senhor. Contactem-me para devolução.",
    category: "Carteiras",
    color: "Castanho",
    municipality: "Luanda",
    neighborhood: "Ingombota",
    location: "Linha 108 - Terminal do Kinaxixi",
    date: "2026-07-15",
    status: "ativo",
    images: [img("wallet1"), img("wallet2")],
    matchPercent: 87,
    contact: { phone: "+244 912 345 678", email: "joao@example.ao" },
    author: "João A.",
  },
  {
    id: "OC-1003",
    type: "aviso",
    title: "Molho de chaves com pingente vermelho",
    description: "Chaves encontradas na praia da Ilha do Cabo. Estão no posto de socorro.",
    category: "Chaves",
    color: "Prateado",
    municipality: "Luanda",
    neighborhood: "Ilha",
    location: "Praia da Ilha, posto de socorro nº2",
    date: "2026-07-16",
    status: "ativo",
    images: [img("keys1")],
    matchPercent: 78,
    contact: { phone: "+244 934 567 890" },
    author: "Posto Socorro Ilha",
  },
  {
    id: "OC-1004",
    type: "perdido",
    title: "Mochila escolar azul",
    description: "Mochila da Nike, azul marinho, com cadernos e uma calculadora científica.",
    category: "Bagagem",
    brand: "Nike",
    color: "Azul",
    municipality: "Viana",
    neighborhood: "Zango",
    location: "Paragem Zango 3",
    date: "2026-07-12",
    status: "em_analise",
    images: [img("bag1"), img("bag2")],
    matchPercent: 65,
    contact: { phone: "+244 945 678 901" },
    author: "Paulo M.",
  },
  {
    id: "OC-1005",
    type: "encontrado",
    title: "Óculos graduados Ray-Ban",
    description: "Óculos encontrados no restaurante Miami Beach. Armação preta, lentes graduadas.",
    category: "Outros",
    brand: "Ray-Ban",
    color: "Preto",
    municipality: "Luanda",
    neighborhood: "Ilha",
    location: "Restaurante Miami Beach",
    date: "2026-07-13",
    status: "ativo",
    images: [img("glasses1")],
    matchPercent: 71,
    contact: { whatsapp: "+244 956 789 012" },
    author: "Restaurante Miami",
  },
  {
    id: "OC-1006",
    type: "aviso",
    title: "Cão de raça pequena encontrado",
    description:
      "Cão pequeno, castanho e branco, encontrado a vaguear no Kilamba. Está bem cuidado.",
    category: "Animais",
    color: "Castanho e branco",
    municipality: "Kilamba Kiaxi",
    neighborhood: "Kilamba",
    location: "Edifício K25",
    date: "2026-07-16",
    status: "ativo",
    images: [img("dog1"), img("dog2")],
    matchPercent: 88,
    contact: { phone: "+244 967 890 123", whatsapp: "+244 967 890 123" },
    author: "Cátia L.",
  },
  {
    id: "OC-1007",
    type: "perdido",
    title: "Bilhete de identidade e carta de condução",
    description: "Perdi a minha carteira com documentos importantes na zona da Maianga.",
    category: "Documentos",
    municipality: "Luanda",
    neighborhood: "Maianga",
    location: "Largo da Maianga",
    date: "2026-07-11",
    status: "ativo",
    images: [img("docs1")],
    matchPercent: 55,
    contact: { phone: "+244 978 901 234", email: "ana@example.ao" },
    author: "Ana T.",
  },
  {
    id: "OC-1008",
    type: "encontrado",
    title: "Relógio prateado",
    description: "Relógio de pulso encontrado no ginásio Nautilus.",
    category: "Joias",
    color: "Prateado",
    municipality: "Belas",
    neighborhood: "Benfica",
    location: "Ginásio Nautilus Benfica",
    date: "2026-07-10",
    status: "resolvido",
    images: [img("watch1")],
    matchPercent: 60,
    contact: { email: "nautilus@example.ao" },
    author: "Ginásio Nautilus",
  },
];

export const notifications = [
  {
    id: "n1",
    title: "Nova correspondência encontrada",
    desc: "Alguém publicou algo semelhante ao seu iPhone.",
    time: "há 2h",
    read: false,
  },
  {
    id: "n2",
    title: "Aviso na sua zona",
    desc: "Novo aviso de encontro em Talatona.",
    time: "há 5h",
    read: false,
  },
  {
    id: "n3",
    title: "Ocorrência aprovada",
    desc: "A sua ocorrência foi validada.",
    time: "ontem",
    read: true,
  },
];

export const chartData = [
  { month: "Jan", perdidos: 45, encontrados: 20, recuperados: 12 },
  { month: "Fev", perdidos: 52, encontrados: 28, recuperados: 18 },
  { month: "Mar", perdidos: 61, encontrados: 34, recuperados: 22 },
  { month: "Abr", perdidos: 58, encontrados: 41, recuperados: 30 },
  { month: "Mai", perdidos: 70, encontrados: 45, recuperados: 33 },
  { month: "Jun", perdidos: 82, encontrados: 55, recuperados: 42 },
  { month: "Jul", perdidos: 76, encontrados: 60, recuperados: 48 },
];

export const categoryChart = categories.slice(0, 6).map((name, i) => ({
  name,
  value: [42, 38, 27, 22, 19, 15][i],
}));

export const users = [
  {
    id: "u1",
    name: "Maria Silva",
    email: "maria@example.ao",
    role: "utilizador",
    occurrences: 3,
    joined: "2026-05-12",
  },
  {
    id: "u2",
    name: "João Almeida",
    email: "joao@example.ao",
    role: "utilizador",
    occurrences: 5,
    joined: "2026-04-02",
  },
  {
    id: "u3",
    name: "Ana Teixeira",
    email: "ana@example.ao",
    role: "utilizador",
    occurrences: 2,
    joined: "2026-06-20",
  },
  {
    id: "u4",
    name: "Admin",
    email: "admin@achadosluanda.ao",
    role: "admin",
    occurrences: 0,
    joined: "2026-01-01",
  },
];

export const activities = [
  {
    id: "a1",
    user: "Maria Silva",
    action: "publicou uma nova ocorrência",
    target: "iPhone 14 Pro preto",
    time: "há 10min",
  },
  {
    id: "a2",
    user: "Admin",
    action: "validou o aviso",
    target: "Molho de chaves",
    time: "há 30min",
  },
  {
    id: "a3",
    user: "João Almeida",
    action: "marcou como recuperado",
    target: "Carteira castanha",
    time: "há 1h",
  },
  { id: "a4", user: "Ana Teixeira", action: "criou uma nova conta", target: "", time: "há 2h" },
];
