# Portfólio — João Pedro Ferreira

Portfólio pessoal de **João Pedro Ferreira**, desenvolvedor de software, estagiário de desenvolvimento Java na Yank Solutions e estudante de Ciência da Computação na UNISAGRADO (Bauru/SP).

Site estático em HTML, CSS e JavaScript puro — sem build — hospedado na **Vercel**.

## Estrutura

| Arquivo | O que faz |
|---|---|
| `index.html` | Estrutura das seções (início, experiência, projetos, ferramentas, contato) |
| `style.css` | Tema escuro, cartão de perfil fixo, layout responsivo |
| `dados.js` | Dados de todos os projetos (usado pela página inicial e pela página de cada projeto) |
| `script.js` | Renderiza projetos e ferramentas, formulário de contato (FormSubmit, com fallback para mailto) e animações |
| `projeto.html` | Endereço antigo das páginas de projeto; redireciona para `projetos/<id>.html` |
| `img/projetos/` | Capturas (WebP) e vídeos (MP4) dos projetos |
| `img/certificados/` | Certificados em WebP (o CPF do certificado da FAT foi coberto) |
| `cv-joao-pedro-ferreira.pdf` | Currículo do botão "Baixar CV" |
| `og.png` | Imagem de prévia ao compartilhar o link (1200×630) |
| `vercel.json` | Configuração de deploy (URLs limpas, cache e redirect do endereço antigo de projeto) |
| `projetos/<id>.html`, `sitemap.xml`, `img/og/` | **Gerados** pelos scripts de `tools/` a partir do `dados.js` — não edite à mão |
| `menu.js`, `galeria.js` | Menu do celular e lightbox das galerias |
| `404.html`, `robots.txt` | Página de erro e instruções para buscadores |
| `tools/` | `gerar-paginas.mjs` (Node) e `gerar-imagens.py` (Python + Pillow) |
| `tests/` | Testes automáticos com Playwright e axe-core (`cd tests && npm install && npm test`) |
| `CLAUDE.md` | Guia para agentes de IA que trabalham no repositório |

## Como atualizar

- **Projetos:** lista `projectsData` no `dados.js`. `featured: true` coloca o projeto em destaque (problema → o que fiz → resultado). Projetos com `gallery` ou `video` ganham página própria; os outros abrem direto no GitHub. Os campos estão explicados no topo do arquivo.
- **Imagens e vídeos:** coloque em `img/projetos/<id>/`. Prefira WebP com até 1280 px de largura e MP4 (H.264) com `-movflags +faststart`.
- **Formação e certificados:** `education`, `languages`, `otherCourses`, `journey` (trajetória ano a ano) e `certificates` no `dados.js`. Cada certificado usa duas imagens em `img/certificados/`: `<nome>.webp` (ampliada) e `<nome>-thumb.webp` (miniatura). O campo `credential` (link público) é opcional: não use link para documentos que mostram CPF ou outros dados pessoais.
- **Ferramentas:** `toolsMain` / `toolsExtra` no `script.js`.
- **Formulário:** usa o [FormSubmit](https://formsubmit.co) (`FORM_ENDPOINT` no `script.js`). Na primeira mensagem, chega um e-mail de ativação; depois de clicar no link, as mensagens passam a chegar normalmente. Se o envio falhar, o formulário oferece abrir o app de e-mail.

A experiência profissional fica direto no `index.html`, seção `#experiencia`. Para trocar o CV, substitua o PDF mantendo o nome. Edite, faça commit e push — a Vercel publica automaticamente.

> Ao mudar qualquer CSS/JS, atualize o `?v=` em `index.html`, `projeto.html`, `404.html` e a constante `VERSAO` de `tools/gerar-paginas.mjs` (ex.: `?v=2026-12-01`) e rode `node tools/gerar-paginas.mjs`. O `vercel.json` guarda esses arquivos em cache por 1 hora, e sem trocar o `?v=` quem já visitou o site continua vendo a versão antiga.

## Depois de editar o `dados.js`

```bash
python3 tools/gerar-imagens.py
node tools/gerar-paginas.mjs
cd tests && npm test
```

## Rodar localmente

```bash
npx serve .
# ou
python -m http.server 8000
```

## Deploy

1. Em [vercel.com/new](https://vercel.com/new), importe este repositório.
2. Framework Preset: **Other** · Build Command: vazio · Output Directory: `.`
3. Deploy. Cada push na branch `main` gera um novo deploy.

Layout inspirado no template [Sawad](https://sawad.framer.website/).
