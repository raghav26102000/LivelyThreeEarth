import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, OrbitControls, Box } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as random from "maath/random/dist/maath-random.esm";
// FIX: Import THREE for blending constants
import * as THREE from 'three'; 

// --- PersonalizedDataHelix Component ---
function PersonalizedDataHelix() {
  const helixRef = useRef();
  const ringRef = useRef();
  const pointLightRef = useRef();

  // 1. Central Helix Data: Create points for the helix path
  const helixPoints = useMemo(() => {
    const points = [];
    const numPoints = 100;
    const radius = 0.5;
    const height = 3;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = i * 0.5; // Adjust for tighter/looser spiral
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = (i / numPoints) * height - (height / 2);
      points.push(x, y, z);
    }
    return new Float32Array(points);
  }, []);

  // 2. Outer Ring Data: Create points distributed in a wide circle/sphere
  const [ringPoints] = useState(() => random.inSphere(new Float32Array(3000), { radius: 3 }));
  
  // Animation loop
  useFrame((state, delta) => {
    // Animate the main helix rotation (slow, steady, structural)
    helixRef.current.rotation.y += delta * 0.3;
    
    // Animate the outer ring rotation (fast, dynamic, complex data flow)
    ringRef.current.rotation.x += delta * 0.5;
    ringRef.current.rotation.y -= delta * 0.4;

    // Animate the central light's intensity (pulsing personalization)
    const time = state.clock.getElapsedTime();
    pointLightRef.current.intensity = 2 + Math.sin(time * 2) * 1.5;
  });

  return (
    <group>
      {/* Central Intelligent Glow */}
      <pointLight 
        ref={pointLightRef} 
        position={[0, 0, 0]} 
        color="#FBC02D" // Gold/Yellow for intelligence/insights
        distance={5}
      />
      
      {/* 1. Central Helix (Data/DNA Structure) */}
      <Points ref={helixRef} positions={helixPoints} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#1E88E5" // Blue for Data/Technology
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* 2. Outer Ring (Nutrients/Community Data) */}
      <Points ref={ringRef} positions={ringPoints} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#4CAF50" // Green for Nutrition/Health
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Optional: Add orbit controls for user interaction (great for engagement) */}
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


export default function About() {
  return (
    <div className="w-full min-h-screen bg-brand-light pt-24 px-6">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-[80vh]">
        {/* Text Content */}
        <div className="space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h4 className="text-brand-leaf font-bold tracking-wider uppercase text-sm mb-4">
              Our Vision
            </h4>
            <h1 className="font-display text-5xl md:text-7xl text-brand-deep leading-tight">
              One simple app for smarter fibre, protein, and micronutrients.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-brand-dark/70 max-w-lg"
          >
            **Citizen-science. Community-centric. Data-driven.** We are building a future where nutrition is intuitive and personalized.
          </motion.p>
        </div>

        {/* 3D Visualization */}
        <div className="h-[500px] w-full relative">
          <Canvas camera={{ position: [0, 0, 5] }}>
            {/* Ambient light for subtle scene lighting */}
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

