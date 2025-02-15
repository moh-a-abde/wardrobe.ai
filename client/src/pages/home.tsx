import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { OutfitSuggestion } from "@/components/OutfitSuggestion";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { ClothingItem } from "@shared/schema";

type Weather = "sunny" | "cloudy" | "rainy" | "snowy";

export default function Home() {
  const { toast } = useToast();
  const [weather] = useState<Weather>("sunny");
  const [occasion, setOccasion] = useState("casual");

  const { data: items = [] } = useQuery<ClothingItem[]>({
    queryKey: ["/api/clothing"],
  });

  const { data: suggestion, isPending, mutate: generateSuggestion } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/outfits/suggest", {
        weather,
        occasion,
      });
      return res.json();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate outfit suggestion",
        variant: "destructive",
      });
    },
  });

  const { mutate: saveOutfit } = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/outfits", {
        items: suggestion?.items,
        weather,
        occasion,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Outfit saved to history",
      });
    },
  });

  if (!items.length) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to your AI Wardrobe!</h1>
        <p className="text-muted-foreground mb-4">
          Start by adding some clothing items to your wardrobe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Today's Outfit</h1>
        <WeatherWidget weather={weather} temperature={22} />
      </div>

      <div className="flex gap-2 mb-4">
        {["casual", "formal", "sport", "party"].map((o) => (
          <Button
            key={o}
            variant={occasion === o ? "default" : "outline"}
            onClick={() => setOccasion(o)}
          >
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </Button>
        ))}
      </div>

      {suggestion ? (
        <OutfitSuggestion
          items={items.filter((item) => suggestion.items.includes(item.id))}
          reasoning={suggestion.reasoning}
          onSave={saveOutfit}
          onRefresh={() => generateSuggestion()}
          isLoading={isPending}
        />
      ) : (
        <Button
          className="w-full"
          size="lg"
          onClick={() => generateSuggestion()}
          disabled={isPending}
        >
          Generate Outfit Suggestion
        </Button>
      )}
    </div>
  );
}