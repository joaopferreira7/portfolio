// ===== Dados — edite aqui para atualizar o portfólio =====
const GITHUB = "https://github.com/joaopferreira7";
const EMAIL = "jpf190617@gmail.com";

// Formspree: crie um formulário grátis em https://formspree.io e cole o ID aqui
// (ex.: "xyzabcd"). Enquanto estiver vazio, o formulário abre o app de e-mail.
const FORMSPREE_ID = "";

// Projetos em destaque — formato problema → o que fiz → resultado.
// Para adicionar imagem: image: "img/fintrack.png". Para demo: demo: "https://...".
const featured = [
  {
    name: "FinTrack",
    kind: "Back-end · projeto pessoal",
    problem: "Aplicação de finanças pessoais com API REST, frontend SPA e integração com IA.",
    did: "Criei do zero (API REST, SPA e Docker) e reescrevi na v2 com Clean Architecture, Service Layer, Repository Pattern, Marshmallow, autenticação JWT e isolamento multi-tenant. Integrei IA ao backend e migrei o provedor (Anthropic → Groq → Gemini).",
    result: "Testes com pytest expuseram bugs reais, e uma auditoria técnica própria levantou 23 achados, incluindo segredos no código, JWT em localStorage e prompt injection no endpoint de IA.",
    tags: ["Python", "Flask", "JWT", "pytest", "Docker"],
    repo: "FinTrack",
    color: "linear-gradient(135deg,#2ecc8f,#117a52)",
    initials: "FT",
  },
  {
    name: "Ecos de Aldenor",
    kind: "Jogo 2D · equipe de 5",
    problem: "Jogo de plataforma em que um explorador chega à vila abandonada de Aldenor em busca de um artefato protegido por uma antiga guardiã.",
    did: "Implementei, seguindo o GDD, o personagem jogável, 3 tipos de inimigos (incluindo o chefe), 3 fases e tutorial, checkpoints, coletáveis, HUD, menu de pausa e telas de vitória e derrota.",
    result: "Jogo completo e jogável, do tutorial ao chefe final.",
    tags: ["C#", "Unity 6", "GDD"],
    repo: "Ecos-de-Aldenor",
    color: "linear-gradient(135deg,#c5ff41,#5e8a00)",
    initials: "EA",
  },
  {
    name: "AutoLeitura",
    kind: "Visão computacional · equipe",
    problem: "Leitura automática de medidores de água e energia a partir de fotos.",
    did: "Pipeline em duas etapas: YOLOv8 detecta o contador na imagem e uma CRNN com CTC lê os dígitos, com interface em Streamlit.",
    tags: ["Python", "YOLOv8", "OpenCV", "PyTorch", "Streamlit"],
    repo: "AutoLeitura",
    color: "linear-gradient(135deg,#f46c38,#b83a12)",
    initials: "AL",
  },
];

const projects = [
  {
    name: "ChronoMundi",
    desc: "Museu virtual em realidade virtual, em equipe. Fiz os personagens acompanhantes, o sistema de artefatos por sala e o suporte a VR no Android/Cardboard.",
    tags: ["C#", "Unity", "VR"],
    repo: "ChronoMundi",
    color: "linear-gradient(135deg,#3cb4ff,#0b4f86)",
    initials: "CM",
  },
  {
    name: "Concilig App",
    desc: "Aplicação em C#/.NET entregue como solução do desafio técnico da Concilig.",
    tags: ["C#", ".NET"],
    repo: "ConciligAppp",
    color: "linear-gradient(135deg,#ffb238,#8a5400)",
    initials: "CA",
  },
  {
    name: "Lumi: Voo na Caverna",
    desc: "Jogo 2D em Unity inspirado em Flappy Bird: guie a vaga-lume Lumi por uma caverna de cristais.",
    tags: ["C#", "Unity", "2D"],
    repo: "lumi-voo-na-caverna",
    color: "linear-gradient(135deg,#7b5cff,#2b1a7a)",
    initials: "LU",
  },
  {
    name: "Missão Solidária",
    desc: "Jogo educativo em equipe que promove empatia, colaboração e solidariedade.",
    tags: ["Dart", "Flutter"],
    repo: "Missao-Solidaria",
    color: "linear-gradient(135deg,#ff4f8b,#8a0f3a)",
    initials: "MS",
  },
];

