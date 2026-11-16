// Testes do portfólio. Rodar com: cd tests && node --test
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { iniciarServidor } from "./servidor.mjs";

const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const AXE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

export const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let servidor;
let navegador;

before(async () => {
  servidor = await iniciarServidor(RAIZ);
  navegador = await chromium.launch();
});

after(async () => {
  await navegador?.close();
  await servidor?.fechar();
});

const DESKTOP = { viewport: { width: 1366, height: 900 } };
const CELULAR = devices["iPhone 13"];

/**
 * Abre uma página do site. Pedidos para fora do servidor local são bloqueados
 * (fontes, avatar do GitHub, ícones): o teste cobre só o que está no repositório.
 */
export async function abrir(caminho, { celular = false, javaScript = true } = {}) {
  const contexto = await navegador.newContext({ ...(celular ? CELULAR : DESKTOP), javaScriptEnabled: javaScript });
  const page = await contexto.newPage();
  const erros = [];
  const respostasRuins = [];
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  page.on("pageerror", (e) => erros.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) erros.push(m.text());
  });
  page.on("response", (r) => {
    if (r.url().startsWith(servidor.url) && r.status() >= 400) respostasRuins.push(`${r.status()} ${r.url()}`);
  });
  const resposta = await page.goto(servidor.url + "/" + caminho.replace(/^\//, ""), { waitUntil: "load" });
  return { page, contexto, erros, respostasRuins, resposta };
}

async function revelarTudo(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach((e) => e.classList.add("visible"));
    document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
    document.documentElement.style.scrollBehavior = "auto";
  });
  await page.waitForTimeout(900); // transição de .reveal (0,7 s)
}

