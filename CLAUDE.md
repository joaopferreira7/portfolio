# CLAUDE.md — Portfólio de João Pedro Ferreira

Guia para agentes (Claude) que trabalham neste repositório. Leia inteiro antes de mudar qualquer coisa.

## O que é

Portfólio pessoal de **João Pedro Ferreira**: estudante de Ciência da Computação na UNISAGRADO (Bauru/SP, formatura prevista 12/2027) e estagiário de desenvolvimento Java na Yank Solutions (time de Sustentação de automações RPA).

- **Site no ar:** https://joaopferreira.vercel.app (deploy automático da Vercel a cada push na `main`)
- **Público-alvo:** recrutadores de vagas de desenvolvimento de software (estágio/júnior). Toda decisão de conteúdo e layout deve servir a quem tem ~30 segundos para decidir se chama o João para conversar.
- **Idioma do site, do código e dos commits:** português do Brasil.

## Stack e princípios

- HTML, CSS e JavaScript puros. **Sem build, sem framework, sem npm no site.** Abrir o `index.html` num servidor estático tem de bastar.
- Um único tema escuro definido em variáveis no topo do `style.css` (`--bg`, `--surface`, `--accent` laranja `#f46c38`, `--accent-2` verde-limão `#c5ff41`). Fonte Poppins (Google Fonts).
- Layout inspirado no template Sawad: cartão de perfil fixo à esquerda (vira bloco no topo abaixo de 960px) e seções com título grande em duas linhas (`.title` + `.muted`).
- Conteúdo é **dado**, não HTML: projetos, formação e certificados ficam em `dados.js` e são renderizados por `script.js` / `projeto.html`.

## Estrutura

| Arquivo | Papel |
|---|---|
| `index.html` | Página única: Início, Experiência & Projetos (timeline), Projetos, Formação & Trajetória, Certificados & Cursos, Stack & Ferramentas, Contato |
| `projetos/<id>.html` | **Gerados** por `tools/gerar-paginas.mjs` a partir do `dados.js`: página de cada projeto com título, descrição, canonical e Open Graph próprios (vídeo, problema/o que fiz/resultado, "como foi feito", galeria). Nunca edite à mão |
| `projeto.html` | Endereço antigo (`projeto.html?id=<id>`): redireciona para `projetos/<id>.html` (no ar, o `vercel.json` faz um 308 antes). Mostra "Projeto não encontrado" se o id não existir |
| `menu.js` | Menu recolhível do celular (botão "Menu" abaixo de 641 px). Carregado em todas as páginas |
| `galeria.js` | Lightbox das galerias das páginas de projeto (miniatura → imagem grande em `data-src`) |
| `404.html` | Página de erro (a Vercel serve sozinha). Usa caminhos absolutos (`/style.css`) |
| `robots.txt`, `sitemap.xml` | SEO. O `sitemap.xml` é **gerado** junto com as páginas de projeto |
| `tools/` | Geradores que rodam na sua máquina, nunca no site: `gerar-paginas.mjs` (Node) e `gerar-imagens.py` (Python + Pillow) |
| `tests/` | Testes automáticos (Playwright + axe-core). Não fazem parte do site |
| `img/og/<id>.jpg` | **Gerados**: prévias 1200×630 de cada projeto com capa |
| `dados.js` | **Fonte de verdade do conteúdo**: `projectsData`, `education`, `languages`, `otherCourses`, `journey`, `certificates`. Comentário no topo explica cada campo |
| `script.js` | Renderiza projetos, ferramentas (`toolsMain`/`toolsExtra`, ícones do devicon via jsDelivr), formação, trajetória, certificados (filtros + lightbox), formulário de contato e animações |
| `style.css` | Todo o CSS. Seções no fim: página de projeto, formação, certificados |
| `img/projetos/<id>/` | Capturas em WebP e vídeos MP4 de cada projeto |
| `img/certificados/` | `<nome>.webp` (ampliado) + `<nome>-thumb.webp` (miniatura) |
| `cv-joao-pedro-ferreira.pdf` | Currículo do botão "Baixar CV". Trocar mantendo o nome |
| `og.png` | Prévia de compartilhamento 1200×630 |
| `vercel.json` | `cleanUrls`, cache de 1 h para CSS/JS e redirect 308 de `/projeto?id=X` para `/projetos/X`. A lista de ids desse redirect é **reescrita** por `tools/gerar-paginas.mjs` (só ids com página; os outros caem no "Projeto não encontrado" do `projeto.html`) |

## Regras que não podem ser quebradas

