import { chromium } from "playwright";
setTimeout(() => { console.error("TIMEOUT"); process.exit(1); }, 400000).unref();
const S = process.argv[2], W = Number(process.argv[3]), H = Number(process.argv[4]), RM = process.argv[5] === "rm";
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: RM ? "reduce" : "no-preference", hasTouch: W < 768, isMobile: W < 768 });
const p = await ctx.newPage();
await p.goto("http://localhost:8081/", { waitUntil: "load" });
await p.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
await p.waitForTimeout(3000);
const pre = RM ? "rm" : "y";
for (const y of JSON.parse(process.argv[6])) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${S}/${pre}${y}.png`, timeout: 90000 });
  console.log("shot", y, await p.evaluate(()=>Math.round(scrollY)));
}
await b.close();
