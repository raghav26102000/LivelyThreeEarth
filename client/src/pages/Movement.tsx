import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useState, useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";

function Stars(props: any) {
  const ref = useRef<any>();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#A2D39C"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Movement() {
  return (
    <div className="w-full min-h-screen bg-brand-dark text-brand-light pt-24 relative overflow-hidden">
      {/* Background Map Visualization */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <Stars />
          </Suspense>
        </Canvas>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20 mt-10"
        >
          <h1 className="font-display text-6xl md:text-8xl mb-6 text-white">The Movement</h1>
          <p className="text-xl text-brand-leaf/80 max-w-2xl mx-auto">
            Join a global network of citizen scientists redefining nutrition from the ground up.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { year: "Phase 1", title: "Launch Beta", desc: "Initial release to founding members." },
            { year: "Phase 2", title: "1,000 Users", desc: "Building the core dataset." },
            { year: "Phase 3", title: "Research", desc: "First publication of findings." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl"
            >
              <span className="text-brand-leaf font-mono text-sm mb-2 block">{item.year}</span>
              <h3 className="text-2xl font-display mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
