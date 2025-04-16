import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  createFallbackTexture,
  calculateOrbitParameters,
  createOrbitPath,
} from "./utils";

interface PlanetProps {
  planet: {
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
  onClick: () => void;
}

export default function Planet({
  planet,
  orbitDistance,
  orbitSpeed,
  size,
  texturePath,
  orbitColor,
  isPaused,
  showLabel,
  onClick,
}: PlanetProps) {
  const planetRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Line>(null);

  // Get eccentricity based on planet id
  const eccentricity =
    planet.id === "mercury"
      ? 0.21
      : planet.id === "venus"
      ? 0.01
      : planet.id === "earth"
      ? 0.017
      : planet.id === "mars"
      ? 0.09
      : planet.id === "jupiter"
      ? 0.05
      : planet.id === "saturn"
      ? 0.06
      : planet.id === "uranus"
      ? 0.05
      : planet.id === "neptune"
      ? 0.01
      : 0.1;

  // Calculate orbit parameters
  const { semiMajorAxis, semiMinorAxis, focalDistance } =
    calculateOrbitParameters(orbitDistance, eccentricity);

  // Use texture loading with error handling
  interface TextureSuccessCallback {
    (loadedTexture: THREE.Texture): void;
  }

  interface TextureErrorCallback {
    (error: Error): THREE.Texture;
  }

  const texture = useTexture(
    texturePath,
    ((loadedTexture: THREE.Texture): void => {
      console.log(`Loaded texture: ${texturePath}`);
    }) as TextureSuccessCallback,
    ((error: Error): THREE.Texture => {
      console.error(`Error loading texture ${texturePath}:`, error);
      return createFallbackTexture(planet.color);
    }) as TextureErrorCallback
  );

  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(Math.random() * 100);

  // Create orbit path
  const orbitPath = useMemo(
    () => createOrbitPath(semiMajorAxis, semiMinorAxis, focalDistance),
    [semiMajorAxis, semiMinorAxis, focalDistance]
  );

  useFrame((state, delta) => {
    if (!isPaused) {
      setTime((time) => time + delta * orbitSpeed);
    }

    if (planetRef.current) {
      // Position using ellipse formula with Sun at one focus
      planetRef.current.position.x =
        -focalDistance + semiMajorAxis * Math.cos(time);
      planetRef.current.position.z = semiMinorAxis * Math.sin(time);

      // Rotate planet
      planetRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      {/* Orbit path */}
      <lineSegments ref={orbitRef}>
        <bufferGeometry attach="geometry" {...orbitPath} />
        <lineBasicMaterial
          attach="material"
          color={orbitColor}
          opacity={0.3}
          transparent
          linewidth={1}
        />
      </lineSegments>

      {/* Planet */}
      <group ref={planetRef}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={texture} metalness={0.2} roughness={0.8} />

          {/* Saturn's Rings - only render if the planet is Saturn */}
          {planet.id === "saturn" && (
            <group rotation={[Math.PI / 2.5, 0, 0]}>
              {/* Inner ring */}
              <mesh>
                <ringGeometry args={[size * 1.2, size * 1.7, 64]} />
                <meshStandardMaterial
                  color="#f8e8c7"
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              {/* Middle ring - slightly different color */}
              <mesh>
                <ringGeometry args={[size * 1.7, size * 2.2, 64]} />
                <meshStandardMaterial
                  color="#e0c194"
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.7}
                />
              </mesh>
              {/* Outer ring - more transparent */}
              <mesh>
                <ringGeometry args={[size * 2.2, size * 2.7, 64]} />
                <meshStandardMaterial
                  color="#d4b683"
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </group>
          )}

          {/* Planet label */}
          {showLabel && (
            <Html position={[0, size + 1, 0]} center distanceFactor={10}>
              <div
                className="planet-tooltip"
                style={{ opacity: hovered ? 1 : 0.7 }}
              >
                {planet.name}
              </div>
            </Html>
          )}

          {/* Hover effect */}
          {hovered && (
            <mesh>
              <sphereGeometry args={[size + 0.1, 32, 32]} />
              <meshBasicMaterial
                color={planet.color}
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
