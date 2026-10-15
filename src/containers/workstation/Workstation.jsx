
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
} from "@react-three/drei";

import * as THREE from "three";
import { useGSAP, reveals } from "../../lib/gsapSetup";
import "./Workstation.css";

const Desktop = lazy(() => import("./desktop/Desktop"));

const C = {
  black: "#090d13",
  dark: "#111821",
  panel: "#19232e",
  metal: "#526170",
  silver: "#aab7c5",
  green: "#10b981",
  mint: "#7cf5c2",
  blue: "#3b82f6",
  wall: "#202a36",
  wallDark: "#141c26",
  rug: "#26323d",
};

const KEY_ROWS = [
  ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Ctrl", "Win", "Alt", "Space", "Alt", "Win", "Ctrl"],
];

const INITIAL_CAMERA = [8.6, 8.4, 9.6];

function Box({
  size,
  color,
  position,
  rotation,
  roughness = 0.55,
  metalness = 0.12,
  ...props
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      {...props}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

function Cylinder({
  args,
  color,
  position,
  rotation,
  roughness = 0.5,
  metalness = 0.15,
  ...props
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      {...props}
    >
      <cylinderGeometry args={args} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

/* ======================================================
   DRAG CONTROLLER

   Desktop:
   - Left mouse button to move.
   - Right mouse button to rotate.
   - Double-click to reset.

   Mobile:
   - Touch and drag to move.
   - Pointer capture keeps dragging active.
   - Movement is projected onto a stable horizontal plane.
   - No movementY-based vertical jumping.
   - Release/cancel always ends the drag.
====================================================== */

function useDragController({
  initialPosition,
  minX = -6.5,
  maxX = 6.5,
  minZ = -5.5,
  maxZ = 5.5,
  deskY = 1.76,
  floorY = 0.05,
  heightOffset = 0,
  floorThreshold = 1.5,
}) {
  const [position, setPosition] = useState([...initialPosition]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [onFloor, setOnFloor] = useState(false);

  const { camera, gl, raycaster, invalidate } = useThree();

  const positionRef = useRef([...initialPosition]);
  const rotationRef = useRef([0, 0, 0]);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef(null);
  const dragOffsetRef = useRef(new THREE.Vector3());
  const dragPlaneRef = useRef(
    new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  );
  const hitRef = useRef(new THREE.Vector3());
  const startPositionRef = useRef([...initialPosition]);
  const groupRef = useRef(null);
  const callbacksRef = useRef(null);

  useEffect(() => {
    positionRef.current = [...position];
  }, [position]);

  useEffect(() => {
    rotationRef.current = [...rotation];
  }, [rotation]);

  const updatePosition = useCallback((next) => {
    positionRef.current = [...next];
    setPosition([...next]);
    invalidate();
  }, [invalidate]);

  const updateRotation = useCallback((next) => {
    rotationRef.current = [...next];
    setRotation([...next]);
    invalidate();
  }, [invalidate]);

  const setCursor = useCallback((value) => {
    if (gl.domElement) {
      gl.domElement.style.cursor = value;
    }
  }, [gl]);

  const setPointerCaptureSafe = useCallback((event) => {
    const target = event.target;

    try {
      if (
        target &&
        typeof target.setPointerCapture === "function"
      ) {
        target.setPointerCapture(event.pointerId);
      }
    } catch {
      // Some browsers or event targets do not support capture.
    }

    pointerIdRef.current = event.pointerId;
  }, []);

  const releasePointerCaptureSafe = useCallback((event) => {
    try {
      if (
        event?.target &&
        typeof event.target.releasePointerCapture === "function" &&
        event.pointerId != null &&
        event.target.hasPointerCapture?.(event.pointerId)
      ) {
        event.target.releasePointerCapture(event.pointerId);
      }
    } catch {
      // The browser may already have released capture.
    }

    pointerIdRef.current = null;
  }, []);

  const setRayFromPointer = useCallback((event) => {
    const rect = gl.domElement.getBoundingClientRect();

    if (!rect.width || !rect.height) return false;

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    return true;
  }, [camera, gl, raycaster]);

  const stopDrag = useCallback((event) => {
    if (
      event &&
      pointerIdRef.current !== null &&
      event.pointerId !== undefined &&
      event.pointerId !== pointerIdRef.current
    ) {
      return;
    }

    if (event) {
      event.stopPropagation?.();
    }

    releasePointerCaptureSafe(event);

    if (draggingRef.current) {
      const current = positionRef.current;
      const shouldUseFloor = current[2] > floorThreshold;

      const nextY = shouldUseFloor
        ? floorY + heightOffset
        : deskY + heightOffset;

      updatePosition([current[0], nextY, current[2]]);
      setOnFloor(shouldUseFloor);
    }

    draggingRef.current = false;
    setDragging(false);
    setCursor(hovered ? "grab" : "");
    invalidate();
  }, [
    deskY,
    floorThreshold,
    floorY,
    heightOffset,
    hovered,
    invalidate,
    releasePointerCaptureSafe,
    setCursor,
    updatePosition,
  ]);

  const startDrag = useCallback((event) => {
    // Right-click is reserved for rotation.
    if (event.button === 2) return;

    // Ignore additional simultaneous pointers.
    if (draggingRef.current) return;

    event.stopPropagation();

    if (!setRayFromPointer(event)) return;

    const current = positionRef.current;

    // Keep the plane fixed for the entire drag.
    const dragPlane = dragPlaneRef.current;
    dragPlane.set(
      new THREE.Vector3(0, 1, 0),
      -current[1]
    );

    const hit = hitRef.current;

    if (!raycaster.ray.intersectPlane(dragPlane, hit)) {
      return;
    }

    dragOffsetRef.current.set(
      current[0] - hit.x,
      0,
      current[2] - hit.z
    );

    startPositionRef.current = [...current];
    draggingRef.current = true;

    setDragging(true);
    setHovered(true);
    setCursor("grabbing");

    setPointerCaptureSafe(event);
    invalidate();
  }, [
    invalidate,
    raycaster,
    setCursor,
    setPointerCaptureSafe,
    setRayFromPointer,
  ]);

  const moveDrag = useCallback((event) => {
    if (!draggingRef.current) return;

    if (
      pointerIdRef.current !== null &&
      event.pointerId !== undefined &&
      event.pointerId !== pointerIdRef.current
    ) {
      return;
    }

    event.stopPropagation();

    if (!setRayFromPointer(event)) return;

    const current = positionRef.current;
    const dragPlane = dragPlaneRef.current;
    const hit = hitRef.current;

    // The drag plane follows the object's current base height.
    // Vertical movement is intentionally not derived from
    // event.movementY, which is unreliable on touch devices.
    dragPlane.set(
      new THREE.Vector3(0, 1, 0),
      -current[1]
    );

    if (!raycaster.ray.intersectPlane(dragPlane, hit)) {
      return;
    }

    const offset = dragOffsetRef.current;

    const x = THREE.MathUtils.clamp(
      hit.x + offset.x,
      minX,
      maxX
    );

    const z = THREE.MathUtils.clamp(
      hit.z + offset.z,
      minZ,
      maxZ
    );

    updatePosition([x, current[1], z]);
  }, [
    maxX,
    maxZ,
    minX,
    minZ,
    raycaster,
    setRayFromPointer,
    updatePosition,
  ]);

  const rotateObject = useCallback((event) => {
    event.stopPropagation();

    // Prevent the browser context menu.
    event.nativeEvent?.preventDefault?.();

    const current = rotationRef.current;

    updateRotation([
      current[0],
      current[1] + Math.PI / 4,
      current[2],
    ]);
  }, [updateRotation]);

  const resetObject = useCallback((event) => {
    event.stopPropagation();

    if (draggingRef.current) {
      draggingRef.current = false;
      setDragging(false);
    }

    releasePointerCaptureSafe(event);

    updatePosition([...initialPosition]);
    updateRotation([0, 0, 0]);
    setOnFloor(false);
    setCursor("");
  }, [
    initialPosition,
    releasePointerCaptureSafe,
    setCursor,
    updatePosition,
    updateRotation,
  ]);

  const handlers = {
    onPointerDown: startDrag,
    onPointerMove: moveDrag,
    onPointerUp: stopDrag,
    onPointerCancel: stopDrag,
    onLostPointerCapture: stopDrag,

    onPointerEnter: (event) => {
      event.stopPropagation();
      setHovered(true);

      if (!draggingRef.current) {
        setCursor("grab");
      }
    },

    onPointerLeave: () => {
      setHovered(false);

      if (!draggingRef.current) {
        setCursor("");
      }
    },

    onDoubleClick: resetObject,
    onContextMenu: rotateObject,
  };

  callbacksRef.current = { stopDrag };

  useEffect(() => {
    const handleWindowBlur = () => {
      if (draggingRef.current) {
        callbacksRef.current?.stopDrag();
      }
    };

    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);

      draggingRef.current = false;

      if (gl.domElement) {
        gl.domElement.style.cursor = "";
      }
    };
  }, [gl]);

  return {
    position,
    rotation,
    dragging,
    hovered,
    onFloor,
    groupRef,
    handlers,
    setPosition: updatePosition,
    setRotation: updateRotation,
  };
}

function InteractionHint({ visible, label, position = [0, 0.6, 0] }) {
  if (!visible) return null;

  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      style={{ pointerEvents: "none" }}
    >
      <div className="ws-interaction-hint">
        {label}
      </div>
    </Html>
  );
}

/* ======================================================
   FLOOR
====================================================== */

function Floor() {
  return (
    <group>
      <Box
        size={[15, 0.12, 13]}
        color="#111821"
        position={[0, -0.09, 0]}
        roughness={0.84}
      />

      <Box
        size={[8.1, 0.035, 6.6]}
        color={C.rug}
        position={[0, -0.005, 0.5]}
        roughness={0.98}
      />

      {[
        { p: [0, 0.016, -2.78], s: [7.8, 0.009, 0.025] },
        { p: [0, 0.016, 3.78], s: [7.8, 0.009, 0.025] },
        { p: [-3.9, 0.016, 0.5], s: [0.025, 0.009, 6.55] },
        { p: [3.9, 0.016, 0.5], s: [0.025, 0.009, 6.55] },
      ].map((item, i) => (
        <Box
          key={i}
          size={item.s}
          position={item.p}
          color={C.green}
          roughness={0.35}
        />
      ))}

      <Box
        size={[5.5, 0.018, 0.035]}
        color={C.green}
        position={[0, -0.005, -4.7]}
      />

      <Box
        size={[0.025, 0.018, 5.5]}
        color={C.blue}
        position={[-6.3, -0.005, 0]}
      />
    </group>
  );
}

/* ======================================================
   ROOM
====================================================== */

function Room({ roomLightOn }) {
  return (
    <group>
      <Box
        size={[15, 6.2, 0.22]}
        color={C.wall}
        position={[0, 3.05, -4.15]}
        roughness={0.88}
      />

      <Box
        size={[0.22, 6.2, 13]}
        color={C.wallDark}
        position={[-7.4, 3.05, 1.5]}
      />

      <Box
        size={[0.22, 6.2, 13]}
        color={C.wall}
        position={[7.4, 3.05, 1.5]}
      />

      <Box
        size={[15, 0.16, 1.1]}
        color="#161f2a"
        position={[0, 6.1, -3.6]}
      />

      <Box
        size={[0.16, 0.16, 11.5]}
        color="#161f2a"
        position={[-7.1, 6.1, 1.6]}
      />

      <Box
        size={[0.16, 0.16, 11.5]}
        color="#161f2a"
        position={[7.1, 6.1, 1.6]}
      />

      {[-5.6, -4.5, 4.5, 5.6].map((x) => (
        <group key={x} position={[x, 3.05, -4.025]}>
          <Box size={[0.72, 3.9, 0.045]} color="#2d3947" />

          <Box
            size={[0.035, 3.6, 0.025]}
            color={x < 0 ? C.green : C.blue}
            position={[0.3, 0, 0.03]}
          />
        </group>
      ))}

      <Box
        size={[3.2, 0.025, 0.035]}
        color={roomLightOn ? C.green : "#164b3d"}
        position={[-4.6, 5.1, -4.0]}
      />

      <Box
        size={[3.2, 0.025, 0.035]}
        color={roomLightOn ? C.blue : "#18365f"}
        position={[4.6, 5.1, -4.0]}
      />

      <group position={[-7.25, 3.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Box size={[1.65, 2.15, 0.09]} color="#111821" metalness={0.45} />

        <Box
          size={[1.43, 1.93, 0.025]}
          color="#233445"
          position={[0, 0, 0.055]}
        />

        <Box
          size={[0.11, 1.3, 0.02]}
          color={C.green}
          position={[-0.35, 0, 0.075]}
        />

        <Box
          size={[0.65, 0.055, 0.02]}
          color={C.mint}
          position={[0.22, 0.35, 0.075]}
        />

        <Box
          size={[0.45, 0.035, 0.02]}
          color={C.blue}
          position={[0.12, 0.18, 0.075]}
        />
      </group>

      <group position={[0, 4.28, -4.005]}>
        <Box
          size={[3.45, 1.12, 0.12]}
          color="#101720"
          roughness={0.3}
          metalness={0.4}
        />

        <Box
          size={[3.22, 0.91, 0.025]}
          color="#1c2935"
          position={[0, 0, 0.07]}
        />

        <Html
          transform
          position={[0, 0, 0.11]}
          distanceFactor={5.2}
          occlude={false}
          style={{ pointerEvents: "none" }}
        >
          <div className="ws-wall-brand">
            <img src="/susvg.svg" alt="Sadaat Upgrade" />
            <span>SADAAT UPGRADE</span>
          </div>
        </Html>
      </group>

      {[4.2, 3.35, 2.5].map((y, i) => (
        <group
          key={y}
          position={[7.25, y, -0.2]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <Box
            size={[1.9, 0.07, 0.48]}
            color="#303d4b"
            metalness={0.35}
          />

          {Array.from({ length: 3 }, (_, j) => (
            <Box
              key={j}
              size={[0.37, 0.37 + ((i + j) % 2) * 0.15, 0.27]}
              color={["#536a78", "#1f745b", "#34475d"][(i + j) % 3]}
              position={[-0.58 + j * 0.58, 0.22, -0.015]}
              roughness={0.75}
            />
          ))}
        </group>
      ))}

      <pointLight
        position={[-6.6, 4.2, -3.2]}
        color={C.green}
        intensity={roomLightOn ? 1.1 : 0.12}
        distance={5}
      />

      <pointLight
        position={[6.7, 4.1, -3.1]}
        color={C.blue}
        intensity={roomLightOn ? 1.2 : 0.12}
        distance={5}
      />
    </group>
  );
}

/* ======================================================
   CEILING LAMP
====================================================== */

function CeilingLamp({ roomLightOn }) {
  const [swing, setSwing] = useState([0, 0, 0]);
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0.8, 5.88, -0.35]}>
      <Cylinder
        args={[0.15, 0.15, 0.08, 32]}
        color="#465362"
        metalness={0.7}
      />

      <group
        rotation={swing}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onContextMenu={(event) => {
          event.stopPropagation();
          setSwing(([x, y, z]) => [x, y + Math.PI / 4, z]);
        }}
      >
        <Cylinder
          args={[0.018, 0.018, 1.08, 12]}
          color="#242c35"
          position={[0, -0.53, 0]}
          metalness={0.55}
        />

        <group position={[0, -1.1, 0]}>
          <Cylinder
            args={[0.56, 0.35, 0.2, 48]}
            color="#252f3b"
            metalness={0.55}
            roughness={0.25}
          />

          <Cylinder
            args={[0.4, 0.49, 0.045, 48]}
            color={roomLightOn ? "#fff0c7" : "#333b46"}
            position={[0, -0.105, 0]}
          />

          <mesh position={[0, -0.14, 0]}>
            <circleGeometry args={[0.37, 48]} />
            <meshBasicMaterial
              color={roomLightOn ? "#fff0cf" : "#1b2430"}
            />
          </mesh>

          {roomLightOn && (
            <pointLight
              position={[0, -0.25, 0]}
              color="#e8f5ff"
              intensity={4.5}
              distance={9}
            />
          )}
        </group>
      </group>

      {/* <InteractionHint
        visible={hovered}
        label="Ceiling lamp · Right-click to rotate"
        position={[0, -1.7, 0]}
      /> */}
    </group>
  );
}

/* ======================================================
   WALL LIGHT SWITCH
====================================================== */

function WallLightSwitch({ roomLightOn, onToggle }) {
  return (
    <group
      position={[-7.255, 2.0, 2.0]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <Box size={[0.48, 0.7, 0.09]} color="#111821" metalness={0.4} />

      <Box
        size={[0.34, 0.56, 0.025]}
        color="#34404e"
        position={[0, 0, 0.06]}
      />

      <Html transform position={[0, 0, 0.085]} distanceFactor={4}>
        <button
          type="button"
          className={`ws-wall-switch ${roomLightOn ? "is-on" : "is-off"}`}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          aria-pressed={roomLightOn}
          title={roomLightOn ? "Turn room lights off" : "Turn room lights on"}
        >
          <span className="ws-wall-switch-label">LIGHT</span>
          <span className="ws-wall-switch-control">
            {roomLightOn ? "I" : "O"}
          </span>
          <span className="ws-wall-switch-state">
            {roomLightOn ? "ON" : "OFF"}
          </span>
        </button>
      </Html>
    </group>
  );
}

/* ======================================================
   DESK
====================================================== */

function Desk() {
  return (
    <group>
      <Box
        size={[5.8, 0.18, 3.2]}
        color="#202a35"
        position={[0, 1.56, 0]}
        roughness={0.3}
        metalness={0.25}
      />

      <Box
        size={[5.63, 0.025, 3.03]}
        color="#151d27"
        position={[0, 1.662, 0]}
        roughness={0.32}
      />

      <Box
        size={[5.52, 0.22, 0.11]}
        color="#111922"
        position={[0, 1.37, 1.49]}
      />

      <Box
        size={[4.7, 0.018, 0.025]}
        color={C.green}
        position={[0, 1.39, 1.553]}
      />

      {[[-2.58, -1.32], [2.58, -1.32], [-2.58, 1.32], [2.58, 1.32]].map(
        ([x, z]) => (
          <group key={`${x}:${z}`} position={[x, 0.72, z]}>
            <Box
              size={[0.105, 1.38, 0.105]}
              color="#596574"
              metalness={0.75}
            />

            <Box
              size={[0.2, 0.045, 0.2]}
              color="#171d26"
              position={[0, -0.68, 0]}
            />
          </group>
        )
      )}

      <Box
        size={[2.1, 0.07, 0.52]}
        color="#121a23"
        position={[0, 1.23, -0.85]}
      />

      <Box
        size={[1.65, 0.28, 0.82]}
        color="#293541"
        position={[1.4, 1.15, 0.2]}
        metalness={0.3}
      />

      <Box
        size={[0.55, 0.025, 0.04]}
        color="#81909e"
        position={[1.4, 1.17, 0.625]}
      />
    </group>
  );
}

/* ======================================================
   INTERACTIVE OBJECT WRAPPER
====================================================== */

function InteractiveObject({
  name,
  initialPosition,
  children,
  scale = 1,
  deskY = 1.76,
  floorY = 0.05,
  heightOffset = 0,
  floorThreshold = 1.5,
  minX = -6.5,
  maxX = 6.5,
  minZ = -5.5,
  maxZ = 5.5,
  onDoubleClick,
}) {
  const {
    position,
    rotation,
    dragging,
    hovered,
    groupRef,
    handlers,
  } = useDragController({
    initialPosition,
    deskY,
    floorY,
    heightOffset,
    floorThreshold,
    minX,
    maxX,
    minZ,
    maxZ,
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      {...handlers}
      onDoubleClick={(event) => {
        handlers.onDoubleClick(event);
        onDoubleClick?.();
      }}
    >
      {children}

      {/* <InteractionHint
        visible={hovered && !dragging}
        label={`${name} · Drag to move · Right-click to rotate`}
        position={[0, 0.7, 0]}
      /> */}

      {dragging && (
        <Html
          position={[0, 0.95, 0]}
          center
          distanceFactor={7}
          style={{ pointerEvents: "none" }}
        >
          <div className="ws-interaction-hint">
            Moving {name}…
          </div>
        </Html>
      )}
    </group>
  );
}

/* ======================================================
   PC CASE
====================================================== */

function Case() {
  return (
    <InteractiveObject
      name="PC case"
      initialPosition={[-2.12, 2.18, -0.52]}
      deskY={2.18}
      heightOffset={0.56}
      floorThreshold={1.5}
    >
      <Box
        size={[0.8, 1.12, 0.82]}
        color="#101720"
        roughness={0.24}
        metalness={0.4}
      />

      <Box
        size={[0.69, 1.0, 0.025]}
        color="#1b2a36"
        position={[0, 0, 0.423]}
      />

      {Array.from({ length: 8 }, (_, i) => (
        <Box
          key={i}
          size={[0.012, 0.55, 0.012]}
          color="#526170"
          position={[-0.31 + i * 0.09, -0.08, 0.44]}
        />
      ))}

      {[-0.29, 0, 0.29].map((y, i) => (
        <group key={y} position={[-0.13, y, 0.45]}>
          <mesh>
            <ringGeometry args={[0.083, 0.105, 36]} />
            <meshBasicMaterial color={i === 1 ? C.green : C.blue} />
          </mesh>

          <mesh>
            <circleGeometry args={[0.077, 28]} />
            <meshBasicMaterial color="#101722" />
          </mesh>

          {Array.from({ length: 5 }, (_, blade) => (
            <mesh key={blade} rotation={[0, 0, (Math.PI * 2 * blade) / 5]}>
              <boxGeometry args={[0.018, 0.12, 0.004]} />
              <meshBasicMaterial color="#354454" />
            </mesh>
          ))}
        </group>
      ))}

      <mesh position={[0.23, 0.43, 0.45]}>
        <circleGeometry args={[0.027, 20]} />
        <meshBasicMaterial color={C.mint} />
      </mesh>

      {[-0.18, 0.17].map((x, i) => (
        <group key={x} position={[x, 0.605, 0]}>
          <Cylinder
            args={[0.075, 0.065, 0.17, 24]}
            color={i ? "#8ea4b7" : "#b4c1cf"}
          />
        </group>
      ))}
    </InteractiveObject>
  );
}

/* ======================================================
   MONITOR + VIRTUAL DESKTOP
====================================================== */

function Monitor({ active, onOpen, onClose }) {
  return (
    <group position={[0, 2.78, -0.62]}>
      <Box
        size={[2.88, 1.8, 0.14]}
        color="#0b1017"
        position={[0, 0, -0.07]}
        metalness={0.4}
        roughness={0.22}
      />

      <Box
        size={[2.79, 1.71, 0.035]}
        color="#030508"
        position={[0, 0, 0.015]}
      />

      <mesh
        position={[0, 0, 0.037]}
        onClick={(event) => {
          event.stopPropagation();
          if (!active) onOpen();
        }}
      >
        <planeGeometry args={[2.58, 1.455]} />
        <meshBasicMaterial color="#101827" />
      </mesh>

      <mesh position={[0, -0.864, 0.023]}>
        <circleGeometry args={[0.018, 20]} />
        <meshBasicMaterial color={C.green} />
      </mesh>

      <Box
        size={[0.22, 0.38, 0.16]}
        color="#424b59"
        position={[0, -1.0, -0.02]}
      />

      <Box
        size={[1.08, 0.055, 0.58]}
        color="#303946"
        position={[0, -1.215, -0.025]}
      />

      <Html
        transform
        position={[0, 0, 0.048]}
        distanceFactor={1.6}
        occlude={false}
        style={{
          width: "1000px",
          height: "562px",
          pointerEvents: "auto",
        }}
      >
        <div
          className="ws-html-screen"
          onClick={(event) => event.stopPropagation()}
        >
          {!active ? (
            <button
              className="ws-startoverlay"
              type="button"
              onClick={onOpen}
              aria-label="Open the virtual desktop"
            >
              <img
                src="/susvg.svg"
                alt=""
                className="ws-startoverlay-logo"
              />

              <span className="ws-startoverlay-title">
                Sadaat Upgrade
              </span>

              <span className="ws-startoverlay-sub">
                Virtual Desktop
              </span>

              <span className="ws-startoverlay-btn">
                Click to start
              </span>
            </button>
          ) : (
            <Suspense
              fallback={
                <div className="ws-screen-loading">
                  Loading desktop…
                </div>
              }
            >
              <Desktop onClose={onClose} />
            </Suspense>
          )}
        </div>
      </Html>
    </group>
  );
}

/* ======================================================
   KEYBOARD
====================================================== */

function Keyboard({ onPhysicalKey }) {
  const keyRefs = useRef({});

  const dispatchKey = useCallback((label) => {
    if (["Win", "Alt", "Ctrl"].includes(label)) return;

    const keyMap = {
      Space: " ",
      "⌫": "Backspace",
      Esc: "Escape",
      Enter: "Enter",
      Tab: "Tab",
      Caps: "CapsLock",
    };

    const key = keyMap[label] || label;

    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        cancelable: true,
      })
    );

    window.dispatchEvent(
      new KeyboardEvent("keyup", {
        key,
        bubbles: true,
        cancelable: true,
      })
    );

    onPhysicalKey?.(key);
  }, [onPhysicalKey]);

  return (
    <InteractiveObject
      name="Keyboard"
      initialPosition={[-0.08, 1.72, 0.82]}
      deskY={1.72}
      heightOffset={0.08}
      floorThreshold={1.5}
    >
      <Box
        size={[2.75, 0.105, 0.94]}
        color="#10151d"
        roughness={0.32}
        metalness={0.22}
      />

      <Box
        size={[2.45, 0.012, 0.016]}
        color={C.green}
        position={[0, 0.055, -0.43]}
      />

      {KEY_ROWS.map((row, rowIndex) => {
        const widths = row.map((label) => {
          if (label === "Space") return 0.68;

          if (
            ["⌫", "Enter", "Shift", "Caps", "Tab", "Ctrl"].includes(label)
          ) {
            return 0.22;
          }

          return 0.145;
        });

        const total =
          widths.reduce((sum, width) => sum + width, 0) +
          (row.length - 1) * 0.022;

        let cursor = -total / 2;

        return row.map((label, keyIndex) => {
          const width = widths[keyIndex];
          const x = cursor + width / 2;

          cursor += width + 0.022;

          const special = [
            "Esc", "Enter", "Shift", "Ctrl", "⌫", "Space", "Tab",
          ].includes(label);

          const id = `${rowIndex}-${keyIndex}`;

          return (
            <group
              key={id}
              ref={(element) => {
                keyRefs.current[id] = element;
              }}
              position={[x, 0.062, -0.34 + rowIndex * 0.135]}
              onPointerDown={(event) => {
                event.stopPropagation();

                // Do not let key presses start a drag of the keyboard.
                dispatchKey(label);

                const group = keyRefs.current[id];

                if (group) {
                  group.scale.set(0.96, 0.82, 0.96);
                }
              }}
              onPointerUp={(event) => {
                event.stopPropagation();

                const group = keyRefs.current[id];

                if (group) {
                  group.scale.set(1, 1, 1);
                }
              }}
              onPointerCancel={() => {
                const group = keyRefs.current[id];

                if (group) {
                  group.scale.set(1, 1, 1);
                }
              }}
            >
              <Box
                size={[width, 0.045, 0.105]}
                color={special ? "#394653" : "#c6cdd5"}
                roughness={0.36}
              />

              <mesh position={[0, 0.024, 0]}>
                <boxGeometry args={[0.035, 0.002, 0.002]} />
                <meshBasicMaterial color={special ? C.green : "#444c56"} />
              </mesh>
            </group>
          );
        });
      })}
    </InteractiveObject>
  );
}

/* ======================================================
   MOUSE
====================================================== */

function Mouse() {
  return (
    <InteractiveObject
      name="Mouse"
      initialPosition={[1.58, 1.76, 0.77]}
      deskY={1.76}
      heightOffset={0.12}
    >
      <mesh castShadow>
        <capsuleGeometry args={[0.14, 0.25, 6, 16]} />
        <meshStandardMaterial color="#11161e" roughness={0.24} />
      </mesh>

      <mesh position={[0, 0.12, 0.055]}>
        <boxGeometry args={[0.035, 0.055, 0.045]} />
        <meshStandardMaterial color="#73808f" />
      </mesh>

      <mesh position={[0, 0.145, 0.015]}>
        <boxGeometry args={[0.012, 0.008, 0.16]} />
        <meshBasicMaterial color={C.green} />
      </mesh>
    </InteractiveObject>
  );
}

/* ======================================================
   DESK LAMP
====================================================== */

function DeskLamp({ roomLightOn }) {
  const [lampOn, setLampOn] = useState(roomLightOn);

  return (
    <InteractiveObject
      name="Desk lamp"
      initialPosition={[-1.42, 1.68, -0.7]}
      deskY={1.68}
      heightOffset={0.4}
    >
      <Cylinder
        args={[0.19, 0.23, 0.07, 32]}
        color="#34404d"
        metalness={0.8}
      />

      <Cylinder
        args={[0.035, 0.04, 0.54, 16]}
        color="#758392"
        position={[0, 0.29, 0]}
        metalness={0.8}
      />

      <mesh position={[0.12, 0.57, 0]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.03, 0.03, 0.38, 16]} />
        <meshStandardMaterial color="#758392" metalness={0.8} />
      </mesh>

      <mesh
        position={[0.29, 0.7, 0]}
        rotation={[0, 0, -0.8]}
        onClick={(event) => {
          event.stopPropagation();
          setLampOn((current) => !current);
        }}
      >
        <coneGeometry args={[0.2, 0.26, 32, 1, true]} />

        <meshStandardMaterial
          color="#35414e"
          side={THREE.DoubleSide}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0.31, 0.59, 0]}>
        <circleGeometry args={[0.13, 28]} />
        <meshBasicMaterial color={lampOn ? "#fff0c5" : "#303744"} />
      </mesh>

      {lampOn && (
        <pointLight
          position={[0.31, 0.55, 0.08]}
          color="#c8ffe7"
          intensity={2.5}
          distance={3}
        />
      )}
    </InteractiveObject>
  );
}

