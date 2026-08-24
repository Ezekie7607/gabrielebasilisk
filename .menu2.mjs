import { chromium } from "playwright";
setTimeout(() => { console.error("TIMEOUT"); process.exit(1); }, 150000).unref();
const b = await chromium.launch({ executablePath: "/Users/leoni/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const logs = []; p.on("console", m => m.type()==="error" && logs.push(m.text())); p.on("pageerror", e => logs.push("PE:"+e.message));
await p.goto("http://localhost:8081/", { waitUntil: "load" });
await p.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
await p.waitForTimeout(2500);
console.log("hitTest", await p.evaluate(()=>{
  const btn = document.querySelector('button[aria-controls="mobile-menu"]');
  const r = btn.getBoundingClientRect();
  const el = document.elementFromPoint(r.x+r.width/2, r.y+r.height/2);
  return { btnBox:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)], top: el.tagName+"."+String(el.className).slice(0,50), isBtnOrChild: btn.contains(el) };
}));
// open via DOM click
await p.evaluate(()=>document.querySelector('button[aria-controls="mobile-menu"]').click());
await p.waitForTimeout(700);
await p.screenshot({ path: "/private/tmp/claude-501/-Users-leoni-vault/e6c650b4-64cd-4e47-b306-a51162c72eb1/scratchpad/wf/a11y-m/menu.png", timeout: 60000 });
console.log("expanded", await p.evaluate(()=>document.querySelector('button[aria-controls="mobile-menu"]').getAttribute("aria-expanded")));
console.log("panel", await p.evaluate(()=>{const m=document.getElementById("mobile-menu"); if(!m) return null; const r=m.getBoundingClientRect(); const cs=getComputedStyle(m); return { role:m.getAttribute("role"), modal:m.getAttribute("aria-modal"), hidden:m.hasAttribute("hidden"), inert:m.hasAttribute("inert"), box:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)], op:cs.opacity, vis:cs.visibility, pe:cs.pointerEvents };}));
console.log("focus after open:", await p.evaluate(()=>{const e=document.activeElement; return e.tagName+":"+(e.textContent||"").trim().slice(0,24);}));
const seq=[]; for(let i=0;i<10;i++){ await p.keyboard.press("Tab"); await p.waitForTimeout(50);
 seq.push(await p.evaluate(()=>{const e=document.activeElement;const r=e.getBoundingClientRect();return `${e.tagName}:${(e.textContent||"").trim().slice(0,24)} y=${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`;})); }
console.log("TAB WHILE OPEN:\n"+seq.join("\n"));
await p.keyboard.press("Escape"); await p.waitForTimeout(500);
console.log("after Esc expanded=", await p.evaluate(()=>document.querySelector('button[aria-controls="mobile-menu"]').getAttribute("aria-expanded")));
console.log("focus after Esc:", await p.evaluate(()=>{const e=document.activeElement; return e.tagName+":"+(e.textContent||"").trim().slice(0,24);}));
await p.evaluate(()=>document.querySelector('button[aria-controls="mobile-menu"]').click()); await p.waitForTimeout(400);
console.log("lock:", await p.evaluate(()=>({b:getComputedStyle(document.body).overflow, h:getComputedStyle(document.documentElement).overflow})));
await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(400);
console.log("scrollY while open:", await p.evaluate(()=>Math.round(scrollY)));
console.log("LOGS", logs);
await b.close();
