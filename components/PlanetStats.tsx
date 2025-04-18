import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanetStatsProps {
  realSize: string;
  rotationPeriod: string;
  orbitPeriod: string;
  position: number;
}

export default function PlanetStats({
  realSize,
  rotationPeriod,
  orbitPeriod,
  position,
}: PlanetStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-black/50 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Diameter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{realSize}</p>
        </CardContent>
      </Card>

      <Card className="bg-black/50 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Day Length</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{rotationPeriod}</p>
        </CardContent>
      </Card>

      <Card className="bg-black/50 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Year Length</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{orbitPeriod}</p>
        </CardContent>
      </Card>

      <Card className="bg-black/50 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Position</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {position}
            <span className="text-sm text-gray-400"> from Sun</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
