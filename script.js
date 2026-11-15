// Dados dos projetos: dados.js (carregado antes deste arquivo).

// Formulário de contato via FormSubmit (https://formsubmit.co), sem cadastro.
// Na primeira mensagem enviada, o FormSubmit manda um e-mail de ativação para EMAIL:
// é só clicar no link uma vez. Para esconder o e-mail do código, troque pelo
// endereço aleatório que o FormSubmit envia depois da ativação.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;

const featured = projectsData.filter((p) => p.featured);
const projects = projectsData.filter((p) => !p.featured);

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
    ? `<img class="${cls}" src="${p.image}" alt="Captura de tela do ${p.name}" loading="lazy"${p.imagePosition ? ` style="object-position:${p.imagePosition}"` : ""} />`
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
          ${hasPage(p) ? `<a class="btn small" href="${projectUrl(p)}">${p.video ? "Ver vídeo e capturas" : "Ver capturas"} →</a>` : ""}
          ${p.repo ? `<a class="btn-outline small" href="${GITHUB}/${p.repo}" target="_blank" rel="noopener">Código ↗</a>` : ""}
          ${(p.links || []).map((l) => `<a class="btn-outline small" href="${l.url}" target="_blank" rel="noopener">${l.label} ↗</a>`).join("")}
        </div>
      </div>
    </article>`
  )
  .join("");

document.getElementById("project-list").innerHTML = projects
  .map(
    (p) => `
    <a class="project reveal" href="${projectUrl(p)}"${hasPage(p) ? "" : ' target="_blank" rel="noopener"'}>
      ${thumb(p, "project-thumb")}
      <div class="project-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        ${tagsHtml(p.tags)}
      </div>
      <span class="project-arrow" aria-hidden="true">${hasPage(p) ? "→" : "↗"}</span>
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

// ===== Formulário de contato (FormSubmit, com fallback para mailto) =====
const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");
const noteDefault = note.innerHTML;
const mailtoLink = (f, subject) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `${f.get("mensagem")}\n\n— ${f.get("nome")} (${f.get("email")})`
  )}`;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(form);
  const subject = `[Portfólio] ${f.get("assunto")} — ${f.get("nome")}`;
  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = "Enviando…";
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        nome: f.get("nome"),
        email: f.get("email"),
        assunto: f.get("assunto"),
        mensagem: f.get("mensagem"),
        _subject: subject,
        _replyto: f.get("email"),
        _template: "table",
        _captcha: "false",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== "true") throw new Error(data.message || res.status);
    form.reset();
    note.textContent = "Mensagem enviada! Respondo em breve.";
  } catch {
    note.innerHTML = `Não consegui enviar agora. <a href="${mailtoLink(f, subject)}">Abrir no seu e-mail</a> ou escreva para <a href="mailto:${EMAIL}">${EMAIL}</a>.`;
  } finally {
    button.disabled = false;
    button.textContent = "Enviar mensagem";
    setTimeout(() => (note.innerHTML = noteDefault), 12000);
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
