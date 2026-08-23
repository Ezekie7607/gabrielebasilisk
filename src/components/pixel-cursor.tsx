import { useEffect, useState } from "react";

export function PixelCursor() {
  const [pos, setPos] = useState({ x: -40, y: -40 });
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setOn(true);
    const move = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  if (!on) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-cursor hidden size-2.5 bg-primary mix-blend-difference md:block"
      style={{ left: pos.x - 5, top: pos.y - 5 }}
    />
  );
}
