import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface SolarSystemControlsProps {
  orbitSpeed: number;
  setOrbitSpeed: (speed: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
}

export default function SolarSystemControls({
  orbitSpeed,
  setOrbitSpeed,
  isPaused,
  setIsPaused,
  showLabels,
  setShowLabels,
}: SolarSystemControlsProps) {
  return (
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
  );
}