const icon = (name, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;

const toolsMain = [
  { name: "Java", role: "Estágio: sustentação de automações", img: icon("java") },
  { name: "Python", role: "APIs, back-end e IA", img: icon("python") },
  { name: "Flask", role: "APIs REST (FinTrack)", img: icon("flask") },
  { name: "SQL", role: "MySQL e SQL Server", img: icon("microsoftsqlserver") },
  { name: "C#", role: "Jogos e aplicações .NET", img: icon("csharp") },
  { name: "Unity", role: "Jogos 2D, 3D e VR", img: icon("unity") },
  { name: "Docker", role: "Ambiente do FinTrack", img: icon("docker") },
  { name: "Git & GitHub", role: "Versionamento e equipe", img: icon("github") },
];

const toolsExtra = [
  { name: "pytest", img: icon("pytest") },
  { name: "Redis", img: icon("redis") },
  { name: "MongoDB", img: icon("mongodb") },
  { name: "OpenCV", img: icon("opencv") },
  { name: "PyTorch", img: icon("pytorch") },
  { name: "Flutter", img: icon("flutter") },
  { name: "Unreal Engine", img: icon("unrealengine") },
  { name: "HTML, CSS & JS", img: icon("javascript") },
];

// ===== Renderização =====
const tagsHtml = (tags) => `<div class="tags">${tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>`;
const thumb = (p, cls) =>
  p.image
    ? `<img class="${cls}" src="${p.image}" alt="Captura de tela do ${p.name}" loading="lazy" />`
    : `<div class="${cls}" style="background:${p.color}" aria-hidden="true">${p.initials}</div>`;

document.getElementById("featured-list").innerHTML = featured
  .map(
    (p) => `
    <article class="feat reveal">
      ${thumb(p, "feat-thumb")}
      <div class="feat-body">
        <span class="feat-kind">${p.kind}</span>
        <h3>${p.name}</h3>
        <dl>
          <dt>Problema</dt><dd>${p.problem}</dd>
          <dt>O que fiz</dt><dd>${p.did}</dd>
          ${p.result ? `<dt>Resultado</dt><dd>${p.result}</dd>` : ""}
        </dl>
        ${tagsHtml(p.tags)}
        <div class="feat-links">
          <a class="btn-outline small" href="${GITHUB}/${p.repo}" target="_blank" rel="noopener">Código ↗</a>
          ${p.demo ? `<a class="btn small" href="${p.demo}" target="_blank" rel="noopener">Ver demo ↗</a>` : ""}
        </div>
      </div>
    </article>`
  )
  .join("");

document.getElementById("project-list").innerHTML = projects
  .map(
    (p) => `
    <a class="project reveal" href="${GITHUB}/${p.repo}" target="_blank" rel="noopener">
      ${thumb(p, "project-thumb")}
      <div class="project-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        ${tagsHtml(p.tags)}
      </div>
      <span class="project-arrow" aria-hidden="true">↗</span>
    </a>`
  )
  .join("");

document.getElementById("tool-main").innerHTML = toolsMain
  .map(
    (t) => `
    <div class="tool reveal">
      <div class="tool-icon"><img src="${t.img}" alt="" loading="lazy" /></div>
      <div><h3>${t.name}</h3><span>${t.role}</span></div>
    </div>`
  )
  .join("");

document.getElementById("tool-extra").innerHTML = toolsExtra
  .map(
    (t) => `
    <div class="tool-chip reveal"><img src="${t.img}" alt="" loading="lazy" /><span>${t.name}</span></div>`
  )
  .join("");

document.getElementById("year").textContent = new Date().getFullYear();

// ===== Formulário de contato (Formspree, com fallback para mailto) =====
const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");
const noteDefault = note.innerHTML;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(form);
  const subject = `[Portfólio] ${f.get("assunto")} — ${f.get("nome")}`;

  if (!FORMSPREE_ID) {
    const body = `${f.get("mensagem")}\n\n— ${f.get("nome")} (${f.get("email")})`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = "Enviando…";
  f.append("_subject", subject);
  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      body: f,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    note.textContent = "Mensagem enviada! Respondo em breve.";
  } catch {
    note.innerHTML = `Não consegui enviar agora. Me escreva direto em <a href="mailto:${EMAIL}">${EMAIL}</a>.`;
  } finally {
    button.disabled = false;
    button.textContent = "Enviar mensagem";
    setTimeout(() => (note.innerHTML = noteDefault), 8000);
  }
});

// ===== Animação de entrada =====
document.querySelectorAll(".section > *").forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ===== Link ativo no menu =====
const links = [...document.querySelectorAll(".nav a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
const navIO = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
      }
    }),
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => s && navIO.observe(s));
