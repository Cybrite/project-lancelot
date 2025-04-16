import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AsteroidBeltProps {
  orbitDistance?: number;
  count?: number;
  isPaused?: boolean;
}

export default function AsteroidBelt({ 
  orbitDistance = 30, 
  count = 100, 
  isPaused = false 
}: AsteroidBeltProps) {
  const mainBeltRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!isPaused && mainBeltRef.current) {
      mainBeltRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={mainBeltRef}>
      {/* Create a visible ring to mark the asteroid belt */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitDistance - 2, orbitDistance + 2, 64]} />
        <meshBasicMaterial
          color="#444444"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Use instanced meshes for better performance */}
      <instancedMesh args={[undefined, undefined, count]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#999999" />
        {Array.from({ length: count }).map((_, i) => {
          // Calculate position for each asteroid
          const angle = Math.random() * Math.PI * 2;
          const distance = orbitDistance + (Math.random() * 8 - 4);
          const x = Math.cos(angle) * distance;
          const y = (Math.random() - 0.5) * 3;
          const z = Math.sin(angle) * distance;

          // Set matrix for each instance
          const matrix = new THREE.Matrix4();
          matrix.setPosition(x, y, z);

          // Random rotation and scale
          matrix.multiply(
            new THREE.Matrix4().makeRotationY(Math.random() * Math.PI)
          );
          matrix.multiply(
            new THREE.Matrix4().makeScale(
              0.5 + Math.random() * 1.0,
              0.5 + Math.random() * 1.0,
              0.5 + Math.random() * 1.0
            )
          );

          return (
            <primitive
              key={i}
              object={matrix}
              attach={`instanceMatrix[${i}]`}
            />
          );
        })}
      </instancedMesh>
    </group>
  );
}
