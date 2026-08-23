import { flow, hash01, phase } from "@/lib/flow";

export const pointer = { x: 0, y: 0 };

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

export function tickPhase(delta: number, reduced: boolean) {
  const d = Math.min(delta, 0.1);
  const h = flow.heroOut;
  const targetImplode = Math.min(h / 0.38, 1);
  const targetGalaxy = Math.min(Math.max((h - 0.42) / 0.5, 0), 1);
  if (reduced) {
    phase.implode = targetImplode;
    phase.galaxy = targetGalaxy;
    return;
  }
  const k = 1 - Math.exp(-6.4 * d);
  phase.implode += (targetImplode - phase.implode) * k;
  phase.galaxy += (targetGalaxy - phase.galaxy) * k;
}

export function seedSphere(count: number) {
  const arr = new Float32Array(count * 4);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const radius = Math.sqrt(Math.max(1 - y * y, 0));
    const theta = golden * i;
    arr[i * 4] = Math.cos(theta) * radius * 1.65;
    arr[i * 4 + 1] = y * 1.65;
    arr[i * 4 + 2] = Math.sin(theta) * radius * 1.65;
    arr[i * 4 + 3] = 0.055 + (i % 5) * 0.012;
  }
  return arr;
}

export function seedGalaxy(count: number, spread: number) {
  const arr = new Float32Array(count * 4);
  const arms = 3;
  const perArm = Math.max(Math.floor(count / arms), 1);
  for (let i = 0; i < count; i++) {
    const bulge = hash01(i + 3) < 0.12;
    if (bulge) {
      const u = Math.pow(hash01(i + 11), 0.7);
      const r = u * 0.7 * spread;
      const theta = hash01(i + 21) * Math.PI * 2;
      const phi = Math.acos(2 * hash01(i + 31) - 1);
      arr[i * 4] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 4 + 1] = r * Math.cos(phi) * 0.35;
      arr[i * 4 + 2] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 4 + 3] = 0.02 + (1 - u) * 0.04;
    } else {
      const arm = i % arms;
      const k = Math.floor(i / arms) / perArm;
      const u = Math.pow(Math.min(Math.max(k, 0), 1), 0.72);
      const r = (0.22 + u * 7.4) * spread;
      const theta = u * 6.9 + arm * ((Math.PI * 2) / arms);
      const jitter = (0.03 + u * 0.1) * r;
      arr[i * 4] = Math.cos(theta) * r + (hash01(i + 51) - 0.5) * jitter;
      arr[i * 4 + 1] = (hash01(i + 71) - 0.5) * (0.035 + (1 - u) * 0.09) * spread;
      arr[i * 4 + 2] = Math.sin(theta) * r + (hash01(i + 61) - 0.5) * jitter;
      arr[i * 4 + 3] = 0.012 + (1 - u) * 0.03;
    }
  }
  return arr;
}

/** Deterministic wide spherical shell of tiny background points — always-on atmosphere. */
export function seedStars(count: number, radius: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = hash01(i * 2.13 + 501);
    const v = hash01(i * 2.71 + 907);
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = radius * (0.55 + hash01(i + 733) * 0.45);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.cos(phi) * 0.6;
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - radius * 0.25;
  }
  return arr;
}

