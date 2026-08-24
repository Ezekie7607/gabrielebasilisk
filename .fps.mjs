import { chromium } from "playwright";
setTimeout(() => { console.error("timeout"); process.exit(1); }, 120000).unref();
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:8081/", { waitUntil: "networkidle" });
await p.waitForTimeout(3000);
await p.evaluate(() => window.scrollTo(0, 600));
const r = await p.evaluate(() => new Promise((res) => {
  let n = 0; const t0 = performance.now();
  const f = () => { n++; if (performance.now() - t0 > 5000) res({ n, ms: performance.now() - t0 }); else requestAnimationFrame(f); };
  requestAnimationFrame(f);
}));
console.log("frames", r.n, "in", Math.round(r.ms), "ms ->", (r.n / (r.ms/1000)).toFixed(1), "fps");
await b.close();
