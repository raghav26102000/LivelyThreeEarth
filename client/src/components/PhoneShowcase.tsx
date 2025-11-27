import React, { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { RoundedBox, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type PhoneShowcaseProps = {
  screenUrl?: string;
  className?: string;
};

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

// Create screen content
function createScreenCanvas() {
  const canvas = document.createElement('canvas');
  // Increase resolution for better quality (2x)
  canvas.width = 720;
  canvas.height = 1520;
  const ctx = canvas.getContext('2d', { 
    alpha: false,
    desynchronized: true,
    willReadFrequently: false
  });
  
  if (!ctx) return null;
  
  // Scale all drawing operations by 2x
  ctx.scale(2, 2);

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 0, 760);
  gradient.addColorStop(0, '#FEFFFC');
  gradient.addColorStop(1, '#F7FFF6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 360, 760);

  // Status bar
  ctx.fillStyle = '#7b8f82';
  ctx.font = '12px system-ui';
  ctx.fillText('3:22', 12, 20);
  ctx.fillText('76%', 320, 20);

  ctx.fillStyle = '#e45c58';
  ctx.beginPath();
  ctx.arc(310, 17, 3, 0, Math.PI * 2);
  ctx.fill();

  // Logo
  ctx.fillStyle = '#E6FAEA';
  ctx.fillRect(20, 48, 56, 56);
  ctx.fillStyle = '#2f7a3e';
  ctx.font = 'bold 20px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('TL', 48, 82);

  // Title
  ctx.fillStyle = '#194b31';
  ctx.font = 'bold 18px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('The Lively Three', 88, 68);
  ctx.fillStyle = '#5f836b';
  ctx.font = '12px system-ui';
  ctx.fillText('Smart nutrition, naturally', 88, 88);

  // Main card
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(18, 128, 324, 200);
  ctx.fillStyle = '#103824';
  ctx.font = 'bold 20px system-ui';
  ctx.fillText('Daily snapshot', 34, 158);
  ctx.fillStyle = '#486a53';
  ctx.font = '13px system-ui';
  ctx.fillText('Track fiber, protein & micronutrients', 34, 178);

  // Progress
  ctx.strokeStyle = '#edf7ee';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(60, 225, 22, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#5FBF6C';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(60, 225, 22, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * 0.45));
  ctx.stroke();

  ctx.fillStyle = '#194b31';
  ctx.font = 'bold 10px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('45%', 60, 228);

  ctx.fillStyle = '#244f36';
  ctx.font = 'bold 13px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('Fiber', 95, 218);
  ctx.fillStyle = '#5f7a66';
  ctx.font = '12px system-ui';
  ctx.fillText('25–35 g target', 95, 235);

  // Stats
  ctx.fillStyle = '#E8F7EA';
  ctx.fillRect(210, 200, 68, 38);
  ctx.fillStyle = '#2f7a3e';
  ctx.font = 'bold 14px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('+12g', 244, 224);

  ctx.fillStyle = '#fff8ec';
  ctx.fillRect(285, 200, 50, 38);
  ctx.fillStyle = '#c6872a';
  ctx.fillText('42%', 310, 224);

  // Button
  ctx.fillStyle = '#2F7A3E';
  ctx.fillRect(34, 270, 262, 44);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px system-ui';
  ctx.fillText('Log meal', 165, 297);

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#eef6ee';
  ctx.lineWidth = 1;
  ctx.fillRect(304, 270, 44, 44);
  ctx.stroke();
  ctx.fillStyle = '#2F7A3E';
  ctx.font = 'bold 20px system-ui';
  ctx.fillText('⋯', 326, 298);

  // Bottom cards
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(18, 348, 156, 90);
  ctx.fillRect(186, 348, 156, 90);

  ctx.fillStyle = '#5b7a64';
  ctx.font = 'bold 12px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('Community', 30, 368);
  ctx.fillStyle = '#254c2a';
  ctx.font = 'bold 13px system-ui';
  ctx.fillText('Challenges', 30, 392);

  ctx.fillStyle = '#7b8f82';
  ctx.font = 'bold 12px system-ui';
  ctx.fillText('Sustainability', 198, 368);
  ctx.fillStyle = '#254c2a';
  ctx.font = 'bold 13px system-ui';
  ctx.fillText('Footprint', 198, 392);

  // Nav bar
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 676, 360, 84);
  ctx.strokeStyle = 'rgba(10,20,12,0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 676);
  ctx.lineTo(360, 676);
  ctx.stroke();

  const navItems = [
    { x: 60, label: 'Home' },
    { x: 180, label: 'Log', highlight: true },
    { x: 300, label: 'Profile' }
  ];

  navItems.forEach(item => {
    ctx.fillStyle = item.highlight ? '#E6FAEA' : '#ffffff';
    ctx.fillRect(item.x - 18, 696, 36, 36);
    if (item.highlight) {
      ctx.fillStyle = '#2f7a3e';
      ctx.font = 'bold 20px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('+', item.x, 721);
    }
    ctx.fillStyle = '#587765';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, item.x, 750);
  });

  return canvas;
}

function PhoneModel() {
  const group = useRef<any>();
  const [dataUrl, setDataUrl] = useState<string>("");
  
  usePointerTilt(group);

  useEffect(() => {
    const canvas = createScreenCanvas();
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      console.log("📸 Created data URL, length:", url.length);
      setDataUrl(url);
    }
  }, []);

  // Load texture using TextureLoader
  const texture = useLoader(THREE.TextureLoader, dataUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  
  // Improve texture quality
  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16; // Maximum anisotropic filtering
      texture.needsUpdate = true;
      console.log("✅ Texture quality enhanced");
    }
  }, [texture]);

  const screenW = 0.54;
  const screenH = 1.07;
  const phoneThickness = 0.04;

  return (
    <group ref={group} position={[0, 0.02, 0]}>
      {/* Phone body */}
      <RoundedBox args={[0.62, 1.16, phoneThickness]} radius={0.06} smoothness={8} castShadow>
        <meshStandardMaterial color="#0f1720" metalness={0.2} roughness={0.35} />
      </RoundedBox>

      {/* Bezel */}
      <RoundedBox
        args={[0.58, 1.11, phoneThickness - 0.005]}
        radius={0.055}
        smoothness={8}
        position={[0, 0, phoneThickness / 2 + 0.001]}
      >
        <meshStandardMaterial color="#1f2937" metalness={0.3} roughness={0.4} />
      </RoundedBox>

      {/* Screen */}
      <mesh position={[0, 0, phoneThickness / 2 + 0.02]} renderOrder={1000}>
        <planeGeometry args={[screenW, screenH]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Camera notch */}
      <mesh position={[0, 0.51, phoneThickness / 2 + 0.025]} renderOrder={1001}>
        <boxGeometry args={[0.12, 0.02, 0.004]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
    </group>
  );
}

export default function PhoneShowcase({ screenUrl, className = "" }: PhoneShowcaseProps) {
  return (
    <div className={`hidden md:block ${className}`} aria-hidden style={{ pointerEvents: 'none' }}>
      <div style={{ width: 420, height: 640, position: "relative" }}>
        <Canvas
          shadows
          dpr={[2, 3]}
          camera={{ position: [0, 0, 2.4], fov: 30 }}
          style={{ pointerEvents: 'none' }}
          gl={{ 
            preserveDrawingBuffer: true, 
            antialias: true, 
            alpha: false,
            powerPreference: 'high-performance'
          }}
        >
          <color attach="background" args={["#F5F5F5"]} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[2, 5, 2]} intensity={1.0} castShadow />
          <directionalLight position={[-3, -2, -2]} intensity={0.6} />
          <directionalLight position={[0, 0, 5]} intensity={1.0} />

          <Suspense fallback={null}>
            <PhoneModel />
          </Suspense>

          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>

        <div style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: -26,
          width: 260,
          height: 60,
          borderRadius: 999,
          filter: "blur(36px)",
          background: "rgba(20,30,20,0.18)",
          zIndex: 0,
          pointerEvents: 'none'
        }} />
      </div>
    </div>
  );
}