#!/usr/bin/env python3
"""Gera as imagens derivadas do portfólio a partir do conteúdo de dados.js.

- Miniatura <nome>-thumb.webp (até 640 px) ao lado de cada imagem de galeria.
- Prévia de compartilhamento img/og/<id>.jpg (1200×630) para cada projeto com capa.

Uso (na raiz do repositório):
    python3 tools/gerar-imagens.py          # gera o que falta ou está desatualizado
    python3 tools/gerar-imagens.py --check  # só confere; sai com 1 se faltar algo

Requer Python 3 + Pillow e Node (para ler dados.js do mesmo jeito que o site).
"""
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
MINI_MAX = 640
OG_W, OG_H, OG_FAIXA = 1200, 630, 120
FONTES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
]


def ler_projetos():
    codigo = (
        "const vm=require('node:vm');"
        "const c=require('node:fs').readFileSync(process.argv[1],'utf8');"
        "process.stdout.write(JSON.stringify(vm.runInNewContext(c+';({projectsData})',{}).projectsData));"
    )
    saida = subprocess.run(
        ["node", "-e", codigo, str(RAIZ / "dados.js")], check=True, capture_output=True, text=True
    ).stdout
    return json.loads(saida)


def miniatura_de(src: str) -> str:
    return src[: -len(".webp")] + "-thumb.webp"


def desatualizado(destino: Path, origem: Path) -> bool:
    return not destino.exists() or destino.stat().st_mtime < origem.stat().st_mtime


def fonte(tamanho: int):
    for caminho in FONTES:
        if Path(caminho).exists():
            return ImageFont.truetype(caminho, tamanho)
    return ImageFont.load_default()


def posicao_vertical(projeto) -> float:
    """Usa o 'Y%' de imagePosition (ex.: 'center 20%') para decidir o corte; padrão: centro."""
    partes = (projeto.get("imagePosition") or "").split()
    if len(partes) == 2 and partes[1].endswith("%"):
        return float(partes[1][:-1]) / 100
    return 0.5


def gerar_miniatura(origem: Path, destino: Path):
    im = Image.open(origem).convert("RGB")
    im.thumbnail((MINI_MAX, MINI_MAX))
    im.save(destino, "WEBP", quality=75, method=6)


def compor_fundo(origem_im):
    """Capa em pé (tela de celular): inteira e centralizada sobre o fundo escuro, sem cortar nem ampliar demais."""
    fundo = Image.new("RGB", (OG_W, OG_H), "#151312")
    altura = OG_H - OG_FAIXA - 40
    im = origem_im.resize((round(origem_im.width * altura / origem_im.height), altura), Image.LANCZOS)
    fundo.paste(im, ((OG_W - im.width) // 2, 20))
    return fundo


def gerar_og(projeto, origem: Path, destino: Path):
    im = Image.open(origem).convert("RGB")
    if im.height > im.width:
        im = compor_fundo(im)
    else:
        escala = max(OG_W / im.width, OG_H / im.height)
        im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
        x = (im.width - OG_W) // 2
        y = round((im.height - OG_H) * posicao_vertical(projeto))
        im = im.crop((x, y, x + OG_W, y + OG_H))
    desenho = ImageDraw.Draw(im)
    desenho.rectangle([0, OG_H - OG_FAIXA, OG_W, OG_H], fill="#151312")
    desenho.rectangle([0, OG_H - OG_FAIXA, 12, OG_H], fill="#f46c38")
    desenho.text((48, OG_H - OG_FAIXA + 14), projeto["name"], font=fonte(56), fill="#ffffff")
    desenho.text((50, OG_H - 34), "joaopferreira.vercel.app", font=fonte(22), fill="#9a9894")
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, "JPEG", quality=82, optimize=True, progressive=True)


def main(conferir: bool) -> int:
    projetos = ler_projetos()
    faltando, gerados = [], []
    for p in projetos:
        for src in p.get("gallery") or []:
            origem, destino = RAIZ / src, RAIZ / miniatura_de(src)
            if conferir:
                if not destino.exists():
                    faltando.append(str(destino.relative_to(RAIZ)))
            elif desatualizado(destino, origem):
                gerar_miniatura(origem, destino)
                gerados.append(str(destino.relative_to(RAIZ)))
        if p.get("image"):
            origem, destino = RAIZ / p["image"], RAIZ / "img" / "og" / f"{p['id']}.jpg"
            if conferir:
                if not destino.exists():
                    faltando.append(str(destino.relative_to(RAIZ)))
            elif desatualizado(destino, origem):
                gerar_og(p, origem, destino)
                gerados.append(str(destino.relative_to(RAIZ)))
    if conferir:
        for f in faltando:
            print("faltando:", f)
        return 1 if faltando else 0
    print(f"{len(gerados)} imagem(ns) gerada(s)")
    for g in gerados:
        print("  ", g)
    return 0


if __name__ == "__main__":
    sys.exit(main("--check" in sys.argv[1:]))
