import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ExternalLink, X } from "lucide-react";
import type { ProductRecommendation } from "@shared/schema";

export default function Recommendations() {
  const { toast } = useToast();

  const { data: recommendations = [], isLoading } = useQuery<ProductRecommendation[]>({
    queryKey: ["/api/recommendations"],
  });

  const { mutate: generateRecommendations, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/recommendations/generate");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Success",
        description: "Generated new shopping recommendations",
      });
    },
  });

  const { mutate: deleteRecommendation } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/recommendations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shopping Recommendations</h1>
        <Button
          onClick={() => generateRecommendations()}
          disabled={isGenerating}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          Refresh Recommendations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center text-muted-foreground">
              No recommendations yet. Click the refresh button to generate some!
            </CardContent>
          </Card>
        ) : (
          recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteRecommendation(recommendation.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardHeader>
                <CardTitle className="text-lg">{recommendation.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={recommendation.imageUrl}
                  alt={recommendation.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = "https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/avatars/01.png";
                  }}
                />
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Type:</span> {recommendation.type}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Color:</span> {recommendation.color}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Price:</span> ${recommendation.price}
                  </p>
                  <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={recommendation.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Product
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