/* ======================================================
   SMALL DESK OBJECTS
====================================================== */

function Notebook() {
  return (
    <InteractiveObject
      name="Notebook"
      initialPosition={[2.08, 1.695, 0.63]}
      deskY={1.695}
      heightOffset={0.04}
    >
      <Box size={[0.62, 0.035, 0.78]} color="#2d654f" />

      <Box
        size={[0.54, 0.009, 0.68]}
        color="#dedbd0"
        position={[0, 0.022, 0]}
      />

      {[-0.18, -0.07, 0.04, 0.15].map((z) => (
        <Box
          key={z}
          size={[0.37, 0.003, 0.008]}
          color="#89949e"
          position={[0, 0.029, z]}
        />
      ))}
    </InteractiveObject>
  );
}

function Pen() {
  return (
    <InteractiveObject
      name="Pen"
      initialPosition={[1.78, 1.72, 0.72]}
      deskY={1.72}
      heightOffset={0.03}
    >
      <Cylinder
        args={[0.025, 0.025, 0.53, 12]}
        color="#718093"
        metalness={0.6}
      />

      <Cylinder
        args={[0.028, 0.028, 0.11, 12]}
        color={C.green}
        position={[0, 0.12, 0]}
      />
    </InteractiveObject>
  );
}

function Plant() {
  return (
    <InteractiveObject
      name="Desk plant"
      initialPosition={[-2.47, 1.72, 0.96]}
      deskY={1.72}
      heightOffset={0.3}
    >
      <Cylinder args={[0.18, 0.14, 0.25, 28]} color="#5b6875" />

      <Cylinder
        args={[0.145, 0.145, 0.015, 24]}
        color="#202a35"
        position={[0, 0.13, 0]}
      />

      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 5) * Math.PI * 2) * 0.1,
            0.34 + (i % 2) * 0.08,
            Math.cos((i / 5) * Math.PI * 2) * 0.1,
          ]}
          rotation={[0.25, 0, Math.sin(i) * 0.55]}
          castShadow
        >
          <coneGeometry args={[0.09, 0.35, 7]} />

          <meshStandardMaterial
            color={i % 2 ? "#16845e" : "#35b47f"}
          />
        </mesh>
      ))}
    </InteractiveObject>
  );
}

