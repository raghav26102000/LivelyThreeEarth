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

// Create a proper leaf shape using a custom geometry
function LeafShape() {
  const shape = useMemo(() => {
    const leafShape = new THREE.Shape();
    
    // Create a realistic leaf shape
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.15, 0.3, 0.1, 0.6);
    leafShape.quadraticCurveTo(0.05, 0.8, 0, 1);
    leafShape.quadraticCurveTo(-0.05, 0.8, -0.1, 0.6);
    leafShape.quadraticCurveTo(-0.15, 0.3, 0, 0);
    
    const extrudeSettings = {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2
    };
    
    return new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
  }, []);
  
  return <primitive object={shape} />;
}

function Globe({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null!);
  const scroll = useScroll();
  const leafMeshes = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const leafData = useMemo(() => {
    const temp = [];
    const leafCount = 80; // Reduced for better performance and less clutter
    for (let i = 0; i < leafCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / leafCount);
      const theta = Math.sqrt(leafCount * Math.PI) * phi;
      
      temp.push({
        phi,
        theta,
        scale: 0.6 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        rotationOffset: Math.random() * Math.PI
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const scrollPos = scroll.offset;
    
    group.current.rotation.y += 0.003;
    
    if (scrollPos < 0.4) {
       const enter = scroll.curve(1/5, 1/5);
       group.current.scale.setScalar(enter * 1.5);
       group.current.position.x = -3 + (1-enter) * -5;
    } else if (scrollPos > 0.6 && scrollPos < 0.8) {
       const enter = scroll.curve(3/5, 1/5);
       group.current.scale.setScalar(1.5 + enter * 1.5);
       group.current.position.x = -3 + (enter * 3);
    }

    leafData.forEach((leaf, i) => {
      const time = state.clock.elapsedTime * 0.3;
      const wave = Math.sin(time + leaf.offset) * 0.08;
      const radius = 1.25 + wave;
      
      const x = radius * Math.sin(leaf.phi) * Math.cos(leaf.theta);
      const y = radius * Math.sin(leaf.phi) * Math.sin(leaf.theta);
      const z = radius * Math.cos(leaf.phi);
      
      dummy.position.set(x, y, z);
      
      // Make leaves point outward from center
      dummy.lookAt(x * 2, y * 2, z * 2);
      dummy.rotateZ(leaf.rotationOffset);
      
      dummy.scale.set(leaf.scale * 0.2, leaf.scale * 0.2, leaf.scale * 0.2);
      dummy.updateMatrix();
      
      leafMeshes.current.setMatrixAt(i, dummy.matrix);
    });
    leafMeshes.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group} position={position}>
      {/* Main Earth sphere */}
      <mesh>
        <sphereGeometry args={[1.15, 64, 64]} />
        <meshStandardMaterial 
          color="#0A1F17" 
          roughness={0.7} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Green continents layer */}
      <mesh>
        <sphereGeometry args={[1.16, 64, 64]} />
        <meshStandardMaterial 
          color="#1D4D32" 
          roughness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>
      
      {/* Leaves - using custom leaf geometry */}
      <instancedMesh ref={leafMeshes} args={[undefined, undefined, 80]}>
        <LeafShape />
        <meshStandardMaterial 
          color="#6FB583" 
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.1}
        />
      </instancedMesh>
      
      {/* Subtle atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
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

function Smartphone() {
  const group = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  useFrame((state) => {
    const visibility = scroll.curve(2/5, 1/5);
    
    group.current.visible = visibility > 0.01;
    group.current.scale.setScalar(visibility * 1.2);
    
    group.current.rotation.y = Math.sin(scroll.offset * Math.PI * 2) * 0.15;
    group.current.rotation.x = -0.1;
  });

  return (
    <group ref={group} position={[2.5, 0, 0]}>
      {/* Phone body with rounded corners simulation */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 2.9, 0.15]} />
        <meshStandardMaterial 
          color="#0A1612" 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Slight bezel */}
      <mesh position={[0, 0, 0.076]}>
        <planeGeometry args={[1.42, 2.92]} />
        <meshStandardMaterial color="#050A08" />
      </mesh>
      
      {/* Screen background */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1.3, 2.7]} />
        <meshStandardMaterial 
          color="#FAFFF8" 
          emissive="#FAFFF8"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Status bar */}
      <mesh position={[0, 1.25, 0.081]}>
        <planeGeometry args={[1.2, 0.15]} />
        <meshBasicMaterial color="#E8F5E9" />
      </mesh>
      
      {/* App header with gradient effect */}
      <mesh position={[0, 1.0, 0.082]}>
        <planeGeometry args={[1.2, 0.35]} />
        <meshBasicMaterial color="#81C784" />
      </mesh>
      
      {/* Plant tracking cards - cleaner design */}
      {[
        { pos: [-0.3, 0.45, 0.083], color: "#4CAF50", icon: "leaf" },
        { pos: [0.3, 0.45, 0.083], color: "#66BB6A", icon: "sprout" },
        { pos: [-0.3, -0.15, 0.083], color: "#43A047", icon: "tree" },
        { pos: [0.3, -0.15, 0.083], color: "#388E3C", icon: "flower" }
      ].map((card, idx) => (
        <group key={idx} position={card.pos as [number, number, number]}>
          {/* Card background */}
          <mesh>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          
          {/* Card border */}
          <mesh position={[0, 0, -0.001]}>
            <planeGeometry args={[0.52, 0.52]} />
            <meshBasicMaterial color="#E0E0E0" />
          </mesh>
          
          {/* Icon circle background */}
          <mesh position={[0, 0.08, 0.001]}>
            <circleGeometry args={[0.12, 32]} />
            <meshBasicMaterial color={card.color} />
          </mesh>
          
          {/* Simple plant icon representation */}
          {card.icon === "leaf" && (
            <>
              <mesh position={[-0.02, 0.08, 0.002]} rotation={[0, 0, 0.3]}>
                <planeGeometry args={[0.05, 0.08]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[0.01, 0.06, 0.002]}>
                <boxGeometry args={[0.008, 0.06, 0.001]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </>
          )}
          
          {card.icon === "sprout" && (
            <>
              <mesh position={[0, 0.05, 0.002]}>
                <boxGeometry args={[0.01, 0.08, 0.001]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[-0.02, 0.1, 0.002]}>
                <circleGeometry args={[0.02, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[0.02, 0.1, 0.002]}>
                <circleGeometry args={[0.02, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </>
          )}
          
          {card.icon === "tree" && (
            <>
              <mesh position={[0, 0.05, 0.002]}>
                <boxGeometry args={[0.015, 0.06, 0.001]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[0, 0.1, 0.002]}>
                <circleGeometry args={[0.04, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </>
          )}
          
          {card.icon === "flower" && (
            <>
              <mesh position={[0, 0.08, 0.002]}>
                <circleGeometry args={[0.015, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <mesh 
                  key={i}
                  position={[
                    Math.cos((i / 6) * Math.PI * 2) * 0.025,
                    0.08 + Math.sin((i / 6) * Math.PI * 2) * 0.025,
                    0.003
                  ]}
                >
                  <circleGeometry args={[0.012, 12]} />
                  <meshBasicMaterial color="#FFFFFF" />
                </mesh>
              ))}
            </>
          )}
          
          {/* Card text lines */}
          <mesh position={[0, -0.05, 0.001]}>
            <planeGeometry args={[0.35, 0.03]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          <mesh position={[0, -0.12, 0.001]}>
            <planeGeometry args={[0.25, 0.02]} />
            <meshBasicMaterial color="#999999" />
          </mesh>
        </group>
      ))}
      
      {/* Bottom action button */}
      <mesh position={[0, -0.85, 0.082]}>
        <planeGeometry args={[1.0, 0.3]} />
        <meshBasicMaterial color="#4CAF50" />
      </mesh>
      
      {/* Navigation dots */}
      <group position={[0, -1.15, 0.082]}>
        {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial 
              color={i === 0 ? "#4CAF50" : "#CCCCCC"} 
            />
          </mesh>
        ))}
      </group>
      
      {/* Camera notch */}
      <mesh position={[0, 1.38, 0.08]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#A2D39C" />
      <spotLight position={[0, 5, 5]} intensity={0.5} angle={0.3} penumbra={1} />

      <PlantParticles />
      <Globe position={[-3, 0, 0]} />
      <Smartphone />
    </>
  );
}