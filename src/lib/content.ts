export const profile = {
  name: "Gabriele Leoni",
  brand: "BASILISK",
  email: "gabrieleleoni006@gmail.com",
  github: "Ezekie7607",
  githubUrl: "https://github.com/Ezekie7607",
  x: "BasiliskosLeo",
  xUrl: "https://x.com/BasiliskosLeo",
} as const;

/**
 * Copy register, set deliberately.
 *
 * Formal and professional: what the work is, how it is delivered, what the client gets. The earlier
 * manifesto framing (Doctrine, Arsenal, numbered Laws, "I build machines that win") was rewritten
 * out on the owner's instruction. What survives from it is the brand, BASILISK, and the motto,
 * Facta non verba, because those are the identity rather than the register.
 *
 * A prior review pass removed every claim no source could substantiate (invented stats, named
 * systems with no trace on disk, a service line the site could not prove). Do not reintroduce a
 * number or a proper noun here without something checkable behind it. This repo is public, so the
 * same rule covers comments: no client names, no places, no personal detail.
 *
 * Typography: apostrophes are U+2019, not the straight ASCII quote. Em dashes appear only in the
 * numeric section kickers ("02 — Metodo"), where they separate rather than punctuate.
 */

export const en = {
  skip: "Skip to the motion section",
  nav: [
    { href: "#work", label: "Motion" },
    { href: "#doctrine", label: "Method" },
    { href: "#arsenal", label: "Services" },
    { href: "#contact", label: "Contact" },
  ],
  hire: "Get in touch",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  hero: {
    motto: "Facta non verba",
    h1a: "Web, design,",
    h1b: "automation.",
    h1c: "From brief",
    h1d: "to launch.",
    lead: `${profile.name}. Websites, visual identity and automation for small and mid-sized companies. I work alone, from analysis to launch.`,
    enter: "See it move",
    brief: "Contact me",
  },
  marquee: [
    "WEB DEVELOPMENT",
    "DESIGN",
    "VISUAL IDENTITY",
    "AUTOMATION",
    "SEO",
    "E-COMMERCE",
    "WORDPRESS",
    "SHOPIFY",
  ],
  /**
   * Six pieces, captioned by sector and type rather than by client. The files are named
   * work-01..work-06 on purpose: a client name in an image URL leaks exactly what this copy is
   * written to keep out.
   */
  motion: {
    kicker: "02 — Motion",
    titleA: "The site is the demonstration.",
    titleB: "Every element answers the scroll.",
    body: "Type, line work and the scene above all move with the page, drawn as you scroll and reversible at any point. What a project gets is built the same way, to measure.",
  },
  doctrine: {
    kicker: "03 — Method",
    titleA: "How the work runs.",
    titleB: "Five things I hold to.",
    body: "Projects are lost in the gaps: between the first conversation and the brief, between the design and the build, between launch and the first update. These five points exist to close those gaps.",
  },
  laws: [
    {
      num: "01",
      title: "Questions first, work second.",
      body: "Every project opens with a written analysis: objectives, audience, constraints, and what has to be true on launch day. The work follows from it, not the other way around.",
    },
    {
      num: "02",
      title: "Design is there to be read.",
      body: "Typography, hierarchy and contrast come before decoration. Every visual decision has to hold on a small screen and a slow connection, because that is where most people will see it.",
    },
    {
      num: "03",
      title: "I deliver finished work.",
      body: "A site goes live tested on real browsers and real devices, with documentation in plain language, so that the people who use it every day can maintain it independently.",
    },
    {
      num: "04",
      title: "Automation where it earns its place.",
      body: "I use agents and scripts for the repetitive parts of my own work, and this is reflected directly in delivery times. What reaches the client is the result, not the machinery.",
    },
    {
      num: "05",
      title: "One person, start to finish.",
      body: "Your point of contact is the person carrying out the work. No handoffs, no account manager, no brief relayed second hand.",
    },
  ],
  strip: "ANALYSIS · DESIGN · BUILD · LAUNCH · MAINTENANCE · FACTA NON VERBA ·",
  arsenal: {
    kicker: "04 — Services",
    titleA: "I cover the whole chain.",
    titleB: "Because projects are lost in handoffs.",
    body: "Design without development stays a picture. Development without distribution stays invisible. I run the chain end to end, so nothing is lost between one stage and the next.",
    items: [
      {
        num: "01",
        title: "Web development",
        body: "Custom sites, WordPress, Shopify, React. Fast, accessible, and built so that the people who use them every day can update them independently.",
      },
      {
        num: "02",
        title: "Design and identity",
        body: "Visual identity, product photography, catalogues, print and social templates. One coherent system, not a set of unrelated images.",
      },
      {
        num: "03",
        title: "Automation and AI",
        body: "Agents and automated flows for content, enquiries and record keeping. Built around the process you already have, not around a standard you would have to adopt.",
      },
      {
        num: "04",
        title: "Industrial clients",
        body: "Websites and campaign creative for companies in the industrial sector. I work in a production plant myself, so the technical context is familiar to me at first hand.",
      },
      {
        num: "05",
        title: "SEO and distribution",
        body: "Technical SEO, structured data, social presence. The part that brings visitors to the site. Without it, a site remains invisible to its public.",
      },
      {
        num: "06",
        title: "3D and motion",
        body: "The WebGL scene on this page is developed in house and holds up on a phone. Motion is there to explain the content, not to draw attention to itself.",
      },
    ],
  },
  contact: {
    kicker: "05 — Contact",
    titleA: "You have seen how I work.",
    titleB: "Let us talk about the project.",
    body: "Websites, identity, automation. Write a few lines about the project and you will receive a candid assessment. If it is not a good fit for me, I will say so plainly.",
    form: {
      name: "Name",
      email: "Email",
      message: "Project",
      send: "Send",
      hint: "Opens in your email client, addressed to me.",
    },
  },
};

