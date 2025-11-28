import { useScroll } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useThree, useFrame, useLoader } from "@react-three/fiber";

const noise3D = (x: number, y: number, z: number) => {
    return (Math.sin(x * 100) + Math.cos(y * 100) + Math.sin(z * 100) + 3) / 6; 
};

// --- PlantParticles Component ---
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
    const scrollOffset = scroll.offset;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      const rise = scroll.range(0, 1) * 5;
      const scatter = scroll.range(3, 1) * 2;

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10 + rise,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10 + (scatter * 10)
      );
      
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

// --- Butterflies Component ---
function SingleButterfly({ orbitSpeed, zOffset, parentRef }: { orbitSpeed: number, zOffset: number, parentRef: React.RefObject<THREE.Group> }) {
    const ref = useRef<THREE.Mesh>(null);
    
    // Create a simple butterfly texture using canvas
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        
        // Draw butterfly shape
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(44, 64, 20, 30, 0, 0, Math.PI * 2);
        ctx.ellipse(84, 64, 20, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(60, 40, 8, 48);
        
        return new THREE.CanvasTexture(canvas);
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current && parentRef.current) {
            const radius = 3.5 + zOffset;
            const localX = Math.sin(t * orbitSpeed) * radius;
            const localZ = Math.cos(t * orbitSpeed) * radius;
            const localY = Math.sin(t * (orbitSpeed * 2)) * 1.5;
            
            // Convert to parent's local space
            ref.current.position.set(localX, localY, localZ);
            ref.current.rotation.y = -t * orbitSpeed - Math.PI / 2;
        }
    });

    return (
        <mesh ref={ref}>
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

// --- NEW GLOBE Component (Integrated with scroll animations) ---
function Globe({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null!);
  const earthRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Load textures with error handling
  const [colorMap, displacementMap] = useMemo(() => {
    try {
      return [
        new THREE.TextureLoader().load('/textures/earth-moss.png'),
        new THREE.TextureLoader().load('/textures/earth_displacement.png')
      ];
    } catch {
      // Return null if textures fail to load
      return [null, null];
    }
  }, []);

  useFrame((state) => {
    const scrollPos = scroll.offset;
    
    // Existing scroll transitions
    if (scrollPos < 0.4) {
        const enter = scroll.curve(1/5, 1/5);
        group.current.scale.setScalar(enter * 1.5);
        group.current.position.x = -3 + (1-enter) * -5;
    } else if (scrollPos > 0.6 && scrollPos < 0.8) {
        const enter = scroll.curve(3/5, 1/5);
        group.current.scale.setScalar(1.5 + enter * 1.5);
        group.current.position.x = -3 + (enter * 3);
    }

    // Rotate the earth
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Main Earth with texture */}
      <mesh ref={earthRef} scale={1.0}>
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

      {/* Butterflies orbiting the globe */}
      <group rotation={[0, 0, 0.2]} scale={0.4}>
        {butterflyConfigs.map((config, index) => (
          <SingleButterfly 
            key={index} 
            orbitSpeed={config.speed} 
            zOffset={config.offset}
            parentRef={group}
          />
        ))}
      </group>
      
      {/* Subtle atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial 
          color="#A2D39C" 
          transparent 
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// --- Smartphone Component ---
// function Smartphone() {
//   const group = useRef<THREE.Group>(null!);
//   const scroll = useScroll();

//   useFrame((state) => {
//     const visibility = scroll.curve(2/5, 1/5);
    
//     group.current.visible = visibility > 0.01;
//     group.current.scale.setScalar(visibility * 1.2);
    
//     group.current.rotation.y = Math.sin(scroll.offset * Math.PI * 2) * 0.15;
//     group.current.rotation.x = -0.1;
//   });

//   return (
//     <group ref={group} position={[2.5, 0, 0]}>
//       <mesh position={[0, 0, 0]} castShadow>
//         <boxGeometry args={[1.4, 2.9, 0.15]} />
//         <meshStandardMaterial 
//           color="#0A1612" 
//           roughness={0.2} 
//           metalness={0.8}
//         />
//       </mesh>
      
//       <mesh position={[0, 0, 0.076]}>
//         <planeGeometry args={[1.42, 2.92]} />
//         <meshStandardMaterial color="#050A08" />
//       </mesh>
      
//       <mesh position={[0, 0, 0.08]}>
//         <planeGeometry args={[1.3, 2.7]} />
//         <meshStandardMaterial 
//           color="#FAFFF8" 
//           emissive="#FAFFF8"
//           emissiveIntensity={0.2}
//         />
//       </mesh>
      
//       <mesh position={[0, 1.25, 0.081]}>
//         <planeGeometry args={[1.2, 0.15]} />
//         <meshBasicMaterial color="#E8F5E9" />
//       </mesh>
      
//       <mesh position={[0, 1.0, 0.082]}>
//         <planeGeometry args={[1.2, 0.35]} />
//         <meshBasicMaterial color="#81C784" />
//       </mesh>
      
//       {[
//         { pos: [-0.3, 0.45, 0.083], color: "#4CAF50", icon: "leaf" },
//         { pos: [0.3, 0.45, 0.083], color: "#66BB6A", icon: "sprout" },
//         { pos: [-0.3, -0.15, 0.083], color: "#43A047", icon: "tree" },
//         { pos: [0.3, -0.15, 0.083], color: "#388E3C", icon: "flower" }
//       ].map((card, idx) => (
//         <group key={idx} position={card.pos as [number, number, number]}>
//           <mesh>
//             <planeGeometry args={[0.5, 0.5]} />
//             <meshBasicMaterial color="#FFFFFF" />
//           </mesh>
          
//           <mesh position={[0, 0, -0.001]}>
//             <planeGeometry args={[0.52, 0.52]} />
//             <meshBasicMaterial color="#E0E0E0" />
//           </mesh>
          
//           <mesh position={[0, 0.08, 0.001]}>
//             <circleGeometry args={[0.12, 32]} />
//             <meshBasicMaterial color={card.color} />
//           </mesh>
          
//           {card.icon === "leaf" && (
//             <>
//               <mesh position={[-0.02, 0.08, 0.002]} rotation={[0, 0, 0.3]}>
//                 <planeGeometry args={[0.05, 0.08]} />
//                 <meshBasicMaterial color="#FFFFFF" />
//               </mesh>
//               <mesh position={[0.01, 0.06, 0.002]}>
//                 <boxGeometry args={[0.008, 0.06, 0.001]} />
//                 <meshBasicMaterial color="#FFFFFF" />
//               </mesh>
//             </>
//           )}
          
//           {card.icon === "sprout" && (
//             <>
//               <mesh position={[0, 0.05, 0.002]}>
//                 <boxGeometry args={[0.01, 0.08, 0.001]} />
//                 <meshBasicMaterial color="#FFFFFF" />
//               </mesh>
//               <mesh position={[-0.02, 0.1, 0.002]}>
//                 <circleGeometry args={[0.02, 16]} />
//                 <meshBasicMaterial color="#FFFFFF" />
//               </mesh>
//               <mesh position={[0.02, 0.1, 0.002]}>
//                 <circleGeometry args={[0.02, 16]} />
//                 <meshBasicMaterial color="#FFFFFF" />
//               </mesh>
//             </>
//           )}
          
//           {card.icon === "tree" && (
//             <>
//               <mesh position={[0, 0.05, 0.002]}>
//                 <boxGeometry args={[0.015, 0.06, 0.001]} />
//                 <meshBasicMaterial color="#FFFFFF" />
//               </mesh>
//               <mesh position={[0, 0.1, 0.002]}>
//                 <circleGeometry args={[0.04, 16]} />
//                 <meshBasicMaterial color="#FFFFFF" />
//               </mesh>
//             </>
//           )}
          
//           {card.icon === "flower" && (
//             <>
//               <mesh position={[0, 0.08, 0.002]}>
//                 <circleGeometry args={[0.015, 16]} />
//                 <meshBasicMaterial color="#FFFFFF" />
//               </mesh>
//               {[0, 1, 2, 3, 4, 5].map((i) => (
//                 <mesh 
//                   key={i}
//                   position={[
//                     Math.cos((i / 6) * Math.PI * 2) * 0.025,
//                     0.08 + Math.sin((i / 6) * Math.PI * 2) * 0.025,
//                     0.003
//                   ]}
//                 >
//                   <circleGeometry args={[0.012, 12]} />
//                   <meshBasicMaterial color="#FFFFFF" />
//                 </mesh>
//               ))}
//             </>
//           )}
          
//           <mesh position={[0, -0.05, 0.001]}>
//             <planeGeometry args={[0.35, 0.03]} />
//             <meshBasicMaterial color="#333333" />
//           </mesh>
//           <mesh position={[0, -0.12, 0.001]}>
//             <planeGeometry args={[0.25, 0.02]} />
//             <meshBasicMaterial color="#999999" />
//           </mesh>
//         </group>
//       ))}
      
//       <mesh position={[0, -0.85, 0.082]}>
//         <planeGeometry args={[1.0, 0.3]} />
//         <meshBasicMaterial color="#4CAF50" />
//       </mesh>
      
//       <group position={[0, -1.15, 0.082]}>
//         {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
//           <mesh key={i} position={[x, 0, 0]}>
//             <circleGeometry args={[0.02, 16]} />
//             <meshBasicMaterial 
//               color={i === 0 ? "#4CAF50" : "#CCCCCC"} 
//             />
//           </mesh>
//         ))}
//       </group>
      
//       <mesh position={[0, 1.38, 0.08]}>
//         <circleGeometry args={[0.03, 16]} />
//         <meshBasicMaterial color="#000000" />
//       </mesh>
//     </group>
//   );
// }

// --- Scene Component (Main Export) ---
export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#A2D39C" />
      <spotLight position={[0, 5, 5]} intensity={0.5} angle={0.3} penumbra={1} />

      <PlantParticles />
      <Globe position={[-3, 0, 0]} />
      
    </>
  );
}