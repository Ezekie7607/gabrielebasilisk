// Twin Galaxy Rings — Originkit
// Originkit — props baked into the default export.
"use client";

import * as React from "react";
import { useEffect, useRef } from "react";

/* The cursor-lift interaction the Originkit original shipped with is gone, and with it the whole
 * framer-motion dependency. This canvas lives inside a `pointer-events: none` background layer, so
 * its five pointer listeners could never fire: hover and press sat pinned at 0 forever, and the
 * per-vertex cursor falloff — an exp() and a length() plus g^8 across every point, every frame —
 * always evaluated to nothing. Restoring it would need `pointer-events: auto` on the galaxy layer,
 * which would eat the scroll that drives the whole hero. */

/* ---------------------------------------------------------------- constants */

const RMAX = 1560;
const FOV = 35;
const DPR_CAP = 1.5;
const TAU = Math.PI * 2;

/* ------------------------------------------------------------------ shaders */

const VERT = `
precision highp float;

attribute vec2 aPath;
attribute vec3 aOff;
attribute float aHue;

uniform vec2  uRes;
uniform float uFocal;
uniform float uStream;
uniform float uSpin;
uniform float uArms;
uniform float uB;
uniform float uThetaMax;
uniform float uRMin;
uniform float uArmW;
uniform float uArmH;
uniform float uDot;
uniform float uDist;
uniform float uPitchCam;
uniform float uRoll;
uniform vec3  uCols[8];
uniform float uCount;
varying vec3  vCol;
varying float vA;

void main() {
    float gIn = aOff.x;
    float gOut = aOff.y;
    float bsd = aOff.z;

    float p = fract(aPath.x + uStream);

    float th = p * uThetaMax;
    float r = uRMin * exp(uB * th);

    float a = th + aPath.y * (6.2831853 / uArms) + uSpin;
    float ca = cos(a);
    float sa = sin(a);

    float inv = 1.0 / sqrt(1.0 + uB * uB);
    vec2 nrm = vec2(-(uB * sa + ca), uB * ca - sa) * inv;

    vec2 pos = vec2(r * ca, r * sa) + nrm * gIn * uArmW * mix(0.40, 1.70, p);
    float y = gOut * uArmH;

    float c = cos(uPitchCam);
    float s = sin(uPitchCam);
    float ry = y * c + pos.y * s;
    float rz = uDist - y * s + pos.y * c;

    if (rz < 30.0) {
        gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
        gl_PointSize = 0.0;
        vCol = uCols[0];
        vA = 0.0;
        return;
    }

    float cr = cos(uRoll);
    float sr = sin(uRoll);
    float sx = (pos.x * cr - ry * sr) * uFocal / rz;
    float sy = (pos.x * sr + ry * cr) * uFocal / rz;
    gl_Position = vec4(sx / (uRes.x * 0.5), sy / (uRes.y * 0.5), 0.0, 1.0);

    float szv = 0.55 + bsd * 1.70;
    gl_PointSize = clamp(uDot * uFocal / rz * szv, 1.0, 40.0);

    float fade = smoothstep(0.0, 0.10, p) * (1.0 - smoothstep(0.86, 1.0, p));

    float dep = 1.0 - smoothstep(uDist * 1.1, uDist * 2.1, rz) * 0.55;

    float bri = (0.32 + bsd * 0.68) * mix(1.30, 0.80, p);

    float cn = max(uCount, 1.0);
    float idx = min(floor(aHue * cn), cn - 1.0);
    vec3 pal = uCols[0];
    for (int i = 1; i < 8; i++) {
        if (abs(idx - float(i)) < 0.5) pal = uCols[i];
    }
    vCol = mix(pal, vec3(1.0), pow(bri, 5.0) * 0.55);
    vA = bri * fade * dep;
}
`;

const FRAG = `
precision highp float;
varying vec3  vCol;
varying float vA;
void main() {
    gl_FragColor = vec4(vCol * vA, vA);
}
`;

