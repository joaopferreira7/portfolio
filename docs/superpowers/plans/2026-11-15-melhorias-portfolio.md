# Melhorias do portfólio — plano de implementação

> **Para quem executa:** SUB-SKILL OBRIGATÓRIA: superpowers:executing-plans (execução nativa: o João pediu que o Claude execute o próprio plano). Passos com checkbox `- [ ]`.

**Objetivo:** corrigir contraste, tornar as páginas de projeto compartilháveis (HTML estático com prévia própria), aliviar as galerias, consertar o menu no celular, adicionar 404/robots/sitemap/JSON-LD e criar um teste automático — sem build no site publicado.

**Arquitetura:** o site continua HTML/CSS/JS puro. Dois geradores **fora do site** (`tools/`) leem `dados.js` e escrevem arquivos estáticos que são commitados (`projetos/<id>.html`, `sitemap.xml`, miniaturas e imagens de prévia). Testes em `tests/` sobem um servidor estático Node e usam Playwright + axe-core.

**Stack:** HTML, CSS, JS (navegador); Node 22 (`node:test`, `node:http`, `node:vm`) para geradores e testes; Python 3 + Pillow para imagens; Playwright (já instalado no ambiente) + axe-core 4.10.2.

**Spec:** `docs/superpowers/specs/2026-11-15-melhorias-portfolio-design.md` (aprovado pelo João em 15/11/2026).

Ao sair do modo de plano, este arquivo é copiado para `docs/superpowers/plans/2026-11-15-melhorias-portfolio.md` e commitado junto com o spec e o `CLAUDE.md`.

## Contexto

O portfólio (`/home/claude/portfolio`, publicado em joaopferreira.vercel.app) existe para recrutadores chamarem o João. A auditoria de hoje (Lighthouse mobile 100/97/96/100 + axe) achou: contraste reprovado em `.muted` (1,58:1) e em texto branco sobre laranja (2,97:1); `projeto.html?id=` define título/descrição só por JS, então LinkedIn/WhatsApp mostram prévia genérica; galerias baixam imagens de 1280 px para miniaturas de 260 px (~230 KB a mais no ChronoMundi); no celular o 6º item do menu ("Contato") fica fora da tela; faltam 404, robots, sitemap e JSON-LD; não há teste automático. O `CLAUDE.md` já foi escrito nesta sessão.

## Restrições globais

- Site sem build: a Vercel publica a raiz como está. `tools/` e `tests/` não são carregados pelo site.
- Fonte única de conteúdo: `dados.js`. Páginas geradas trazem `<!-- Gerado por tools/gerar-paginas.mjs a partir de dados.js. Não edite à mão. -->`.
- Domínio canônico: `https://joaopferreira.vercel.app`; URL canônica de projeto: `https://joaopferreira.vercel.app/projetos/<id>` (Vercel `cleanUrls`).
- Cores novas: `--muted: #6b6763` (3,3:1 sobre `#151312`); texto sobre laranja `#f46c38` passa a `#151312` (6,22:1). Não mudar `--accent`, `--accent-2`, `--bg`.
- Imagens de prévia: JPEG 1200×630, qualidade 82, em `img/og/<id>.jpg`. Miniaturas de galeria: WebP largura ≤ 640, qualidade 75, `<nome>-thumb.webp` ao lado do original.
- Português do Brasil em textos, nomes de arquivo e mensagens de commit. Nenhum fato novo sobre o João.
- Versão de cache: `?v=2026-11-16` em todos os `<link>`/`<script>` locais.

## Foco de revisão (casos que os testes precisam cobrir)

1. Link antigo `projeto.html?id=chronomundi` (já compartilhado) → precisa chegar em `projetos/chronomundi` (Vercel: redirect 308 no `vercel.json`; local: `location.replace` no `projeto.html`). Teste na Tarefa 5.
2. `projeto.html?id=inexistente` ou sem `id` → não pode ficar em branco: mostra "Projeto não encontrado" com link para `./#projetos`. Teste na Tarefa 5.
3. Alguém edita `dados.js` e esquece de rodar o gerador → teste `--check` falha apontando o arquivo desatualizado. Teste na Tarefa 5.
4. Menu do celular aberto + clique num link → menu fecha e a âncora rola; `Esc` fecha. Teste na Tarefa 3.
5. Galeria: clicar na miniatura abre a imagem **grande** (não a `-thumb`). Teste na Tarefa 4.

---

### Task 1: Infra de testes + testes da linha de base

