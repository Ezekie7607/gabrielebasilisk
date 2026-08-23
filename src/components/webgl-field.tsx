import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type {
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Points,
  PointLight,
  Sprite,
  SpriteMaterial,
  Texture,
} from "three";
import { AdditiveBlending, CanvasTexture, Color, Object3D } from "three";
import { flow, hash01, phase } from "@/lib/flow";
import { pointer, seedGalaxy, seedSphere, seedStars, smoothstep, tickPhase } from "@/lib/field-math";
import { PALETTE } from "@/lib/palette";
const dummy = new Object3D();
const tint = new Color();

let glowTextureCache: Texture | null = null;

/** Soft radial-gradient sprite, generated once and reused for the core halo and dust points. */
function getGlowTexture(): Texture | null {
  if (glowTextureCache) return glowTextureCache;
  if (typeof document === "undefined") return null;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.28, "rgba(255,255,255,0.7)");
  gradient.addColorStop(0.62, "rgba(255,255,255,0.14)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  glowTextureCache = texture;
  return texture;
}

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
  /** Per-cube: [rotation seed 0..1, brightness 0.55..1.0(+hot spike)] — deterministic, set once. */
  const traits = useMemo(() => {
    const arr = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      arr[i * 2] = hash01(i + 141);
      const base = 0.55 + hash01(i + 201) * 0.42;
      const hot = hash01(i + 301) > 0.91 ? 0.55 + hash01(i + 311) * 0.6 : 0;
      arr[i * 2 + 1] = base + hot;
    }
    return arr;
  }, [count]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(sphere[i * 4], sphere[i * 4 + 1], sphere[i * 4 + 2]);
      dummy.scale.setScalar(sphere[i * 4 + 3]);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tint.setScalar(traits[i * 2 + 1]);
      mesh.setColorAt(i, tint);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count, sphere, traits]);

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
      const seed = traits[i * 2];
      const idle = reduced ? 0 : t * (0.1 + seed * 0.16) * (0.25 + birth * 0.5);
      dummy.rotation.set(
        reduced ? 0 : t * implode * 2.4,
        idle + seed * Math.PI * 2,
        reduced ? 0 : implode * 0.8,
      );
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
      <meshStandardMaterial color={PALETTE.bone} roughness={0.3} metalness={0.28} />
    </instancedMesh>
  );
}

function Dust({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<Points>(null);
  const texture = useMemo(() => getGlowTexture(), []);
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
    mat.opacity = Math.min(g * 1.1, 0.85);
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
        map={texture ?? undefined}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/** Constant faint sky of tiny points — visible from the hero phase onward, gives the void depth. */
function FarStars({ reduced }: { reduced: boolean }) {
  const ref = useRef<Points>(null);
  const texture = useMemo(() => getGlowTexture(), []);
  const posAttr = useMemo(() => seedStars(260, 9), []);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts || reduced) return;
    pts.rotation.y += Math.min(delta, 0.1) * 0.01;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posAttr, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={PALETTE.stone}
        map={texture ?? undefined}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={AdditiveBlending}
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
    mat.emissiveIntensity = 0.32 + implode * 0.9 + g * 1.7;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial
        color={PALETTE.ivory}
        emissive={PALETTE.ivory}
        emissiveIntensity={0.32}
        roughness={0.15}
        metalness={0.35}
      />
    </mesh>
  );
}

/** Additive sprite halo layered behind/around the Core cube — fakes bloom without postprocessing. */
function CoreGlow({ reduced }: { reduced: boolean }) {
  const outerRef = useRef<Sprite>(null);
  const innerRef = useRef<Sprite>(null);
  const texture = useMemo(() => getGlowTexture(), []);

  useFrame((state) => {
    const g = phase.galaxy;
    const implode = phase.implode;
    const pulse = reduced ? 1 : 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.06;
    const glow = 0.12 + implode * 0.55 + g * 1.15;
    if (outerRef.current) {
      outerRef.current.scale.setScalar((1.3 + g * 2.2) * pulse);
      const mat = outerRef.current.material as SpriteMaterial;
      mat.opacity = Math.min(glow * 0.32, 0.38);
    }
    if (innerRef.current) {
      innerRef.current.scale.setScalar((0.55 + g * 1.0 + implode * 0.45) * pulse);
      const mat = innerRef.current.material as SpriteMaterial;
      mat.opacity = Math.min(0.25 + glow * 0.4, 0.7);
    }
  });

  if (!texture) return null;

  return (
    <>
      <sprite ref={outerRef} renderOrder={1}>
        <spriteMaterial
          map={texture}
          color={PALETTE.ivory}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </sprite>
      <sprite ref={innerRef} renderOrder={2}>
        <spriteMaterial
          map={texture}
          color={PALETTE.ivory}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </sprite>
    </>
  );
}

function CoreLight() {
  const ref = useRef<PointLight>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.intensity = 0.2 + phase.galaxy * 1.8;
  });
  return (
    <pointLight
      ref={ref}
      position={[0, 0, 0]}
      color={PALETTE.ivory}
      distance={15}
      intensity={0.2}
    />
  );
}

export default function WebGLField() {
  useWindowPointer();
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = typeof window !== "undefined" && window.innerWidth < 640;
  const desktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const count = mobile ? 150 : 360;
  const dust = mobile ? 500 : 900;
  const offsetX = desktop ? 1.3 : 0;
  const offsetY = mobile ? 2.2 : desktop ? -0.25 : 0;
  const offsetZ = mobile ? -1.6 : 0;
  const groupScale = mobile ? 0.5 : desktop ? 0.88 : 0.8;

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
      <fog attach="fog" args={[PALETTE.void, 3, 20]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[3.4, 5, 2.4]} intensity={1.65} color={PALETTE.ivory} />
      <directionalLight position={[-4, -2, -3]} intensity={0.16} color={PALETTE.ash} />
      <directionalLight position={[-1.2, 0.6, -6.5]} intensity={1.1} color={PALETTE.ivory} />
      <PhaseDriver reduced={reduced} />
      <CameraRig reduced={reduced} />
      <FarStars reduced={reduced} />
      <group position={[offsetX, offsetY, offsetZ]} scale={groupScale}>
        <CoreLight />
        <VoxelSwarm count={count} reduced={reduced} />
        <Dust count={dust} reduced={reduced} />
        <Core reduced={reduced} />
        <CoreGlow reduced={reduced} />
      </group>
    </Canvas>
  );
}

