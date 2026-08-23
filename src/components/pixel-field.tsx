import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { phase } from "@/lib/flow";
import { pointer, seedGalaxy, seedSphere, smoothstep, tickPhase } from "@/lib/field-math";
import { PALETTE } from "@/lib/palette";

const WebGLField = lazy(() => import("./webgl-field"));

function Starfield2D() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 640;
    const count = mobile ? 180 : 320;
    const sphere = seedSphere(count);
    const galaxy = seedGalaxy(count, 1);

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = performance.now();
    let rot = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const loop = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      tickPhase(delta, reduced);
      if (!reduced) rot += delta * (0.16 + phase.galaxy * 0.06);

      const implode = phase.implode;
      const birth = smoothstep(0, 1, phase.galaxy);
      const collapse = implode * implode;
      const tilt = 0.07 * (1 - birth) + 0.42 * birth;
      const camZ = 4.35 + birth * 6.8;
      const camY = 4.8 * birth;
      const cosY = Math.cos(rot);
      const sinY = Math.sin(rot);
      const cosX = Math.cos(tilt);
      const sinX = Math.sin(tilt);

      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5 + pointer.x * 28;
      const cy = height * 0.48 - pointer.y * 18;
      const scale = Math.min(width, height) * 0.26;

      for (let i = 0; i < count; i++) {
        const sx = sphere[i * 4];
        const sy = sphere[i * 4 + 1];
        const sz = sphere[i * 4 + 2];
        const gx = galaxy[i * 4];
        const gy = galaxy[i * 4 + 1];
        const gz = galaxy[i * 4 + 2];
        const x = sx * (1 - collapse) * (1 - birth) + gx * birth;
        const y = sy * (1 - collapse) * (1 - birth) + gy * birth;
        const z = sz * (1 - collapse) * (1 - birth) + gz * birth;
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const depth = camZ + z2;
        if (depth < 0.2) continue;
        const p = scale / depth;
        const px = cx + x1 * p * 6.2;
        const py = cy - (y1 - camY * 0.12) * p * 6.2;
        const size = Math.max(1, (0.055 - birth * 0.025) * p);
        const a = Math.min(1, 0.55 + p * 0.7);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(px - size * 0.5, py - size * 0.5, size, size);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export default function PixelField() {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-svh w-full" aria-hidden="true">
      {client ? (
        <Suspense fallback={<Starfield2D />}>
          <WebGLField />
        </Suspense>
      ) : (
        <Starfield2D />
      )}
    </div>
  );
}
