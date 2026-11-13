# Portfólio — João Pedro Ferreira

Portfólio pessoal de **João Pedro Ferreira**, desenvolvedor de software, estagiário de desenvolvimento Java na Yank Solutions e estudante de Ciência da Computação na UNISAGRADO (Bauru/SP).

Site estático em HTML, CSS e JavaScript puro — sem build — hospedado na **Vercel**.

## Estrutura

| Arquivo | O que faz |
|---|---|
| `index.html` | Estrutura das seções (início, experiência, projetos, ferramentas, contato) |
| `style.css` | Tema escuro, cartão de perfil fixo, layout responsivo |
| `script.js` | Projetos em destaque, outros projetos, ferramentas, formulário de contato (Formspree ou mailto) e animações |
| `cv-joao-pedro-ferreira.pdf` | Currículo do botão "Baixar CV" |
| `og.png` | Imagem de prévia ao compartilhar o link (1200×630) |
| `vercel.json` | Configuração de deploy (URLs limpas e cache) |

## Como atualizar

Os dados ficam no topo do `script.js`:

- `featured`: projetos em destaque (problema → o que fiz → resultado). Campos opcionais: `image` (captura de tela) e `demo` (link da demo).
- `projects`: outros projetos.
- `toolsMain` / `toolsExtra`: ferramentas do dia a dia e as que já usei.
- `FORMSPREE_ID`: ID do formulário no [Formspree](https://formspree.io). Vazio = o formulário abre o app de e-mail.

A experiência profissional fica direto no `index.html`, seção `#experiencia`. Para trocar o CV, substitua o PDF mantendo o nome. Edite, faça commit e push — a Vercel publica automaticamente.

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
