// ===== Dados do portfólio — edite aqui =====
// Usado pelo index.html (cards) e pelo projeto.html (página de cada projeto).
//
// Campos de um projeto:
//   id        nome curto sem espaço/acento (vira projeto.html?id=...)
//   featured  true = aparece em "Projetos em destaque"
//   name, kind, tags, color, initials
//   problem / did / result   → cards em destaque (formato problema → o que fiz → resultado)
//   desc                     → resumo curto (lista "Outros projetos")
//   highlights               → lista "Como foi feito" na página do projeto (opcional)
//   repo      nome do repositório em github.com/joaopferreira7 (opcional)
//   links     [{ label, url }] botões extras (opcional)
//   image     capa do card (opcional; sem ela aparece o gradiente com as iniciais)
//   gallery   capturas de tela da página do projeto (opcional)
//   video     { src, poster, vertical, caption } (opcional)
// Projetos com gallery ou video ganham página própria; os outros abrem direto no GitHub.

const GITHUB = "https://github.com/joaopferreira7";
const EMAIL = "jpf190617@gmail.com";

const P = "img/projetos";

const projectsData = [
  {
    id: "fintrack",
    featured: true,
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
    id: "jornada-do-bem",
    featured: true,
    name: "Jornada do Bem",
    kind: "Jogo mobile · equipe de 5 · publicado na Play Store",
    problem: "Falar de empatia e solidariedade com crianças sem virar sermão: transformar ações solidárias do dia a dia em desafios com pontuação e fases.",
    did: "Desenvolvi, em equipe de 5, o app em Flutter/Dart com design no Figma: três minijogos (cesta básica, separação de roupas para doação e limpeza do parque), telas de história e de \"como jogar\", pontuação e feedback por desempenho, até a publicação na Play Store.",
    result: "Jogo publicado na Google Play Store em 2025, com 3 minijogos completos, um deles com 3 fases de dificuldade crescente.",
    desc: "Jogo educativo para Android sobre empatia e solidariedade, feito em Flutter e publicado na Play Store.",
    highlights: [
      "Design das telas, personagens e história no Figma",
      "Telas organizadas em componentes Flutter, estado com setState, imagens e sons locais",
      "Minijogo 1 — Coleta de Alimentos: escolher os itens certos para montar a cesta básica",
      "Minijogo 2 — Separação de Roupas: tirar as peças rasgadas ou sujas antes da doação, em 3 fases (mais roupas, menos erros permitidos e objetos mais rápidos)",
      "Minijogo 3 — Coleta de Lixo: recolher os resíduos pedidos antes de o tempo acabar",
      "Telas de história, \"como jogar\" e créditos",
      "Publicação na Google Play Store",
    ],
    tags: ["Flutter", "Dart", "Figma", "Android"],
    repo: "Missao-Solidaria",
    color: "linear-gradient(135deg,#ff4f8b,#8a0f3a)",
    initials: "JB",
    image: `${P}/jornada-do-bem/imagem1.webp`,
    imagePosition: "center 20%",
    gallery: [
      `${P}/jornada-do-bem/imagem1.webp`,
      `${P}/jornada-do-bem/imagem2.webp`,
      `${P}/jornada-do-bem/imagem3.webp`,
      `${P}/jornada-do-bem/imagem4.webp`,
      `${P}/jornada-do-bem/imagem5.webp`,
      `${P}/jornada-do-bem/como-jogar2.webp`,
    ],
    galleryVertical: true,
    video: {
      src: `${P}/jornada-do-bem/minijogo-coleta-lixo.mp4`,
      vertical: true,
      caption: "Minijogo 3 — Coleta de Lixo: o jogador recolhe os resíduos pedidos antes de o tempo acabar.",
    },
  },
  {
    id: "ecos-de-aldenor",
    featured: true,
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
    id: "autoleitura",
    featured: true,
    name: "AutoLeitura",
    kind: "Visão computacional · equipe",
    problem: "Leitura automática de medidores de água e energia a partir de fotos.",
    did: "Pipeline em duas etapas: YOLOv8 detecta o contador na imagem e uma CRNN com CTC lê os dígitos, com interface em Streamlit.",
    tags: ["Python", "YOLOv8", "OpenCV", "PyTorch", "Streamlit"],
    repo: "AutoLeitura",
    color: "linear-gradient(135deg,#f46c38,#b83a12)",
    initials: "AL",
  },
  {
    id: "chronomundi",
    name: "ChronoMundi",
    kind: "Realidade virtual · equipe",
    desc: "Museu virtual em VR feito na Unity. Fiz os personagens acompanhantes, o sistema de artefatos por sala e o suporte a VR no Android/Cardboard.",
    problem: "Ver um artefato de perto, no ambiente da época, ensina mais do que ler sobre ele. A partir de um hub central, o jogador atravessa portais para a Pré-História, a Idade Média e o Futuro e examina artefatos com painel de informações e narração.",
    did: "Fiz os personagens acompanhantes (um guia por era: Uruk, Sir Aldric e ARIA), o sistema de artefatos por sala, que libera a saída quando todos são explorados, e o suporte a VR no Android/Cardboard. Também fiz a auditoria completa do repositório.",
    result: "Três eras completas para explorar, rodando em VR e também no computador com teclado e mouse.",
    highlights: [
      "5 cenas: menu, hub do museu e uma cena por era",
      "Portais no hub levando aos ambientes temáticos",
      "Interação com artefatos abrindo painel com título e descrição",
      "Narração com áudio e legendas, com um guia para cada era",
      "Progresso por sala: a saída só aparece depois de explorar todos os artefatos",
      "VR com XR Interaction Toolkit (incluindo Android/Cardboard) e controle por teclado e mouse",
      "Materiais PBR no URP",
    ],
    tags: ["C#", "Unity", "VR", "XR Interaction Toolkit", "URP"],
    repo: "ChronoMundi",
    color: "linear-gradient(135deg,#3cb4ff,#0b4f86)",
    initials: "CM",
    image: `${P}/chronomundi/cena5.webp`,
    gallery: [
      `${P}/chronomundi/cena2.webp`,
      `${P}/chronomundi/cena3.webp`,
      `${P}/chronomundi/cena5.webp`,
      `${P}/chronomundi/cena4.webp`,
      `${P}/chronomundi/cena7.webp`,
      `${P}/chronomundi/cena8.webp`,
      `${P}/chronomundi/cena10.webp`,
      `${P}/chronomundi/cena11.webp`,
      `${P}/chronomundi/cena9.webp`,
    ],
    video: {
      src: `${P}/chronomundi/demo.mp4`,
      poster: `${P}/chronomundi/capa-video.webp`,
      caption: "Demonstração: tela inicial, hub do museu com os portais e a exploração das três eras.",
    },
  },
  {
    id: "protocolo-omega",
    name: "Protocolo Ômega",
    kind: "FPS · Unreal Engine 5 · equipe de 5",
    desc: "FPS sci-fi na Unreal Engine 5 feito em Blueprints: disparo por Line Trace, HUD em UMG, troca de câmera e robôs com Behavior Tree.",
    problem: "Disciplina de Computação Gráfica: aplicar técnicas de CG em sistemas de jogo de verdade. O jogador é o agente AXIS-7 e precisa desativar os robôs Ômega, controlados por uma IA hostil, num complexo subterrâneo.",
    did: "Em equipe de 5, com toda a lógica em Blueprints: disparo hit scan com efeitos de impacto, HUD com barra de vida, troca de skin em tempo real, câmera em 1ª e 3ª pessoa com mira, itens coletáveis e inimigos com IA.",
    result: "FPS jogável com 5 sistemas completos e robôs que patrulham, perseguem e atiram no jogador.",
    highlights: [
      "Disparo por hit scan (Line Trace) a partir da câmera, com Play Montage e muzzle flash",
      "Impacto com Break Hit Result e Apply Damage, faísca em Niagara e Decal de marca de bala, com efeito e som por tipo de superfície",
      "HUD em UMG: objetivo, barra de vida via Event Dispatcher e vinheta vermelha ao levar dano",
      "Tela de Game Over com Respawn e Main Menu",
      "Troca da cor da jaqueta em tempo real com Dynamic Material Instance",
      "Câmera em 3ª pessoa (Spring Arm) e 1ª pessoa com a tecla V, e mira com FOV de 90° para 65° via Timeline",
      "Medkits coletáveis (+50 de vida)",
      "Robôs com Behavior Tree em 4 estados (parado, patrulha, perseguição e ataque), Blackboard, AI Perception e NavMesh",
    ],
    tags: ["Unreal Engine 5", "Blueprints", "Niagara", "UMG", "Behavior Tree"],
    color: "linear-gradient(135deg,#9aa4b2,#2b3240)",
    initials: "PΩ",
    image: `${P}/protocolo-omega/terceira-pessoa.webp`,
    gallery: [
      `${P}/protocolo-omega/terceira-pessoa.webp`,
      `${P}/protocolo-omega/primeira-pessoa.webp`,
      `${P}/protocolo-omega/tiro.webp`,
      `${P}/protocolo-omega/robos-ia.webp`,
      `${P}/protocolo-omega/hud-skins.webp`,
      `${P}/protocolo-omega/medkit.webp`,
      `${P}/protocolo-omega/game-over.webp`,
      `${P}/protocolo-omega/blueprint-disparo.webp`,
    ],
  },
  {
    id: "concilig-app",
    name: "Concilig App",
    desc: "Aplicação em C#/.NET entregue como solução do desafio técnico da Concilig.",
    tags: ["C#", ".NET"],
    repo: "ConciligAppp",
    color: "linear-gradient(135deg,#ffb238,#8a5400)",
    initials: "CA",
  },
  {
    id: "lumi",
    name: "Lumi: Voo na Caverna",
    desc: "Jogo 2D em Unity inspirado em Flappy Bird: guie a vaga-lume Lumi por uma caverna de cristais.",
    tags: ["C#", "Unity", "2D"],
    repo: "lumi-voo-na-caverna",
    color: "linear-gradient(135deg,#7b5cff,#2b1a7a)",
    initials: "LU",
  },
];

