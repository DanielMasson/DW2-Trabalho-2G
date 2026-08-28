# Painel de Avaliação — Simulação Scrum Competitiva (React)

Migração do painel original (HTML/CSS/JS puro) para **Vite + React + TypeScript**.

## Status

Este diretório é o resultado do merge das quatro entregas do plano de
migração (`Divisao_Plano_Migracao_React.md`):

1. **Pessoa 1** — fundação do projeto (types, constants, seed, store
   base, CSS, shell da app).
2. **Pessoa 2** — `SetupTab`, `AlunosTab`, `EscalacaoTab`,
   `persistence.ts`, `excelImport.ts`, `scoring.ts` + testes, setters
   `setAlunoField`/`setAlunos`.
3. **Pessoa 3** — `ScrumMasterTab`, `OwnerTab`, `ProductOwnerTab`,
   `DevelopersTab` (abas `sm`/`owner`/`po`/`dev`), setters
   `setSmField`/`setOwnerField`/`setPoField`/`setDevField` no store
   (`useSimulationStore.ts`) + testes (`useSimulationStore.test.ts`).
4. **Pessoa 4** — `BuyerProfTab`, `BuyerProductTab`,
   `CorrupcaoSabotagemTab`, `ResultadoFinalTab`, `lib/sprintLabel.ts`,
   setters `setBuyerProfField`/`setBuyerProductField`/
   `setCorrupcaoField`/`setSabotagemField`/`resetAll`.

Com isso, **todas as 11 abas** do plano de migração estão implementadas
e registradas em `App.tsx -> TAB_PANELS`. O placeholder `EmConstrucao`
continua no projeto apenas como fallback genérico (usado caso alguma
aba futura ainda não tenha painel registrado), mas não é mais exibido
para nenhuma das abas atuais.

### Entrega da Pessoa 3 — detalhes

- `ScrumMasterTab.tsx` — avaliação por Sprint × Empresa (um SM por
  empresa): checklist Sim/Não (conduziu eventos, removeu impedimentos,
  ajudou o time) + nota 1–5 + observações. Porta 1:1 o `renderSM()` do
  `js/app.js` original.
- `OwnerTab.tsx` — avaliação por Sprint × Empresa: comunicação,
  negociação e alinhamento (notas 1–5) + nota geral + observações.
  Porta 1:1 o `renderOwner()` original. Não confundir com os pontos de
  corrupção, calculados à parte na aba "Corrupção & Sabotagem"
  (Pessoa 4).
- `ProductOwnerTab.tsx` — avaliação por Sprint × Empresa × Time (2 times
  por empresa): checklist Sim/Não (requisitos, testes, reunião de
  priorização) + nota 1–5 + observações. Porta 1:1 o `renderPO()`
  original.
- `DevelopersTab.tsx` — avaliação por Sprint × Empresa × Time: qualidade
  do produto e colaboração (notas 1–5), checklist "seguiu o processo",
  nota do time e campo livre de destaque individual. Porta 1:1 o
  `renderDev()` original.
- Setters `setSmField`/`setOwnerField`/`setPoField`/`setDevField`
  adicionados ao `SimulationStore` (`useSimulationStore.ts`), seguindo
  exatamente o mesmo padrão genérico e tipado (`<K extends keyof Row>`)
  já usado pelos setters da Pessoa 4 (`setBuyerProfField`/
  `setBuyerProductField`). Cada um atualiza apenas a linha/campo
  indicado, via Immer, sem tocar no restante do array.
- Nenhum arquivo de outra pessoa precisou ser alterado, exceto
  `App.tsx` (registro das 4 abas em `TAB_PANELS`, trocando o
  `EmConstrucao` pelo componente real) e `useSimulationStore.ts`
  (adição dos 4 setters — as demais entradas do store permanecem
  intactas).

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

Para rodar os testes (Vitest):

```bash
npm test
```

## Estrutura de pastas

```
src/
  types/index.ts
  data/constants.ts
  data/seed.ts
  store/
    useSimulationStore.ts          -> MESCLADO (Pessoa 1 + 2 + 3 + 4)
    useSimulationStore.test.ts      (Pessoa 3 — setters sm/owner/po/dev)
  lib/
    persistence.ts                  (Pessoa 2)
    excelImport.ts                  (Pessoa 2)
    scoring.ts / scoring.test.ts    (Pessoa 2)
    sprintLabel.ts                  (Pessoa 4)
  components/
    TopBar.tsx
    TabsBar.tsx
    ui/                            -> ScoreSelect, SimNaoSelect, DecisaoSelect, ObsInput
    tabs/
      SetupTab.tsx                  (Pessoa 2)
      AlunosTab.tsx                 (Pessoa 2)
      EscalacaoTab.tsx              (Pessoa 2)
      ScrumMasterTab.tsx            (Pessoa 3)
      OwnerTab.tsx                  (Pessoa 3)
      ProductOwnerTab.tsx           (Pessoa 3)
      DevelopersTab.tsx             (Pessoa 3)
      BuyerProfTab.tsx              (Pessoa 4)
      BuyerProductTab.tsx           (Pessoa 4)
      CorrupcaoSabotagemTab.tsx     (Pessoa 4)
      ResultadoFinalTab.tsx         (Pessoa 4)
      EmConstrucao.tsx              -> fallback genérico (sem aba pendente no momento)
  style.css
  App.tsx                          -> MESCLADO (Pessoa 1 + 2 + 3 + 4)
  main.tsx
```
