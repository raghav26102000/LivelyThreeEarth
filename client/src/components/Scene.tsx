import { useScroll } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

function PlantParticles() {
  const count = 200;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const { viewport } = useThree();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const scroll = useScroll();

  useFrame(() => {
    // Scene 1 & 4 interactions
    const scrollOffset = scroll.offset;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      // Rise up motion based on scroll
      const rise = scroll.range(0, 1) * 5; // Scene 1 rise
      const scatter = scroll.range(3, 1) * 2; // Scene 4 scatter

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10 + rise,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10 + (scatter * 10)
      );
      
      // Scale based on scroll - disappear in middle scenes
      const scaleFactor = 1 - scroll.curve(1/5, 2/5); 
      dummy.scale.setScalar(s * (scaleFactor > 0 ? scaleFactor : 0));
      
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#A2D39C" transparent opacity={0.8} />
    </instancedMesh>
  );
}

function Globe({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const scroll = useScroll();

  useFrame(() => {
    // Visible in Scene 2 and 4
    const visibleRange = scroll.range(1/5, 1/5); // Scene 2
    const fullRange = scroll.range(3/5, 1/5); // Scene 4
    
    // Spin
    mesh.current.rotation.y += 0.005;
    
    // Move based on scroll
    // Start at left in scene 2, center in scene 4
    const scrollPos = scroll.offset;
    
    if (scrollPos < 0.4) {
       // Scene 2: Left position
       const enter = scroll.curve(1/5, 1/5);
       mesh.current.scale.setScalar(enter * 1.5);
       mesh.current.position.x = -3 + (1-enter) * -5;
    } else if (scrollPos > 0.6 && scrollPos < 0.8) {
       // Scene 4: Full center
       const enter = scroll.curve(3/5, 1/5);
       mesh.current.scale.setScalar(1.5 + enter * 1.5);
       mesh.current.position.x = -3 + (enter * 3); // Move to center
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <icosahedronGeometry args={[1, 4]} />
      <meshStandardMaterial color="#1D5E3B" wireframe />
    </mesh>
  );
}

function Smartphone() {
  const group = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  useFrame(() => {
    // Visible in Scene 3 (approx 0.4 - 0.6)
    const visibility = scroll.curve(2/5, 1/5);
    
    group.current.visible = visibility > 0.01;
    group.current.scale.setScalar(visibility);
    
    group.current.rotation.y = Math.sin(scroll.offset * Math.PI * 2) * 0.2;
    group.current.rotation.x = 0.1;
  });

  return (
    <group ref={group} position={[2, 0, 0]}>
      {/* Phone Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 3, 0.2]} />
        <meshStandardMaterial color="#0E2F24" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[1.3, 2.8]} />
        <meshBasicMaterial color="#F5F5F5" />
      </mesh>
      {/* UI Elements Mockup */}
      <mesh position={[0, 0.5, 0.12]}>
        <planeGeometry args={[1, 0.5]} />
        <meshBasicMaterial color="#A2D39C" />
      </mesh>
      <mesh position={[0, -0.2, 0.12]}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="#1D5E3B" />
      </mesh>
       <mesh position={[0, -0.5, 0.12]}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="#1D5E3B" />
      </mesh>
    </group>
  );
}

function Background() {
  const scroll = useScroll();
  const bg = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    // Scene 5 gradient shift logic could go here or just use CSS for the footer background
    // But let's add a subtle ambient shift
    
  });

  return null;
}

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#A2D39C" />

      <PlantParticles />
      <Globe position={[-3, 0, 0]} />
      <Smartphone />
    </>
  );
}