/** Violações axe serious/critical, no formato "id (impact)". */
export async function semViolacoesAxe(page) {
  await revelarTudo(page);
  await page.addScriptTag({ content: AXE });
  return page.evaluate(async () => {
    const r = await window.axe.run({ runOnly: ["wcag2a", "wcag2aa", "best-practice"] });
    return r.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id} (${v.impact})`);
  });
}

async function imagensLocaisQuebradas(page) {
  await revelarTudo(page);
  return page.evaluate((origem) =>
    Promise.all(
      [...document.images]
        .filter((i) => i.src.startsWith(origem))
        .map((i) => i.decode().then(() => null, () => i.src))
    ).then((l) => l.filter(Boolean)),
    servidor.url
  );
}

// ---------- Linha de base ----------

for (const [nome, opcoes] of [["desktop", {}], ["celular", { celular: true }]]) {
  test(`index (${nome}): sem erros de JS, sem 4xx locais, sem imagem local quebrada, sem rolagem horizontal`, async () => {
    const { page, contexto, erros, respostasRuins } = await abrir("index.html", opcoes);
    const quebradas = await imagensLocaisQuebradas(page);
    const rolagem = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    await contexto.close();
    assert.deepEqual(erros, []);
    assert.deepEqual(respostasRuins, []);
    assert.deepEqual(quebradas, []);
    assert.equal(rolagem, false);
  });
}

test('filtro "extensao" mostra exatamente os 2 certificados de extensão', async () => {
  const { page, contexto } = await abrir("index.html");
  await page.click('[data-filter="extensao"]');
  const visiveis = await page.$$eval(".cert:not([hidden]) .cert-title", (l) => l.map((e) => e.textContent));
  await contexto.close();
  assert.deepEqual(visiveis, ["Fábrica de Software: Websites, Aplicativos e Jogos", "Automação de Processos com RPA"]);
});

test("lightbox do certificado da FAT abre sem link de credencial; o de Python abre com link do Drive", async () => {
  const { page, contexto } = await abrir("index.html");
  await revelarTudo(page);
  const estado = () =>
    page.evaluate(() => ({
      aberto: document.getElementById("cert-box").open,
      semLink: document.getElementById("cert-box-link").hidden,
      href: document.getElementById("cert-box-link").getAttribute("href"),
    }));
  await page.locator(".cert", { hasText: "Aplicação de Banco de Dados Online" }).click();
  const fat = await estado();
  await page.click("#cert-box-close");
  await page.locator(".cert", { hasText: "Linguagem de Programação Python" }).click();
  const python = await estado();
  await contexto.close();
  assert.equal(fat.aberto, true);
  assert.equal(fat.semLink, true);
  assert.equal(python.aberto, true);
  assert.equal(python.semLink, false);
  assert.match(python.href, /^https:\/\/drive\.google\.com\/file\/d\//);
});

async function enviarFormulario(page, corpo) {
  await page.route("https://formsubmit.co/**", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(corpo) })
  );
  await page.fill('input[name="nome"]', "Recrutadora Teste");
  await page.fill('input[name="email"]', "teste@example.com");
  await page.fill('textarea[name="mensagem"]', "Olá");
  await page.click("#contact-form button[type=submit]");
  await page.waitForFunction(() => !document.querySelector("#contact-form button").disabled);
  return page.textContent("#form-note");
}

test('formulário: sucesso mostra "Mensagem enviada!"', async () => {
  const { page, contexto } = await abrir("index.html");
  const nota = await enviarFormulario(page, { success: "true" });
  await contexto.close();
  assert.match(nota, /Mensagem enviada!/);
});

test("formulário: falha oferece o link de e-mail", async () => {
  const { page, contexto } = await abrir("index.html");
  const nota = await enviarFormulario(page, { success: "false", message: "erro" });
  const temMailto = await page.$eval("#form-note", (n) => !!n.querySelector('a[href^="mailto:"]')).catch(() => false);
  await contexto.close();
  assert.match(nota, /Não consegui enviar agora/);
  assert.equal(temMailto, true);
});

// ---------- Acessibilidade ----------

test("index: sem violações axe serious/critical", async () => {
  const { page, contexto } = await abrir("index.html");
  const violacoes = await semViolacoesAxe(page);
  await contexto.close();
  assert.deepEqual(violacoes, []);
});

// ---------- Menu ----------

const ITENS_MENU = ["Início", "Experiência", "Projetos", "Formação", "Certificados", "Contato"];

test("desktop: botão Menu oculto e os 6 links visíveis", async () => {
  const { page, contexto } = await abrir("index.html");
  const botaoVisivel = await page.locator(".nav-toggle").isVisible();
  const visiveis = await page.locator(".nav-links a").evaluateAll((l) =>
    l.filter((a) => a.getBoundingClientRect().width > 0).map((a) => a.textContent.trim())
  );
  await contexto.close();
  assert.equal(botaoVisivel, false);
  assert.deepEqual(visiveis, ITENS_MENU);
});

test("celular: ao abrir o menu, todos os links ficam dentro da tela", async () => {
  const { page, contexto } = await abrir("index.html", { celular: true });
  const fechado = await page.locator(".nav-links").isVisible();
  await page.click(".nav-toggle");
  const expandido = await page.getAttribute(".nav-toggle", "aria-expanded");
  const foraDaTela = await page.locator(".nav-links a").evaluateAll((l) =>
    l
      .filter((a) => {
        const r = a.getBoundingClientRect();
        return r.width === 0 || r.left < 0 || r.right > innerWidth || r.top < 0 || r.bottom > innerHeight;
      })
      .map((a) => a.textContent.trim())
  );
  await contexto.close();
  assert.equal(fechado, false);
  assert.equal(expandido, "true");
  assert.deepEqual(foraDaTela, []);
});

test('celular: clicar em "Contato" fecha o menu e rola até #contato', async () => {
  const { page, contexto } = await abrir("index.html", { celular: true });
  await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));
  await page.click(".nav-toggle");
  await page.click('.nav-links a[href="#contato"]');
  await page.waitForTimeout(300);
  const expandido = await page.getAttribute(".nav-toggle", "aria-expanded");
  const topoContato = await page.$eval("#contato", (s) => s.getBoundingClientRect().top);
  await contexto.close();
  assert.equal(expandido, "false");
  assert.ok(Math.abs(topoContato) < 150, `#contato está a ${topoContato}px do topo`);
});

test("celular: Esc fecha o menu", async () => {
  const { page, contexto } = await abrir("index.html", { celular: true });
  await page.click(".nav-toggle");
  await page.keyboard.press("Escape");
  const expandido = await page.getAttribute(".nav-toggle", "aria-expanded");
  const visivel = await page.locator(".nav-links").isVisible();
  await contexto.close();
  assert.equal(expandido, "false");
  assert.equal(visivel, false);
});

