# EMAp Personality Study

Site estático para GitHub Pages (sem backend, cadastro ou analytics). Envie `index.html`, `style.css`, `app.js`, `score.js`, `data.js` e a pasta `fotos/` para a raiz do repositório e ative **Settings → Pages → Deploy from a branch → main / (root)**.

## Como funciona
- **3 níveis:** Rápido (10), Equilibrado (20) e Profundo (30). Cada nível usa as primeiras 10/20/30 perguntas; cada bloco de 10 cobre áreas variadas.
- **Escala Likert:** cada item é uma afirmação genérica, respondida em 5 pontos (concordo totalmente … discordo totalmente). Concordar soma, discordar subtrai nos traços (`w`, ex. `"T2D1"`). O campo `p` liga a afirmação a docentes cujo jeito de trabalhar ela evoca (`{codeco:2, bernardo:1}`); as afirmações não citam áreas, para não entregar o viés.
- **Afinidade** (`score.js`): correlação do seu vetor com o vetor do docente, recentrado pela média de cada traço (o que distingue o docente pesa mais) + sinal direto das concordâncias (discordar pesa 40% do que concordar), normalizado pelo que cada docente podia receber. Docentes sem nenhuma opção ligada recebem o sinal médio, sem prêmio nem punição. O **antagonista** usa só os traços.
- **Fotos:** `fotos/<id>.jpg` (ids em `data.js`, ex.: `bernardo`, `codeco`, `saporito`). Sem foto, aparece um monograma. `node baixar-fotos.js` tenta baixar do site da EMAp (não testado; confira).
- Os vetores são **julgamentos editoriais** a partir de áreas de pesquisa públicas; não são avaliações da personalidade dos docentes. Ajuste-os em `data.js`.
- O campo `note` traz fatos públicos (site da EMAp, páginas pessoais).

Fontes: https://emap.fgv.br/pessoas · https://emap.fgv.br/linhas-de-pesquisa
