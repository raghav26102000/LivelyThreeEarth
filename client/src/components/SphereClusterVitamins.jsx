// components/SphereClusterVitamins.jsx
"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

/* --- helpers --- */
function fibonacciSpherePoints(N, radius = 1) {
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    pts.push([x * radius, y * radius * 0.85, z * radius]); // slight vertical flattening
  }
  return pts;
}

function createPillTexture(label = "Ca") {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);

  // gradient palette - different labels will reuse similar palette
  const grd = ctx.createLinearGradient(0, 0, size, size);
  grd.addColorStop(0, "#ffd47a");
  grd.addColorStop(1, "#ff9b9b");
  ctx.fillStyle = grd;

  const pad = 36;
  const w = size - pad * 2;
  const h = size - pad * 2;
  const r = h / 2;

  ctx.beginPath();
  ctx.moveTo(pad + r, pad);
  ctx.arcTo(pad + w, pad, pad + w, pad + h, r);
  ctx.arcTo(pad + w, pad + h, pad, pad + h, r);
  ctx.arcTo(pad, pad + h, pad, pad, r);
  ctx.arcTo(pad, pad, pad + w, pad, r);
  ctx.closePath();
  ctx.fill();

  // subtle inner shine
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.ellipse(pad + w * 0.4, pad + h * 0.35, w * 0.45, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // label style
  ctx.fillStyle = "#111";
  ctx.font = "700 56px Sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, size / 2, size / 2 + 6);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* --- central lively three (Fiber, Protein, Micronutrients) --- */
function CentralLively({ scale = 1 }) {
  const ref = useRef();
  useFrame((st, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.18;
  });

  return (
    <group ref={ref} rotation={[0.08, 0.25, 0]}>
      {/* Left: Leaf (fiber / plant) */}
      <mesh position={[-0.95 * scale, 0, 0]} scale={0.62 * scale}>
        <latheGeometry args={[
          Array.from({ length: 12 }, (_, i) => {
            const t = i / 11;
            const x = Math.sin(t * Math.PI) * 0.9;
            const y = -1 + t * 2;
            return new THREE.Vector2(x * 0.25, y * 0.45);
          })
        ]} />
        <meshStandardMaterial color="#3dbb3d" metalness={0.08} roughness={0.38} />
      </mesh>

      {/* Center: Globe (micronutrients / data) */}
      <mesh position={[0, 0, 0]} scale={0.95 * scale}>
        <sphereGeometry args={[0.52, 48, 48]} />
        <meshStandardMaterial color="#7ab8ff" metalness={0.36} roughness={0.16} envMapIntensity={1} />
      </mesh>

      {/* Right: Protein icon (stylized pill/heart/energy) */}
      <mesh position={[0.95 * scale, 0, 0]} scale={0.68 * scale} rotation={[0, 0, -0.12]}>
        <shapeGeometry args={[
          (function () {
            const shape = new THREE.Shape();
            shape.moveTo(0, 0.35);
            shape.bezierCurveTo(0.0, 0.6, -0.35, 0.8, -0.5, 0.55);
            shape.bezierCurveTo(-0.8, 0.2, -0.2, -0.4, 0, -0.1);
            shape.bezierCurveTo(0.2, -0.4, 0.8, 0.2, 0.5, 0.55);
            shape.bezierCurveTo(0.35, 0.8, 0.0, 0.6, 0, 0.35);
            return shape;
          })()
        ]} />
        <meshStandardMaterial color="#ff6b9b" metalness={0.14} roughness={0.24} />
      </mesh>
    </group>
  );
}

/* --- vitamins / nutrients orbiting (instanced) --- */
function VitaminsOrbit({ count = 48, radius = 1.8, labels = ["Fib", "Pro", "Mic", "Ca", "D", "B12"] }) {
  const meshRef = useRef();
  const { scene } = useThree();

  const labelTextures = useMemo(() => labels.map((l) => createPillTexture(l)), [labels]);
  const positions = useMemo(() => fibonacciSpherePoints(count, radius), [count, radius]);

  useFrame((st) => {
    const t = st.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const p = positions[i];
      const bob = Math.sin(t * 0.8 + i) * 0.06;
      const x = p[0] * (1 + bob);
      const y = p[1] * (1 + Math.cos(t * 0.6 + i) * 0.03);
      const z = p[2] * (1 + bob);

      const dummy = new THREE.Object3D();
      dummy.position.set(x, y, z);
      dummy.lookAt(0, 0, 0);
      const s = 0.26 + (i % 5) * 0.035;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      if (meshRef.current) meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
    scene.rotation.y += 0.0022;
  });

  const materials = useMemo(() => labels.map((l, i) => new THREE.MeshBasicMaterial({ map: labelTextures[i % labelTextures.length], transparent: true })), [labelTextures, labels]);

  return (
    <group>
      {materials.map((mat, mi) => {
        const chunk = Math.ceil((count / materials.length));
        const start = mi * chunk;
        const end = Math.min(start + chunk, count);
        const subCount = end - start;
        return (
          <instancedMesh key={mi} ref={mi === 0 ? meshRef : null} args={[null, null, subCount]}>
            <planeGeometry args={[1, 0.6]} />
            <primitive object={mat} attach="material" />
          </instancedMesh>
        );
      })}
    </group>
  );
}

/* --- export wrapper with Canvas --- */
export default function SphereClusterVitamins({ width = "100%", height = 560 }) {
  useEffect(() => {}, []);

  return (
    <div style={{ width, height, position: "relative" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }} dpr={[1, 1.6]} shadows>
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 4]} intensity={1.0} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} />

        <React.Suspense fallback={null}>
          <Environment preset="studio" />

          {/* soft radial gradient background to make the cluster visible on any page */}
          <BackgroundGradientPlane />

          {/* central lively three (Lively Three: Fiber, Protein, Micronutrients) */}
          <group position={[0, 0, 0.2]}>
            <CentralLively scale={1.1} />
          </group>

          {/* nutrients orbiting - renamed labels to match app theme */}
          <VitaminsOrbit count={54} radius={1.9} labels={["Fib", "Pro", "Mic", "Ca", "D", "B12"]} />
        </React.Suspense>

        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

/* --- background plane for preview contrast --- */
function BackgroundGradientPlane() {
  const texRef = useRef();
  useEffect(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const grd = ctx.createRadialGradient(size/2, size/2, size*0.05, size/2, size/2, size*0.95);
    grd.addColorStop(0, "#ffffff");
    grd.addColorStop(1, "#f3f7fb");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    texRef.current = tex;

    return () => {
      if (texRef.current) texRef.current.dispose();
    };
  }, []);

  return (
    <mesh position={[0, 0, -2]} scale={[8, 4.5, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texRef.current} toneMapped={false} />
    </mesh>
  );
}
