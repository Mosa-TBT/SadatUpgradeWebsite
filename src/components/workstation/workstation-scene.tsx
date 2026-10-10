"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useCursor,
} from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";

import { createScreenRenderer, type TerminalScreenState } from "./screen-renderer";

const DESK = { w: 2.4, d: 1.2, t: 0.06 };

const LAPTOP = {
  baseW: 0.7,
  baseD: 0.48,
  baseH: 0.019,
  baseR: 0.011,
  lidW: 0.66,
  lidH: 0.42,
  lidT: 0.012,
  lidR: 0.01,
  hingeZ: -(0.48 / 2 - 0.012),
  openAngle: -THREE.MathUtils.degToRad(104),
};

const BEZEL = { side: 0.021, top: 0.023, bottom: 0.032 };
const SCREEN_W = LAPTOP.lidW - BEZEL.side * 2;
const SCREEN_H = LAPTOP.lidH - BEZEL.top - BEZEL.bottom;
const SCREEN_TEX_W = 1536;
const SCREEN_TEX_H = Math.round((SCREEN_TEX_W * SCREEN_H) / SCREEN_W);

const CAMERA: {
  position: [number, number, number];
  fov: number;
  target: [number, number, number];
} = {
  position: [0.16, 0.6, 1.02],
  fov: 33,
  target: [0, 0.2, -0.07],
};

const SCREEN_LOGO = "/sadat-upgrade-logo-transparent.png";
const MARK_LOGO = "/sadat-upgrade-mark-transparent.png";

export type DeviceQuality = "high" | "low";

export interface WorkstationSceneProps {
  quality?: DeviceQuality;
  reduceMotion?: boolean;
  inView?: boolean;
  screen: TerminalScreenState;
  onActivate?: () => void;
  onExit?: () => void;
}

