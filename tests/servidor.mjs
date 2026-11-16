// Servidor estático mínimo para os testes (sem dependências).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

async function arquivo(caminho) {
  try {
    const s = await stat(caminho);
    if (s.isDirectory()) return arquivo(join(caminho, "index.html"));
    return { corpo: await readFile(caminho), tipo: TIPOS[extname(caminho)] || "application/octet-stream" };
  } catch {
    return null;
  }
}

export async function iniciarServidor(raiz, porta = 0) {
  const base = resolve(raiz);
  const servidor = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const alvo = normalize(join(base, pathname));
    const achado = alvo.startsWith(base) ? await arquivo(alvo) : null;
    if (achado) {
      res.writeHead(200, { "Content-Type": achado.tipo });
      return res.end(achado.corpo);
    }
    const pagina404 = await arquivo(join(base, "404.html"));
    res.writeHead(404, { "Content-Type": pagina404 ? pagina404.tipo : "text/plain" });
    res.end(pagina404 ? pagina404.corpo : "404");
  });
  await new Promise((ok) => servidor.listen(porta, "127.0.0.1", ok));
  const { port } = servidor.address();
  return {
    url: `http://127.0.0.1:${port}`,
    fechar: () => new Promise((ok) => servidor.close(ok)),
  };
}
