// ===== Dados — edite aqui para atualizar o portfólio =====
const GITHUB = "https://github.com/joaopferreira7";
const EMAIL = "jpf190617@gmail.com";

const projects = [
  {
    name: "AutoLeitura",
    desc: "Leitura automática de medidores de água e energia por visão computacional: YOLOv8 detecta o contador e uma CRNN + CTC lê os dígitos.",
    tags: ["Python", "YOLOv8", "OpenCV", "PyTorch", "Streamlit"],
    repo: "AutoLeitura",
    color: "linear-gradient(135deg,#f46c38,#b83a12)",
    initials: "AL",
  },
  {
    name: "FinTrack",
    desc: "Sistema web para controle financeiro pessoal.",
    tags: ["Python", "Flask", "HTML", "CSS"],
    repo: "FinTrack",
    color: "linear-gradient(135deg,#2ecc8f,#117a52)",
    initials: "FT",
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
    name: "Ecos de Aldenor",
    desc: "Jogo de exploração: um explorador chega à vila abandonada de Aldenor em busca do artefato protegido por uma antiga guardiã.",
    tags: ["C#", "Unity"],
    repo: "Ecos-de-Aldenor",
    color: "linear-gradient(135deg,#c5ff41,#5e8a00)",
    initials: "EA",
  },
  {
    name: "Missão Solidária",
    desc: "Jogo educativo que promove empatia, colaboração e solidariedade. Desenvolvido em equipe.",
    tags: ["Dart", "Flutter"],
    repo: "Missao-Solidaria",
    color: "linear-gradient(135deg,#ff4f8b,#8a0f3a)",
    initials: "MS",
  },
  {
    name: "ChronoMundi",
    desc: "Museu virtual em realidade virtual feito em Unity, com salas temáticas, personagens guias e suporte a Android/Cardboard. Desenvolvido em equipe.",
    tags: ["C#", "Unity", "VR"],
    repo: "ChronoMundi",
    color: "linear-gradient(135deg,#3cb4ff,#0b4f86)",
    initials: "CM",
  },
  {
    name: "Concilig App",
    desc: "Aplicação desenvolvida para o desafio técnico da Concilig.",
    tags: ["C#", ".NET"],
    repo: "ConciligAppp",
    color: "linear-gradient(135deg,#ffb238,#8a5400)",
    initials: "CA",
  },
];

const icon = (name, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;

const tools = [
  { name: "Python", role: "IA, visão computacional e back-end", img: icon("python") },
  { name: "C#", role: "Jogos e aplicações .NET", img: icon("csharp") },
  { name: "Unity", role: "Engine de jogos", img: icon("unity") },
  { name: "Unreal Engine", role: "Jogos 3D com Blueprints", img: icon("unrealengine") },
  { name: "JavaScript", role: "Interatividade na web", img: icon("javascript") },
  { name: "Flask", role: "Framework web em Python", img: icon("flask") },
  { name: "Flutter / Dart", role: "Apps multiplataforma", img: icon("flutter") },
  { name: "OpenCV", role: "Processamento de imagens", img: icon("opencv") },
  { name: "PyTorch", role: "Deep learning", img: icon("pytorch") },
  { name: "HTML & CSS", role: "Interfaces web", img: icon("html5") },
  { name: "MySQL & SQLite", role: "Bancos relacionais", img: icon("mysql") },
  { name: "MongoDB", role: "Banco NoSQL", img: icon("mongodb") },
  { name: "Docker", role: "Containers", img: icon("docker") },
  { name: "Git & GitHub", role: "Versionamento", img: icon("github") },
];

// ===== Renderização =====
const projectList = document.getElementById("project-list");
projectList.innerHTML = projects
  .map(
    (p) => `
    <a class="project reveal" href="${GITHUB}/${p.repo}" target="_blank" rel="noopener">
      <div class="project-thumb" style="background:${p.color}">${p.initials}</div>
      <div class="project-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
      <span class="project-arrow" aria-hidden="true">↗</span>
    </a>`
  )
  .join("");

const toolList = document.getElementById("tool-list");
toolList.innerHTML = tools
  .map(
    (t) => `
    <div class="tool reveal">
      <div class="tool-icon"><img src="${t.img}" alt="" loading="lazy" /></div>
      <div><h3>${t.name}</h3><span>${t.role}</span></div>
    </div>`
  )
  .join("");

document.getElementById("year").textContent = new Date().getFullYear();

// ===== Formulário de contato (mailto) =====
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const subject = `[Portfólio] ${f.get("assunto")} — ${f.get("nome")}`;
  const body = `${f.get("mensagem")}\n\n— ${f.get("nome")} (${f.get("email")})`;
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