function CoffeeMug() {
  return (
    <InteractiveObject
      name="Coffee mug"
      initialPosition={[2.25, 1.82, -0.7]}
      deskY={1.82}
      heightOffset={0.13}
    >
      <Cylinder
        args={[0.14, 0.12, 0.25, 28]}
        color="#d7e0e8"
        roughness={0.28}
      />

      <Cylinder
        args={[0.105, 0.105, 0.008, 24]}
        color="#342a25"
        position={[0, 0.128, 0]}
      />

      <mesh
        position={[0.17, 0.02, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <torusGeometry args={[0.09, 0.022, 10, 24]} />
        <meshStandardMaterial color="#d7e0e8" roughness={0.3} />
      </mesh>
    </InteractiveObject>
  );
}

function WirelessCharger() {
  return (
    <InteractiveObject
      name="Wireless charger"
      initialPosition={[1.8, 1.69, -0.9]}
      deskY={1.69}
      heightOffset={0.025}
    >
      <Cylinder
        args={[0.24, 0.24, 0.035, 40]}
        color="#313c49"
        metalness={0.35}
      />

      <Cylinder
        args={[0.17, 0.17, 0.008, 32]}
        color={C.green}
        position={[0, 0.021, 0]}
      />
    </InteractiveObject>
  );
}

/* ======================================================
   CHAIR
====================================================== */

function Chair() {
  const [position, setPosition] = useState([0.05, 0, 2.55]);
  const [dragging, setDragging] = useState(false);
  const offset = useRef(new THREE.Vector3());
  const hit = useRef(new THREE.Vector3());
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    []
  );

  const { camera, gl, raycaster, invalidate } = useThree();
  const positionRef = useRef(position);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef(null);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const updateRay = useCallback((event) => {
    const rect = gl.domElement.getBoundingClientRect();

    if (!rect.width || !rect.height) return false;

    raycaster.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      ),
      camera
    );

    return true;
  }, [camera, gl, raycaster]);

  const stopChairDrag = useCallback((event) => {
    if (
      event?.pointerId !== undefined &&
      pointerIdRef.current !== null &&
      event.pointerId !== pointerIdRef.current
    ) {
      return;
    }

    event?.stopPropagation?.();

    try {
      if (
        event?.target?.hasPointerCapture?.(event.pointerId)
      ) {
        event.target.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore capture release errors.
    }

    draggingRef.current = false;
    pointerIdRef.current = null;
    setDragging(false);
    gl.domElement.style.cursor = "";
    invalidate();
  }, [gl, invalidate]);

  return (
    <group
      position={position}
      rotation={[0, Math.PI, 0]}
      onPointerDown={(event) => {
        if (event.button === 2 || draggingRef.current) return;

        event.stopPropagation();

        if (!updateRay(event)) return;

        if (raycaster.ray.intersectPlane(plane, hit.current)) {
          offset.current.set(
            positionRef.current[0] - hit.current.x,
            0,
            positionRef.current[2] - hit.current.z
          );

          draggingRef.current = true;
          pointerIdRef.current = event.pointerId;

          setDragging(true);
          gl.domElement.style.cursor = "grabbing";

          try {
            event.target.setPointerCapture(event.pointerId);
          } catch {
            // Capture is optional.
          }
        }
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current) return;

        if (
          pointerIdRef.current !== null &&
          event.pointerId !== pointerIdRef.current
        ) {
          return;
        }

        event.stopPropagation();

        if (!updateRay(event)) return;

        if (raycaster.ray.intersectPlane(plane, hit.current)) {
          const next = [
            THREE.MathUtils.clamp(
              hit.current.x + offset.current.x,
              -4.3,
              4.3
            ),
            0,
            THREE.MathUtils.clamp(
              hit.current.z + offset.current.z,
              -1.7,
              4.3
            ),
          ];

          positionRef.current = next;
          setPosition(next);
          invalidate();
        }
      }}
      onPointerUp={stopChairDrag}
      onPointerCancel={stopChairDrag}
      onLostPointerCapture={stopChairDrag}
      onContextMenu={(event) => {
        event.stopPropagation();
        setPosition([0.05, 0, 2.55]);
      }}
    >
      <Box
        size={[1.28, 1.42, 0.22]}
        color="#151e28"
        position={[0, 1.57, -0.43]}
      />

      <Box
        size={[1.02, 1.13, 0.035]}
        color="#263746"
        position={[0, 1.57, -0.3]}
      />

      <Box
        size={[0.025, 0.86, 0.012]}
        color={C.green}
        position={[0, 1.57, -0.275]}
      />

      <Box
        size={[1.32, 0.22, 1.12]}
        color="#202832"
        position={[0, 0.82, 0]}
      />

      <Cylinder
        args={[0.075, 0.11, 0.65, 24]}
        color="#596574"
        position={[0, 0.4, 0]}
        metalness={0.85}
      />

      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, (Math.PI * 2 * i) / 5, 0]}>
          <Box
            size={[0.09, 0.075, 0.72]}
            color="#434e5c"
            position={[0, 0.12, 0.4]}
          />

          <Cylinder
            args={[0.035, 0.035, 0.16, 16]}
            color="#657383"
            position={[0, 0.1, 0.69]}
            rotation={[0, 0, Math.PI / 2]}
          />

          <mesh
            position={[0, 0.085, 0.73]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.09, 0.09, 0.065, 24]} />
            <meshStandardMaterial color="#10151d" />
          </mesh>
        </group>
      ))}

      {[-0.68, 0.68].map((x) => (
        <group key={x} position={[x, 1.0, -0.02]}>
          <Box
            size={[0.075, 0.35, 0.075]}
            color="#414c59"
            position={[0, -0.1, 0]}
          />

          <Box
            size={[0.16, 0.075, 0.46]}
            color="#202832"
            position={[0, 0.08, 0.1]}
          />
        </group>
      ))}

      {/* <InteractionHint
        visible={dragging}
        label="Moving chair…"
        position={[0, 2.6, 0]}
      /> */}
    </group>
  );
}

