import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { createFallbackTexture } from "./utils";

interface MoonProps {
  moon: {
    id: string;
    name: string;
    color: string;
  };
  orbitDistance: number;
  orbitSpeed: number;
  size: number;
  texturePath: string;
  orbitColor: string;
  isPaused: boolean;
  showLabel: boolean;
}

export default function Moon({
  moon,
  orbitDistance,
  orbitSpeed,
  size,
  texturePath,
  orbitColor,
  isPaused,
  showLabel,
}: MoonProps) {
  const moonRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Line>(null);
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(Math.random() * 100);

  // Use texture loading with error handling
  interface TextureSuccessCallback {
    (loadedTexture: THREE.Texture): void;
  }

  interface TextureErrorCallback {
    (error: Error): THREE.Texture;
  }

  const texture = useTexture(texturePath);

  useFrame((state, delta) => {
    if (!isPaused) {
      setTime((time) => time + delta * orbitSpeed);
    }

    if (moonRef.current) {
      // Position using circular orbit
      moonRef.current.position.x = orbitDistance * Math.cos(time);
      moonRef.current.position.z = orbitDistance * Math.sin(time);

      // Rotate moon
      moonRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>

      <group ref={moonRef}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial map={texture} metalness={0.2} roughness={0.8} />

          {showLabel && (
            <Html position={[0, size + 0.5, 0]} center distanceFactor={15}>
              <div
                className="moon-tooltip"
                style={{ opacity: hovered ? 1 : 0.7 }}
              >
                {moon.name}
              </div>
            </Html>
          )}

          {hovered && (
            <mesh>
              <sphereGeometry args={[size + 0.05, 16, 16]} />
              <meshBasicMaterial
                color={moon.color}
                transparent
                opacity={0.2}
              />
            </mesh>
          )}
        </mesh>
      </group>
    </group>
  );
} 