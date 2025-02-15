import { useDrag } from "react-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ClothingItem as ClothingItemType } from "@shared/schema";

interface Props {
  item: ClothingItemType;
  onDelete: (id: number) => void;
}

export function ClothingItem({ item, onDelete }: Props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CLOTHING_ITEM",
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-move ${isDragging ? "opacity-50" : ""}`}
    >
      <Card className="relative group">
        <CardContent className="p-4">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-48 object-cover rounded-md mb-2"
          />
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.type} • {item.color}
              </p>
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
