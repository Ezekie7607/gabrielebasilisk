import { chromium } from "playwright";
setTimeout(() => { console.error("TIMEOUT"); process.exit(1); }, 150000).unref();
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const logs = []; p.on("console", m => m.type()==="error" && logs.push(m.text())); p.on("pageerror", e => logs.push("PE:"+e.message));
await p.goto("http://localhost:8081/", { waitUntil: "load" });
await p.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
await p.waitForTimeout(2500);
const btn = p.locator("button[aria-controls=\"mobile-menu\"]").first();
console.log("btn attrs", await btn.evaluate(e => ({ al: e.getAttribute("aria-label"), ax: e.getAttribute("aria-expanded"), ac: e.getAttribute("aria-controls"), box: (r=>[Math.round(r.width),Math.round(r.height)])(e.getBoundingClientRect()) })));
await btn.click();
await p.waitForTimeout(700);
await p.screenshot({ path: "/private/tmp/claude-501/-Users-leoni-vault/e6c650b4-64cd-4e47-b306-a51162c72eb1/scratchpad/wf/a11y-m/menu.png", timeout: 60000 });
console.log("after open", await btn.evaluate(e => e.getAttribute("aria-expanded")));
// tab through while open
const seq = [];
for (let i=0;i<12;i++){ await p.keyboard.press("Tab"); await p.waitForTimeout(50);
  seq.push(await p.evaluate(()=>{const e=document.activeElement; const r=e.getBoundingClientRect(); return `${e.tagName}:${(e.textContent||"").trim().slice(0,22)} y=${Math.round(r.y)} h=${Math.round(r.height)} w=${Math.round(r.width)}`;})); }
console.log("TAB WHILE OPEN:\n" + seq.join("\n"));
// escape
await p.keyboard.press("Escape"); await p.waitForTimeout(500);
console.log("after Esc expanded=", await btn.evaluate(e => e.getAttribute("aria-expanded")));
console.log("focus after Esc:", await p.evaluate(()=>{const e=document.activeElement; return e.tagName+":"+(e.textContent||"").trim().slice(0,22);}));
// body scroll lock check
await btn.click(); await p.waitForTimeout(400);
console.log("scroll lock:", await p.evaluate(()=>({bodyOv:getComputedStyle(document.body).overflow, htmlOv:getComputedStyle(document.documentElement).overflow, pos:getComputedStyle(document.body).position})));
await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(400);
console.log("scrollY while menu open:", await p.evaluate(()=>Math.round(scrollY)));
console.log("LOGS", logs);
await b.close();
