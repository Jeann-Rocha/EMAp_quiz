# EMAp Personality Study

Site estático para GitHub Pages (sem backend, cadastro ou analytics). Envie `index.html`, `style.css`, `app.js`, `score.js`, `data.js` e a pasta `fotos/` para a raiz do repositório e ative **Settings → Pages → Deploy from a branch → main / (root)**.

## Como funciona
- **3 níveis:** Rápido (10), Equilibrado (20) e Profundo (30). Cada nível usa as primeiras 10/20/30 perguntas; cada bloco de 10 cobre áreas variadas.
- **Dois sinais por resposta:** (1) pontos em até dois dos 8 traços (`"T2D1"`); (2) campo `p`, com pontos diretos para docentes cujo trabalho a opção evoca (`{codeco:2, struchiner:1}`). As perguntas novas partem de coisas concretas de cada docente (dengue e InfoDengue, mobilidade por celular, Julia/SDDP, GFlowNets, cálculo de Itô, olimpíadas, wordnets, visual analytics…).
- **Afinidade** (`score.js`): correlação do seu vetor com o vetor do docente, recentrado pela média de cada traço (o que distingue o docente pesa mais) + sinal direto das escolhas, normalizado pelo que cada docente podia receber. Docentes sem nenhuma opção ligada recebem o sinal médio, sem prêmio nem punição. O **antagonista** usa só os traços.
- **Fotos:** `fotos/<id>.jpg` (ids em `data.js`, ex.: `bernardo`, `codeco`, `saporito`). Sem foto, aparece um monograma. `node baixar-fotos.js` tenta baixar do site da EMAp (não testado; confira).
- Os vetores são **julgamentos editoriais** a partir de áreas de pesquisa públicas; não são avaliações da personalidade dos docentes. Ajuste-os em `data.js`.
- O campo `note` traz fatos públicos (site da EMAp, páginas pessoais).

Fontes: https://emap.fgv.br/pessoas · https://emap.fgv.br/linhas-de-pesquisa
