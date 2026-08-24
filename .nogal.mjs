import { chromium } from "playwright";
setTimeout(() => { console.error("timeout"); process.exit(1); }, 400000).unref();
const S = process.argv[2];
const ys = process.argv[3].split(",").map(Number);
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-angle=metal","--enable-gpu"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:8081/", { waitUntil: "networkidle" });
await p.waitForTimeout(3000);
await p.addStyleTag({ content: `div[aria-hidden="true"].fixed.inset-0.z-0 > div:first-child { opacity: 0 !important; } #hero-copy { visibility: hidden !important; }` });
for (const y of ys) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${S}/n${String(y).padStart(4,"0")}.png`, timeout: 120000 });
  console.log(y);
}
await b.close();
