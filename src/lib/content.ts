export const profile = {
  name: "Gabriele Leoni",
  brand: "BASILISK",
  role: "Web developer · designer · operator",
  location: "Rome, Italy",
  locationIt: "Roma, Italia",
  email: "gabrieleleoni006@gmail.com",
  github: "Ezekie7607",
  githubUrl: "https://github.com/Ezekie7607",
  x: "BasiliskosLeo",
  xUrl: "https://x.com/BasiliskosLeo",
} as const;

export const en = {
  skip: "Skip to doctrine",
  nav: [
    { href: "#doctrine", label: "Doctrine" },
    { href: "#arsenal", label: "Arsenal" },
    { href: "#contact", label: "Contact" },
  ],
  hire: "Hire",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  hero: {
    kicker: `SYS.01 // ${profile.location.toUpperCase()}`,
    motto: "Facta non verba",
    h1a: "I don't sell",
    h1b: "potential.",
    h1c: "I build machines",
    h1d: "that win.",
    lead: `${profile.name}. Web, design, AI agents, industrial ops. One operator. No committees. Rome.`,
    enter: "Enter the doctrine",
    brief: "Send the brief",
  },
  stats: [
    { value: "50Y", label: "Family industrial DNA" },
    { value: "22", label: "Already in the arena" },
    { value: "07", label: "Shipped systems" },
    { value: "RM", label: "Rome, not a cafe" },
  ],
  marquee: [
    "WEB",
    "DESIGN",
    "AI AGENTS",
    "3D",
    "INDUSTRIAL OPS",
    "BRAND",
    "SYSTEMS",
    "DISCIPLINE",
  ],
  doctrine: {
    kicker: "02 — Doctrine",
    titleA: "The talk is simple.",
    titleB: "The work is not.",
    body: "Most people want a pep talk. I want a system that still runs when motivation dies. That is the difference between a hobby and a weapon.",
  },
  laws: [
    {
      num: "01",
      title: "Motivation is for the weak.",
      body: "The strong build systems. I don't wait to feel ready. I ship, then I raise the standard.",
    },
    {
      num: "02",
      title: "Aesthetics without discipline is decoration.",
      body: "Pretty is cheap. I design things that convert, load, and last. Then I make them look inevitable.",
    },
    {
      num: "03",
      title: "If it doesn't ship, it doesn't exist.",
      body: "Talk is a hobby. Repos, catalogs, themes, agents: that's the scoreboard.",
    },
    {
      num: "04",
      title: "Agents work. You direct.",
      body: "I don't collect prompts. I design factories: Hunter, Voicer, Composer, Coach, Amplifier.",
    },
    {
      num: "05",
      title: "Rome was not built by committees.",
      body: "One operator. Full stack. Family industrial blood, digital weapons. Same man.",
    },
  ],
  strip: "BUILD THE MACHINE · THEN BUILD ANOTHER · FACTA NON VERBA · DISCIPLINE COMPOUNDS ·",
  arsenal: {
    kicker: "03 — Arsenal",
    titleA: "I do the whole stack.",
    titleB: "Because specialists stall.",
    body: "Design without code is a moodboard. Code without distribution is a toy. Agents without an operator are a circus. I run all of it.",
    items: [
      {
        num: "01",
        title: "Web engineering",
        body: "Custom sites, WordPress, Shopify, React. Fast, accessible, no templates pretending to be craft.",
      },
      {
        num: "02",
        title: "Visual design",
        body: "Identity, product photography, posters, Reels, catalogs. Images that sell the machine.",
      },
      {
        num: "03",
        title: "AI agent systems",
        body: "LYON, BASILISK-X, Obsidian brains, orchestrators. Automation with a spine.",
      },
      {
        num: "04",
        title: "Industrial ops",
        body: "Roma Lift SRL: forklifts, platforms, cleaning machines. Digital meets the warehouse floor.",
      },
      {
        num: "05",
        title: "Brand & growth",
        body: "SEO, AEO, social systems, the distribution layer most designers pretend isn't their job.",
      },
      {
        num: "06",
        title: "3D / motion",
        body: "WebGL, pixel monuments, cinematic stills. Motion that serves the message, not the ego.",
      },
    ],
  },
  contact: {
    kicker: "04 — Contact",
    titleA: "Stop scrolling.",
    titleB: "Send the brief.",
    body: "Sites. Systems. Agents. Brand. If you want a template, this is the wrong door. If you want a machine, talk.",
    write: "Write now",
  },
  location: profile.location,
};

