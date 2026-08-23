export const flow = {
  progress: 0,
  y: 0,
  vel: 0,
  heroOut: 0,
};

export const phase = {
  implode: 0,
  galaxy: 0,
};

export function hash01(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
