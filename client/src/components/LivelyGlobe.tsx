'use client';
import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';

export default function TestCube() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        {/* If this renders, R3F is working. */}
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="hotpink" />
        </Box>
        <OrbitControls />
      </Canvas>
    </div>
  );
}