"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useParams } from "next/navigation";
import { PLANETS } from "@/lib/planet-data";
import Navbar from "@/components/navbar";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Stars, Html, useTexture } from "@react-three/drei";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import AudioController from "@/components/audio-controller";

export default function PlanetPage() {
  const params = useParams();
  const [planet, setPlanet] = useState<{
    id: string;
    name: string;
    description: string;
    size: number;
    realSize: string;
    orbitDistance: number;
    orbitSpeed: number;
    rotationPeriod: string;
    orbitPeriod: string;
    color: string;
    texturePath: string;
    funFacts: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const foundPlanet = PLANETS.find((p) => p.id === params.id);
      if (foundPlanet) {
        setPlanet(foundPlanet);
      }
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!planet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Planet not found</h1>
        <Link href="/">
          <Button>Return to Solar System</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-20 pb-10 px-4 md:px-6 max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Solar System
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-[400px] md:h-[600px] rounded-lg overflow-hidden border border-white/10">
            <Canvas>
              {/* Improved lighting setup */}
              <ambientLight intensity={0.5} /> {/* Increased from 0.3 */}
              <pointLight position={[10, 10, 10]} intensity={2} />{" "}
              {/* Increased from 1.5 */}
              <pointLight
                position={[-10, -10, -10]}
                intensity={0.5}
                color="#aaccff"
              />{" "}
              {/* Fill light */}
              <hemisphereLight args={["#ffffff", "#333366", 0.8]} />{" "}
              {/* Adds nice environmental lighting */}
              <Suspense fallback={<Html center>Loading Planet...</Html>}>
                <PlanetModel texture={planet.texturePath} />
              </Suspense>
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={6}
                maxDistance={20}
                autoRotate={false}
                autoRotateSpeed={0.5}
              />
              <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={1}
                fade
              />
            </Canvas>
          </div>

          <div className="space-y-6">
            <div>
              <h1
                className="text-4xl font-bold"
                style={{ color: planet.color }}
              >
                {planet.name}
              </h1>
              <p className="text-gray-400 mt-2">{planet.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-black/50 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Diameter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{planet.realSize}</p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Day Length
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{planet.rotationPeriod}</p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Year Length
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{planet.orbitPeriod}</p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {PLANETS.findIndex((p) => p.id === planet.id) + 1}
                    <span className="text-sm text-gray-400"> from Sun</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Fun Facts
                </CardTitle>
                <CardDescription>
                  Interesting things about {planet.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {planet.funFacts.map((fact, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <AudioController />
      </div>
    </div>
  );
}

function PlanetModel({ texture }: { texture: string }) {
  const planetTexture = useTexture(texture);
  // Add slow rotation animation
  const meshRef = useRef<THREE.Mesh | null>(null);
  const params = useParams();
  const isSaturn = params.id === "saturn";

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
            {" "}
            {/* Tilt the rings */}
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
