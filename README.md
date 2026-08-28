# Painel de Avaliação — Simulação Scrum Competitiva (React)

Migração do painel original (HTML/CSS/JS puro) para **Vite + React + JavaScript**.


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
public/
  images/                          -> logos e fotos usados em Escalação/Compradores
src/
  data/
    constants.js
    seed.js
  store/
    useSimulationStore.js          
    useSimulationStore.test.js      
  lib/
    persistence.js                  
    excelImport.js                  
    scoring.js / scoring.test.js   
    sprintLabel.js                 
  components/
    TopBar.jsx
    TabsBar.jsx
    ui/
      index.js                       -> ScoreSelect, SimNaoSelect, DecisaoSelect, ObsInput
      ScoreSelect.jsx
      SimNaoSelect.jsx
      DecisaoSelect.jsx
      ObsInput.jsx
    tabs/
      SetupTab.jsx                 
      AlunosTab.jsx                
      EscalacaoTab.jsx              
      ScrumMasterTab.jsx            
      OwnerTab.jsx                  
      ProductOwnerTab.jsx            
      DevelopersTab.jsx              
      BuyerProfTab.jsx              
      BuyerProductTab.jsx            
      CorrupcaoSabotagemTab.jsx      
      ResultadoFinalTab.jsx          
      EmConstrucao.jsx               -> fallback genérico (sem aba pendente no momento)
  style.css
  App.jsx                            
  main.jsx
index.html
vite.config.js
package.json
```
