# Painel de Avaliação — Simulação Scrum Competitiva (React)

Migração do painel original (HTML/CSS/JS puro) para **Vite + React + TypeScript**.

## Status pós-merge

Este diretório é o resultado do merge das três cópias divergentes do
repositório recebidas até agora:

1. **Raiz (Pessoa 1 + Pessoa 2)** — fundação do projeto (types, constants,
   seed, store base, CSS, shell da app) e a entrega completa da Pessoa 2
   (SetupTab, AlunosTab, EscalacaoTab, persistence.ts, excelImport.ts,
   scoring.ts + testes, setters `setAlunoField`/`setAlunos`).
2. **`pessoa2-entrega (1)/`** — idêntica à raiz em todos os arquivos
   comparados (mesma entrega, cópia duplicada). Nenhum conflito real;
   tratada como confirmação, não como merge.
3. **`painel-avaliacao-scrum-pessoa4/`** — entrega da Pessoa 4
   (BuyerProfTab, BuyerProductTab, CorrupcaoSabotagemTab,
   ResultadoFinalTab, `lib/sprintLabel.ts`, setters
   `setBuyerProfField`/`setBuyerProductField`/`setCorrupcaoField`/
   `setSabotagemField`/`resetAll`).

### Conflitos resolvidos

- **`src/store/useSimulationStore.ts`** — único arquivo com divergência
  estrutural real entre as cópias. A versão da Pessoa 2 tinha os setters
  de alunos mas não os de comprador/corrupção/sabotagem; a da Pessoa 4
  tinha o inverso e também definia `resetAll`. O arquivo mesclado contém
  **todos os setters das duas frentes** dentro do mesmo `create(...)`.
- **`src/App.tsx`** — a versão da Pessoa 2 registrava `setup`, `alunos`,
  `escalacao` e ligava `onSave`/`onLoad`; a da Pessoa 4 registrava
  `buyerProf`, `buyerProduct`, `corrupsab`, `result` e ligava `onReset`.
  O `App.tsx` mesclado registra as **7 abas já entregues** em
  `TAB_PANELS` e liga os três handlers (`onSave`, `onLoad`, `onReset`)
  na `TopBar` ao mesmo tempo.
- Todos os demais arquivos (`types/index.ts`, `data/constants.ts`,
  `data/seed.ts`, `style.css`, componentes de UI, `TopBar.tsx`,
  `TabsBar.tsx`, `index.html`, configs) eram **byte-a-byte idênticos**
  nas três cópias — foram apenas conferidos e copiados uma única vez.

### Ainda pendente

- **Pessoa 3** (`sm`, `owner`, `po`, `dev`): nenhuma das três cópias
  recebidas contém essa entrega. As quatro abas continuam mostrando o
  placeholder `EmConstrucao`, e o store ainda não tem
  `setSmField`/`setOwnerField`/`setPoField`/`setDevField` — adicione-os
  seguindo o mesmo padrão dos setters existentes quando a entrega
  chegar.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Estrutura de pastas

```
src/
  types/index.ts
  data/constants.ts
  data/seed.ts
  store/useSimulationStore.ts   -> MESCLADO (Pessoa 1 + 2 + 4)
  lib/
    persistence.ts               (Pessoa 2)
    excelImport.ts                (Pessoa 2)
    scoring.ts / scoring.test.ts  (Pessoa 2)
    sprintLabel.ts                (Pessoa 4)
  components/
    TopBar.tsx
    TabsBar.tsx
    ui/                          -> ScoreSelect, SimNaoSelect, DecisaoSelect, ObsInput
    tabs/
      SetupTab.tsx               (Pessoa 2)
      AlunosTab.tsx              (Pessoa 2)
      EscalacaoTab.tsx           (Pessoa 2)
      BuyerProfTab.tsx           (Pessoa 4)
      BuyerProductTab.tsx        (Pessoa 4)
      CorrupcaoSabotagemTab.tsx  (Pessoa 4)
      ResultadoFinalTab.tsx      (Pessoa 4)
      EmConstrucao.tsx           -> placeholder para sm/owner/po/dev (Pessoa 3, pendente)
  style.css
  App.tsx                        -> MESCLADO (Pessoa 1 + 2 + 4)
  main.tsx
```