export const it = {
  skip: "Vai alla sezione motion",
  nav: [
    { href: "#work", label: "Motion" },
    { href: "#doctrine", label: "Metodo" },
    { href: "#arsenal", label: "Servizi" },
    { href: "#contact", label: "Contatto" },
  ],
  hire: "Contattami",
  openMenu: "Apri menu",
  closeMenu: "Chiudi menu",
  hero: {
    motto: "Facta non verba",
    h1a: "Web, design,",
    h1b: "automazione.",
    h1c: "Dal brief",
    h1d: "alla pubblicazione.",
    lead: `${profile.name}. Siti, identità visive e automazione per piccole e medie imprese. Lavoro da solo, dall’analisi alla pubblicazione.`,
    enter: "Guardalo muoversi",
    brief: "Contattami",
  },
  marquee: [
    "SVILUPPO WEB",
    "DESIGN",
    "IDENTITÀ VISIVA",
    "AUTOMAZIONE",
    "SEO",
    "E-COMMERCE",
    "WORDPRESS",
    "SHOPIFY",
  ],
  motion: {
    kicker: "02 — Motion",
    titleA: "Il sito è la dimostrazione.",
    titleB: "Ogni elemento risponde allo scroll.",
    body: "Tipografia, tratti e la scena qui sopra si muovono con la pagina: disegnati mentre scorri, reversibili in ogni punto. Per un progetto vale lo stesso metodo, su misura.",
  },
  doctrine: {
    kicker: "03 — Metodo",
    titleA: "Come si svolge il lavoro.",
    titleB: "Cinque punti fermi.",
    body: "I progetti si perdono nei passaggi: tra la prima conversazione e il brief, tra il design e lo sviluppo, tra la pubblicazione e il primo aggiornamento. Questi cinque punti servono a chiudere quei passaggi.",
  },
  laws: [
    {
      num: "01",
      title: "Prima le domande, poi il lavoro.",
      body: "Ogni progetto parte da un’analisi scritta: obiettivi, pubblico, vincoli, e cosa deve essere vero il giorno della pubblicazione. Il lavoro nasce da lì, non il contrario.",
    },
    {
      num: "02",
      title: "Il design serve a farsi leggere.",
      body: "Tipografia, gerarchia e contrasto vengono prima della decorazione. Ogni scelta estetica deve reggere su uno schermo piccolo e una connessione lenta, perché è lì che la vedrà la maggior parte delle persone.",
    },
    {
      num: "03",
      title: "Consegno lavoro finito.",
      body: "Il sito va online verificato su browser e dispositivi reali, con la documentazione in linguaggio semplice, così chi ci lavora ogni giorno lo gestisce in autonomia.",
    },
    {
      num: "04",
      title: "Automazione dove serve davvero.",
      body: "Uso agenti e script per le parti ripetitive del mio lavoro, e questo incide direttamente sui tempi di consegna. Al cliente arriva il risultato, non la complessità.",
    },
    {
      num: "05",
      title: "Una persona sola, dall’inizio alla fine.",
      body: "Il referente è la stessa persona che esegue il lavoro. Nessun passaggio di consegne, nessun account manager, nessun brief riferito di seconda mano.",
    },
  ],
  strip: "ANALISI · DESIGN · SVILUPPO · PUBBLICAZIONE · MANUTENZIONE · FACTA NON VERBA ·",
  arsenal: {
    kicker: "04 — Servizi",
    titleA: "Copro tutta la filiera.",
    titleB: "Perché i progetti si perdono nei passaggi di mano.",
    body: "Il design senza sviluppo resta un’immagine. Lo sviluppo senza distribuzione resta invisibile. Seguo la filiera per intero, così non si perde niente da una fase all’altra.",
    items: [
      {
        num: "01",
        title: "Sviluppo web",
        body: "Siti su misura, WordPress, Shopify, React. Veloci, accessibili, e costruiti perché chi li usa ogni giorno possa aggiornarli in autonomia.",
      },
      {
        num: "02",
        title: "Design e identità",
        body: "Identità visiva, foto prodotto, cataloghi, materiali per stampa e social. Un sistema coerente, non una raccolta di immagini scollegate.",
      },
      {
        num: "03",
        title: "Automazione e AI",
        body: "Agenti e flussi automatici per contenuti, richieste e archiviazione. Costruiti sul processo esistente, non su uno standard da adottare.",
      },
      {
        num: "04",
        title: "Clienti industriali",
        body: "Siti e creatività per le campagne di aziende del settore industriale. Lavoro in un impianto di produzione: il contesto tecnico mi è familiare per esperienza diretta.",
      },
      {
        num: "05",
        title: "SEO e distribuzione",
        body: "SEO tecnica, dati strutturati, presenza social. La parte che porta i visitatori sul sito. Senza, un sito resta invisibile al suo pubblico.",
      },
      {
        num: "06",
        title: "3D e motion",
        body: "La scena WebGL di questa pagina è sviluppata su misura e regge anche da telefono. Il movimento serve a spiegare il contenuto, non a farsi notare.",
      },
    ],
  },
  contact: {
    kicker: "05 — Contatto",
    titleA: "Hai visto come lavoro.",
    titleB: "Parliamo del progetto.",
    body: "Siti, identità, automazione. Scrivimi qualche riga sul progetto: riceverai una valutazione sincera. Se non è adatto alle mie competenze, lo dirò con chiarezza.",
    form: {
      name: "Nome",
      email: "Email",
      message: "Progetto",
      send: "Invia",
      hint: "Si apre nel tuo client di posta, già indirizzato a me.",
    },
  },
};

export const translations = { en, it } as const;
export type Lang = keyof typeof translations;