export const it = {
  skip: "Vai alla dottrina",
  nav: [
    { href: "#doctrine", label: "Dottrina" },
    { href: "#arsenal", label: "Arsenale" },
    { href: "#contact", label: "Contatto" },
  ],
  hire: "Assumimi",
  openMenu: "Apri menu",
  closeMenu: "Chiudi menu",
  hero: {
    kicker: `SYS.01 // ${profile.locationIt.toUpperCase()}`,
    motto: "Facta non verba",
    h1a: "Non vendo",
    h1b: "potenziale.",
    h1c: "Costruisco macchine",
    h1d: "che vincono.",
    lead: `${profile.name}. Web, design, agenti AI, ops industriale. Un operatore. Niente comitati. Roma.`,
    enter: "Entra nella dottrina",
    brief: "Manda il brief",
  },
  stats: [
    { value: "50Y", label: "DNA industriale di famiglia" },
    { value: "22", label: "Già nell'arena" },
    { value: "07", label: "Sistemi shippati" },
    { value: "RM", label: "Roma, non un caffè" },
  ],
  marquee: [
    "WEB",
    "DESIGN",
    "AGENTI AI",
    "3D",
    "OPS INDUSTRIALE",
    "BRAND",
    "SISTEMI",
    "DISCIPLINA",
  ],
  doctrine: {
    kicker: "02 — Dottrina",
    titleA: "Il discorso è semplice.",
    titleB: "Il lavoro no.",
    body: "La maggior parte vuole una pep talk. Io voglio un sistema che gira anche quando la motivazione è morta. Quella è la differenza tra un hobby e un'arma.",
  },
  laws: [
    {
      num: "01",
      title: "La motivazione è per i deboli.",
      body: "I forti costruiscono sistemi. Non aspetto di sentirmi pronto. Shippo, poi alzo lo standard.",
    },
    {
      num: "02",
      title: "L'estetica senza disciplina è decorazione.",
      body: "Il bello è a buon mercato. Disegno cose che convertono, caricano, durano. Poi le rendo inevitabili.",
    },
    {
      num: "03",
      title: "Se non shippa, non esiste.",
      body: "Parlare è un hobby. Repo, cataloghi, theme, agenti: quello è il tabellone.",
    },
    {
      num: "04",
      title: "Gli agenti lavorano. Tu dirigi.",
      body: "Non colleziono prompt. Progetto fabbriche: Hunter, Voicer, Composer, Coach, Amplifier.",
    },
    {
      num: "05",
      title: "Roma non l'hanno costruita i comitati.",
      body: "Un operatore. Full stack. Sangue industriale di famiglia, armi digitali. Lo stesso uomo.",
    },
  ],
  strip: "COSTRUISCI LA MACCHINA · POI UN'ALTRA · FACTA NON VERBA · LA DISCIPLINA È INTERESSE COMPOSTO ·",
  arsenal: {
    kicker: "03 — Arsenale",
    titleA: "Faccio tutto lo stack.",
    titleB: "Perché gli specialisti si fermano.",
    body: "Il design senza codice è un moodboard. Il codice senza distribuzione è un giocattolo. Gli agenti senza un operatore sono un circo. Io mando avanti tutto.",
    items: [
      {
        num: "01",
        title: "Ingegneria web",
        body: "Siti custom, WordPress, Shopify, React. Veloci, accessibili, niente template che fingono mestiere.",
      },
      {
        num: "02",
        title: "Design visivo",
        body: "Identità, product photography, locandine, Reels, cataloghi. Immagini che vendono la macchina.",
      },
      {
        num: "03",
        title: "Sistemi di agenti AI",
        body: "LYON, BASILISK-X, cervelli Obsidian, orchestratori. Automazione con la schiena dritta.",
      },
      {
        num: "04",
        title: "Ops industriale",
        body: "Roma Lift SRL: muletti, piattaforme, macchine per la pulizia. Il digitale incontra il magazzino.",
      },
      {
        num: "05",
        title: "Brand e crescita",
        body: "SEO, AEO, sistemi social, il layer di distribuzione che i designer fingono non sia il loro lavoro.",
      },
      {
        num: "06",
        title: "3D / motion",
        body: "WebGL, monumenti pixel, still cinematografici. Il motion serve il messaggio, non l'ego.",
      },
    ],
  },
  contact: {
    kicker: "04 — Contatto",
    titleA: "Smetti di scrollare.",
    titleB: "Manda il brief.",
    body: "Siti. Sistemi. Agenti. Brand. Se vuoi un template, porta sbagliata. Se vuoi una macchina, parla.",
    write: "Scrivi ora",
  },
  location: profile.locationIt,
};

export const translations = { en, it } as const;
export type Lang = keyof typeof translations;
