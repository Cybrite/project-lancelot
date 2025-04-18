import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from "lucide-react";

interface PlanetFunFactsProps {
  planetName: string;
  funFacts: string[];
}

export default function PlanetFunFacts({
  planetName,
  funFacts,
}: PlanetFunFactsProps) {
  return (
    <Card className="bg-black/50 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="h-5 w-5 mr-2" />
          Fun Facts
        </CardTitle>
        <CardDescription>Interesting things about {planetName}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {funFacts.map((fact, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
