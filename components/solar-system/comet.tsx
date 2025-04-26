import { useRef, useState, useMemo, useEffect } from "react";
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
  const dustTailRef = useRef<THREE.Group>(null);
  const ionTailRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(Math.random() * 100);
  const [cometPosition, setCometPosition] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [cometVelocity, setCometVelocity] = useState<[number, number, number]>([
    -1, 0, 0,
  ]);
  const prevPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const velocityMagnitudeRef = useRef<number>(1);

  const { semiMajorAxis, semiMinorAxis, focalDistance } =
    calculateOrbitParameters(
      80, // Large orbit
      0.8 // High eccentricity for elongated orbit
    );

  const orbitPath = createOrbitPath(
    semiMajorAxis,
    semiMinorAxis,
    focalDistance
  );

  const sunDirectionRef = useRef(new THREE.Vector3());
  const velocityDirectionRef = useRef(new THREE.Vector3(-1, 0, 0));

  useFrame((state, delta) => {
    if (!isPaused) {
      const currentPosition = new THREE.Vector3(
        -focalDistance + semiMajorAxis * Math.cos(time),
        0,
        semiMinorAxis * Math.sin(time)
      );

      const distanceToSun = currentPosition.length();
      const speedFactor = Math.max(0.5, 5 / (distanceToSun / 10));

      setTime((time) => time + delta * orbitSpeed * speedFactor);

      velocityMagnitudeRef.current = speedFactor;
    }

    if (cometRef.current) {
      const newX = -focalDistance + semiMajorAxis * Math.cos(time);
      const newZ = semiMinorAxis * Math.sin(time);

      cometRef.current.position.x = newX;
      cometRef.current.position.z = newZ;

      const currentPos = new THREE.Vector3(newX, 0, newZ);
      const moveDirection = new THREE.Vector3();

      if (prevPositionRef.current) {
        moveDirection.subVectors(currentPos, prevPositionRef.current);
        if (moveDirection.length() > 0) {
          moveDirection.normalize();
          velocityDirectionRef.current.copy(moveDirection);
          setCometVelocity([moveDirection.x, moveDirection.y, moveDirection.z]);
        }
      }

      setCometPosition([newX, 0, newZ]);
      prevPositionRef.current.copy(currentPos);

      sunDirectionRef.current.set(-newX, 0, -newZ).normalize();

      if (dustTailRef.current && ionTailRef.current) {
        dustTailRef.current.position.set(0, 0, 0);
        ionTailRef.current.position.set(0, 0, 0);

        // Dust tail follows slightly behind the comet's trajectory
        const dustTailDirection = velocityDirectionRef.current.clone().negate();
        dustTailRef.current.lookAt(
          dustTailDirection.multiplyScalar(10).add(new THREE.Vector3(0, 0, 0))
        );

        // Ion tail points directly away from sun
        const ionTailDirection = sunDirectionRef.current.clone().negate();
        ionTailRef.current.lookAt(
          ionTailDirection.multiplyScalar(10).add(new THREE.Vector3(0, 0, 0))
        );
      }

      if (cometCoreRef.current) {
        // Rotate core slowly for visual interest
        cometCoreRef.current.rotation.y += delta * 0.5;

        // Pitch core slightly upward - looks more dynamic
        cometCoreRef.current.rotation.x = Math.PI * 0.05;
      }
    }
  });

  const dustTrailParams = useMemo(
    () => ({
      scale: [15, 2.5, 2.5] as [number, number, number],
      offset: [0, 0, 0] as [number, number, number],
    }),
    []
  );

  const ionTrailParams = useMemo(
    () => ({
      scale: [18, 1.2, 1.2] as [number, number, number],
      offset: [0, 0, 0] as [number, number, number],
    }),
    []
  );

  return (
    <group>
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

      <group ref={cometRef}>
        <mesh
          ref={cometCoreRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#d4e6f1"
            emissive="#a5c8e1"
            emissiveIntensity={0.8}
            roughness={0.7}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#a5c8e1"
            transparent={true}
            opacity={0.4}
            roughness={1}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshBasicMaterial color="#ffffff" transparent={true} opacity={0.3} />
        </mesh>

        <group ref={dustTailRef}>
          <CometParticles
            count={400}
            size={0.08}
            scale={dustTrailParams.scale}
            color="#e6f0fa"
            spreadFactor={0.7}
            position={[0, 0, 0]}
            velocity={cometVelocity}
            trailLength={12}
            speedFactor={velocityMagnitudeRef.current}
          />
        </group>

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
