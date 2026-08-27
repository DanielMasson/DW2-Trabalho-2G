# Painel de Avaliação — Simulação Scrum Competitiva (React)

Migração do painel original (HTML/CSS/JS puro) para **Vite + React + TypeScript**.
Este commit entrega a parte da **Pessoa 1 — Fundação & Infraestrutura**, conforme
`Divisao_Plano_Migracao_React.md`.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. O painel já sobe funcional: TopBar, navegação
entre abas e controle de fonte funcionam. As abas em si mostram um placeholder
("Esta aba ainda não foi implementada") até as Pessoas 2, 3 e 4 entrarem com
seus componentes.

## O que foi entregue nesta etapa

- **Setup do projeto** — Vite + React 18 + TypeScript, com alias `@/` apontando
  para `src/`.
- **`src/types/index.ts`** — todas as interfaces do domínio (`Meta`, `SmRow`,
  `OwnerRow`, `PoRow`, `DevRow`, `BuyerProfRow`, `BuyerProductRow`, `Corrupcao`,
  `Sabotagem`, `Aluno`, `SimulationState`, etc.), portadas 1:1 do modelo de
  dados do `app.js` original.
- **`src/data/constants.ts`** e **`src/data/seed.ts`** — constantes globais
  (`SPRINTS`, `TIMES`, `BUYERS`, `PAPEIS`, imagens, cores) e `buildInitialData`,
  que monta o estado inicial da simulação.
- **`src/store/useSimulationStore.ts`** — store global com Zustand + immer +
  persist (localStorage). Contém a estrutura base (`data`, `tab`, `fileName`) e
  setters genéricos (`setByPath`, `setMeta`, `setWeights`, `changeFontScale`,
  `renameEmpresa`, `replaceState`). Cada pessoa acrescenta ali os setters
  específicos da sua aba — ver comentário no topo do arquivo.
- **CSS migrado** — `src/style.css` é uma cópia 1:1 do `css/style.css`
  original, importada globalmente em `src/main.tsx`.
- **Shell da aplicação** — `App.tsx`, `TopBar.tsx`, `TabsBar.tsx`: montam o
  layout (topo fixo, abas, área do painel) e a navegação entre abas.
- **Componentes de UI reutilizáveis** (`src/components/ui/`) — `ScoreSelect`,
  `SimNaoSelect`, `DecisaoSelect`, `ObsInput`. São componentes controlados
  (`value` + `onChange`), sem conhecimento de "path" no estado — cada aba
  decide como ligá-los ao store.

## Assets estáticos

- `public/images/*.jpg` — logos das empresas e fotos dos compradores (mesmos
  arquivos do painel original). Referenciados como `/images/arquivo.jpg`.
- `public/data/alunos.xlsx` — cópia da planilha original de alunos, mantida
  como referência (não é lida pelo app; a importação de fato usa SheetJS,
  a cargo da Pessoa 2 em `lib/excelImport.ts`).

## Pontos de integração para as próximas pessoas

1. **Registrar uma aba**: em `src/App.tsx`, o objeto `TAB_PANELS` mapeia cada
   `TabKey` ao componente da aba. Basta importar o componente e preencher a
   entrada correspondente — nada mais precisa mudar em `App.tsx`.
   ```ts
   import { ScrumMasterTab } from "@/components/tabs/ScrumMasterTab";
   // ...
   const TAB_PANELS: Partial<Record<TabKey, ComponentType>> = {
     sm: ScrumMasterTab,
   };
   ```
2. **Setters do store**: adicione as ações específicas da sua aba em
   `useSimulationStore.ts`, seguindo o padrão dos setters existentes
   (mutação direta do `state.data...` dentro do `set((state) => {...})`,
   graças ao middleware `immer`).
3. **TopBar (Pessoa 2 e Pessoa 4)**: `TopBar` já aceita `onSave`, `onLoad` e
   `onReset` como props opcionais — hoje os botões ficam desabilitados. Em
   `App.tsx`, plugue os handlers reais (`lib/persistence.ts` para
   salvar/carregar, `resetAll()` + `confirm()` para limpar).
4. **`replaceState(newState, fileName)`** no store é o ponto de entrada para
   repor o `STATE` inteiro — use ao carregar um `.json` ou ao reimportar a
   lista de alunos via Excel.

## Estrutura de pastas

```
src/
  types/index.ts          -> interfaces do domínio
  data/constants.ts        -> constantes globais (SPRINTS, TIMES, imagens...)
  data/seed.ts              -> SEED_NAMES + buildInitialData
  store/useSimulationStore.ts
  components/
    TopBar.tsx
    TabsBar.tsx
    ui/                    -> ScoreSelect, SimNaoSelect, DecisaoSelect, ObsInput
    tabs/                  -> um arquivo por aba (a preencher pelas Pessoas 2/3/4)
  style.css                -> CSS migrado 1:1
  App.tsx
  main.tsx
```
