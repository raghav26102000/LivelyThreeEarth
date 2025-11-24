import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Activity, Pill, Leaf, Database, ArrowRight } from "lucide-react";

/* --- 1. HELPERS --- */

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

  // Gradient palette 
  const grd = ctx.createLinearGradient(0, 0, size, size);
  grd.addColorStop(0, "#ffd47a");
  grd.addColorStop(1, "#ff9b9b");
  ctx.fillStyle = grd;

  const pad = 36;
  const w = size - pad * 2;
  const h = size - pad * 2;
  const r = h / 2;

  // Pill shape
  ctx.beginPath();
  ctx.moveTo(pad + r, pad);
  ctx.arcTo(pad + w, pad, pad + w, pad + h, r);
  ctx.arcTo(pad + w, pad + h, pad, pad + h, r);
  ctx.arcTo(pad, pad + h, pad, pad, r);
  ctx.arcTo(pad, pad, pad + w, pad, r);
  ctx.closePath();
  ctx.fill();

  // Subtle inner shine
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.ellipse(pad + w * 0.4, pad + h * 0.35, w * 0.45, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Label
  ctx.fillStyle = "#111";
  ctx.font = "700 56px Sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, size / 2, size / 2 + 6);

  const tex = new THREE.CanvasTexture(canvas);
  // tex.needsUpdate = true; // automatic in newer three versions usually
  return tex;
}

/* --- 2. 3D COMPONENTS --- */

function CentralLively({ scale = 1 }) {
  const ref = useRef();
  useFrame((st, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.18;
  });

  return (
    <group ref={ref} rotation={[0.08, 0.25, 0]}>
      {/* Left: Leaf (fiber / plant) */}
      <mesh position={[-0.95 * scale, 0, 0]} scale={0.62 * scale}>
        <latheGeometry
          args={[
            Array.from({ length: 12 }, (_, i) => {
              const t = i / 11;
              const x = Math.sin(t * Math.PI) * 0.9;
              const y = -1 + t * 2;
              return new THREE.Vector2(x * 0.25, y * 0.45);
            }),
          ]}
        />
        <meshStandardMaterial color="#3dbb3d" metalness={0.08} roughness={0.38} />
      </mesh>

      {/* Center: Globe (micronutrients / data) */}
      <mesh position={[0, 0, 0]} scale={0.95 * scale}>
        <sphereGeometry args={[0.52, 48, 48]} />
        <meshStandardMaterial
          color="#7ab8ff"
          metalness={0.36}
          roughness={0.16}
          envMapIntensity={1}
        />
      </mesh>

      {/* Right: Protein icon (stylized pill/heart/energy) */}
      <mesh position={[0.95 * scale, 0, 0]} scale={0.68 * scale} rotation={[0, 0, -0.12]}>
        <shapeGeometry
          args={[
            (function () {
              const shape = new THREE.Shape();
              shape.moveTo(0, 0.35);
              shape.bezierCurveTo(0.0, 0.6, -0.35, 0.8, -0.5, 0.55);
              shape.bezierCurveTo(-0.8, 0.2, -0.2, -0.4, 0, -0.1);
              shape.bezierCurveTo(0.2, -0.4, 0.8, 0.2, 0.5, 0.55);
              shape.bezierCurveTo(0.35, 0.8, 0.0, 0.6, 0, 0.35);
              return shape;
            })(),
          ]}
        />
        <meshStandardMaterial color="#ff6b9b" metalness={0.14} roughness={0.24} />
      </mesh>
    </group>
  );
}

function VitaminsOrbit({ count = 48, radius = 1.8, labels = ["Fib", "Pro", "Mic", "Ca", "D", "B12"] }) {
  // We use an array of refs to control multiple instanced meshes (one per label type)
  const meshRefs = useRef([]); 
  const { scene } = useThree();

  const labelTextures = useMemo(() => labels.map((l) => createPillTexture(l)), [labels]);
  const positions = useMemo(() => fibonacciSpherePoints(count, radius), [count, radius]);

  useFrame((st) => {
    const t = st.clock.elapsedTime;
    
    // Rotate the whole scene slightly
    // Note: Mutating scene.rotation directly is a bit risky in shared scenes, 
    // but works for this self-contained component.
    // Ideally, wrap everything in a <group> and rotate that.
    
    const chunk = Math.ceil(count / labels.length);

    for (let i = 0; i < count; i++) {
      const p = positions[i];
      
      // Calculate individual pill animation
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

      // Determine which instancedMesh (batch) this particle belongs to
      const batchIndex = Math.floor(i / chunk);
      const indexInBatch = i % chunk;

      if (meshRefs.current[batchIndex]) {
        meshRefs.current[batchIndex].setMatrixAt(indexInBatch, dummy.matrix);
      }
    }

    // Mark all batches as needing update
    meshRefs.current.forEach(mesh => {
        if (mesh) mesh.instanceMatrix.needsUpdate = true;
    });
  });

  const materials = useMemo(
    () =>
      labels.map(
        (l, i) =>
          new THREE.MeshBasicMaterial({
            map: labelTextures[i % labelTextures.length],
            transparent: true,
          })
      ),
    [labelTextures, labels]
  );

  return (
    <group rotation-y={0.5}>
      {/* We create one InstancedMesh per material type */}
      {materials.map((mat, mi) => {
        const chunk = Math.ceil(count / materials.length);
        const start = mi * chunk;
        const end = Math.min(start + chunk, count);
        const subCount = Math.max(0, end - start);
        
        if (subCount === 0) return null;

        return (
          <instancedMesh
            key={mi}
            ref={(el) => (meshRefs.current[mi] = el)}
            args={[null, null, subCount]}
          >
            <planeGeometry args={[1, 0.6]} />
            <primitive object={mat} attach="material" />
          </instancedMesh>
        );
      })}
    </group>
  );
}