export default function WorkstationScene({
  quality = "high",
  reduceMotion = false,
  inView = true,
  screen,
  onActivate,
  onExit,
}: WorkstationSceneProps) {
  const handleMissing = useCallback(() => {
    onExit?.();
  }, [onExit]);

  const dpr: [number, number] = quality === "low" ? [1, 1.3] : [1, 1.75];
  const shadows = quality === "high";

  return (
    <Canvas
      shadows={shadows ? "soft" : false}
      dpr={dpr}
      frameloop={inView ? "always" : "never"}
      gl={{
        antialias: quality === "high",
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{ position: CAMERA.position, fov: CAMERA.fov, near: 0.05, far: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      onPointerMissed={handleMissing}
      style={{ touchAction: "pan-y" }}
      aria-label="Interactive 3D Sadat Upgrade workstation"
    >
      <Suspense fallback={null}>
        <SceneContents
          quality={quality}
          reduceMotion={reduceMotion}
          screen={screen}
          onActivate={onActivate}
        />
      </Suspense>
      <AdaptiveDpr pixelated={quality === "high"} />
    </Canvas>
  );
}

interface SceneContentsProps {
  quality: DeviceQuality;
  reduceMotion: boolean;
  screen: TerminalScreenState;
  onActivate?: () => void;
}

function SceneContents({ quality, reduceMotion, screen, onActivate }: SceneContentsProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <>
      <Lighting quality={quality} />
      <Environment resolution={quality === "high" ? 256 : 128} frames={1}>
        <color attach="background" args={["#0b0d12"] as const} />
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#ffffff"
          position={[0, 4, 2]}
          scale={[8, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.3}
          color="#dbeafe"
          position={[-4.5, 1.6, 1]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#f3e8ff"
          position={[4.5, 1.6, -1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[5, 3, 1]}
        />
        <Lightformer
          form="circle"
          intensity={0.7}
          color="#ffffff"
          position={[0, -3, 1.5]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[5, 5, 1]}
        />
      </Environment>

      <ParallaxRig reduceMotion={reduceMotion} dragging={dragging}>
        <group>
          <Desk />
          <Laptop screen={screen} onActivate={onActivate} />
          <Mouse />
          <Notebook />
          <Mug />
        </group>
      </ParallaxRig>

      <ContactShadows
        position={[0, 0.006, 0.02]}
        scale={2.5}
        opacity={0.42}
        blur={2.8}
        far={1.3}
        resolution={quality === "high" ? 512 : 256}
        color="#0b1220"
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={0.82}
        maxDistance={1.95}
        minPolarAngle={THREE.MathUtils.degToRad(48)}
        maxPolarAngle={THREE.MathUtils.degToRad(86)}
        minAzimuthAngle={THREE.MathUtils.degToRad(-34)}
        maxAzimuthAngle={THREE.MathUtils.degToRad(34)}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.45}
        zoomSpeed={0.55}
        target={CAMERA.target}
        onStart={() => setDragging(true)}
        onEnd={() => setDragging(false)}
      />
    </>
  );
}

interface ParallaxRigProps {
  children: ReactNode;
  reduceMotion: boolean;
  dragging: boolean;
}

function ParallaxRig({ children, reduceMotion, dragging }: ParallaxRigProps) {
  const ref = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion) return undefined;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    let tx = 0;
    let ty = 0;
    if (!reduceMotion && !dragging) {
      tx = pointer.current.x * 0.05 + Math.sin(t * 0.18) * 0.012;
      ty = pointer.current.y * 0.028;
    }
    ref.current.rotation.y = THREE.MathUtils.damp(
      ref.current.rotation.y,
      tx,
      2.6,
      delta,
    );
    ref.current.rotation.x = THREE.MathUtils.damp(
      ref.current.rotation.x,
      ty,
      2.6,
      delta,
    );
  });

  return <group ref={ref}>{children}</group>;
}

function Lighting({ quality }: { quality: DeviceQuality }) {
  const mapSize = quality === "high" ? 2048 : 1024;
  return (
    <>
      <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#c3ccd9" />
      <ambientLight intensity={0.22} />
      <directionalLight
        castShadow={quality === "high"}
        position={[2.4, 3.4, 2.6]}
        intensity={2.0}
        color="#fff6ea"
        shadow-mapSize={[mapSize, mapSize]}
        shadow-bias={-0.00012}
        shadow-normalBias={0.02}
        shadow-camera-near={0.5}
        shadow-camera-far={10}
        shadow-camera-left={-1.9}
        shadow-camera-right={1.9}
        shadow-camera-top={1.9}
        shadow-camera-bottom={-1.9}
      />
      <directionalLight position={[-2.6, 1.7, -1.4]} intensity={0.55} color="#dbeafe" />
      <directionalLight position={[0.5, 1.2, -3]} intensity={0.4} color="#ede9fe" />
    </>
  );
}

type SmoothBoxProps = ThreeElements["mesh"] & {
  w: number;
  h: number;
  d: number;
  radius?: number;
  segments?: number;
  children?: ReactNode;
};

function SmoothBox({ w, h, d, radius = 0.006, segments = 4, children, ...props }: SmoothBoxProps) {
  const geometry = useMemo(
    () => new RoundedBoxGeometry(w, h, d, segments, radius),
    [w, h, d, segments, radius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} {...props}>
      {children}
    </mesh>
  );
}

function useRoundedShapeGeometry(width: number, height: number, radius: number): THREE.ShapeGeometry {
  return useMemo(() => {
    const w = width / 2;
    const h = height / 2;
    const r = Math.min(radius, w, h);
    const shape = new THREE.Shape();
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);
    const geo = new THREE.ShapeGeometry(shape, 12);
    return geo;
  }, [width, height, radius]);
}

function useImageTexture(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      setTexture(tex);
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [url]);
  useEffect(
    () => () => {
      if (texture) texture.dispose();
    },
    [texture],
  );
  return texture;
}

