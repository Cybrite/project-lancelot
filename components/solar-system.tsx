"use client";

import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import SolarSystemScene from "@/components/solar-system/scene";
import SolarSystemControls from "@/components/solar-system/controls";

export default function SolarSystem() {
  const [orbitSpeed, setOrbitSpeed] = useState(0.1);
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const controlsRef = useRef<any>(null);

  const handlePlanetFocus = (position: number[]) => {
    // Convert to tuple for type safety
    const safePosition: [number, number, number] = [
      position[0] || 0,
      position[1] || 0,
      position[2] || 0,
    ];
    setTargetPosition(safePosition);
    if (controlsRef.current) {
      controlsRef.current.target.set(...safePosition);
      controlsRef.current.update();
    }
  };

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
          onPlanetFocus={handlePlanetFocus}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={200}
          target={targetPosition}
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
        onResetView={() => handlePlanetFocus([0, 0, 0])}
      />
    </div>
  );
}
