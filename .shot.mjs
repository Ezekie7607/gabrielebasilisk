import { chromium } from "playwright";
setTimeout(() => { console.error("shot timeout"); process.exit(1); }, 600000).unref();
const S = process.argv[2];
const W = Number(process.argv[3] || 1440), H = Number(process.argv[4] || 900);
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto("http://localhost:8081/", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
await p.screenshot({ path: `${S}/s0.png`, timeout: 120000 });
for (const [i, y] of [[1, 350], [2, 700], [3, 1100], [4, 1800], [5, 2800]]) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${S}/s${i}.png`, timeout: 120000 });
}
await b.close();
