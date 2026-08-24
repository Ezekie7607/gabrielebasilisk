import { chromium } from "playwright";
setTimeout(() => { console.error("TIMEOUT"); process.exit(1); }, 180000).unref();
const S = process.argv[2];
const W = Number(process.argv[3] || 375), H = Number(process.argv[4] || 812);
const RM = process.argv[5] === "rm";
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, reducedMotion: RM ? "reduce" : "no-preference", hasTouch: W < 768, isMobile: W < 768 });
const p = await ctx.newPage();
const logs = [];
p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") logs.push(`[${m.type()}] ${m.text()}`); });
p.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
await p.goto("http://localhost:8081/", { waitUntil: "load" });
await p.waitForTimeout(2500);

const out = { viewport: `${W}x${H}`, reducedMotion: RM, overflow: [], canvases: null, focusables: null, logs: [] };

const ys = [0, 350, 620, 1100, 2800];
for (const y of ys) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(y === 0 ? 300 : 1200);
  const ov = await p.evaluate(() => {
    const d = document.documentElement;
    const bad = [];
    if (d.scrollWidth > window.innerWidth) {
      for (const el of document.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > window.innerWidth + 0.5 || r.left < -0.5) {
          bad.push({ tag: el.tagName, cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : String(el.className || "")).slice(0, 90), left: Math.round(r.left), right: Math.round(r.right) });
        }
      }
    }
    return { scrollWidth: d.scrollWidth, innerWidth: window.innerWidth, bodyScrollWidth: document.body.scrollWidth, offenders: bad.slice(0, 12) };
  });
  out.overflow.push({ y, ...ov });
  await p.screenshot({ path: `${S}/y${y}.png` });
}

await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(600);

out.canvases = await p.evaluate(() => {
  return [...document.querySelectorAll("canvas")].map((c) => {
    const chain = [];
    let n = c;
    for (let i = 0; i < 6 && n; i++) {
      chain.push({
        tag: n.tagName,
        ariaHidden: n.getAttribute("aria-hidden"),
        role: n.getAttribute("role"),
        tabindex: n.getAttribute("tabindex"),
        inert: n.hasAttribute("inert"),
        pe: getComputedStyle(n).pointerEvents,
        touchAction: getComputedStyle(n).touchAction,
        cls: String(n.className || "").slice(0, 120),
      });
      n = n.parentElement;
    }
    return { w: c.width, h: c.height, chain };
  });
});

out.focusables = await p.evaluate(() => {
  const sel = 'a[href],button,input,select,textarea,canvas,[tabindex]:not([tabindex="-1"])';
  return [...document.querySelectorAll(sel)].map((e) => ({ tag: e.tagName, ti: e.getAttribute("tabindex"), txt: (e.textContent || "").trim().slice(0, 40), ariaHiddenAncestor: !!e.closest('[aria-hidden="true"]') }));
});

// keyboard tab order walk
out.tabOrder = await p.evaluate(async () => {
  const res = [];
  return res;
});

out.logs = logs;
console.log(JSON.stringify(out, null, 1));
await b.close();