**Arquivos:**
- Criar: `tests/package.json`, `tests/servidor.mjs`, `tests/site.test.mjs`, `tests/.gitignore` (`node_modules/`)

**Interfaces:**
- Produz: `iniciarServidor(raiz: string, porta?: number) → Promise<{ url: string, fechar: () => Promise<void> }>` em `tests/servidor.mjs` (node:http, MIME por extensão, 404 servindo `404.html` se existir, sem cleanUrls); `abrir(caminho, { celular?: boolean }) → Promise<{ page, erros: string[], respostasRuins: string[] }>` e `semViolacoesAxe(page) → Promise<string[]>` (lista `id (impact)` de violações `serious`/`critical`, com `.reveal` forçado a `.visible`) dentro de `tests/site.test.mjs`.
- `tests/package.json`: `"type": "module"`, `"scripts": { "test": "node --test" }`, devDependencies `axe-core@4.10.2` e `playwright@^1` (no ambiente do Claude, instalar só `axe-core` com `npm i --no-save axe-core@4.10.2` e usar o Playwright global).

- [ ] **Passo 1: escrever os testes da linha de base** (devem PASSAR com o site atual)
  - `index sem erros de JS, sem 4xx locais, sem imagem local quebrada, sem rolagem horizontal` (desktop 1366×900 e iPhone 13)
  - `filtro "extensao" mostra exatamente 2 certificados` (Fábrica de Software e Automação de Processos com RPA)
  - `lightbox do certificado da FAT abre sem link de credencial`; `o de Python abre com link do Drive`
  - `formulário: sucesso mostra "Mensagem enviada!"; falha mostra o link de e-mail` (via `page.route('https://formsubmit.co/**')`)
- [ ] **Passo 2: escrever o teste de acessibilidade** `index sem violações axe serious/critical` — deve FALHAR hoje com `color-contrast (serious)`.
- [ ] **Passo 3: rodar** `cd tests && node --test` → linha de base PASSA, axe FALHA com `color-contrast`.
- [ ] **Passo 4: commit** `test: infraestrutura de testes e linha de base do site`

### Task 2: Contraste WCAG AA

**Arquivos:** Modificar `style.css` (tokens `:root` linhas 1–13; regras com `color: #fff` sobre `var(--accent)`: `.card-badge` ~l.103, `.btn` ~l.289, `.filter.active` ~l.423, `.hl-accent` ~l.152 e `.hl small`)

- [ ] **Passo 1:** rodar `node --test --test-name-pattern=axe` → FALHA com `color-contrast` (teste da Tarefa 1). A página de projeto entra no axe na Tarefa 5.
- [ ] **Passo 2:** `--muted: #6b6763`; novo token `--on-accent: #151312` usado em `.btn`, `.card-badge`, `.filter.active`, `.hl-accent` (e `.hl-accent small` com `opacity: .8`). Manter `.hl-light` (já escuro sobre verde).
- [ ] **Passo 3:** `node --test` → tudo PASSA (axe sem `color-contrast`).
- [ ] **Passo 4:** conferir visualmente screenshot desktop do hero e da seção Certificados (botões laranja com texto escuro legível).
- [ ] **Passo 5: commit** `fix: contraste dos títulos e dos botões laranja (WCAG AA)`

### Task 3: Menu no celular

**Arquivos:** Modificar `index.html` (`<nav class="nav">` l.24–31), `style.css` (`.nav` l.28–50 e media 640px l.315–317), `script.js` (bloco "Link ativo no menu", ~fim do arquivo).

**Interfaces:** Produz o markup do menu reutilizado pelas páginas geradas (Tarefa 5):
`<nav class="nav" aria-label="Principal"><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button><div class="nav-links" id="nav-links">…<a>…</div></nav>` e o script `menu.js` (novo, carregado por todas as páginas) com `iniciarMenu(): void` executado ao carregar.

- [ ] **Passo 1: testes (FALHAM):** em iPhone 13, `todos os links do menu ficam visíveis após abrir o menu` (bounding box dentro da viewport); `clicar em "Contato" fecha o menu e rola até #contato`; `Esc fecha o menu`; em desktop `.nav-toggle` não aparece e os 6 links estão visíveis.
- [ ] **Passo 2:** implementar. ≥ 641 px: igual a hoje (`.nav-toggle` oculto). ≤ 640 px: barra fixa com "João Pedro Ferreira" (texto à esquerda, link `#inicio`) + botão "Menu"; `.nav-links` em coluna, oculto até `aria-expanded="true"`. Remover `.nav a[href="#inicio"] { display:none }` e o `overflow-x: auto`. `menu.js`: alterna `aria-expanded`, fecha em clique de link e `Escape`. O IntersectionObserver de link ativo em `script.js` continua usando `.nav a`.
- [ ] **Passo 3:** `node --test` → PASSA.
- [ ] **Passo 4: commit** `feat: menu recolhível no celular`

