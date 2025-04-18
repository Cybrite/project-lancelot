interface PlanetInfoProps {
  name: string;
  description: string;
  color: string;
}

export default function PlanetInfo({
  name,
  description,
  color,
}: PlanetInfoProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold" style={{ color }}>
        {name}
      </h1>
      <p className="text-gray-400 mt-2">{description}</p>
    </div>
  );
}
