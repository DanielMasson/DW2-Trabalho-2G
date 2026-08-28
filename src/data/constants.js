// =====================================================================
// CONSTANTES E TIPOS DE DOMÍNIO — exportados como valores/strings
// =====================================================================

export const SPRINTS = [1, 2, 3];

export const TIMES = ["Caça", "Transporte"];

export const BUYERS = ["Governo", "Militar", "Setor Privado"];

export const PAPEIS = [
  "",
  "Scrum Master",
  "Product Owner",
  "Owner/Stakeholder",
  "Developer",
  "Comprador - Governo",
  "Comprador - Militar",
  "Comprador - Setor Privado",
];

export const TEAM_IMAGES = {
  "Maverick Aviation": {
    logo: "/images/maverick_caca.jpg",
    Caça: "/images/maverick_caca.jpg",
    Transporte: "/images/maverick_cargo.jpg",
  },
  "SkyForge Ind. Aeronáutica": {
    logo: "/images/skyforge_caca.jpg",
    Caça: "/images/skyforge_caca.jpg",
    Transporte: "/images/skyforge_cargo.jpg",
  },
};

export const BUYER_IMAGES = {
  Governo: "/images/governo_caca.jpg",
  Militar: "/images/militar.jpg",
  "Setor Privado": "/images/empresa_privada.jpg",
};

export const ROLE_COLORS = {
  "Scrum Master": "#455F51",
  "Product Owner": "#029676",
  "Owner/Stakeholder": "#0989B1",
  Developer: "#549E39",
  "Comprador - Governo": "#E8871E",
  "Comprador - Militar": "#B33A3A",
  "Comprador - Setor Privado": "#E8871E",
};

export const TAB_LIST = [
  { key: "setup", label: "Configuração" },
  { key: "alunos", label: "Alunos" },
  { key: "escalacao", label: "Escalação" },
  { key: "sm", label: "Scrum Master" },
  { key: "owner", label: "Owner" },
  { key: "po", label: "Product Owner" },
  { key: "dev", label: "Developers" },
  { key: "buyerProf", label: "Compradores (Papel)" },
  { key: "buyerProduct", label: "Compradores (Produto)" },
  { key: "corrupsab", label: "Corrupção & Sabotagem" },
  { key: "result", label: "Resultado Final" },
];
