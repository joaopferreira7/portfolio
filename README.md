# Portfólio — João Pedro Ferreira

Portfólio pessoal de **João Pedro Ferreira**, estudante de Ciência da Computação na UNISAGRADO (Bauru/SP).

Site estático em HTML, CSS e JavaScript puro — sem build — hospedado na **Vercel**.

## Estrutura

| Arquivo | O que faz |
|---|---|
| `index.html` | Estrutura das seções (início, projetos, formação, ferramentas, contato) |
| `style.css` | Tema escuro, cartão de perfil fixo, layout responsivo |
| `script.js` | Lista de projetos e ferramentas, formulário de contato (mailto) e animações |
| `vercel.json` | Configuração de deploy (URLs limpas e cache) |

## Como atualizar

Projetos e ferramentas ficam nos arrays `projects` e `tools` no topo do `script.js`. Edite, faça commit e push — a Vercel publica automaticamente.

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
