import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react";
import type { Weather } from "@/lib/weather";

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
};

interface Props {
  weather: Weather;
  isLoading?: boolean;
}

export function WeatherWidget({ weather, isLoading }: Props) {
  const Icon = weatherIcons[weather.weather];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-2">
            <div className="h-6 w-6 bg-muted rounded" />
            <div className="h-6 w-20 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6" />
          <div>
            <div className="font-medium">{weather.temperature}°C</div>
            <div className="text-sm text-muted-foreground capitalize">
              {weather.description}
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {weather.location}
        </div>
      </CardContent>
    </Card>
  );
}