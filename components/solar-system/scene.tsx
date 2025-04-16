import { Suspense } from "react";
import { Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { PLANETS } from "@/lib/planet-data";
import Sun from "./sun";
import Planet from "./planet";
import AsteroidBelt from "./asteroid-belt";
import Comet from "./comet";

interface SolarSystemSceneProps {
  orbitSpeed: number;
  isPaused: boolean;
  showLabels: boolean;
}

export default function SolarSystemScene({
  orbitSpeed,
  isPaused,
  showLabels,
}: SolarSystemSceneProps) {
  const router = useRouter();

  return (
    <Suspense fallback={<Html center>Loading Solar System...</Html>}>
      <group>
        {/* Sun */}
        <Sun position={[0, 0, 0]} />

        {/* Asteroid Belt - positioned between Mars (25) and Jupiter (35) */}
        <AsteroidBelt orbitDistance={30} isPaused={isPaused} />

        {/* Comet */}
        <Comet
          orbitSpeed={orbitSpeed * 0.3}
          isPaused={isPaused}
          showLabel={showLabels}
        />

        {/* Planets */}
        {PLANETS.map((planet) => (
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
    </Suspense>
  );
}
