"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import SolarSystemScene from "@/components/solar-system/scene";
import SolarSystemControls from "@/components/solar-system/controls";

export default function SolarSystem() {
  const [orbitSpeed, setOrbitSpeed] = useState(0.1);
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  return (
    <div className="w-full h-screen">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 30, 80]} fov={50} />
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />

        <SolarSystemScene
          orbitSpeed={orbitSpeed}
          isPaused={isPaused}
          showLabels={showLabels}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={200}
        />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>

      <SolarSystemControls
        orbitSpeed={orbitSpeed}
        setOrbitSpeed={setOrbitSpeed}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
      />
    </div>
  );
}
