import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

interface PlanetModelProps {
  texture: string;
  planetId: string;
}

export default function PlanetModel({ texture, planetId }: PlanetModelProps) {
  const planetTexture = useTexture(texture);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const isSaturn = planetId === "saturn";

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1; // Slow rotation effect
    }
  });

  return (
    <>
      {/* Add atmospheric glow effect */}
      <mesh>
        <sphereGeometry args={[4.2, 32, 32]} />
        <meshStandardMaterial
          color="#4488ff"
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial
          map={planetTexture}
          metalness={0.1}
          roughness={0.6}
          envMapIntensity={1.5}
        />

        {/* Saturn's rings in the detailed view */}
        {isSaturn && (
          <group rotation={[Math.PI / 2, 0, 0]}>
            {/* Inner ring */}
            <mesh>
              <ringGeometry args={[4.8, 6.8, 128]} />
              <meshStandardMaterial
                color="#f8e8c7"
                side={THREE.DoubleSide}
                transparent
                opacity={0.8}
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
            {/* Middle ring - more detailed for close-up view */}
            <mesh>
              <ringGeometry args={[6.8, 8.8, 128]} />
              <meshStandardMaterial
                color="#e0c194"
                side={THREE.DoubleSide}
                transparent
                opacity={0.7}
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
            {/* Outer ring */}
            <mesh>
              <ringGeometry args={[8.8, 10.8, 128]} />
              <meshStandardMaterial
                color="#d4b683"
                side={THREE.DoubleSide}
                transparent
                opacity={0.5}
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
          </group>
        )}
      </mesh>
    </>
  );
}
