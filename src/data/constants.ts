import type { Buyer, Papel, TabKey, TimeNome } from "@/types";

// =====================================================================
// CONSTANTES DE DOMÍNIO
// Portadas 1:1 do js/app.js original.
// =====================================================================

export const SPRINTS = [1, 2, 3] as const;

export const TIMES: TimeNome[] = ["Caça", "Transporte"];

export const BUYERS: Buyer[] = ["Governo", "Militar", "Setor Privado"];

export const PAPEIS: Papel[] = [
  "",
  "Scrum Master",
  "Product Owner",
  "Owner/Stakeholder",
  "Developer",
  "Comprador - Governo",
  "Comprador - Militar",
  "Comprador - Setor Privado",
];

/**
 * Imagens por empresa/time. Os arquivos vivem em /public/images, então o
 * caminho é resolvido a partir da raiz do site (sem precisar de import).
 */
export const TEAM_IMAGES: Record<string, { logo: string; Caça: string; Transporte: string }> = {
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

export const BUYER_IMAGES: Record<Buyer, string> = {
  Governo: "/images/governo_caca.jpg",
  Militar: "/images/militar.jpg",
  "Setor Privado": "/images/empresa_privada.jpg",
};

export const ROLE_COLORS: Partial<Record<Papel, string>> = {
  "Scrum Master": "#455F51",
  "Product Owner": "#029676",
  "Owner/Stakeholder": "#0989B1",
  Developer: "#549E39",
  "Comprador - Governo": "#E8871E",
  "Comprador - Militar": "#B33A3A",
  "Comprador - Setor Privado": "#E8871E",
};

/**
 * Lista de abas na ordem de navegação (TabsBar) e título exibido.
 * O componente correspondente a cada aba é registrado em App.tsx,
 * em `TAB_PANELS` — cada pessoa liga sua própria aba lá, sem precisar
 * tocar neste arquivo.
 */
export const TAB_LIST: { key: TabKey; label: string }[] = [
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
