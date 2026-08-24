/** Mirror of CSS tokens — used only by the WebGL scene. Strictly monochrome. */
export const PALETTE = {
  bg: "#000000",
  bone: "#ffffff",
  ivory: "#ffffff",
  stone: "#c8c8c8",
  /** Dim rim/fill tone — keeps contrast without leaving pure grayscale. */
  ash: "#4a4a4a",
  /** Fog / void tone, matches the page background for seamless depth falloff. */
  void: "#000000",
  /** Core-side white, a hair warm — the only permitted hue drift. */
  warm: "#fff4e6",
  /** Rim-side white, a hair cool. */
  cool: "#e6eef8",
} as const;