### Task 4: Miniaturas de galeria e imagens de prévia

**Arquivos:** Criar `tools/gerar-imagens.py`; gerados: `img/projetos/*/*-thumb.webp`, `img/og/<id>.jpg`; Modificar o gerador de página (Tarefa 5) para usar a miniatura.

**Interfaces:** Produz a convenção `miniatura(src) = src.replace(/\.webp$/, "-thumb.webp")` e `img/og/<id>.jpg` para todo projeto com `image`.
- `tools/gerar-imagens.py [--check]`: para cada `img/projetos/**/*.webp` que não termina em `-thumb`, cria a miniatura se faltar ou se for mais antiga; para cada projeto de `dados.js` com `image` (ler via regex `id: "…"` + `image: \`${P}/…\``, ou chamando `node -e` que imprime JSON de `projectsData` — preferir o `node -e`), gera `img/og/<id>.jpg` 1200×630 por corte central (cover) + faixa inferior escura de 120 px com o nome do projeto em branco (fonte DejaVu Sans Bold 56 px) e "joaopferreira.vercel.app" em `#9a9894`. `--check` sai com código 1 se algo estiver faltando.

- [ ] **Passo 1: teste (FALHA):** `toda imagem de galeria tem -thumb.webp com largura ≤ 640` e `todo projeto com image tem img/og/<id>.jpg 1200×630` (ler dimensões com Playwright `naturalWidth` ou lendo o cabeçalho do arquivo).
- [ ] **Passo 2:** implementar `tools/gerar-imagens.py`; rodar `python3 tools/gerar-imagens.py`.
- [ ] **Passo 3:** `python3 tools/gerar-imagens.py --check` → código 0; `node --test` → PASSA.
- [ ] **Passo 4:** abrir 1 imagem de prévia gerada e conferir visualmente.
- [ ] **Passo 5: commit** `feat: miniaturas de galeria e imagens de prévia por projeto`

### Task 5: Páginas de projeto estáticas + redirect

**Arquivos:**
- Criar: `tools/gerar-paginas.mjs`, `galeria.js` (lightbox da galeria, extraído do script inline de `projeto.html`), gerados `projetos/<id>.html`
- Modificar: `projeto.html` (vira redirecionador), `dados.js` (`projectUrl`), `vercel.json` (redirect), `style.css` (se preciso para `.page` em subpasta)

**Interfaces:**
- Consome: markup do menu + `menu.js` (Tarefa 3); `miniatura(src)` e `img/og/<id>.jpg` (Tarefa 4); `projectsData`, `GITHUB`, `hasPage` de `dados.js`.
- Produz: `carregarDados(caminho: string) → { projectsData, GITHUB, hasPage }` (lê `dados.js` com `node:vm`, avaliando `código + ";({ projectsData, GITHUB, hasPage })"`); `renderizarPagina(p) → string` (HTML completo); `node tools/gerar-paginas.mjs [--check]` escreve `projetos/<id>.html` para cada `hasPage(p)` e `sitemap.xml` (Tarefa 6 usa); `--check` compara sem escrever e sai 1 listando arquivos divergentes.
- `projectUrl(p)` em `dados.js` passa a `projetos/${p.id}.html` para projetos com página.

- [ ] **Passo 1: testes (FALHAM):**
  - `cada projetos/<id>.html tem <title> "<Nome> — João Pedro Ferreira", meta description, canonical /projetos/<id>, og:title, og:description e og:image img/og/<id>.jpg` (verificado **com JavaScript desativado**: `browser.newContext({ javaScriptEnabled: false })`)
  - `conteúdo visível sem JS`: h1 com o nome, seção "Sobre o projeto" e as imagens da galeria apontando para `-thumb.webp`
  - `clicar na miniatura abre a imagem grande` (src do dialog sem `-thumb`) — Foco 5
  - `projeto.html?id=chronomundi redireciona para projetos/chronomundi.html` — Foco 1
  - `projeto.html?id=inexistente mostra "Projeto não encontrado" com link para ./#projetos` — Foco 2
  - `node tools/gerar-paginas.mjs --check sai com 0` (via `child_process`) — Foco 3
  - axe sem `serious/critical` em `projetos/chronomundi.html`
  - cards de "Outros projetos" e botão "Ver vídeo e capturas" apontam para `projetos/<id>.html`
