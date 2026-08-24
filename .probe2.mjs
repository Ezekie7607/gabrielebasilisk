import { chromium } from "playwright";
setTimeout(() => { console.error("TIMEOUT"); process.exit(1); }, 170000).unref();
const W = Number(process.argv[2]), H = Number(process.argv[3]), RM = process.argv[4] === "rm";
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: RM ? "reduce" : "no-preference", hasTouch: W < 768, isMobile: W < 768 });
const p = await ctx.newPage();
const logs = [];
p.on("console", (m) => { if (m.type() === "error") logs.push(`[error] ${m.text()}`); });
p.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
await p.goto("http://localhost:8081/", { waitUntil: "load" });
await p.waitForTimeout(3000);
const out = { vp: `${W}x${H}`, rm: RM, ovf: [], logs: [] };
for (const y of [0, 200, 350, 480, 620, 900, 1400, 2400, 3600]) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(700);
  out.ovf.push(await p.evaluate(() => {
    const d = document.documentElement, bad = [];
    if (d.scrollWidth > window.innerWidth) for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.right > window.innerWidth + 0.5) bad.push({ t: el.tagName, c: String(el.className?.baseVal ?? el.className ?? "").slice(0,80), l: Math.round(r.left), r: Math.round(r.right) });
    }
    return { y: Math.round(scrollY), sw: d.scrollWidth, iw: innerWidth, bad: bad.slice(0,8) };
  }));
}
await p.evaluate(() => scrollTo(0,0)); await p.waitForTimeout(500);
// canvas wrapper chain
out.canvas = await p.evaluate(() => [...document.querySelectorAll("canvas")].map(c => {
  const ch = []; let n = c;
  while (n && n !== document.body) { ch.push(`${n.tagName}${n.id?"#"+n.id:""}[ah=${n.getAttribute("aria-hidden")},ti=${n.getAttribute("tabindex")},pe=${getComputedStyle(n).pointerEvents},ta=${getComputedStyle(n).touchAction}] .${String(n.className?.baseVal ?? n.className ?? "").slice(0,70)}`); n = n.parentElement; }
  return ch;
}));
// real tab order
out.tab = [];
await p.evaluate(() => document.body.focus());
for (let i = 0; i < 22; i++) {
  await p.keyboard.press("Tab");
  const a = await p.evaluate(() => { const e = document.activeElement; if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return { t: e.tagName, txt: (e.textContent||"").trim().slice(0,32), ah: !!e.closest('[aria-hidden="true"]'), vis: cs.visibility, disp: cs.display, off: !e.offsetParent && cs.position!=="fixed", box: [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)], outline: cs.outlineWidth+" "+cs.outlineStyle, ring: cs.boxShadow.slice(0,50) }; });
  out.tab.push(a);
  if (a && a.t === "BODY") break;
}
// hero copy contrast probe: sample pixels behind hero text
out.hero = await p.evaluate(() => {
  const h = document.querySelector("#hero-copy");
  if (!h) return null;
  const r = h.getBoundingClientRect();
  const heads = [...h.querySelectorAll("h1,p,span")].slice(0,6).map(e => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { tag: e.tagName, txt:(e.textContent||"").trim().slice(0,30), box:[Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)], color: cs.color, fs: cs.fontSize, op: cs.opacity }; });
  return { box: [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)], heads, cs: { op: getComputedStyle(h).opacity, pe: getComputedStyle(h).pointerEvents } };
});
out.nav = await p.evaluate(() => { const n = document.querySelector("header,nav"); if(!n) return null; const r = n.getBoundingClientRect(); return { tag:n.tagName, box:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)], z:getComputedStyle(n).zIndex, pos:getComputedStyle(n).position }; });
out.logs = logs;
console.log(JSON.stringify(out));
await b.close();
