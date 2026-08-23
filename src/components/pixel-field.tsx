import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { InstancedMesh, Mesh, MeshStandardMaterial, Points, PointLight } from "three";
import { Color, Object3D } from "three";
import { flow, hash01, phase } from "@/lib/flow";
import { PALETTE } from "@/lib/palette";

const pointer = { x: 0, y: 0 };
const dummy = new Object3D();
const tint = new Color();

function useWindowPointer() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function tickPhase(delta: number, reduced: boolean) {
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

function seedSphere(count: number) {
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

function seedGalaxy(count: number, spread: number) {
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

function PhaseDriver({ reduced }: { reduced: boolean }) {
  useFrame((_, delta) => tickPhase(delta, reduced));
  return null;
}

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state, delta) => {
    const g = phase.galaxy;
    if (reduced) {
      state.camera.position.set(0, 4.8 * g, 4.35 + g * 6.8);
      state.camera.lookAt(0, 0, 0);
      return;
    }
    const d = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    const orbit = flow.progress * 0.9;
    const wantX = pointer.x * (0.5 - g * 0.25) + Math.sin(t * 0.05 + orbit) * g * 1.1;
    const wantY = pointer.y * 0.22 * (1 - g) + (4.8 + Math.sin(t * 0.04) * 0.12) * g;
    const wantZ = 4.35 + g * 6.8;
    state.camera.position.x += (wantX - state.camera.position.x) * 1.55 * d;
    state.camera.position.y += (wantY - state.camera.position.y) * 1.55 * d;
    state.camera.position.z += (wantZ - state.camera.position.z) * 1.4 * d;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function VoxelSwarm({ count, reduced }: { count: number; reduced: boolean }) {
  const meshRef = useRef<InstancedMesh>(null);
  const sphere = useMemo(() => seedSphere(count), [count]);
  const galaxy = useMemo(() => seedGalaxy(count, 1), [count]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(sphere[i * 4], sphere[i * 4 + 1], sphere[i * 4 + 2]);
      dummy.scale.setScalar(sphere[i * 4 + 3]);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, sphere]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.1);
    const implode = phase.implode;
    const birth = smoothstep(0, 1, phase.galaxy);
    const collapse = implode * implode;
    const spin = 0.16 * (1 - birth) + birth * 0.07;
    for (let i = 0; i < count; i++) {
      const sx = sphere[i * 4];
      const sy = sphere[i * 4 + 1];
      const sz = sphere[i * 4 + 2];
      const ss = sphere[i * 4 + 3];
      const gx = galaxy[i * 4];
      const gy = galaxy[i * 4 + 1];
      const gz = galaxy[i * 4 + 2];
      const gs = galaxy[i * 4 + 3];
      const wobble = reduced ? 0 : Math.sin(t * 0.7 + i * 0.13) * 0.05 * (1 - collapse);
      const ix = (sx + pointer.x * 0.16 + wobble) * (1 - collapse);
      const iy = (sy + pointer.y * 0.1) * (1 - collapse);
      const iz = sz * (1 - collapse);
      dummy.position.set(
        ix * (1 - birth) + gx * birth,
        iy * (1 - birth) + gy * birth,
        iz * (1 - birth) + gz * birth,
      );
      dummy.scale.setScalar(ss * (1 - collapse) * (1 - birth) + gs * birth + 0.002);
      dummy.rotation.set(reduced ? 0 : t * implode * 2.4, 0, reduced ? 0 : implode * 0.8);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (!reduced) {
      mesh.rotation.y += d * spin;
      mesh.rotation.x = Math.sin(t * 0.18) * 0.07 * (1 - birth) + 0.42 * birth;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={PALETTE.bone} roughness={0.38} metalness={0.18} />
    </instancedMesh>
  );
}

function Dust({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => seedGalaxy(count, 1.18), [count]);
  const posAttr = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = positions[i * 4];
      arr[i * 3 + 1] = positions[i * 4 + 1];
      arr[i * 3 + 2] = positions[i * 4 + 2];
    }
    return arr;
  }, [count, positions]);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const g = phase.galaxy;
    const s = Math.max(g * g * (3 - 2 * g), 0.001);
    pts.scale.setScalar(s);
    pts.visible = g > 0.02;
    const mat = pts.material as { opacity: number };
    mat.opacity = Math.min(g * 1.15, 0.9);
    if (!reduced) pts.rotation.y += Math.min(delta, 0.1) * 0.045;
    else pts.rotation.y = 0.4;
    pts.rotation.x = 0.42 + Math.sin(state.clock.elapsedTime * 0.04) * 0.03 * g;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posAttr, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={PALETTE.ivory}
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}

function Core({ reduced }: { reduced: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const d = Math.min(delta, 0.1);
    const g = phase.galaxy;
    const implode = phase.implode;
    if (!reduced) {
      ref.current.rotation.y += d * (0.32 + implode * 1.4 + g * 0.5);
      ref.current.rotation.x += d * 0.11;
    }
    const collapse = 1 - implode * 0.7;
    const born = 0.42 + Math.sin(state.clock.elapsedTime * 1.8) * 0.05;
    const s = collapse * (1 - g) + born * g;
    ref.current.scale.setScalar(Math.max(s, 0.08));
    const mat = ref.current.material as MeshStandardMaterial;
    mat.emissiveIntensity = 0.22 + implode * 0.8 + g * 1.6;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial
        color={PALETTE.ivory}
        emissive={PALETTE.ivory}
        emissiveIntensity={0.22}
        roughness={0.18}
        metalness={0.32}
      />
    </mesh>
  );
}

function CoreLight() {
  const ref = useRef<PointLight>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.intensity = 0.15 + phase.galaxy * 2.4;
  });
  return <pointLight ref={ref} position={[0, 0, 0]} color={PALETTE.ivory} distance={14} intensity={0.15} />;
}

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
        let x = (sx * (1 - collapse)) * (1 - birth) + gx * birth;
        let y = (sy * (1 - collapse)) * (1 - birth) + gy * birth;
        let z = (sz * (1 - collapse)) * (1 - birth) + gz * birth;
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const depth = camZ + z2;
        if (depth < 0.2) continue;
        const p = scale / depth;
        const px = cx + x1 * p * 6.2;
        const py = cy - (y1 - camY * 0.12) * p * 6.2;
        const size = Math.max(1.4, (4.2 - birth * 1.8) * p);
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

function WebGLField() {
  useWindowPointer();
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = typeof window !== "undefined" && window.innerWidth < 640;
  const count = mobile ? 180 : 360;
  const dust = mobile ? 500 : 900;

  return (
    <Canvas
      camera={{ position: [0, 0, 4.35], fov: 46 }}
      dpr={[1, 1.25]}
      frameloop="always"
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3.2, 5, 2.2]} intensity={1.35} color={PALETTE.ivory} />
      <directionalLight position={[-4, -2, -3]} intensity={0.22} color={PALETTE.stone} />
      <PhaseDriver reduced={reduced} />
      <CameraRig reduced={reduced} />
      <CoreLight />
      <VoxelSwarm count={count} reduced={reduced} />
      <Dust count={dust} reduced={reduced} />
      <Core reduced={reduced} />
    </Canvas>
  );
}

export default function PixelField() {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-svh w-full">
      <Starfield2D />
      {client ? <WebGLField /> : null}
    </div>
  );
}
