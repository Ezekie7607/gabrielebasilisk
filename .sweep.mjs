import { chromium } from "playwright";
setTimeout(() => { console.error("timeout"); process.exit(1); }, 580000).unref();
const S = process.argv[2];
const W = Number(process.argv[3] || 1440), H = Number(process.argv[4] || 900);
const ys = process.argv[5].split(",").map(Number);
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-angle=metal","--enable-gpu"] });
const p = await b.newPage({ viewport: { width: W, height: H } });
const errs = [];
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
p.on("pageerror", (e) => errs.push("PAGEERROR " + e.message));
await p.goto("http://localhost:8081/", { waitUntil: "networkidle" });
await p.waitForTimeout(3000);
for (const y of ys) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(3500);
  const ho = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--hero-out"));
  const op = await p.evaluate(() => { const c = document.getElementById("hero-copy"); return c ? getComputedStyle(c).opacity : "n/a"; });
  await p.screenshot({ path: `${S}/y${String(y).padStart(4,"0")}.png`, timeout: 120000 });
  console.log(y, "hero-out=", ho.trim(), "copyOpacity=", op);
}
console.log("ERRORS", JSON.stringify(errs));
await b.close();