function DisplaySurface({ screen }: { screen: TerminalScreenState }) {
  const renderer = useMemo(
    () => createScreenRenderer({ width: SCREEN_TEX_W, height: SCREEN_TEX_H }),
    [],
  );
  const stateRef = useRef(screen);
  stateRef.current = screen;

  useEffect(
    () => () => {
      renderer.texture.dispose();
    },
    [renderer],
  );

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      renderer.setLogo(img);
      renderer.draw(stateRef.current);
    };
    img.src = SCREEN_LOGO;
    return () => {
      cancelled = true;
    };
  }, [renderer]);

  useEffect(() => {
    renderer.draw(screen);
  }, [renderer, screen]);

  return (
    <mesh
      name="display"
      position={[0, -LAPTOP.lidT / 2 - 0.0016, LAPTOP.lidH / 2]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[SCREEN_W, SCREEN_H]} />
      <meshBasicMaterial
        map={renderer.texture}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Laptop({
  screen,
  onActivate,
}: {
  screen: TerminalScreenState;
  onActivate?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const markTexture = useImageTexture(MARK_LOGO);
  const bezelGeometry = useRoundedShapeGeometry(
    LAPTOP.lidW - 0.012,
    LAPTOP.lidH - 0.012,
    0.012,
  );

  const shell = (
    <meshPhysicalMaterial
      color="#c8ccd3"
      metalness={0.85}
      roughness={0.32}
      clearcoat={0.4}
      clearcoatRoughness={0.35}
      envMapIntensity={1.15}
    />
  );

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onPointerDown={(e) => {
        e.stopPropagation();
        onActivate?.();
      }}
    >
      {/* ============ BASE ============ */}
      <group position={[0, hovered ? 0.004 : 0, 0]}>
        <SmoothBox
          w={LAPTOP.baseW}
          h={LAPTOP.baseH}
          d={LAPTOP.baseD}
          radius={0.006}
          position={[0, LAPTOP.baseH / 2, 0]}
          castShadow
          receiveShadow
        >
          {shell}
        </SmoothBox>

        {/* Keyboard well */}
        <SmoothBox
          w={LAPTOP.baseW - 0.06}
          h={0.004}
          d={0.235}
          radius={0.0016}
          position={[0, LAPTOP.baseH + 0.001, -0.062]}
          receiveShadow
        >
          <meshStandardMaterial color="#22262c" roughness={0.62} metalness={0.35} />
        </SmoothBox>

        <Keybed centerZ={-0.062} topY={LAPTOP.baseH + 0.0035} />

        {/* Speaker grilles */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.262, LAPTOP.baseH + 0.0018, -0.2]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.13, 0.02]} />
            <meshStandardMaterial color="#1a1e24" roughness={0.7} metalness={0.3} />
          </mesh>
        ))}

        {/* Trackpad */}
        <SmoothBox
          w={0.155}
          h={0.0022}
          d={0.104}
          radius={0.001}
          position={[0, LAPTOP.baseH + 0.0008, 0.118]}
          receiveShadow
        >
          <meshPhysicalMaterial
            color="#c2c7ce"
            roughness={0.16}
            metalness={0.55}
            clearcoat={0.85}
            clearcoatRoughness={0.2}
            envMapIntensity={1}
          />
        </SmoothBox>

        {/* Palm-rest brand mark */}
        {markTexture && (
          <mesh
            position={[0, LAPTOP.baseH + 0.0009, 0.205]}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={2}
          >
            <planeGeometry args={[0.0545, 0.045]} />
            <meshStandardMaterial
              map={markTexture}
              transparent
              depthWrite={false}
              roughness={0.5}
              metalness={0.1}
              opacity={hovered ? 1 : 0.92}
            />
          </mesh>
        )}
      </group>

      {/* ============ HINGE ============ */}
      <mesh
        position={[0, LAPTOP.baseH, LAPTOP.hingeZ]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.009, 0.009, LAPTOP.lidW * 0.94, 28]} />
        <meshStandardMaterial color="#202329" metalness={0.95} roughness={0.35} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * LAPTOP.lidW * 0.47, LAPTOP.baseH, LAPTOP.hingeZ]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.012, 0.012, 0.03, 24]} />
          <meshStandardMaterial color="#aab0b8" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}

      {/* ============ LID (rotates as one object) ============ */}
      <group
        position={[0, LAPTOP.baseH, LAPTOP.hingeZ]}
        rotation={[LAPTOP.openAngle, 0, 0]}
      >
        {/* Outer lid / shell */}
        <SmoothBox
          w={LAPTOP.lidW}
          h={LAPTOP.lidT}
          d={LAPTOP.lidH}
          radius={0.0035}
          position={[0, 0, LAPTOP.lidH / 2]}
          castShadow
          receiveShadow
        >
          {shell}
        </SmoothBox>

        {/* Display bezel (inset into the lid's inner face) */}
        <mesh
          geometry={bezelGeometry}
          position={[0, -LAPTOP.lidT / 2 - 0.0005, LAPTOP.lidH / 2]}
          rotation={[Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#08090c" roughness={0.5} metalness={0.2} />
        </mesh>

        {/* Display surface — canvas texture, part of the lid */}
        <DisplaySurface screen={screen} />

        {/* Camera notch */}
        <mesh
          position={[0, -LAPTOP.lidT / 2 - 0.001, LAPTOP.lidH - BEZEL.top / 2 - 0.004]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.0035, 24]} />
          <meshStandardMaterial color="#05070a" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Outer-lid brand mark */}
        {markTexture && (
          <mesh
            position={[0, LAPTOP.lidT / 2 + 0.0005, LAPTOP.lidH / 2]}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={2}
          >
            <planeGeometry args={[0.0945, 0.078]} />
            <meshStandardMaterial
              map={markTexture}
              transparent
              depthWrite={false}
              roughness={0.45}
              metalness={0.15}
            />
          </mesh>
        )}
      </group>

      {/* Screen spill light */}
      <pointLight
        position={[0, 0.36, 0.08]}
        color="#6f9bff"
        intensity={hovered || screen?.active ? 0.42 : 0.22}
        distance={1.5}
        decay={2}
      />
    </group>
  );
}

