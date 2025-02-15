import { z } from "zod";

export const weatherSchema = z.object({
  temperature: z.number(),
  weather: z.enum(["sunny", "cloudy", "rainy", "snowy"]),
  description: z.string(),
  location: z.string(),
});

export type Weather = z.infer<typeof weatherSchema>;

async function mapOpenWeatherToAppWeather(openWeatherData: any): Promise<Weather> {
  // Map OpenWeather conditions to our app's weather types
  const weatherCode = openWeatherData.weather[0].id;
  let weather: Weather["weather"];
  
  if (weatherCode >= 200 && weatherCode < 600) {
    weather = "rainy";
  } else if (weatherCode >= 600 && weatherCode < 700) {
    weather = "snowy";
  } else if (weatherCode >= 801) {
    weather = "cloudy";
  } else {
    weather = "sunny";
  }

  return {
    temperature: Math.round(openWeatherData.main.temp - 273.15), // Convert Kelvin to Celsius
    weather,
    description: openWeatherData.weather[0].description,
    location: openWeatherData.name,
  };
}

export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<Weather> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenWeather API key not found");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();
  return mapOpenWeatherToAppWeather(data);
}

// Get user's location and weather
export async function getUserLocationAndWeather(): Promise<Weather> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const weather = await getCurrentWeather(
            position.coords.latitude,
            position.coords.longitude
          );
          resolve(weather);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error(`Failed to get location: ${error.message}`));
      }
    );
  });
}