function BackgroundGradientPlane() {
  const texRef = useRef();
  
  useEffect(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const grd = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.05,
      size / 2,
      size / 2,
      size * 0.95
    );
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
    <mesh position={[0, 0, -4]} scale={[12, 8, 1]}>
      <planeGeometry args={[1, 1]} />
      {/* Safely handle the texture ref */}
      {texRef.current && (
         <meshBasicMaterial map={texRef.current} toneMapped={false} />
      )}
    </mesh>
  );
}

/* --- 3. EXPORTED COMPONENT (The one you pasted) --- */

function SphereClusterVitamins({ width = "100%", height = 560 }) {
  return (
    <div style={{ width, height, position: "relative" }} className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-white">
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }} dpr={[1, 1.6]} shadows>
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 4]} intensity={1.0} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} />

        <React.Suspense fallback={null}>
          <Environment preset="studio" />

          <BackgroundGradientPlane />

          <group position={[0, 0, 0.2]}>
            <CentralLively scale={1.1} />
          </group>

          <VitaminsOrbit count={54} radius={1.9} labels={["Fib", "Pro", "Mic", "Ca", "D", "B12"]} />
        </React.Suspense>

        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      
      {/* Overlay Text for Demo purposes */}
      <div className="absolute bottom-6 left-6 pointer-events-none select-none">
          <h3 className="text-slate-900 font-bold text-lg">Nutrient Matrix</h3>
          <p className="text-slate-500 text-sm">Real-time bioavailability</p>
      </div>
    </div>
  );
}

/* --- 4. PAGE LAYOUT (MOCKING globe.tsx) --- */

export default function GlobePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
                <span className="font-bold text-xl tracking-tight">VitaGlobe</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <a href="#" className="hover:text-blue-600 transition-colors">Dashboard</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Analysis</a>
                <a href="#" className="text-blue-600">Globe View</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Settings</a>
            </div>
            <div className="flex items-center gap-4">
                <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                    <div className="w-4 h-4 bg-slate-400 rounded-full" />
                </button>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Context/Stats */}
            <div className="lg:col-span-4 space-y-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                        Your Personal<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">
                            Health Ecosystem
                        </span>
                    </h1>
                    <p className="text-slate-600 leading-relaxed">
                        Visualize your daily intake across three primary dimensions: Fiber, Protein, and Micronutrients. Your sphere is currently balanced.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Leaf size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500">Plant Fiber</div>
                            <div className="text-xl font-bold text-slate-900">24g <span className="text-xs font-normal text-slate-400">/ 30g</span></div>
                        </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-pink-100 text-pink-600 rounded-lg">
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500">Protein Synthesis</div>
                            <div className="text-xl font-bold text-slate-900">92% <span className="text-xs font-normal text-slate-400">Efficiency</span></div>
                        </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Pill size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500">Active Supplements</div>
                            <div className="text-xl font-bold text-slate-900">4 <span className="text-xs font-normal text-slate-400">Items</span></div>
                        </div>
                    </div>
                </div>

                <button className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
                    View detailed report <ArrowRight size={16} />
                </button>
            </div>

            {/* Right Column: The Component */}
            <div className="lg:col-span-8">
                {/* This is where we call your component. 
                    I gave it a fixed height via the component props, 
                    but the wrapper controls the width.
                */}
                <div className="relative">
                     {/* Decorative background blob */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    
                    <SphereClusterVitamins height={600} />
                    
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-2">
                        <span>Render: Three.js / R3F</span>
                        <span>Update Rate: 60fps</span>
                    </div>
                </div>
            </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-20 pt-10 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-blue-300 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <Database size={16} />
                            </div>
                            <span className="text-xs text-slate-400">2h ago</span>
                        </div>
                        <div>
                            <div className="font-medium text-slate-900">Data Point {i}</div>
                            <div className="text-sm text-slate-500">Micronutrient levels calibrated.</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}