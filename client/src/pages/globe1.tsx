'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Sparkles, 
  Float,
  PerspectiveCamera,
  Environment,
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Define high-quality colors
const Colors = {
    coreTeal: new THREE.Color('#0369a1'), // Deep Ocean Teal
    glowGreen: new THREE.Color('#34d399'), // Emerald Green
    accentGold: new THREE.Color('#fbbf24'), // Muted Gold Accent
    lightBlue: new THREE.Color('#a5f3fc'),
};

// --- 1. The Classy, Translucent Core ---
const PremiumCore = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    // Smooth, slow rotation for a classy look
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.0015;
  });

  return (
    <mesh ref={meshRef} scale={2}>
      <sphereGeometry args={[1, 128, 128]} />
      {/* High-quality standard material for depth and reflection */}
      <meshStandardMaterial
        color={Colors.coreTeal}
        emissive={Colors.glowGreen}
        emissiveIntensity={0.8}
        roughness={0.1}
        metalness={0.9} // High metalness for deep reflections
        transparent
        opacity={0.4} // Translucent for visibility of the internal light
        toneMapped={false}
      />
    </mesh>
  );
};

// --- 2. Thinner, Glowing DNA / Energy Strands ---
const ClassyHelix = ({ radius, speed, color, rotationOffset }: { radius: number; speed: number; color: string; rotationOffset: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * speed;
      groupRef.current.rotation.z = state.clock.getElapsedTime() * (speed * 0.5);
    }
  });

  return (
    <group ref={groupRef} rotation={rotationOffset}>
      {/* Reduced size for subtlety and high quality */}
      <mesh>
        <torusKnotGeometry args={[radius, 0.005, 128, 16, 2, 3]} /> {/* Very thin tube radius */}
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={5} // Maximize the glow for the Bloom effect
          roughness={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

// --- 3. Floating Premium Nutrient Crystals ---
const PremiumNutrients = () => {
  // Create fewer, larger, and more significant crystals
  const particles = useMemo(() => {
    return new Array(10).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      scale: Math.random() * 0.15 + 0.1, // Larger scale
    }));
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <Float key={i} speed={3} rotationIntensity={2.5} floatIntensity={3.5}>
          <mesh position={p.position}>
            {/* Using Icosahedron for a crisp, high-end crystal look */}
            <icosahedronGeometry args={[p.scale, 0]} /> 
            <meshStandardMaterial 
              color={i % 2 === 0 ? Colors.accentGold : Colors.glowGreen}
              emissive={i % 2 === 0 ? Colors.accentGold : Colors.glowGreen}
              emissiveIntensity={2}
              toneMapped={false}
              metalness={0.5}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

// --- 4. Brand Typography (No font prop to avoid load issues) ---
const BrandTitle = () => {
  return (
    <group position={[0, 0, 3]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          THE LIVELY THREE
          <meshStandardMaterial 
            color="white" 
            emissive="#ffffff" 
            emissiveIntensity={0.5} 
            toneMapped={false} 
          />
        </Text>
        <Text
          position={[0, -0.45, 0]}
          fontSize={0.1}
          color="#A7F3D0" 
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.4}
        >
          VITALITY • PURITY • GROWTH
        </Text>
      </Float>
    </group>
  );
};

// --- MAIN COMPONENT ---
export default function LivelyGlobeRefined() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Background Gradient Overlay for Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#000508] to-black z-0 pointer-events-none" />

      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        
        {/* Environment for high-quality reflection on the sphere */}
        <Environment preset="night" />

        {/* Scene Lighting for premium contrast */}
        <ambientLight intensity={0.1} color={Colors.lightBlue} /> 
        <pointLight position={[5, 3, 5]} intensity={1.5} color={Colors.lightBlue} /> {/* Key Light */}
        <pointLight position={[-5, -3, -5]} intensity={1.5} color={Colors.glowGreen} /> {/* Fill Light */}
        
        {/* --- Scene Elements --- */}
        <group>
            <PremiumCore />
            
            {/* Helix 1 (Green) */}
            <ClassyHelix radius={2.8} speed={0.2} color={Colors.glowGreen} rotationOffset={[0.5, 0, 0]} />
            {/* Helix 2 (Gold Accent) */}
            <ClassyHelix radius={3.2} speed={-0.15} color={Colors.accentGold} rotationOffset={[-0.5, 0.5, 0]} />

            <PremiumNutrients />
            <BrandTitle />

            {/* Subtle, soft particle aura */}
            <Sparkles 
                count={150} 
                scale={6} 
                size={1} 
                speed={0.2} 
                opacity={0.3} 
                color={Colors.lightBlue}
            />
        </group>

        {/* --- Post Processing for cinematic Bloom and Clarity --- */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.5} // Lower threshold for a softer, broader glow
            mipmapBlur 
            intensity={1.5} 
            radius={0.8}
          />
          <Noise opacity={0.01} />
          <Vignette eskil={false} offset={0.1} darkness={1.3} />
        </EffectComposer>

        {/* User Interaction and Auto-Rotation */}
        <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate={true}
            autoRotateSpeed={0.3} // Slower rotation is more classy
            minPolarAngle={Math.PI / 2 - 0.2}
            maxPolarAngle={Math.PI / 2 + 0.2}
        />
      </Canvas>
      
      <div className="absolute bottom-10 w-full text-center z-10 pointer-events-none">
        <span className="text-teal-500/30 text-sm uppercase tracking-[0.5em]">Experience Vitality</span>
      </div>
    </div>
  );
}