import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react";

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
};

interface Props {
  weather: keyof typeof weatherIcons;
  temperature: number;
}

export function WeatherWidget({ weather, temperature }: Props) {
  const Icon = weatherIcons[weather];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6" />
          <div className="font-medium">{temperature}°C</div>
        </div>
      </CardContent>
    </Card>
  );
}
