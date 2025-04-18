"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PLANETS } from "@/lib/planet-data";
import Navbar from "@/components/navbar";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioController from "@/components/audio-controller";
import PlanetModel from "../../../components/PlanetModel";
import PlanetInfo from "../../../components/PlanetInfo";
import PlanetStats from "../../../components/PlanetStats";
import PlanetFunFacts from "../../../components/PlanetFunFacts";

// Define proper types for planet data
interface Planet {
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
}

// Custom hook for fetching planet data
function usePlanetData(id: string | string[] | undefined): {
  planet: Planet | null;
  loading: boolean;
} {
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPlanet = PLANETS.find((p) => p.id === id);
      if (foundPlanet) {
        setPlanet(foundPlanet as Planet);
      }
      setLoading(false);
    }
  }, [id]);

  return { planet, loading };
}

export default function PlanetPage() {
  const params = useParams();
  const { planet, loading } = usePlanetData(params.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-xl">Loading celestial body...</div>
      </div>
    );
  }

  if (!planet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
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
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={2} />
              <pointLight
                position={[-10, -10, -10]}
                intensity={0.5}
                color="#aaccff"
              />
              <hemisphereLight args={["#ffffff", "#333366", 0.8]} />
              <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={1}
                fade
              />
              <Html center>{loading && <div>Loading Planet...</div>}</Html>
              {!loading && (
                <PlanetModel
                  texture={planet.texturePath}
                  planetId={planet.id}
                />
              )}
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={6}
                maxDistance={20}
                autoRotate={false}
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </div>

          <div className="space-y-6">
            <PlanetInfo
              name={planet.name}
              description={planet.description}
              color={planet.color}
            />

            <PlanetStats
              realSize={planet.realSize}
              rotationPeriod={planet.rotationPeriod}
              orbitPeriod={planet.orbitPeriod}
              position={PLANETS.findIndex((p) => p.id === planet.id) + 1}
            />

            <PlanetFunFacts
              planetName={planet.name}
              funFacts={planet.funFacts}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <AudioController />
      </div>
    </div>
  );
}
