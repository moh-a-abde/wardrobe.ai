import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RefreshCw } from "lucide-react";
import type { ClothingItem } from "@shared/schema";

interface Props {
  items: ClothingItem[];
  reasoning: string;
  onSave: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function OutfitSuggestion({ 
  items, 
  reasoning, 
  onSave, 
  onRefresh,
  isLoading 
}: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Suggested Outfit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <p className="font-medium">{item.name}</p>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mb-4">{reasoning}</p>

        <div className="flex gap-2">
          <Button
            onClick={onSave}
            className="flex-1"
            disabled={isLoading}
          >
            <Check className="mr-2 h-4 w-4" />
            Save Outfit
          </Button>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
