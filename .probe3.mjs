import { chromium } from "playwright";
setTimeout(() => { console.error("TIMEOUT"); process.exit(1); }, 170000).unref();
const W = Number(process.argv[2]), H = Number(process.argv[3]), RM = process.argv[4] === "rm";
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: RM ? "reduce" : "no-preference", hasTouch: W < 768, isMobile: W < 768 });
const p = await ctx.newPage();
const logs = [];
p.on("console", (m) => { if (m.type() === "error") logs.push(`[err] ${m.text()}`); });
p.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
await p.goto("http://localhost:8081/", { waitUntil: "load" });
await p.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
await p.waitForTimeout(3000);
const out = { vp: `${W}x${H}`, rm: RM };

// ---- tab walk from true top ----
await p.evaluate(() => { window.scrollTo(0,0); });
await p.waitForTimeout(800);
await p.evaluate(() => document.body.focus());
out.tab = [];
for (let i = 0; i < 30; i++) {
  await p.keyboard.press("Tab");
  await p.waitForTimeout(60);
  const a = await p.evaluate(() => { const e = document.activeElement; if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return { t: e.tagName, txt:(e.textContent||"").trim().slice(0,34), y: Math.round(scrollY), box:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)], ho: getComputedStyle(document.documentElement).getPropertyValue("--hero-out"), inertAnc: !!e.closest("[inert]"), out: cs.outlineStyle+" "+cs.outlineWidth+" "+cs.outlineColor, bs: cs.boxShadow.slice(0,60) }; });
  out.tab.push(a);
  if (a && a.t === "BODY") break;
}

// ---- overflow, rect-based (body has overflow-x:hidden so scrollWidth lies) ----
await p.evaluate(() => { window.scrollTo(0,0); });
out.ovf = [];
for (const y of [0, 300, 600, 900, 1400, 2200, 3200, 4200]) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(500);
  out.ovf.push(await p.evaluate(() => {
    const d = document.documentElement, bad = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      if (getComputedStyle(el).visibility === "hidden") continue;
      if (r.right > innerWidth + 1 || r.left < -1) bad.push({ t: el.tagName, c: String(el.className?.baseVal ?? el.className ?? "").slice(0,70), l: Math.round(r.left), rt: Math.round(r.right) });
    }
    return { y: Math.round(scrollY), docSW: d.scrollWidth, bodySW: document.body.scrollWidth, iw: innerWidth, htmlOX: getComputedStyle(d).overflowX, bodyOX: getComputedStyle(document.body).overflowX, nBad: bad.length, bad: bad.slice(0,10) };
  }));
}

// ---- hero band geometry vs nav + sphere ----
await p.evaluate(() => window.scrollTo(0,0));
await p.waitForTimeout(600);
out.geom = await p.evaluate(() => {
  const g = (s) => { const e = document.querySelector(s); if(!e) return null; const r = e.getBoundingClientRect(); return { box:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)], op: getComputedStyle(e).opacity }; };
  const canv = [...document.querySelectorAll("canvas")].map(c => { const r = c.getBoundingClientRect(); const w = c.parentElement.parentElement; const wr = w.getBoundingClientRect(); return { cbox:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)], wbox:[Math.round(wr.x),Math.round(wr.y),Math.round(wr.width),Math.round(wr.height)], wop: getComputedStyle(w).opacity, cw: c.width, chh: c.height }; });
  return { header: g("header"), heroCopy: g("#hero-copy"), h1: g("#hero-copy h1"), kicker: g("#hero-copy p"), canv, innerH: innerHeight };
});
out.logs = logs;
console.log(JSON.stringify(out));
await b.close();