// ---------- Imagens geradas (tools/gerar-imagens.py) ----------


/** Largura e altura lidas do cabeçalho do arquivo (WebP VP8/VP8L/VP8X ou JPEG). */
export function dimensoes(caminho) {
  const b = readFileSync(caminho);
  if (b.toString("ascii", 0, 4) === "RIFF") {
    const tipo = b.toString("ascii", 12, 16);
    if (tipo === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (tipo === "VP8L") {
      const v = b.readUInt32LE(21);
      return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 };
    }
    return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  }
  let i = 2;
  while (i < b.length) {
    const marca = b[i + 1];
    const tam = b.readUInt16BE(i + 2);
    if (marca >= 0xc0 && marca <= 0xc3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + tam;
  }
  throw new Error("formato desconhecido: " + caminho);
}

/** projectsData lido do dados.js (o mesmo arquivo que o site usa). */
export function dadosDoSite() {
  const saida = execFileSync("node", ["-e", `
    const vm = require("node:vm");
    const codigo = require("node:fs").readFileSync(${JSON.stringify(join(RAIZ, "dados.js"))}, "utf8");
    const d = vm.runInNewContext(codigo + ";({ projectsData })", {});
    process.stdout.write(JSON.stringify(d.projectsData));
  `]);
  return JSON.parse(saida);
}

test("toda imagem de galeria tem miniatura -thumb.webp com largura ≤ 640", () => {
  const faltando = [];
  for (const p of dadosDoSite()) {
    for (const src of p.gallery || []) {
      const mini = join(RAIZ, src.replace(/\.webp$/, "-thumb.webp"));
      if (!existsSync(mini)) faltando.push(`${src}: sem miniatura`);
      else if (dimensoes(mini).w > 640) faltando.push(`${src}: miniatura com ${dimensoes(mini).w}px`);
    }
  }
  assert.deepEqual(faltando, []);
});

test("todo projeto com capa tem img/og/<id>.jpg em 1200×630", () => {
  const problemas = [];
  for (const p of dadosDoSite().filter((p) => p.image)) {
    const og = join(RAIZ, "img", "og", `${p.id}.jpg`);
    if (!existsSync(og)) problemas.push(`${p.id}: sem imagem de prévia`);
    else {
      const { w, h } = dimensoes(og);
      if (w !== 1200 || h !== 630) problemas.push(`${p.id}: ${w}×${h}`);
    }
  }
  assert.deepEqual(problemas, []);
});

// ---------- Páginas de projeto estáticas (tools/gerar-paginas.mjs) ----------

const URL_SITE = "https://joaopferreira.vercel.app";
const comPagina = () => dadosDoSite().filter((p) => (p.gallery && p.gallery.length) || p.video);

test("cada projetos/<id>.html tem título, descrição, canonical e Open Graph próprios (sem JavaScript)", async () => {
  const problemas = [];
  for (const p of comPagina()) {
    const { page, contexto, resposta } = await abrir(`projetos/${p.id}.html`, { javaScript: false });
    if (resposta.status() !== 200) {
      problemas.push(`${p.id}: HTTP ${resposta.status()}`);
      await contexto.close();
      continue;
    }
    const meta = await page.evaluate(() => {
      const m = (s) => document.querySelector(s)?.getAttribute("content") ?? null;
      return {
        title: document.title,
        description: m('meta[name="description"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
        ogTitle: m('meta[property="og:title"]'),
        ogDescription: m('meta[property="og:description"]'),
        ogImage: m('meta[property="og:image"]'),
        ogUrl: m('meta[property="og:url"]'),
      };
    });
    await contexto.close();
    const esperado = {
      title: `${p.name} — João Pedro Ferreira`,
      canonical: `${URL_SITE}/projetos/${p.id}`,
      ogTitle: `${p.name} — João Pedro Ferreira`,
      ogImage: `${URL_SITE}/img/og/${p.id}.jpg`,
      ogUrl: `${URL_SITE}/projetos/${p.id}`,
    };
    for (const [k, v] of Object.entries(esperado)) if (meta[k] !== v) problemas.push(`${p.id}: ${k} = ${meta[k]}`);
    for (const k of ["description", "ogDescription"]) {
      if (!meta[k] || meta[k].length < 50 || meta[k].length > 160) problemas.push(`${p.id}: ${k} com ${meta[k]?.length} caracteres`);
    }
  }
  assert.deepEqual(problemas, []);
});

test("conteúdo da página de projeto aparece sem JavaScript, com galeria em miniaturas", async () => {
  const { page, contexto } = await abrir("projetos/chronomundi.html", { javaScript: false });
  const h1 = await page.textContent("h1");
  const secoes = await page.$$eval(".page-section h2", (l) => l.map((e) => e.textContent));
  const mini = await page.$$eval(".gallery img", (l) => l.map((i) => i.getAttribute("src")));
  await contexto.close();
  assert.equal(h1.trim(), "ChronoMundi");
  assert.ok(secoes.includes("Sobre o projeto"), secoes.join(", "));
  assert.equal(mini.length, 9);
  assert.ok(mini.every((s) => s.endsWith("-thumb.webp")), mini.join(", "));
});

test("clicar na miniatura abre a imagem grande", async () => {
  const { page, contexto, erros } = await abrir("projetos/protocolo-omega.html");
  await page.click(".gallery button");
  const estado = await page.evaluate(() => ({
    aberto: document.getElementById("lightbox").open,
    src: document.getElementById("lightbox-img").getAttribute("src"),
  }));
  await contexto.close();
  assert.deepEqual(erros, []);
  assert.equal(estado.aberto, true);
  assert.match(estado.src, /terceira-pessoa\.webp$/);
});

test("link antigo projeto.html?id=chronomundi leva para projetos/chronomundi.html", async () => {
  const { page, contexto } = await abrir("projeto.html?id=chronomundi");
  await page.waitForURL(/\/projetos\/chronomundi\.html$/, { timeout: 5000 });
  const h1 = await page.textContent("h1");
  await contexto.close();
  assert.equal(h1.trim(), "ChronoMundi");
});

for (const caminho of ["projeto.html?id=inexistente", "projeto.html"]) {
  test(`${caminho} mostra "Projeto não encontrado" com link para os projetos`, async () => {
    const { page, contexto } = await abrir(caminho);
    await page.waitForTimeout(300);
    const texto = await page.textContent("main");
    const link = await page.$eval('main a[href="./#projetos"]', (a) => a.textContent).catch(() => null);
    await contexto.close();
    assert.match(texto, /Projeto não\s*encontrado/);
    assert.ok(link, "sem link para ./#projetos");
  });
}

test("páginas geradas estão em dia com dados.js (gerar-paginas --check)", () => {
  const r = (() => {
    try {
      execFileSync("node", [join(RAIZ, "tools", "gerar-paginas.mjs"), "--check"], { cwd: RAIZ, stdio: "pipe" });
      return { codigo: 0, saida: "" };
    } catch (e) {
      return { codigo: e.status, saida: String(e.stdout) + String(e.stderr) };
    }
  })();
  assert.equal(r.codigo, 0, r.saida);
});

test("projetos/chronomundi.html: sem violações axe serious/critical", async () => {
  const { page, contexto } = await abrir("projetos/chronomundi.html");
  const violacoes = await semViolacoesAxe(page);
  await contexto.close();
  assert.deepEqual(violacoes, []);
});

test("nenhum link da página inicial aponta para o antigo projeto.html", async () => {
  const { page, contexto } = await abrir("index.html");
  const antigos = await page.$$eval("a[href]", (l) => l.map((a) => a.getAttribute("href")).filter((h) => h.startsWith("projeto.html")));
  const novos = await page.$$eval("a[href^='projetos/']", (l) => l.map((a) => a.getAttribute("href")));
  await contexto.close();
  assert.deepEqual(antigos, []);
  assert.ok(novos.includes("projetos/chronomundi.html") && novos.includes("projetos/jornada-do-bem.html"), novos.join(", "));
});

// ---------- 404, robots, sitemap e JSON-LD ----------

test("URL inexistente devolve 404 com a página 404.html (link para o início e menu)", async () => {
  const { page, contexto, resposta, erros } = await abrir("pagina-que-nao-existe");
  const titulo = await page.title();
  const inicio = await page.$('a[href="/"]');
  const menu = await page.$(".nav-toggle");
  await contexto.close();
  assert.equal(resposta.status(), 404);
  assert.equal(titulo, "Página não encontrada — João Pedro Ferreira");
  assert.ok(inicio, "sem link para /");
  assert.ok(menu, "sem menu");
  assert.deepEqual(erros, []);
});

test("404.html: sem violações axe serious/critical", async () => {
  const { page, contexto } = await abrir("404.html");
  const violacoes = await semViolacoesAxe(page);
  await contexto.close();
  assert.deepEqual(violacoes, []);
});

test("robots.txt libera o site e aponta o sitemap", () => {
  const robots = readFileSync(join(RAIZ, "robots.txt"), "utf8");
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/joaopferreira\.vercel\.app\/sitemap\.xml$/m);
});

test("sitemap.xml lista a página inicial e cada projeto com página", () => {
  const xml = readFileSync(join(RAIZ, "sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const esperado = [URL_SITE + "/", ...comPagina().map((p) => `${URL_SITE}/projetos/${p.id}`)];
  assert.deepEqual(locs, esperado);
});

test("JSON-LD da página inicial descreve o João (Person)", async () => {
  const { page, contexto } = await abrir("index.html", { javaScript: false });
  const blocos = await page.$$eval('script[type="application/ld+json"]', (l) => l.map((s) => s.textContent));
  await contexto.close();
  assert.equal(blocos.length, 1);
  const d = JSON.parse(blocos[0]);
  assert.equal(d["@context"], "https://schema.org");
  assert.equal(d["@type"], "Person");
  assert.equal(d.name, "João Pedro Ferreira");
  assert.equal(d.url, URL_SITE + "/");
  assert.equal(d.jobTitle, "Estagiário em Desenvolvimento Java");
  assert.equal(d.worksFor?.name, "Yank Solutions");
  assert.equal(d.alumniOf?.name, "UNISAGRADO");
  assert.ok(d.sameAs.includes("https://github.com/joaopferreira7"));
  assert.ok(d.sameAs.includes("https://www.linkedin.com/in/joaopedroferreira19"));
});

// ---------- Versão de cache ----------

test("todas as páginas usam a mesma versão ?v= nos arquivos locais de CSS/JS", () => {
  const paginas = ["index.html", "projeto.html", "404.html", ...comPagina().map((p) => `projetos/${p.id}.html`)];
  const versoes = new Set();
  for (const pagina of paginas) {
    const html = readFileSync(join(RAIZ, pagina), "utf8");
    for (const m of html.matchAll(/(?:href|src)="[^"]*?(?:style\.css|dados\.js|script\.js|menu\.js|galeria\.js)\?v=([^"]+)"/g)) versoes.add(m[1]);
  }
  assert.equal(versoes.size, 1, [...versoes].join(", "));
});

// ---------- vercel.json ----------

test("vercel.json: /projeto?id= redireciona (308) só os ids que têm página; o resto fica em projeto.html", () => {
  const config = JSON.parse(readFileSync(join(RAIZ, "vercel.json"), "utf8"));
  const regra = (config.redirects || []).find((r) => r.source === "/projeto");
  assert.ok(regra, "sem regra para /projeto");
  assert.equal(regra.destination, "/projetos/:id");
  assert.equal(regra.permanent, true);
  const filtro = regra.has?.find((h) => h.type === "query" && h.key === "id");
  assert.ok(filtro, "sem filtro pela query id");
  const casa = (id) => new RegExp(`^(?:${filtro.value})$`).test(id);
  const comPag = comPagina().map((p) => p.id);
  const semPag = dadosDoSite().filter((p) => !comPag.includes(p.id)).map((p) => p.id);
  assert.deepEqual(comPag.filter((id) => !casa(id)), [], "ids com página sem redirect");
  assert.deepEqual([...semPag, "inexistente"].filter(casa), [], "ids sem página redirecionados para uma 404");
});