/* ------------------------------------------------------------------- helpers */

function parseColor(input: string): [number, number, number] {
  if (!input) return [0, 0, 0];
  const s = input.trim();
  const fn = s.match(/rgba?\(([^)]+)\)/i);
  if (fn) {
    const p = fn[1].split(",").map((v) => parseFloat(v.trim()));
    return [(p[0] || 0) / 255, (p[1] || 0) / 255, (p[2] || 0) / 255];
  }
  let h = s.replace("#", "");
  if (h.length === 3 || h.length === 4) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  h = h.padEnd(6, "0");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rnd: () => number) {
  const u1 = Math.max(1e-9, rnd());
  const u2 = rnd();
  const g = Math.sqrt(-2 * Math.log(u1)) * Math.cos(TAU * u2);
  return Math.max(-3, Math.min(3, g));
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("TwinGalaxyRings shader:", gl.getShaderInfoLog(sh));
  }
  return sh;
}

/* --------------------------------------------------------------------- props */

interface TiltGroup {
  tilt: number;
  sideTilt: number;
  /** Optional end pose — the camera lerps from tilt/sideTilt to these across `progress`. */
  tiltEnd?: number;
  sideTiltEnd?: number;
}

const ARM_W_AT_100 = 34;
const ARM_H_AT_100 = 16;
const SPIN = 0;
// Monochrome: the shipped glow was blue, and this site allows no hue.
const GLOW = "rgba(236, 240, 246, 0.055)";
// Opened up from the shipped 9. Pitch sets how many turns the logarithmic spiral makes before it
// reaches the inner void: at 9 degrees it wound 3.5 times, so any radius crossed 14 arm segments
// and the disc resolved as uniform dust however many samples it was given. At 13 it makes 2.2
// turns and the four arms are separable.
const ARM_PITCH = 15;
const STREAM_AT_50 = 8;

const MAX_POINTS = 400000;

const MAX_COLORS = 8;
const DEFAULT_COLORS = ["#A050FF", "#C9D6E8"];

interface Props {
  background?: string;
  colors?: string[];
  density?: number;
  dotSize?: number;
  speed?: number;
  direction?: "ccw" | "cw";
  distance?: number;
  innerVoid?: number;
  armThickness?: number;
  armCount?: number;
  tilt?: Partial<TiltGroup>;
  /**
   * 0..1 camera-pose driver. Given, it replaces the built-in host-rect reading — which is a
   * constant 0.5 once the host is a fixed full-screen layer, so the tilt would never move.
   */
  progress?: () => number;
  /** False parks the loop: the layer is hidden or the tab is in the background. */
  active?: () => boolean;
  /**
   * Per-frame multiplier on the camera distance. The blast uses it to pull the galaxy in from far
   * away as it is born — a CSS scale on the layer would clip the canvas and show its rectangle.
   */
  dolly?: () => number;
  style?: React.CSSProperties;
}

/* ----------------------------------------------------------------- component */

