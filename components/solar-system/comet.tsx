import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { calculateOrbitParameters, createOrbitPath } from "./utils";
import CometParticles from "../comet-particles";

interface CometProps {
  orbitSpeed: number;
  isPaused: boolean;
  showLabel: boolean;
}

export default function Comet({ orbitSpeed, isPaused, showLabel }: CometProps) {
  const cometRef = useRef<THREE.Group>(null);
  const cometCoreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(Math.random() * 100);
  const [cometPosition, setCometPosition] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [cometVelocity, setCometVelocity] = useState<[number, number, number]>([
    -1, 0, 0,
  ]);
  const prevPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Comet orbit parameters - highly elliptical
  const { semiMajorAxis, semiMinorAxis, focalDistance } =
    calculateOrbitParameters(
      80, // Large orbit
      0.8 // High eccentricity for elongated orbit
    );

  // Create orbit path
  const orbitPath = createOrbitPath(
    semiMajorAxis,
    semiMinorAxis,
    focalDistance
  );

  useFrame((state, delta) => {
    if (!isPaused) {
      // Adjust speed based on distance from sun (faster when closer)
      const currentPosition = new THREE.Vector3(
        -focalDistance + semiMajorAxis * Math.cos(time),
        0,
        semiMinorAxis * Math.sin(time)
      );
      const distanceToSun = currentPosition.length();
      const speedFactor = Math.max(0.5, 4 / (distanceToSun / 10)); // Speed up when closer to sun

      setTime((time) => time + delta * orbitSpeed * speedFactor);
    }

    if (cometRef.current) {
      // Position using ellipse formula with Sun at one focus
      const newX = -focalDistance + semiMajorAxis * Math.cos(time);
      const newZ = semiMinorAxis * Math.sin(time);

      cometRef.current.position.x = newX;
      cometRef.current.position.z = newZ;

      // Calculate velocity based on position change
      const currentPos = new THREE.Vector3(newX, 0, newZ);
      const moveDirection = new THREE.Vector3();

      if (prevPositionRef.current) {
        moveDirection.subVectors(currentPos, prevPositionRef.current);
        if (moveDirection.length() > 0) {
          moveDirection.normalize();
          setCometVelocity([moveDirection.x, moveDirection.y, moveDirection.z]);
        }
      }

      // Update position for CometParticles
      setCometPosition([newX, 0, newZ]);
      prevPositionRef.current.copy(currentPos);

      // Rotate to always point tail away from the sun
      const toSun = new THREE.Vector3(
        -cometRef.current.position.x,
        -cometRef.current.position.y,
        -cometRef.current.position.z
      ).normalize();

      cometRef.current.lookAt(
        toSun.multiplyScalar(-100).add(cometRef.current.position)
      );

      // Rotate comet core
      if (cometCoreRef.current) {
        cometCoreRef.current.rotation.y += delta * 0.5;
      }
    }
  });

  return (
    <group>
      {/* Orbit path */}
      <lineSegments>
        <bufferGeometry attach="geometry" {...orbitPath} />
        <lineBasicMaterial
          attach="material"
          color="#6fa8dc"
          opacity={0.2}
          transparent
          linewidth={1}
          dashSize={2}
          gapSize={1}
        />
      </lineSegments>

      {/* Comet */}
      <group ref={cometRef}>
        {/* Comet core */}
        <mesh
          ref={cometCoreRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#d4e6f1"
            emissive="#a5c8e1"
            emissiveIntensity={0.5}
            roughness={0.7}
          />
        </mesh>

        {/* Comet coma (hazy atmosphere) */}
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#a5c8e1"
            transparent={true}
            opacity={0.4}
            roughness={1}
          />
        </mesh>

        {/* Comet dust tail particles */}
        <CometParticles
          count={300}
          size={0.08}
          scale={[10, 2.5, 2.5]}
          color="#d4e6f1"
          spreadFactor={0.5}
          position={[0, 0, 0]}
          velocity={cometVelocity}
          trailLength={10}
        />

        {/* Comet ion tail particles - bluer and straighter */}
        <CometParticles
          count={200}
          size={0.06}
          scale={[12, 1.5, 1.5]}
          color="#88ccff"
          spreadFactor={0.15}
          position={[0, 0, 0]}
          velocity={cometVelocity}
          trailLength={15}
        />

        {/* Comet label */}
        {showLabel && (
          <Html position={[0, 3, 0]} center distanceFactor={10}>
            <div
              className="planet-tooltip"
              style={{ opacity: hovered ? 1 : 0.7 }}
            >
              Halley's Comet
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