const hasPage = (p) => Boolean((p.gallery && p.gallery.length) || p.video);
const projectUrl = (p) => (hasPage(p) ? `projeto.html?id=${p.id}` : `${GITHUB}/${p.repo}`);

// ===== Formação =====
const education = [
  { title: "Bacharelado em Ciência da Computação", org: "UNISAGRADO · Bauru/SP", date: "02/2024 — 12/2027 (previsão)", status: "Cursando",
    desc: "Engenharia de software, banco de dados, redes e sistemas distribuídos, computação gráfica, visão computacional, IA generativa e desenvolvimento de jogos." },
  { title: "Ensino Médio", org: "E.E. Christino Cabral", date: "2021 — 2023", status: "Concluído" },
];

const languages = [
  { name: "Português", level: "Nativo" },
  { name: "Inglês", level: "Avançado" },
  { name: "Espanhol", level: "Básico" },
];

const otherCourses = ["C# Completo (Udemy)", "Desenvolvimento Web Completo (Udemy)"];

// Trajetória ano a ano
const journey = [
  { year: "2021–2023", items: ["Ensino Médio na E.E. Christino Cabral", "Primeiro contato com programação: jogos em Scratch (Alura, 2023)"] },
  { year: "2024", items: [
    "Entrada em Ciência da Computação na UNISAGRADO",
    "Python e Projetos de Sistemas de TI (Fundação Bradesco)",
    "Introdução à Unity e ao Figma (UNISAGRADO)",
    "Líder do Reciclei!: 3º lugar e publicação na Revista Científica InterAção",
    "Sistema de avaliação do suporte financeiro com SQL Server e dashboard",
  ] },
  { year: "2025", items: [
    "Fábrica de Software: 109 horas de projeto de extensão",
    "Jornada do Bem: app em Flutter publicado na Play Store",
    "Aplicação de Banco de Dados Online (Fundação FAT, 120 horas)",
    "Curso de extensão em Automação de Processos com RPA (40 horas)",
    "Início do estágio em desenvolvimento Java na Yank Solutions",
  ] },
  { year: "2026", items: [
    "FinTrack v2: Clean Architecture, JWT, multi-tenant e IA",
    "Jogos e VR em equipe: Ecos de Aldenor, Protocolo Ômega e ChronoMundi",
    "Vitrine Bauru: projeto de extensão com a SEDECON",
  ] },
  { year: "2027", items: ["Formatura prevista (dezembro)"], future: true },
];