function Keybed({ centerZ, topY }: { centerZ: number; topY: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const rows = 5;
  const cols = 15;
  const key = { x: 0.032, y: 0.008, z: 0.032 };
  const gap = 0.0055;

  const matrices = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = (c - (cols - 1) / 2) * (key.x + gap);
        const z = centerZ + (r - (rows - 1) / 2) * (key.z + gap);
        arr.push([x, topY, z]);
      }
    }
    return arr;
  }, [centerZ, topY, key.x, key.z, gap]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D();
    matrices.forEach((p, i) => {
      dummy.position.set(p[0], p[1], p[2]);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, matrices.length]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[key.x, key.y, key.z]} />
      <meshStandardMaterial
        color="#15181d"
        roughness={0.5}
        metalness={0.22}
        emissive="#26314a"
        emissiveIntensity={0.22}
      />
    </instancedMesh>
  );
}

function Desk() {
  return (
    <group>
      <SmoothBox
        w={DESK.w}
        h={DESK.t}
        d={DESK.d}
        radius={0.012}
        position={[0, -DESK.t / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#4a3f34"
          roughness={0.52}
          metalness={0.06}
          envMapIntensity={0.5}
        />
      </SmoothBox>

      <SmoothBox
        w={1.5}
        h={0.0016}
        d={0.72}
        radius={0.0008}
        position={[0.08, 0.0008, 0.03]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#1b2029"
          roughness={0.92}
          metalness={0.04}
          envMapIntensity={0.35}
        />
      </SmoothBox>

      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.02, -0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.68, 0.98]} />
          <meshStandardMaterial color="#2b2621" roughness={0.6} metalness={0.12} />
        </mesh>
      ))}

      <mesh position={[0, -0.14, -0.55]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.05, 0.04]} />
        <meshStandardMaterial color="#2b2621" roughness={0.6} metalness={0.12} />
      </mesh>
    </group>
  );
}

function Mouse() {
  return (
    <group position={[0.48, 0, 0.16]} rotation={[0, -0.24, 0]}>
      <SmoothBox
        w={0.062}
        h={0.028}
        d={0.108}
        radius={0.012}
        position={[0, 0.014, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#e9ebef"
          metalness={0.35}
          roughness={0.32}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
          envMapIntensity={1}
        />
      </SmoothBox>
      <mesh position={[0, 0.028, -0.018]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.006, 20]} />
        <meshStandardMaterial color="#0f1115" roughness={0.4} metalness={0.4} />
      </mesh>
    </group>
  );
}

function Notebook() {
  return (
    <group position={[-0.68, 0, 0.08]} rotation={[0, 0.16, 0]}>
      <SmoothBox
        w={0.21}
        h={0.014}
        d={0.29}
        radius={0.005}
        position={[0, 0.007, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#1e2530"
          roughness={0.72}
          metalness={0.06}
          envMapIntensity={0.4}
        />
      </SmoothBox>
      <mesh position={[0.045, 0.0165, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.004, 0.004, 0.17, 16]} />
        <meshPhysicalMaterial
          color="#c9ccd4"
          metalness={0.85}
          roughness={0.28}
          envMapIntensity={1}
        />
      </mesh>
    </group>
  );
}

function Mug() {
  return (
    <group position={[-0.74, 0, -0.28]}>
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.043, 0.038, 0.09, 40]} />
        <meshPhysicalMaterial
          color="#f4f1ea"
          roughness={0.32}
          metalness={0}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>
      <mesh position={[0.05, 0.045, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.024, 0.007, 14, 32]} />
        <meshPhysicalMaterial color="#f4f1ea" roughness={0.35} metalness={0} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, 0.088, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.039, 40]} />
        <meshStandardMaterial color="#33210f" roughness={0.25} metalness={0.05} />
      </mesh>
    </group>
  );
}