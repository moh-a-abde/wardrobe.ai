import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import type { ClothingItem, Outfit } from "@shared/schema";

export default function History() {
  const { data: outfits = [], isLoading: loadingOutfits } = useQuery<Outfit[]>({
    queryKey: ["/api/outfits"],
  });

  const { data: items = [], isLoading: loadingItems } = useQuery<ClothingItem[]>({
    queryKey: ["/api/clothing"],
  });

  if (loadingOutfits || loadingItems) {
    return <div>Loading...</div>;
  }

  const getItemsForOutfit = (outfit: Outfit) => {
    return outfit.items
      .map((id) => items.find((item) => item.id === id))
      .filter((item): item is ClothingItem => item !== undefined);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Outfit History</h1>

      <div className="space-y-4">
        {outfits.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No outfits saved yet. Try generating some outfit suggestions!
            </CardContent>
          </Card>
        ) : (
          outfits.map((outfit) => (
            <Card key={outfit.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {outfit.occasion.charAt(0).toUpperCase() + outfit.occasion.slice(1)} Outfit
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(outfit.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getItemsForOutfit(outfit).map((item) => (
                    <div key={item.id} className="space-y-2">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.type} • {item.color}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Weather: {outfit.weather}</span>
                  <span>•</span>
                  <span>Occasion: {outfit.occasion}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}