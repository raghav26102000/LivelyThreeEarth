import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { Suspense } from "react";

function EarthModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[1, 32, 32]} scale={2}>
        <MeshDistortMaterial
          color="#A2D39C"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.4}
        />
      </Sphere>
    </Float>
  );
}

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
            Citizen-science. Community-centric. Data-driven. We are building a future where nutrition is intuitive and personalized.
          </motion.p>
        </div>

        {/* 3D Visualization */}
        <div className="h-[500px] w-full relative">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 5]} intensity={1} />
            <Suspense fallback={null}>
              <EarthModel />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