- [ ] **Passo 2:** implementar `tools/gerar-paginas.mjs` reproduzindo o markup atual de `projeto.html` (cabeçalho `.page`, vídeo, fatos, "como foi feito", galeria) com caminhos relativos `../`; descrição da meta = `p.desc` ou `p.problem` truncado em 155 caracteres sem cortar palavra. `galeria.js` com `iniciarGaleria(): void` (dialog `#lightbox`, imagem grande em `data-src`).
- [ ] **Passo 3:** `projeto.html`: se `id` existe em `projectsData` com página → `location.replace("projetos/" + id + ".html")`; senão mantém a mensagem "Projeto não encontrado". `vercel.json`: `redirects: [{ "source": "/projeto", "has": [{ "type": "query", "key": "id", "value": "(?<id>[a-z0-9-]+)" }], "destination": "/projetos/:id", "permanent": true }]`.
- [ ] **Passo 4:** rodar `node tools/gerar-paginas.mjs`; `node --test` → PASSA.
- [ ] **Passo 5: commit** `feat: páginas estáticas por projeto com prévia própria`

### Task 6: 404, robots, sitemap e JSON-LD

**Arquivos:** Criar `404.html`, `robots.txt`; Modificar `tools/gerar-paginas.mjs` (escreve `sitemap.xml`), `index.html` (`<script type="application/ld+json">` no `<head>`).

- [ ] **Passo 1: testes (FALHAM):** `URL inexistente devolve 404 com 404.html` (servidor de teste serve `404.html`), com link para `/` e o menu; `robots.txt contém "Sitemap: https://joaopferreira.vercel.app/sitemap.xml"`; `sitemap.xml lista / e /projetos/<id> de cada projeto com página`; `JSON-LD do index é JSON válido com @type "Person", name "João Pedro Ferreira", url, sameAs com github.com/joaopferreira7 e linkedin.com/in/joaopedroferreira19, worksFor "Yank Solutions", alumniOf "UNISAGRADO"`.
- [ ] **Passo 2:** implementar. `404.html` com caminhos absolutos (`/style.css?v=…`, `/menu.js`), título "Página não encontrada", texto curto e botões "Voltar ao início" e "Ver projetos" (`/#projetos`). `robots.txt`: `User-agent: *` / `Allow: /` / linha do Sitemap. JSON-LD com `jobTitle: "Estagiário em Desenvolvimento Java"`, `address` Bauru/SP.
- [ ] **Passo 3:** `node tools/gerar-paginas.mjs && node --test` → PASSA.
- [ ] **Passo 4: commit** `feat: página 404, robots.txt, sitemap e dados estruturados`

### Task 7: Documentação, versão, verificação final e publicação

**Arquivos:** Modificar `CLAUDE.md` (seções Estrutura, Como adicionar conteúdo, Validação: `tools/` e `tests/`), `README.md` (estrutura), `index.html`/`projeto.html`/`404.html`/gerador (`?v=2026-11-16`).

- [ ] **Passo 1:** atualizar docs e versões; regenerar páginas.
- [ ] **Passo 2:** verificação completa: `python3 tools/gerar-imagens.py --check && node tools/gerar-paginas.mjs --check && (cd tests && node --test)` → tudo verde; Lighthouse mobile em `index.html` e `projetos/chronomundi.html` → Acessibilidade 100 nas duas, `color-contrast` ausente.
- [ ] **Passo 3:** revisão final do branch com superpowers:requesting-code-review (um revisor novo).
- [ ] **Passo 4: commit** `docs: CLAUDE.md e README com geradores e testes`
- [ ] **Passo 5: publicar.** Sem credencial de push no sandbox: usar o Chrome do João (upload pelo GitHub web, pastas de imagem primeiro, código por último) se a extensão estiver conectada; senão entregar os arquivos alterados e explicar o bloqueio.
- [ ] **Passo 6: verificar o site publicado:** `/projetos/chronomundi` com metas corretas, `/projeto?id=chronomundi` redireciona (308), `/rota-inexistente` mostra a 404, menu no celular funciona.

## Verificação ponta a ponta

```bash
cd /home/claude/portfolio
python3 tools/gerar-imagens.py --check
node tools/gerar-paginas.mjs --check
cd tests && npm i --no-save axe-core@4.10.2 && node --test
```
Mais: Lighthouse mobile (index e uma página de projeto) e, após o deploy, as checagens do Passo 6 no domínio da Vercel.
