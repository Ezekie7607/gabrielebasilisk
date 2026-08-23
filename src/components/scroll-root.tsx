import { useEffect } from "react";
import { flow } from "@/lib/flow";

export function ScrollRoot() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let lastY = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const next = Math.min(Math.max(y / max, 0), 1);
      if (!reduced) flow.vel = flow.vel * 0.82 + (y - lastY) * 0.18;
      lastY = y;
      flow.y = y;
      flow.progress = next;
      document.documentElement.style.setProperty("--scroll", next.toFixed(4));

      const copy = document.getElementById("hero-copy");
      if (copy) {
        const rect = copy.getBoundingClientRect();
        const start = window.innerHeight * 0.72;
        const end = window.innerHeight * 0.08;
        const raw = (start - rect.bottom) / (start - end);
        flow.heroOut = Math.min(Math.max(raw, 0), 1);
      } else {
        flow.heroOut = y > window.innerHeight * 0.55 ? 1 : 0;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-skip h-0.5 bg-primary" aria-hidden="true" />
  );
}