1. **Nada de inventar fatos.** Todo texto sobre o João (cargo, datas, horas, prêmios, o que ele fez) tem de vir do currículo (`cv-joao-pedro-ferreira.pdf`), do LinkedIn dele ou do que ele disse. Se não sabe qual foi a parte dele num projeto em equipe, escreva do ponto de vista da equipe ("Em equipe de 5…") e avise-o. Nunca transforme trabalho da equipe em "eu fiz".
2. **Privacidade.** Nunca publique CPF, RG, RA, telefone ou endereço. O certificado da FAT teve CPF e RA cobertos; ele **não** tem `credential` (o link original expõe o CPF). Ao adicionar certificado novo, abra a imagem e confira antes de publicar.
3. **Projetos em equipe com o Heitor Lupino** (ChronoMundi, Jornada do Bem, Reciclei!, Protocolo Ômega): João autorizou usar as capturas e vídeos do portfólio do Heitor (github.com/heitorlupino/heitorlupino.github.io). O link da Play Store da Jornada do Bem (`br.edu.unisagrado.jornadadobem`) está **quebrado** — não recoloque sem verificar.
4. **Cache:** ao mudar qualquer CSS/JS local, troque o `?v=` em **todas** as páginas (`index.html`, `projeto.html`, `404.html`) e a constante `VERSAO` em `tools/gerar-paginas.mjs`, depois regenere. Um teste falha se as versões divergirem. Sem isso, visitantes veem a versão antiga por até 1 h.
5. **Não declare trabalho concluído sem validação executada** (ver abaixo). O João pediu isso explicitamente.
6. Mudanças pequenas e focadas. Não reescreva o layout nem troque a stack sem pedido.

## Como adicionar conteúdo

- **Projeto:** novo objeto em `projectsData` (`dados.js`). `featured: true` → aparece em destaque no formato problema → o que fiz → resultado. Com `gallery` ou `video` ganha página própria; sem eles o card abre o GitHub (`repo`).
- **Depois de mexer em `dados.js` ou em imagens de projeto, rode os geradores** e commite o que eles produzirem:
  ```bash
  python3 tools/gerar-imagens.py   # miniaturas -thumb.webp e prévias img/og/<id>.jpg
  node tools/gerar-paginas.mjs     # projetos/<id>.html, sitemap.xml e ids do redirect no vercel.json
  ```
- **Certificado:** item em `certificates` + duas imagens em `img/certificados/`. Os números do bloco de estatísticas (quantidade, horas, instituições) são calculados sozinhos.
- **Trajetória:** `journey` (um item por ano; `future: true` para o que ainda vai acontecer).
- **Experiência:** direto no `index.html`, seção `#experiencia` (timeline `.tl-item`).

### Pipeline de mídia

```bash
# Imagens → WebP, no máximo 1280 px de largura
python3 -c "from PIL import Image; im=Image.open('in.png').convert('RGB'); im.thumbnail((1280,1280)); im.save('out.webp','WEBP',quality=78,method=6)"
# Vídeo → MP4 H.264 leve, com faststart
ffmpeg -i in.mp4 -vf "scale=960:-2,fps=24" -c:v libx264 -preset slow -crf 31 -an -movflags +faststart out.mp4
```

Mantenha cada arquivo abaixo de 10 MB (limite prático do upload pelo navegador) e o repositório enxuto.

## Validação (obrigatória antes de dizer "pronto")

```bash
python3 -m http.server 8765   # na raiz do repositório
```

Esse servidor serve para olhar o site. A validação em si é automática:

```bash
python3 tools/gerar-imagens.py --check   # nada faltando
node tools/gerar-paginas.mjs --check     # páginas geradas em dia com dados.js
cd tests && npm install && npx playwright install chromium && npm test
```

No ambiente do Claude o Playwright já vem instalado: use `npm i --no-save --no-package-lock axe-core@4.10.2`, apague `tests/node_modules/playwright*` se o npm tiver instalado e rode `node --test`.

O que a suíte (`tests/site.test.mjs`) cobre: página inicial em desktop e celular sem erro de JS, sem 404 local, sem imagem quebrada e sem rolagem horizontal; filtros e lightbox de certificados; formulário (sucesso e falha, com a rede interceptada, **sem enviar mensagem real**); menu do celular; miniaturas e prévias; metas de cada página de projeto sem JavaScript; galeria; redirecionamento do endereço antigo; 404, robots, sitemap e JSON-LD; versão de cache igual em todas as páginas; axe-core sem violações `serious`/`critical` no início, numa página de projeto e na 404.

Ao criar comportamento novo, escreva o teste antes (ele precisa falhar primeiro). Depois do deploy, confira no domínio da Vercel o que o teste local não alcança: redirects do `vercel.json`, `cleanUrls` e a 404.

Erros de rede para Google Fonts, GitHub e jsDelivr dentro do sandbox do Claude são do ambiente, não do site.

## Deploy

- Push na `main` → Vercel publica em ~30 s. Não há staging.
- O sandbox do Claude **não tem credencial de push** para este repositório. Caminhos que funcionaram: upload pelo GitHub web no Chrome do João (logado), uma pasta por commit, código por último; ou o João adiciona o repositório às fontes da sessão.
- Formulário de contato: FormSubmit já **ativado** para `jpf190617@gmail.com` (alias aleatório disponível no e-mail de ativação).

## Comunicação com o João

- Feedback honesto e direto, sem bajulação.
- Entregue os arquivos alterados, não o projeto inteiro zipado.
- Retome exatamente de onde parou.
