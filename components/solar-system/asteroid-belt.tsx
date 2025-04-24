import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AsteroidBeltProps {
  orbitDistance?: number;
  count?: number;
  isPaused?: boolean;
  beltWidth?: number;
  density?: number;
  color?: string;
  metallic?: boolean;
}

export default function AsteroidBelt({
  orbitDistance = 30,
  count = 200,
  isPaused = false,
  beltWidth = 4,
  density = 1.0,
  color = "#777777",
  metallic = false,
}: AsteroidBeltProps) {
  const mainBeltRef = useRef<THREE.Group>(null);
  const asteroidsRef = useRef<THREE.InstancedMesh>(null);

  // Create realistic asteroid distribution (with Kirkwood gaps)
  const matrices = useMemo(() => {
    const kirkwoodGaps = [2.06, 2.5, 2.82, 3.27]; // Actual Kirkwood gaps ratios
    const scaledGaps = kirkwoodGaps.map((gap) => gap * (orbitDistance / 2.8)); // Scale to our orbit

    return Array.from({ length: count }).map((_, i) => {
      const matrix = new THREE.Matrix4();

      // Use more realistic asteroid distribution
      const angle = Math.random() * Math.PI * 2;
      let radius: number;
      let inGap: boolean;
      do {
        // Generate candidate radius with density concentrated toward middle of belt
        radius = orbitDistance + (Math.random() * beltWidth * 2 - beltWidth);
        // Check if in a Kirkwood gap
        inGap = scaledGaps.some((gap) => Math.abs(radius - gap) < 0.3);
      } while (Math.random() > density || inGap);

      // Add slight inclination to the orbital plane
      const inclination = (Math.random() - 0.5) * 0.2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(inclination) * radius;
      const z = Math.sin(angle) * radius;

      matrix.setPosition(x, y, z);

      // Random rotation
      matrix.multiply(
        new THREE.Matrix4().makeRotationX(Math.random() * Math.PI)
      );
      matrix.multiply(
        new THREE.Matrix4().makeRotationY(Math.random() * Math.PI)
      );
      matrix.multiply(
        new THREE.Matrix4().makeRotationZ(Math.random() * Math.PI)
      );

      // Varied scale based on power law distribution (more small asteroids)
      const size = Math.pow(Math.random(), 2) * 1.2 + 0.3;
      matrix.multiply(new THREE.Matrix4().makeScale(size, size, size));

      return matrix;
    });
  }, [orbitDistance, count, beltWidth, density]);

  // Individual asteroid rotation and orbital speeds
  useFrame((state, delta) => {
    if (isPaused) return;

    if (mainBeltRef.current) {
      mainBeltRef.current.rotation.y += delta * 0.05;
    }

    if (asteroidsRef.current) {
      // Add subtle wobble to the whole belt
      const time = state.clock.getElapsedTime();
      mainBeltRef.current.rotation.x = Math.sin(time * 0.1) * 0.01;

      // Individual asteroid rotation can be added here
      // (would require a different approach than instancedMesh)
    }
  });

  // Create a material based on metallic property
  const asteroidMaterial = useMemo(() => {
    if (metallic) {
      return new THREE.MeshStandardMaterial({
        color,
        metalness: 0.8,
        roughness: 0.5,
        flatShading: true,
      });
    } else {
      return new THREE.MeshStandardMaterial({
        color,
        metalness: 0.1,
        roughness: 0.9,
        flatShading: true,
      });
    }
  }, [color, metallic]);

  return (
    <group ref={mainBeltRef}>
      {/* Belt background with slight tilt for realism */}
      <mesh rotation={[Math.PI / 2 + 0.02, 0, 0]}>
        <ringGeometry
          args={[orbitDistance - beltWidth, orbitDistance + beltWidth, 128]}
        />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Asteroids with improved geometry */}
      <instancedMesh
        ref={asteroidsRef}
        args={[undefined, undefined, count]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.5, 1]} />
        <primitive object={asteroidMaterial} />

        {matrices.map((matrix, i) => (
          <primitive key={i} object={matrix} attach={`instanceMatrix[${i}]`} />
        ))}
      </instancedMesh>
    </group>
  );
}
