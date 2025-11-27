'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';


// --- 1. THE EARTH COMPONENT (Rotation & Material) ---
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load textures
  const [colorMap, displacementMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth-moss.png', 
    '/textures/earth_displacement.png'  
  ]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={2.5} renderOrder={0}>
      <sphereGeometry args={[1, 128, 128]} /> 
      <meshStandardMaterial
        map={colorMap}
        displacementMap={displacementMap}
        displacementScale={0.2}
        roughness={0.8}
        metalness={0.1}
        color="#ffffff"
      />
    </mesh>
  );
}

// --- 2. THE BUTTERFLIES (MULTIPLE INSTANCES) ---
function SingleButterfly({ orbitSpeed, zOffset }: { orbitSpeed: number, zOffset: number }) {
    const ref = useRef<THREE.Mesh>(null);
    const texture = useLoader(THREE.TextureLoader, '/textures/butterfly.png');

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            const radius = 3.5 + zOffset;
            ref.current.position.x = Math.sin(t * orbitSpeed) * radius;
            ref.current.position.z = Math.cos(t * orbitSpeed) * radius;
            ref.current.position.y = Math.sin(t * (orbitSpeed * 2)) * 1.5;
            
            ref.current.rotation.y = -t * orbitSpeed - Math.PI / 2;
        }
    });

    return (
        <mesh ref={ref} renderOrder={2}>
            <planeGeometry args={[0.3, 0.3]} /> 
            <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} alphaTest={0.5} />
        </mesh>
    );
}

const butterflyConfigs = [
    { speed: 1.5, offset: 0 },
    { speed: 0.8, offset: 1.2 }, 
    { speed: 2.2, offset: 0.5 }, 
    { speed: 1.1, offset: -0.8 }, 
];

function Butterflies() {
    return (
        <group>
            {butterflyConfigs.map((config, index) => (
                <SingleButterfly 
                    key={index} 
                    orbitSpeed={config.speed} 
                    zOffset={config.offset} 
                />
            ))}
        </group>
    );
}

// --- 3. MAIN SCENE ---
export default function GlobeHero() {
  return (
    <div className="h-[600px] w-full bg-neutral-100 relative">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }} 
        gl={{ antialias: true }} 
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} color="#ffffff" /> 
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        {/* The Earth Ecosystem Group */}
        <group rotation={[0, 0, 0.2]}> 
          <Earth />
          <Butterflies />             
        </group>

        {/* Improved Magical Sparkles/Pollen Effect */}
        <Sparkles 
            count={200} 
            scale={7} 
            size={3} 
            speed={0.5} 
            opacity={0.6} 
            color="#ffeebb" 
        />
        
        {/* Post-Processing (Bloom for the dreamy glow) */}
        <EffectComposer enableNormalPass={false}>
            <Bloom 
                luminanceThreshold={0.5} 
                luminanceSmoothing={0.9} 
                intensity={1.5} 
            />
        </EffectComposer>
        
        {/* Controls */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}