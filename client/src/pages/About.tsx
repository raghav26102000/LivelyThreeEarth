import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from 'three'; 

// --- PersonalizedDataHelix Component (Updated with Typescript Fix) ---
function PersonalizedDataHelix() {
  // FIX: Explicitly type the refs for TypeScript compatibility
  const helixRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Points>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // 1. Central Helix Data: Create points for the helix path
  const helixPoints = useMemo(() => {
    const points = [];
    const numPoints = 100;
    const radius = 0.5;
    const height = 3;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = i * 0.5; 
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = (i / numPoints) * height - (height / 2);
      points.push(x, y, z);
    }
    return new Float32Array(points);
  }, []);

  // 2. Outer Ring Data: Create points distributed in a wide circle/sphere
  // Increased point count and radius for a denser cloud
  const [ringPoints] = useState(() => random.inSphere(new Float32Array(4000), { radius: 3.5 }));
  
  // Animation loop
  useFrame((state, delta) => {
    // Rotation animation
    if (helixRef.current) helixRef.current.rotation.y += delta * 0.3;
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.5;
      ringRef.current.rotation.y -= delta * 0.4;
    }

    // Central light pulsing animation
    if (pointLightRef.current) {
      const time = state.clock.getElapsedTime();
      // Increased base intensity and pulse range
      pointLightRef.current.intensity = 3 + Math.sin(time * 2) * 2; 
    }
  });

  return (
    <group>
      {/* Central Intelligent Glow */}
      <pointLight 
        ref={pointLightRef} 
        position={[0, 0, 0]} 
        color="#FFD700" // Brighter Gold
        distance={10} // Increased light range
      />
      
      {/* 1. Central Helix (Data/DNA Structure) */}
      <Points ref={helixRef} positions={helixPoints} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#00E5FF" // Vivid Cyan
          size={0.15} // Much larger point size
          sizeAttenuation={true}
          depthWrite={false}
          // blending={THREE.AdditiveBlending}
          opacity={0.9}
        />
      </Points>

      {/* 2. Outer Ring (Nutrients/Community Data) */}
      <Points ref={ringRef} positions={ringPoints} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#66FF66" // Bright vibrant Green
          size={0.08} // Larger point size
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.7}
        />
      </Points>
      
      {/* Optional: Orbit controls for auto-rotation and interaction */}
      <OrbitControls 
        enableZoom={false} 
        autoRotate={true} 
        autoRotateSpeed={0.5} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 2} 
      />
    </group>
  );
}
// --- End PersonalizedDataHelix Component ---

// --- About Component (Updated with Enhanced Typography) ---
export default function About() {
  return (
    <div className="w-full min-h-screen bg-brand-light pt-24 px-6">
      {/* Increased height to h-[90vh] for more vertical space */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-[90vh]"> 
        {/* Text Content */}
        <div className="space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Section heading */}
            <h4 className="text-brand-leaf font-bold tracking-wider uppercase text-xl md:text-2xl mb-6"> 
              Our Vision
            </h4>
            {/* Main headline - similar size to section heading */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-deep leading-tight mb-6"> 
              One simple app for smarter fibre, protein, and micronutrients.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base md:text-lg text-brand-dark max-w-xl leading-relaxed" 
          >
            <span className="font-semibold text-brand-leaf">Citizen-science. Community-centric. Data-driven.</span> We are building a future where nutrition is intuitive and personalized.
          </motion.p>
        </div>

        {/* 3D Visualization */}
        <div className="h-[400px] w-full relative">
          <Canvas camera={{ position: [0, 0, 6.5] }}>
            <ambientLight intensity={0.5} /> 
            <Suspense fallback={null}>
              <PersonalizedDataHelix />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}