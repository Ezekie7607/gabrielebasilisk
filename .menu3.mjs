import { chromium } from "playwright";
setTimeout(() => { console.error("TIMEOUT"); process.exit(1); }, 130000).unref();
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const logs=[]; p.on("pageerror", e=>logs.push("PE:"+e.message)); p.on("console", m=>m.type()==="error"&&logs.push(m.text()));
await p.goto("http://localhost:8081/", { waitUntil: "load" });
await p.waitForTimeout(4000);
const st = () => p.evaluate(()=>{const btn=document.querySelector('button[aria-controls="mobile-menu"]'); const m=document.getElementById("mobile-menu"); return { exp: btn.getAttribute("aria-expanded"), inert: m.hasAttribute("inert"), op: getComputedStyle(m).opacity, mainInert: document.querySelector("main")?.hasAttribute("inert") };});
console.log("0 initial", await st());
// 1. DOM .click()
await p.evaluate(()=>document.querySelector('button[aria-controls="mobile-menu"]').click());
await p.waitForTimeout(500); console.log("1 after el.click()", await st());
// 2. focus + Enter key
await p.evaluate(()=>document.querySelector('button[aria-controls="mobile-menu"]').focus());
await p.keyboard.press("Enter"); await p.waitForTimeout(600);
console.log("2 after Enter", await st());
if ((await st()).exp === "true") {
  console.log("focus after open:", await p.evaluate(()=>document.activeElement.tagName+":"+(document.activeElement.textContent||"").trim().slice(0,24)));
  const seq=[]; for(let i=0;i<9;i++){ await p.keyboard.press("Tab"); await p.waitForTimeout(60);
    seq.push(await p.evaluate(()=>{const e=document.activeElement;const r=e.getBoundingClientRect();return `${e.tagName}:${(e.textContent||"").trim().slice(0,26)} ${Math.round(r.width)}x${Math.round(r.height)}@y${Math.round(r.y)}`;})); }
  console.log("TAB IN MENU:\n"+seq.join("\n"));
  await p.screenshot({ path: "/private/tmp/claude-501/-Users-leoni-vault/e6c650b4-64cd-4e47-b306-a51162c72eb1/scratchpad/wf/a11y-m/menu.png", timeout: 60000 });
  await p.keyboard.press("Escape"); await p.waitForTimeout(500);
  console.log("3 after Esc", await st(), "focus:", await p.evaluate(()=>document.activeElement.tagName+":"+(document.activeElement.textContent||"").trim().slice(0,24)));
}
// 3. real tap
await p.evaluate(()=>{const btn=document.querySelector('button[aria-controls="mobile-menu"]'); window.__r=btn.getBoundingClientRect();});
const r = await p.evaluate(()=>({x:window.__r.x+window.__r.width/2,y:window.__r.y+window.__r.height/2}));
await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(600);
console.log("4 after touch tap", await st());
console.log("LOGS", logs);
await b.close();
