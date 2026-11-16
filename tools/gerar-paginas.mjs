#!/usr/bin/env node
// Gera as páginas estáticas de projeto (projetos/<id>.html), o sitemap.xml e o redirect do vercel.json a partir de dados.js.
// Uso, na raiz do repositório:
//   node tools/gerar-paginas.mjs          → escreve os arquivos
//   node tools/gerar-paginas.mjs --check  → só compara; sai com 1 se algum estiver desatualizado
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const URL_SITE = "https://joaopferreira.vercel.app";
export const VERSAO = "2026-11-16";
const AVISO = "<!-- Gerado por tools/gerar-paginas.mjs a partir de dados.js. Não edite à mão. -->";

/** Lê dados.js exatamente como o navegador (sem módulos). */
export function carregarDados(caminho = join(RAIZ, "dados.js")) {
  const codigo = readFileSync(caminho, "utf8");
  return vm.runInNewContext(codigo + ";({ projectsData, GITHUB, hasPage })", {});
}

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const miniatura = (src) => src.replace(/\.webp$/, "-thumb.webp");

/** Descrição para buscadores e prévias: até 155 caracteres, sem cortar palavra. */
export function descricaoCurta(p, limite = 155) {
  const texto = (p.desc || p.problem || "").replace(/\s+/g, " ").trim();
  if (texto.length <= limite) return texto;
  const corte = texto.slice(0, limite - 1);
  return corte.slice(0, corte.lastIndexOf(" ")).replace(/[\s,.;:—-]+$/, "") + "…";
}

function nav() {
  const itens = [
    ["inicio", "Início"],
    ["experiencia", "Experiência"],
    ["projetos", "Projetos"],
    ["formacao", "Formação"],
    ["certificados", "Certificados"],
    ["contato", "Contato"],
  ];
  return `  <nav class="nav" aria-label="Principal">
    <a class="nav-brand" href="../#inicio">João Pedro Ferreira</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
    <div class="nav-links" id="nav-links">
${itens.map(([id, nome]) => `      <a href="../#${id}"${id === "projetos" ? ' class="active"' : ""}>${nome}</a>`).join("\n")}
    </div>
  </nav>`;
}

function secaoVideo(p) {
  if (!p.video) return "";
  const v = p.video;
  return `
    <section class="page-section">
      <h2>Vídeo</h2>
      <div class="video-wrap${v.vertical ? " vertical" : ""}">
        <video src="../${esc(v.src)}"${v.poster ? ` poster="../${esc(v.poster)}"` : ""} controls playsinline preload="${v.poster ? "none" : "metadata"}"></video>
      </div>${v.caption ? `\n      <p class="video-caption">${esc(v.caption)}</p>` : ""}
    </section>`;
}

function secaoSobre(p) {
  if (!p.did) return "";
  const item = (rotulo, texto) => (texto ? `\n        <div><dt>${rotulo}</dt><dd>${esc(texto)}</dd></div>` : "");
  return `
    <section class="page-section">
      <h2>Sobre o projeto</h2>
      <dl class="facts">${item("Problema", p.problem)}${item("O que fiz", p.did)}${item("Resultado", p.result)}
      </dl>
    </section>`;
}

function secaoComo(p) {
  if (!p.highlights) return "";
  return `
    <section class="page-section">
      <h2>Como foi feito</h2>
      <ul class="how">
${p.highlights.map((h) => `        <li>${esc(h)}</li>`).join("\n")}
      </ul>
    </section>`;
}

function secaoGaleria(p) {
  if (!p.gallery || !p.gallery.length) return "";
  const n = p.gallery.length;
  return `
    <section class="page-section">
      <h2>Capturas de tela</h2>
      <div class="gallery${p.galleryVertical ? " vertical" : ""}">
${p.gallery
  .map(
    (src, i) =>
      `        <button type="button" data-src="../${esc(src)}" aria-label="Ampliar captura ${i + 1} de ${n}"><img src="../${esc(miniatura(src))}" alt="Captura ${i + 1} do ${esc(p.name)}" loading="lazy" /></button>`
  )
  .join("\n")}
      </div>
    </section>`;
}

