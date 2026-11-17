# EMAp Personality Study

Site estático para GitHub Pages (sem backend, cadastro ou analytics). Envie `index.html`, `style.css`, `app.js` e `data.js` para a raiz do repositório e ative **Settings → Pages → Deploy from a branch → main / (root)**.

## Como funciona
- **3 níveis:** Rápido (10 perguntas), Equilibrado (20) e Profundo (30). Os níveis usam as primeiras 10/20/30 perguntas do banco, escritas em blocos balanceados entre os traços; mais respostas = perfil mais estável.
- **8 traços:** abstração/rigor, impacto aplicado, dados/padrões, incerteza, dinâmica/mecanismos, construção/computação, decisão/otimização, comunicação/visualização. Cada resposta soma pontos a até dois traços (`"T2D1"`).
- **Afinidade:** correlação entre seu vetor de traços e o vetor de cada docente (campo `t` em `data.js`, ordem T A D I M C O V, valores 0–5). O **antagonista** é o docente com menor correlação.
- Os vetores são **julgamentos editoriais** a partir de áreas de pesquisa públicas; não são avaliações da personalidade dos docentes nem medida psicométrica. Ajuste-os livremente em `data.js`.
- O campo `note` traz fatos de fontes públicas fora do site da EMAp (páginas pessoais, repositórios, bases acadêmicas). Hoje existe para Paccanaro, Iusem, Mesquita, Nascimento, Thompson, de Pinho, Targino e Saporito. Os demais ainda usam só a área informada pela EMAp.

Fontes: https://emap.fgv.br/pessoas · https://emap.fgv.br/linhas-de-pesquisa
