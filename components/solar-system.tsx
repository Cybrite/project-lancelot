"use client";

import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Html,
  useTexture,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { PLANETS } from "@/lib/planet-data";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

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

        <Suspense fallback={<Html center>Loading Solar System...</Html>}>
          <SolarSystemScene
            orbitSpeed={orbitSpeed}
            isPaused={isPaused}
            showLabels={showLabels}
          />
        </Suspense>

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

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md p-4 rounded-lg border border-white/20 flex flex-col gap-4 w-80">
        <div className="flex justify-between items-center">
          <span className="text-white text-sm">Orbit Speed</span>
          <Slider
            value={[orbitSpeed]}
            onValueChange={(value) => setOrbitSpeed(value[0])}
            max={0.5}
            step={0.01}
            className="w-40"
          />
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <Play className="h-4 w-4 mr-2" />
            ) : (
              <Pause className="h-4 w-4 mr-2" />
            )}
            {isPaused ? "Play" : "Pause"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
          >
            {showLabels ? "Hide Labels" : "Show Labels"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOrbitSpeed(0.1);
              setIsPaused(false);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SolarSystemScene({
  orbitSpeed,
  isPaused,
  showLabels,
}: {
  orbitSpeed: number;
  isPaused: boolean;
  showLabels: boolean;
}) {
  const router = useRouter();

  return (
    <group>
      {/* Sun */}
      <Sun position={[0, 0, 0]} />

      {/* Asteroid Belt - positioned between Mars (25) and Jupiter (35) */}
      <AsteroidBelt orbitDistance={30} isPaused={isPaused} />

      {/* Planets */}
      {PLANETS.map((planet, index) => (
        <Planet
          key={planet.id}
          planet={planet}
          orbitDistance={planet.orbitDistance}
          orbitSpeed={orbitSpeed * planet.orbitSpeed}
          size={planet.size}
          texturePath={planet.texturePath}
          orbitColor={planet.color}
          isPaused={isPaused}
          showLabel={showLabels}
          onClick={() => router.push(`/planet/${planet.id}`)}
        />
      ))}
    </group>
  );
}

// Add this component before Planet function

function AsteroidBelt({ orbitDistance = 30, count = 100, isPaused = false }) {
  const mainBeltRef = useRef<THREE.Group>(null);

  // Create a bunch of actual meshes instead of points
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

// Update the Sun component to use a placeholder texture
function Sun({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  const sunRef = useRef<THREE.Mesh>(null);

  // Create a simple sun texture with a radial gradient
  const sunTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");

    if (!context) {
      console.error("Failed to get 2D context");
      return new THREE.Texture(); // Return empty texture as fallback
    }

    // Create a radial gradient
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );

    gradient.addColorStop(0, "#ffff00");
    gradient.addColorStop(0.5, "#ffcc00");
    gradient.addColorStop(1, "#ff6600");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={sunRef} position={position}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive="#ffcc00"
        emissiveIntensity={5}
      />
      <pointLight intensity={5000} distance={10 ** 20} color="#ffcc00" />
    </mesh>
  );
}

// Update the Planet component to handle texture loading errors
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

function Planet({
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

  // Keep the existing eccentricity values
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

  // Calculate semi-major and semi-minor axes for the ellipse
  const semiMajorAxis = orbitDistance;
  const semiMinorAxis =
    orbitDistance * Math.sqrt(1 - eccentricity * eccentricity);

  // Calculate the focal distance (distance from center to focus)
  const focalDistance = Math.sqrt(
    semiMajorAxis * semiMajorAxis - semiMinorAxis * semiMinorAxis
  );

  // Create a fallback texture with the planet's color
  const createFallbackTexture = (color = "#cccccc") => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");

    if (!context) {
      console.error("Failed to get 2D context");
      return new THREE.Texture(); // Return empty texture as fallback
    }

    // Fill with base color
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise/texture
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 2;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
      context.fill();
    }

    return new THREE.CanvasTexture(canvas);
  };

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

  useFrame((state, delta) => {
    if (!isPaused) {
      setTime((time) => time + delta * orbitSpeed);
    }

    if (planetRef.current) {
      // Position using ellipse formula with Sun at one focus
      // Offset the x position by focalDistance
      planetRef.current.position.x =
        -focalDistance + semiMajorAxis * Math.cos(time);
      planetRef.current.position.z = semiMinorAxis * Math.sin(time);

      // Rotate planet
      planetRef.current.rotation.y += delta * 0.5;
    }
  });

  // Create elliptical orbit path with the Sun at one focus
  const orbitPath = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      -focalDistance, // x center is offset by focal distance
      0, // y center
      semiMajorAxis,
      semiMinorAxis,
      0,
      2 * Math.PI,
      false,
      0
    );

    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );

    return geometry;
  }, [semiMajorAxis, semiMinorAxis, focalDistance]);

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
              {" "}
              {/* Tilt the rings */}
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
