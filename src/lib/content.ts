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
    lead: `${profile.name}. Web, design, AI systems, industrial operations. One operator, no committees, no theatre. Rome.`,
    enter: "Enter the doctrine",
    brief: "Send the brief",
  },
  stats: [
    { value: "50Y", label: "Family industrial DNA" },
    { value: "22", label: "Already in the arena" },
    { value: "07", label: "Systems in production" },
    { value: "RM", label: "Rome, base of operations" },
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
    body: "Encouragement is cheap. A system that runs without it is not. That is the difference between a pastime and a weapon.",
  },
  laws: [
    {
      num: "01",
      title: "Motivation expires. Systems don't.",
      body: "I don't wait to feel ready. The work starts on schedule, and the standard rises after every delivery.",
    },
    {
      num: "02",
      title: "Aesthetics without discipline is decoration.",
      body: "Beauty is easy. I design things that convert, load, and last. Then I make them look inevitable.",
    },
    {
      num: "03",
      title: "If it doesn't ship, it doesn't exist.",
      body: "Talk is a hobby. Delivered work is the only record: repositories, catalogues, systems, agents.",
    },
    {
      num: "04",
      title: "Agents work. You direct.",
      body: "I don't collect prompts. I build the factory that uses them: Hunter, Voicer, Composer, Coach, Amplifier.",
    },
    {
      num: "05",
      title: "Rome was not built by committees.",
      body: "Fifty years of family industry behind me. The digital front ahead. The same hands.",
    },
  ],
  strip: "BUILD THE MACHINE · THEN BUILD ANOTHER · FACTA NON VERBA · DISCIPLINE COMPOUNDS ·",
  arsenal: {
    kicker: "03 — Arsenal",
    titleA: "I do the whole stack.",
    titleB: "Because handoffs are where projects die.",
    body: "Design without code is a moodboard. Code without distribution is a toy. Agents without an operator are noise. I run the whole chain.",
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
        body: "SEO, AEO, social systems: the distribution layer most studios ignore.",
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
    titleA: "You've seen enough.",
    titleB: "Send the brief.",
    body: "Sites, systems, agents, brand. If you want a template, this is the wrong address. If you want a machine that works while you sleep, write.",
    write: "Write me",
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
  hire: "Ingaggiami",
  openMenu: "Apri menu",
  closeMenu: "Chiudi menu",
  hero: {
    kicker: `SYS.01 // ${profile.locationIt.toUpperCase()}`,
    motto: "Facta non verba",
    h1a: "Non vendo",
    h1b: "potenziale.",
    h1c: "Costruisco macchine",
    h1d: "che vincono.",
    lead: `${profile.name}. Web, design, sistemi AI, operazioni industriali. Un solo operatore, nessun comitato, nessun teatro. Roma.`,
    enter: "Entra nella dottrina",
    brief: "Manda il brief",
  },
  stats: [
    { value: "50Y", label: "DNA industriale di famiglia" },
    { value: "22", label: "Già nell'arena" },
    { value: "07", label: "Sistemi in produzione" },
    { value: "RM", label: "Roma, base operativa" },
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
    body: "Gli incoraggiamenti costano poco. Un sistema che gira senza è un'altra cosa. Questa è la differenza tra un passatempo e un'arma.",
  },
  laws: [
    {
      num: "01",
      title: "La motivazione scade. I sistemi no.",
      body: "Non aspetto di sentirmi pronto. Il lavoro parte in orario e lo standard sale a ogni consegna.",
    },
    {
      num: "02",
      title: "L'estetica senza disciplina è decorazione.",
      body: "Il bello è facile. Io disegno cose che convertono, caricano, durano. Poi le rendo inevitabili.",
    },
    {
      num: "03",
      title: "Se non va in produzione, non esiste.",
      body: "Parlare è un hobby. Conta solo il lavoro consegnato: repository, cataloghi, sistemi, agenti.",
    },
    {
      num: "04",
      title: "Gli agenti lavorano. Tu dirigi.",
      body: "Non colleziono prompt. Costruisco la fabbrica che li usa: Hunter, Voicer, Composer, Coach, Amplifier.",
    },
    {
      num: "05",
      title: "Roma non l'hanno costruita i comitati.",
      body: "Cinquant'anni di industria di famiglia alle spalle. Il fronte digitale davanti. Le stesse mani.",
    },
  ],
  strip: "COSTRUISCI LA MACCHINA · POI COSTRUISCINE UN'ALTRA · FACTA NON VERBA · LA DISCIPLINA È INTERESSE COMPOSTO ·",
  arsenal: {
    kicker: "03 — Arsenale",
    titleA: "Faccio tutto lo stack.",
    titleB: "Perché i passaggi di mano ammazzano i progetti.",
    body: "Il design senza codice è un moodboard. Il codice senza distribuzione è un giocattolo. Gli agenti senza un operatore sono rumore. Io mando avanti l'intera catena.",
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
        body: "SEO, AEO, sistemi social: il layer di distribuzione che gli studi ignorano.",
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
    titleA: "Hai visto abbastanza.",
    titleB: "Manda il brief.",
    body: "Siti, sistemi, agenti, brand. Se cerchi un template, indirizzo sbagliato. Se cerchi una macchina che lavora anche quando dormi, scrivi.",
    write: "Scrivimi",
  },
  location: profile.locationIt,
};

export const translations = { en, it } as const;
export type Lang = keyof typeof translations;
