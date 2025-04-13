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

function SolarSystemScene({ orbitSpeed, isPaused, showLabels }) {
  const router = useRouter();

  return (
    <group>
      {/* Sun */}
      <Sun position={[0, 0, 0]} />

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

// Update the Sun component to use a placeholder texture
function Sun() {
  const sunRef = useRef();

  // Create a simple sun texture with a radial gradient
  const sunTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");

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
    <mesh ref={sunRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive="#ffcc00"
        emissiveIntensity={1}
      />
      <pointLight intensity={1.5} distance={100} color="#ffcc00" />
    </mesh>
  );
}

// Update the Planet component to handle texture loading errors
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
}) {
  const planetRef = useRef();
  const orbitRef = useRef();

  // Create a fallback texture with the planet's color
  const createFallbackTexture = (color = "#cccccc") => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");

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
  const texture = useTexture(
    texturePath,
    (loadedTexture) => {
      console.log(`Loaded texture: ${texturePath}`);
    },
    (error) => {
      console.error(`Error loading texture ${texturePath}:`, error);
      return createFallbackTexture(planet.color);
    }
  );

  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(Math.random() * 100);

  useFrame((state, delta) => {
    if (!isPaused) {
      setTime((time) => time + delta * orbitSpeed);
    }

    if (planetRef.current) {
      // Update planet position in orbit
      planetRef.current.position.x = Math.sin(time) * orbitDistance;
      planetRef.current.position.z = Math.cos(time) * orbitDistance;

      // Rotate planet
      planetRef.current.rotation.y += delta * 0.5;
    }
  });

  // Create orbit path
  const orbitPath = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0,
      0, // center
      orbitDistance,
      orbitDistance, // xRadius, yRadius
      0,
      2 * Math.PI, // startAngle, endAngle
      false, // clockwise
      0 // rotation
    );

    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );

    return geometry;
  }, [orbitDistance]);

  return (
    <group>
      {/* Orbit path */}
      <line ref={orbitRef}>
        <bufferGeometry attach="geometry" {...orbitPath} />
        <lineBasicMaterial
          attach="material"
          color={orbitColor}
          opacity={0.3}
          transparent
          linewidth={1}
        />
      </line>

      {/* Planet */}
      <group ref={planetRef}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={texture} metalness={0.2} roughness={0.8} />

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