export function renderizarPagina(p, { GITHUB }) {
  const titulo = `${p.name} — João Pedro Ferreira`;
  const descricao = descricaoCurta(p);
  const url = `${URL_SITE}/projetos/${p.id}`;
  const imagem = p.image ? `${URL_SITE}/img/og/${p.id}.jpg` : `${URL_SITE}/og.png`;
  const links = [
    p.repo ? `<a class="btn-outline small" href="${esc(GITHUB)}/${esc(p.repo)}" target="_blank" rel="noopener">Código no GitHub ↗</a>` : "",
    ...(p.links || []).map((l) => `<a class="btn-outline small" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`),
  ].filter(Boolean);
  const lead = p.did ? "" : `\n    <p class="page-lead">${esc(p.desc)}</p>`;

  return `<!doctype html>
${AVISO}
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descricao)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="João Pedro Ferreira" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(titulo)}" />
  <meta property="og:description" content="${esc(descricao)}" />
  <meta property="og:image" content="${imagem}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="https://github.com/joaopferreira7.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../style.css?v=${VERSAO}" />
</head>
<body>
${nav()}

  <main class="page">
    <a class="back" href="../#projetos">← Voltar para projetos</a>
    ${p.kind ? `<p class="page-kind">${esc(p.kind)}</p>` : ""}
    <h1 class="title">${esc(p.name)}</h1>${lead}
    <div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>${
      links.length ? `\n    <div class="feat-links">${links.join("")}</div>` : ""
    }
${secaoVideo(p)}${secaoSobre(p)}${secaoComo(p)}${secaoGaleria(p)}
  </main>

  <dialog class="lightbox" id="lightbox" aria-label="Imagem ampliada">
    <img id="lightbox-img" alt="" />
  </dialog>

  <script src="../menu.js?v=${VERSAO}"></script>
  <script src="../galeria.js?v=${VERSAO}"></script>
</body>
</html>
`;
}

/** sitemap.xml com a página inicial e cada página de projeto. */
export function renderizarSitemap(dados) {
  const urls = [`${URL_SITE}/`, ...dados.projectsData.filter(dados.hasPage).map((p) => `${URL_SITE}/projetos/${p.id}`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Gerado por tools/gerar-paginas.mjs a partir de dados.js. Não edite à mão. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
}

/**
 * vercel.json com o redirect 308 do endereço antigo (/projeto?id=X → /projetos/X) restrito aos ids que têm página.
 * Ids sem página continuam em projeto.html, que mostra "Projeto não encontrado".
 */
export function atualizarVercel(dados, caminho = join(RAIZ, "vercel.json")) {
  const config = JSON.parse(readFileSync(caminho, "utf8"));
  const ids = dados.projectsData.filter(dados.hasPage).map((p) => p.id);
  const regra = {
    source: "/projeto",
    has: [{ type: "query", key: "id", value: `(?<id>${ids.join("|")})` }],
    destination: "/projetos/:id",
    permanent: true,
  };
  config.redirects = [...(config.redirects || []).filter((r) => r.source !== "/projeto"), regra];
  return JSON.stringify(config, null, 2) + "\n";
}

/** Todos os arquivos que o gerador produz: { caminho relativo → conteúdo }. */
export function gerarArquivos(dados = carregarDados()) {
  const arquivos = {};
  for (const p of dados.projectsData.filter(dados.hasPage)) {
    arquivos[`projetos/${p.id}.html`] = renderizarPagina(p, dados);
  }
  arquivos["sitemap.xml"] = renderizarSitemap(dados);
  arquivos["vercel.json"] = atualizarVercel(dados);
  return arquivos;
}

function main(conferir) {
  const arquivos = gerarArquivos();
  const divergentes = [];
  for (const [rel, conteudo] of Object.entries(arquivos)) {
    const destino = join(RAIZ, rel);
    const atual = existsSync(destino) ? readFileSync(destino, "utf8") : null;
    if (atual === conteudo) continue;
    if (conferir) {
      divergentes.push(rel);
    } else {
      mkdirSync(dirname(destino), { recursive: true });
      writeFileSync(destino, conteudo);
      console.log("escrito:", relative(RAIZ, destino));
    }
  }
  if (conferir && divergentes.length) {
    console.log("desatualizados (rode: node tools/gerar-paginas.mjs):");
    divergentes.forEach((d) => console.log("  ", d));
    return 1;
  }
  if (!conferir) console.log(`${Object.keys(arquivos).length} arquivo(s) conferido(s)`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.includes("--check")));
}
