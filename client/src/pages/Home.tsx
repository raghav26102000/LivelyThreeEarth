import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { Suspense } from "react";
import Scene from "@/components/Scene";
import Overlay from "@/components/Overlay";

export default function Home() {
  return (
    <div className="w-full h-screen bg-brand-light">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
        <color attach="background" args={["#F5F5F5"]} />
        <fog attach="fog" args={["#F5F5F5", 10, 25]} />
        <Suspense fallback={null}>
          <ScrollControls pages={8} damping={0.2}>
            <Scene />
            <Scroll html style={{ width: "100%", height: "100%" }}>
              <Overlay />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