// ===== Certificados =====
// category: "curso", "extensao" ou "evento". credential: link público (opcional).
const C = "img/certificados";
const certificates = [
  { title: "Aplicação de Banco de Dados Online", org: "Fundação FAT · Governo de SP", date: "Set/2025", hours: 120, category: "curso",
    skills: ["SQL Server", "Azure SQL"], image: `${C}/fat-banco-de-dados-2025` },
  { title: "Fábrica de Software: Websites, Aplicativos e Jogos", org: "UNISAGRADO", date: "1º sem./2025", hours: 109, category: "extensao",
    skills: ["POO", "Documentação", "Equipe"], image: `${C}/fabrica-software-2025`,
    credential: "https://drive.google.com/file/d/1bpQTZp_0TEAJHWR7yWK3_nxjZTSEXVj8/view" },
  { title: "Automação de Processos com RPA", org: "UNISAGRADO · Curso de extensão", date: "Dez/2025", hours: 40, category: "extensao",
    skills: ["RPA", "Automação"], image: `${C}/rpa-2025`,
    credential: "https://drive.google.com/file/d/1KsoKO5SK0nBlYhQKEKqhin7E6YivYY5x/view" },
  { title: "Linguagem de Programação Python — Básico", org: "Fundação Bradesco", date: "Abr/2024", hours: 18, category: "curso",
    skills: ["Python"], image: `${C}/python-bradesco-2024`,
    credential: "https://drive.google.com/file/d/1_pjAo52qVAVYruudyxD8sZqJsVDlp7q3/view" },
  { title: "Projetos de Sistemas de TI", org: "Fundação Bradesco", date: "Abr/2024", hours: 15, category: "curso",
    skills: ["Gestão de projetos"], image: `${C}/projetos-ti-bradesco-2024`,
    credential: "https://drive.google.com/file/d/1RSb9LE4dcybAqXNlz6U6MbK8IONb04jW/view" },
  { title: "VII SITec — Semana de Inovação e Tecnologia", org: "UNISAGRADO", date: "Nov/2025", hours: 9, category: "evento",
    skills: ["Agentes inteligentes"], image: `${C}/sitec-2025`,
    credential: "https://drive.google.com/file/d/1qLl_fsUU2P8FMNDzgkAEZ4EvrQcSoiTf/view" },
  { title: "Introdução à Unity", org: "UNISAGRADO", date: "Abr/2024", hours: 8, category: "evento",
    skills: ["Unity", "C#"], image: `${C}/unity-2024`,
    credential: "https://drive.google.com/file/d/1WUNR6neQ0P9gaUC7RE7bXH2h72-gbdSY/view" },
  { title: "Introdução ao Figma", org: "UNISAGRADO", date: "Set/2024", hours: 8, category: "evento",
    skills: ["Figma", "UI"], image: `${C}/figma-2024`,
    credential: "https://drive.google.com/file/d/1xcDUlo2EHhMI8PY31F7nczpW879gcfbu/view" },
  { title: "Scratch: desenvolvendo jogos através da programação", org: "Alura", date: "Out/2023", hours: 6, category: "curso",
    skills: ["Lógica"], image: `${C}/scratch-alura-2023`,
    credential: "https://drive.google.com/file/d/1MXI8wdX5kbR7JdBA32F69yLzgBFnX1Ih/view" },
  { title: "VI SITec — Semana de Inovação e Tecnologia", org: "UNISAGRADO", date: "Nov/2024", hours: 4, category: "evento",
    skills: ["Palestras"], image: `${C}/sitec-2024`,
    credential: "https://drive.google.com/file/d/1IO_Wgxzio1VpptmlWmLmUgE85x5ZO-f3/view" },
];
