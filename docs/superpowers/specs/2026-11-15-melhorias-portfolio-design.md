# Melhorias do portfólio — design (aprovado em 15/11/2026)

## Intenção

O portfólio existe para que recrutadores de vagas de desenvolvimento de software chamem o João para conversar. A auditoria de 15/11/2026 (Lighthouse mobile: Performance 100, Acessibilidade 97, Boas práticas 96, SEO 100; axe-core) mostrou falhas que afetam como o site aparece quando compartilhado e para quem tem dificuldade de leitura, além de peso desnecessário e ausência de teste automático.

## Objetivos

1. **Contraste (WCAG AA):** `.muted` dos títulos (1,58:1 → ≥ 3:1, texto grande); texto branco sobre botões/cartões laranja (2,97:1 → ≥ 4,5:1 para texto normal, ≥ 3:1 para grande). Manter a identidade (fundo escuro, laranja e verde-limão).
2. **Páginas de projeto compartilháveis:** cada projeto com página tem HTML estático próprio, com `<title>`, `description`, `canonical`, Open Graph e imagem de prévia do próprio projeto, legíveis sem JavaScript.
3. **Galerias leves:** miniaturas próprias para as galerias de projeto; a imagem grande só carrega ao ampliar.
4. **Menu no celular:** todos os destinos alcançáveis sem rolagem horizontal escondida.
5. **Arquivos básicos de SEO:** `404.html` no estilo do site, `robots.txt`, `sitemap.xml` e JSON-LD `Person` na página inicial.
6. **Teste automático:** um comando que sobe o site localmente e verifica o que o `CLAUDE.md` exige (erros de JS, 404 locais, imagens quebradas, rolagem horizontal, filtros, lightboxes, formulário com rede interceptada, axe sem `serious`/`critical`).

## Não-objetivos

- Trocar a stack, adicionar framework ou build ao site publicado.
- Redesenhar o layout.
- Capturas de FinTrack, Ecos de Aldenor e AutoLeitura (dependem do João).

## Anti-objetivos (falha mesmo se "funcionar")

- O site passar a depender de um passo de build para funcionar na Vercel.
- Conteúdo duplicado que possa divergir: as páginas estáticas precisam ser geradas a partir do `dados.js`, nunca editadas à mão.
- Qualquer texto novo com fato não confirmado pelo João.

## Abordagens consideradas

- **Páginas de projeto:**
  - (A) gerar `projetos/<id>.html` estáticos com um script Node fora do site (`tools/`), a partir do `dados.js`, e commitar o resultado. **Escolhida**: crawlers leem as metas, o site continua estático, e há uma única fonte de verdade.
  - (B) Edge Function/middleware da Vercel injetando metas. Descartada: adiciona runtime e configuração de servidor a um site estático.
  - (C) Manter `projeto.html?id=` só com JS. Descartada: não resolve as prévias.
  - `projeto.html?id=` continua existindo e redireciona para a página estática, para não quebrar links já compartilhados.
- **Menu no celular:**
  - (A) encurtar os rótulos e reduzir o espaçamento até caberem. Frágil com 6 itens em 375 px.
  - (B) botão "Menu" que abre a lista. **Escolhida**: escala com novas seções e é acessível (`aria-expanded`).
- **Contraste:** ajustar tokens (`--muted`, cor do texto sobre laranja) em vez de trocar o laranja; verificar com axe.

## Decisões do builder (calls do Claude)

- Script gerador em `tools/gerar-paginas.mjs` (Node, sem dependências), rodado manualmente; documentado no `CLAUDE.md`.
- Imagem de prévia por projeto: a capa (`image`) do projeto, convertida para JPEG 1200×630 (`og` não aceita WebP em todos os apps).
- Testes em `tests/` com Playwright + axe-core, rodando com `npm test` a partir de `tests/package.json` (fora do site; a Vercel ignora).