/* ======================================================
   SLIPPERS
====================================================== */

function Slipper({ position, rotation = [0, 0, 0], color }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.115, 0.31, 6, 14]} />
        <meshStandardMaterial color="#252d37" roughness={0.95} />
      </mesh>

      <mesh position={[0, 0.14, 0.035]}>
        <boxGeometry args={[0.19, 0.065, 0.17]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      <Box
        size={[0.07, 0.008, 0.035]}
        color="#aab7c5"
        position={[0, 0.176, 0.035]}
      />
    </group>
  );
}

function Slippers() {
  return (
    <group>
      <Slipper
        position={[-1.48, 0.015, 2.02]}
        rotation={[0, -0.12, 0]}
        color="#687b8c"
      />

      <Slipper
        position={[-1.06, 0.015, 1.82]}
        rotation={[0, 0.72, -0.07]}
        color="#4d6474"
      />
    </group>
  );
}

/* ======================================================
   WASTE BIN
====================================================== */

function WasteBin() {
  return (
    <InteractiveObject
      name="Waste bin"
      initialPosition={[2.75, 0.37, 2.15]}
      deskY={0.37}
      floorY={0.37}
      floorThreshold={-100}
    >
      <Cylinder
        args={[0.27, 0.21, 0.7, 40]}
        color="#343e4a"
        metalness={0.45}
      />

      <Cylinder
        args={[0.29, 0.29, 0.055, 40]}
        color="#596574"
        position={[0, 0.36, 0]}
        metalness={0.68}
      />

      <Cylinder
        args={[0.235, 0.235, 0.012, 32]}
        color="#10151d"
        position={[0, 0.392, 0]}
      />
    </InteractiveObject>
  );
}

