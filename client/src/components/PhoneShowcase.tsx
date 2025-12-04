// PhoneShowcase.tsx

import React, { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { RoundedBox, OrbitControls } from "@react-three/drei";
import * as THREE from "three";



const screenUrls = [
  "/00 - Onboarding.png", 
  "/05 - Questionnaire.png",
  "/Health Score.png", 
  "/plants add.png",
  "/Spider Chart.png",  
];

type PhoneShowcaseProps = {
  className?: string;
};

// --- Custom Hook for Pointer/Idle Tilt (No changes needed) ---
function usePointerTilt(ref: any, factor = 0.06) {
  useFrame(({ mouse, clock }) => {
    if (!ref.current) return;
    const elapsed = clock.getElapsedTime();
    const targetRotY = -mouse.x * factor;
    const targetRotX = mouse.y * factor * 0.6;
    const idle = Math.sin(elapsed * 0.6) * 0.02;
    ref.current.rotation.x += (targetRotX + idle - ref.current.rotation.x) * 0.08;
    ref.current.rotation.y += (targetRotY - ref.current.rotation.y) * 0.08;
    ref.current.rotation.z += (Math.sin(elapsed * 0.2) * 0.005 - ref.current.rotation.z) * 0.04;
    ref.current.position.y += (Math.sin(elapsed * 0.6) * 0.02 - ref.current.position.y) * 0.04;
  });
}

// --- Phone 3D Model Component ---
function PhoneModel({ screenUrls }: { screenUrls: string[] }) {
  const group = useRef<any>();
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const currentScreenUrl = screenUrls[currentScreenIndex];

  usePointerTilt(group, 0.15); // Tilt hook

  // --- Screen Cycling Logic ---
  useEffect(() => {
    // Cycle to the next screen every 6000ms (6 seconds)
    const intervalId = setInterval(() => {
      setCurrentScreenIndex((prevIndex) => (prevIndex + 1) % screenUrls.length);
    }, 6000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [screenUrls.length]);
  
  // Load the current texture. This hook will automatically re-run 
  // when 'currentScreenUrl' changes.
  const texture = useLoader(THREE.TextureLoader, currentScreenUrl);
  
  // Ensure texture properties are set correctly
  useMemo(() => {
    if (texture) {
      // Set filtering for better texture display
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Define phone geometry dimensions (using your original values)
  const screenW = 0.56;
  const screenH = 1.18;
  const phoneThickness = 0.09;
  const phoneW = 0.64;
  const phoneH = 1.28;

  return (
    <group ref={group} position={[0, 0, 0]} rotation={[0, 0.15, 0]}>
      {/* Main phone body */}
      <RoundedBox 
        args={[phoneW, phoneH, phoneThickness]} 
        radius={0.08} 
        smoothness={10} 
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#0a0e12" 
          metalness={0.8} 
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </RoundedBox>

      {/* Side frame */}
      <RoundedBox
        args={[phoneW - 0.002, phoneH - 0.002, phoneThickness + 0.005]}
        radius={0.078}
        smoothness={10}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#1a1f26" 
          metalness={0.9} 
          roughness={0.1}
        />
      </RoundedBox>

      {/* SCREEN - mapped with the current texture */}
      <mesh position={[0, 0, phoneThickness / 2 + 0.01]} renderOrder={1000}>
        <planeGeometry args={[screenW, screenH]} />
        <meshBasicMaterial 
          map={texture}
          toneMapped={false}
        />
      </mesh>

      {/* Buttons (No changes) */}
      <mesh position={[phoneW / 2 + 0.002, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 0.01, 0.02]} />
        <meshStandardMaterial color="#1a1f26" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-phoneW / 2 - 0.002, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.06, 0.01, 0.02]} />
        <meshStandardMaterial color="#1a1f26" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-phoneW / 2 - 0.002, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.06, 0.01, 0.02]} />
        <meshStandardMaterial color="#1a1f26" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// --- Main Showcase Component ---
export default function PhoneShowcase({ className = "" }: PhoneShowcaseProps) {
  return (
    <div className={`hidden md:block ${className}`} aria-hidden style={{ pointerEvents: 'none' }}>
      <div style={{ width: 420, height: 640, position: "relative" }}>
        <Canvas
          shadows
          dpr={[2, 3]}
          camera={{ position: [0, 0, 2.8], fov: 28 }}
          style={{ pointerEvents: 'none' }}
          gl={{ 
            preserveDrawingBuffer: true, 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
         
          
          {/* Enhanced lighting for realism */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 8, 5]} 
            intensity={1.2} 
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-2}
            shadow-camera-right={2}
            shadow-camera-top={2}
            shadow-camera-bottom={-2}
          />
          <directionalLight position={[-3, 3, -3]} intensity={0.5} />
          <pointLight position={[0, 0, 4]} intensity={0.8} color="#ffffff" />
          
          {/* Rim light for depth */}
          <spotLight 
            position={[-2, 0, -2]} 
            intensity={0.6} 
            angle={0.5}
            penumbra={0.5}
            color="#4a90e2"
          />

          <Suspense fallback={null}>
            <PhoneModel screenUrls={screenUrls} /> 
          </Suspense>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false}
          />
        </Canvas>

        {/* Soft, realistic shadow */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          filter: "blur(60px)",
          background: "radial-gradient(ellipse 200px 250px at center, rgba(15,25,35,0.15) 0%, transparent 50%)",
          zIndex: -1,
          pointerEvents: 'none'
        }} />
      </div>
    </div>
  );
}