function OriginkitTwinGalaxyRings(props: Props) {
  const {
    background = "#050A14",
    colors = DEFAULT_COLORS,
    density = 98,
    dotSize = 2,
    speed = 47,
    direction = "cw",
    distance = 3540,
    innerVoid = 14,
    armThickness = 100,
    armCount = 5,
    tilt = { tilt: 26, sideTilt: -8 },
    progress,
    active,
    dolly,
    style,
  } = props;

  // Refs, not deps: the loop mounts once and reads the latest samplers every frame.
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const activeRef = useRef(active);
  activeRef.current = active;
  const dollyRef = useRef(dolly);
  dollyRef.current = dolly;

  const palette = colors && colors.length ? colors.slice(0, MAX_COLORS) : DEFAULT_COLORS;

  const speedDial = Math.max(0, speed);
  const dirSign = direction === "cw" ? -1 : 1;
  const spin = SPIN;
  const cameraDistance = distance;

  const armPitch = ARM_PITCH;

  const tiltStart = tilt.tilt ?? 26;
  const rollStart = tilt.sideTilt ?? -8;
  const armW = (ARM_W_AT_100 * armThickness) / 100;
  const armH = (ARM_H_AT_100 * armThickness) / 100;
  const tiltEnd = tilt.tiltEnd ?? tiltStart;
  const rollEnd = tilt.sideTiltEnd ?? rollStart;

  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const live = useRef({
    palette,
    density,
    dotSize,
    armWidth: armW,
    armHeight: armH,
    armCount,
    armPitch,
    innerVoid,
    speedDial,
    dirSign,
    spin,
    cameraDistance,
    tiltStart,
    tiltEnd,
    rollStart,
    rollEnd,
  });
  live.current = {
    palette,
    density,
    dotSize,
    armWidth: armW,
    armHeight: armH,
    armCount,
    armPitch,
    innerVoid,
    speedDial,
    dirSign,
    spin,
    cameraDistance,
    tiltStart,
    tiltEnd,
    rollStart,
    rollEnd,
  };

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      depth: false,
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    // Every GL object lives behind this one builder so a lost context can be recovered by calling
    // it again. A dropped GPU process is routine on mobile, and without a rebuild path the loop
    // would go on issuing calls into a dead context against a permanently black frame.
    const buildProgram = (g: WebGLRenderingContext) => {
      const vs = compile(g, g.VERTEX_SHADER, VERT);
      const fs = compile(g, g.FRAGMENT_SHADER, FRAG);
      const p = g.createProgram()!;
      g.attachShader(p, vs);
      g.attachShader(p, fs);
      g.linkProgram(p);
      if (!g.getProgramParameter(p, g.LINK_STATUS)) {
        console.warn("TwinGalaxyRings link:", g.getProgramInfoLog(p));
        g.deleteShader(vs);
        g.deleteShader(fs);
        g.deleteProgram(p);
        return null;
      }
      const U = (n: string) => g.getUniformLocation(p, n);
      return {
        vs,
        fs,
        prog: p,
        pathBuf: g.createBuffer()!,
        offBuf: g.createBuffer()!,
        hueBuf: g.createBuffer()!,
        aPath: g.getAttribLocation(p, "aPath"),
        aOff: g.getAttribLocation(p, "aOff"),
        aHue: g.getAttribLocation(p, "aHue"),
        u: {
          res: U("uRes"),
          focal: U("uFocal"),
          stream: U("uStream"),
          spin: U("uSpin"),
          arms: U("uArms"),
          b: U("uB"),
          thetaMax: U("uThetaMax"),
          rMin: U("uRMin"),
          armW: U("uArmW"),
          armH: U("uArmH"),
          dot: U("uDot"),
          dist: U("uDist"),
          pitchCam: U("uPitchCam"),
          roll: U("uRoll"),
          cols: U("uCols[0]"),
          colCount: U("uCount"),
        },
      };
    };
    type GLKit = NonNullable<ReturnType<typeof buildProgram>>;

    const dispose = (g: WebGLRenderingContext, k: GLKit) => {
      g.deleteBuffer(k.pathBuf);
      g.deleteBuffer(k.offBuf);
      g.deleteBuffer(k.hueBuf);
      g.deleteShader(k.vs);
      g.deleteShader(k.fs);
      g.deleteProgram(k.prog);
    };

    const first = buildProgram(gl);
    if (!first) return;
    let kit: GLKit = first;
    gl.useProgram(kit.prog);

    const colBuf = new Float32Array(MAX_COLORS * 3);
    let colKey = "";
    let colCount = 1;
    const uploadPalette = (list: string[]) => {
      const key = list.join("|");
      if (key === colKey) return;
      colKey = key;
      colCount = Math.max(1, Math.min(MAX_COLORS, list.length));
      for (let i = 0; i < MAX_COLORS; i++) {
        const [r, g, b] = parseColor(list[Math.min(i, colCount - 1)]);
        colBuf[i * 3] = r;
        colBuf[i * 3 + 1] = g;
        colBuf[i * 3 + 2] = b;
      }
    };

    let builtKey = "";
    let count = 0;

    const buildArms = (d: number, arms: number) => {
      const nArms = Math.max(1, Math.round(arms));
      const across = 8;
      const samples = Math.max(
        24,
        Math.min(Math.round(d * 8), Math.floor(MAX_POINTS / (nArms * across))),
      );
      count = nArms * samples * across;

      const pathA = new Float32Array(count * 2);
      const offA = new Float32Array(count * 3);
      const hueA = new Float32Array(count);
      const rnd = mulberry32(0x9a1a1);
      let i = 0;
      for (let arm = 0; arm < nArms; arm++) {
        for (let sIdx = 0; sIdx < samples; sIdx++) {
          const p = sIdx / samples;
          for (let k = 0; k < across; k++) {
            pathA[i * 2] = p;
            pathA[i * 2 + 1] = arm;
            offA[i * 3] = gauss(rnd);
            offA[i * 3 + 1] = gauss(rnd);
            offA[i * 3 + 2] = rnd();
            hueA[i] = rnd();
            i++;
          }
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, kit.pathBuf);
      gl.bufferData(gl.ARRAY_BUFFER, pathA, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, kit.offBuf);
      gl.bufferData(gl.ARRAY_BUFFER, offA, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, kit.hueBuf);
      gl.bufferData(gl.ARRAY_BUFFER, hueA, gl.STATIC_DRAW);
      builtKey = `${d}|${arms}`;
    };

    // Grouped so a restored context can be put back into the same state in one call.
    const initState = () => {
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
    };
    initState();

    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    // Assigning canvas.width reallocates and CLEARS the drawing buffer. The loop parks whenever
    // the layer is dark or the page has scrolled past the hero, so without this flag a resize
    // landing while parked would leave a blank canvas that nothing repaints.
    let needsRedraw = true;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      cssW = canvas.clientWidth || host.clientWidth || 0;
      cssH = canvas.clientHeight || host.clientHeight || 0;
      const w = Math.max(1, Math.round(cssW * dpr));
      const h = Math.max(1, Math.round(cssH * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        needsRedraw = true;
      }
      gl.viewport(0, 0, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const scrollProgress = () => {
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const span = r.height + vh;
      if (span <= 0) return 0;
      const p = (vh - r.top) / span;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    };

    let raf = 0;
    let last = performance.now();
    let stream = 0;
    let spinPhase = 0;
    // The first frame is what builds the 50k-point arm buffers. It always runs, so the layer is
    // ready the instant the blast calls for it instead of hitching mid-detonation.
    let drawn = false;
    let lost = false;

    // A dropped GPU process, a driver reset or memory pressure all land here, and all three are
    // routine on a phone. Without preventDefault the browser never offers a restore, and without
    // the rebuild the loop would keep calling into a dead context forever.
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(raf);
    };
    const onRestored = () => {
      dispose(gl, kit);
      const next = buildProgram(gl);
      if (!next) return;
      kit = next;
      gl.useProgram(kit.prog);
      initState();
      // Forces the arm buffers to be rebuilt into the new context on the next frame.
      builtKey = "";
      count = 0;
      colKey = "";
      cssW = 0;
      cssH = 0;
      drawn = false;
      lost = false;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    const frame = (now: number) => {
      if (lost) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const gate = activeRef.current;
      if (drawn && !needsRedraw && (document.hidden || (gate && !gate()))) return;
      needsRedraw = false;

      if (cssW <= 0 || cssH <= 0) {
        resize();
        if (cssW <= 0 || cssH <= 0) return;
      }

      const L = live.current;
      const key = `${L.density}|${L.armCount}`;
      if (key !== builtKey) buildArms(L.density, L.armCount);
      if (count === 0) return;

      const rate = ((L.speedDial / 50) * STREAM_AT_50 * L.dirSign) / 100;
      stream = (stream + dt * rate) % 1;
      spinPhase = (spinPhase + dt * ((L.spin * Math.PI) / 180)) % TAU;

      const prog01 = progressRef.current ? progressRef.current() : scrollProgress();

      const pitch = ((L.tiltStart + (L.tiltEnd - L.tiltStart) * prog01) * Math.PI) / 180;
      const roll = (-(L.rollStart + (L.rollEnd - L.rollStart) * prog01) * Math.PI) / 180;
      const minDist = RMAX * Math.cos(pitch) + 400;
      const dollyMul = dollyRef.current ? dollyRef.current() : 1;
      const dist = Math.max(minDist, L.cameraDistance * (dollyMul > 0 ? dollyMul : 1));

      const b = Math.max(0.02, Math.tan((L.armPitch * Math.PI) / 180));
      const voidFrac = Math.min(0.9, Math.max(0.01, L.innerVoid / 100));
      const thetaMax = Math.min(Math.log(1 / voidFrac) / b, 24 * Math.PI);
      const rMin = RMAX * Math.exp(-b * thetaMax);

      const wDev = canvas.width;
      const hDev = canvas.height;
      const focal = hDev / (2 * Math.tan(((FOV / 2) * Math.PI) / 180));

      uploadPalette(L.palette);

      gl.uniform2f(kit.u.res, wDev, hDev);
      gl.uniform1f(kit.u.focal, focal);
      gl.uniform1f(kit.u.stream, stream);
      gl.uniform1f(kit.u.spin, spinPhase);
      gl.uniform1f(kit.u.arms, Math.max(1, Math.round(L.armCount)));
      gl.uniform1f(kit.u.b, b);
      gl.uniform1f(kit.u.thetaMax, thetaMax);
      gl.uniform1f(kit.u.rMin, rMin);
      gl.uniform1f(kit.u.armW, L.armWidth);
      gl.uniform1f(kit.u.armH, L.armHeight);
      gl.uniform1f(kit.u.dot, L.dotSize);
      gl.uniform1f(kit.u.dist, dist);
      gl.uniform1f(kit.u.pitchCam, pitch);
      gl.uniform1f(kit.u.roll, roll);
      gl.uniform3fv(kit.u.cols, colBuf);
      gl.uniform1f(kit.u.colCount, colCount);

      gl.bindBuffer(gl.ARRAY_BUFFER, kit.pathBuf);
      gl.enableVertexAttribArray(kit.aPath);
      gl.vertexAttribPointer(kit.aPath, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, kit.offBuf);
      gl.enableVertexAttribArray(kit.aOff);
      gl.vertexAttribPointer(kit.aOff, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, kit.hueBuf);
      gl.enableVertexAttribArray(kit.aHue);
      gl.vertexAttribPointer(kit.aHue, 1, gl.FLOAT, false, 0, 0);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
      drawn = true;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      // No loseContext(): getContext hands back the same context per canvas, so StrictMode's
      // mount/cleanup/mount would reuse a force-lost one. Deleting the objects is what actually
      // releases the ~66k-point arm buffers.
      dispose(gl, kit);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{
        // The Framer size floors are gone: this host fills an absolutely positioned layer that
        // already has a size, and a 1200×800 floor would blow the canvas past a phone viewport.
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(46% 40% at 6% 4%, ${GLOW} 0%, transparent 72%), radial-gradient(52% 44% at 96% 6%, ${GLOW} 0%, transparent 74%), radial-gradient(44% 38% at 92% 96%, ${GLOW} 0%, transparent 72%), ${background}`,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}

const __originkitPresetProps: Props = {
  background: "#000000",
  colors: ["#F8F8F8"],
};

export default function TwinGalaxyRings(props: Props) {
  return <OriginkitTwinGalaxyRings {...__originkitPresetProps} {...props} />;
}