/* ======================================================
   CAMERA RIG

   Direct useFrame import; no ReactFrame/requireFrame shim.
====================================================== */

function CameraRig({ active, phoneSelected }) {
  const { camera, size, invalidate } = useThree();

  const targetRef = useRef(new THREE.Vector3(0, 1.9, 0.1));

  const initialPosition = useMemo(
    () => new THREE.Vector3(...INITIAL_CAMERA),
    []
  );

  const initialTarget = useMemo(
    () => new THREE.Vector3(0, 1.9, 0.1),
    []
  );

  const desktopPosition = useMemo(
    () => new THREE.Vector3(0, 3.0, 4.7),
    []
  );

  const desktopTarget = useMemo(
    () => new THREE.Vector3(0, 2.78, -0.55),
    []
  );

  const phonePosition = useMemo(
    () => new THREE.Vector3(0, 3.0, 5.4),
    []
  );

  const phoneTarget = useMemo(
    () => new THREE.Vector3(0, 2.5, 2.0),
    []
  );

  const desiredPosition = phoneSelected
    ? phonePosition
    : active
      ? desktopPosition
      : initialPosition;

  const desiredTarget = phoneSelected
    ? phoneTarget
    : active
      ? desktopTarget
      : initialTarget;

  useEffect(() => {
    // Adjust framing on mobile and after orientation changes.
    if (size.width < 640) {
      camera.fov = 43;
    } else {
      camera.fov = 36;
    }

    camera.aspect = size.width / Math.max(size.height, 1);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);

  useFrame((_, delta) => {
    const blend = 1 - Math.exp(-delta * 3.5);

    camera.position.lerp(desiredPosition, blend);
    targetRef.current.lerp(desiredTarget, blend);

    camera.lookAt(targetRef.current);

    if (
      camera.position.distanceTo(desiredPosition) > 0.01 ||
      targetRef.current.distanceTo(desiredTarget) > 0.01
    ) {
      invalidate();
    }
  });

  return null;
}

/* ======================================================
   COMPLETE SCENE
====================================================== */

function Scene({
  active,
  onOpen,
  onClose,
  roomLightOn,
  onToggleLight,
  phoneSelected,
  onPhoneOpen,
  onPhoneClose,
}) {
  return (
    <>
      <color
        attach="background"
        args={[roomLightOn ? "#17222d" : "#05070b"]}
      />

      <fog
        attach="fog"
        args={[roomLightOn ? "#17222d" : "#05070b", 17, 35]}
      />

      <ambientLight
        intensity={roomLightOn ? 0.72 : 0.2}
        color="#d4e4f5"
      />

      <hemisphereLight
        args={[
          roomLightOn ? "#dce8f5" : "#536078",
          "#11131a",
          roomLightOn ? 0.8 : 0.2,
        ]}
      />

      <directionalLight
        position={[6, 10, 7]}
        intensity={roomLightOn ? 1.8 : 0.35}
        color="#e3edff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <pointLight
        position={[-3, 3, -1.4]}
        color={C.green}
        intensity={roomLightOn ? 1.3 : 0.18}
        distance={8}
      />

      <pointLight
        position={[3.2, 2.8, 0]}
        color={C.blue}
        intensity={roomLightOn ? 0.9 : 0.12}
        distance={7}
      />

      <Environment preset="apartment" />

      <CameraRig
        active={active}
        phoneSelected={phoneSelected}
      />

      <Room roomLightOn={roomLightOn} />
      <Floor />
      <Desk />

      <CeilingLamp roomLightOn={roomLightOn} />

      <WallLightSwitch
        roomLightOn={roomLightOn}
        onToggle={onToggleLight}
      />

      <Monitor
        active={active}
        onOpen={onOpen}
        onClose={onClose}
      />

      <Case />
      <DeskLamp roomLightOn={roomLightOn} />
      <Keyboard />
      <Mouse />

      <Notebook />
      <Pen />
      <Plant />
      <CoffeeMug />
      <WirelessCharger />

      <Chair />
      <Slippers />
      <WasteBin />

      <ContactShadows
        position={[0, 0.008, 0]}
        opacity={roomLightOn ? 0.42 : 0.55}
        scale={15}
        blur={2.6}
        far={6}
      />
    </>
  );
}

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function Workstation() {
  const scope = useRef(null);
  const [active, setActive] = useState(false);
  const [roomLightOn, setRoomLightOn] = useState(true);
  const [phoneSelected, setPhoneSelected] = useState(false);

  useGSAP(() => reveals(scope.current), { scope });

  const openDesktop = useCallback(() => {
    setPhoneSelected(false);
    setActive(true);
  }, []);

  const closeDesktop = useCallback(() => {
    setActive(false);
  }, []);

  const toggleRoomLight = useCallback(() => {
    setRoomLightOn((current) => !current);
  }, []);

  const openPhone = useCallback(() => {
    setActive(false);
    setPhoneSelected(true);
  }, []);

  const closePhone = useCallback(() => {
    setPhoneSelected(false);
  }, []);

  return (
    <section
      className="workstation section__padding"
      id="workstation"
      ref={scope}
    >
      <div className="ws-heading">
        <p className="eyebrow" data-reveal>
          Interactive Workspace
        </p>

        <h2 data-split>
          A Virtual Computer You Can Actually Use
        </h2>

        <p className="ws-intro" data-reveal>
          Explore the room, move the desk accessories,
          switch the lights and open the virtual desktop.
        </p>
      </div>

      <div
        className={[
          "ws-stage",
          active ? "ws-stage--active" : "",
          phoneSelected ? "ws-stage--phone" : "",
        ].filter(Boolean).join(" ")}
      >
        <Canvas
          shadows
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{
            position: INITIAL_CAMERA,
            fov: 36,
            near: 0.1,
            far: 100,
          }}
          style={{
            touchAction: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;

            gl.domElement.style.touchAction = "none";
          }}
        >
          <Scene
            active={active}
            onOpen={openDesktop}
            onClose={closeDesktop}
            roomLightOn={roomLightOn}
            onToggleLight={toggleRoomLight}
            phoneSelected={phoneSelected}
            onPhoneOpen={openPhone}
            onPhoneClose={closePhone}
          />
        </Canvas>

        {active ? (
          <button
            className="ws-exit"
            type="button"
            onClick={closeDesktop}
          >
            Exit desktop <span aria-hidden="true">×</span>
          </button>
        ) : phoneSelected ? (
          <button
            className="ws-exit"
            type="button"
            onClick={closePhone}
          >
            Back to room <span aria-hidden="true">×</span>
          </button>
        ) : (
          <div className="ws-action-hints">
            <button
              className="ws-hint"
              type="button"
              onClick={openDesktop}
            >
              Click the monitor to enter{" "}
              <span aria-hidden="true">↗</span>
            </button>

            <span className="ws-hint-secondary">
              Drag objects · Right-click to rotate · Double-click to reset
            </span>

            <span className="ws-hint-mobile">
              Touch and drag objects · Tap the phone to inspect
            </span>
          </div>
        )}
      </div>

      <p className="sr-only">
        An interactive three-dimensional Sadaat Upgrade workstation.
        The scene includes a virtual desktop, movable accessories,
        a hanging lamp, a desk lamp, a movable chair.
      </p>
    </section>
  );
}
