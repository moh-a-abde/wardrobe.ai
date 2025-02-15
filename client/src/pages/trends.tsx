import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, X } from "lucide-react";
import type { FashionTrend } from "@shared/schema";
import { format } from "date-fns";

export default function Trends() {
  const { toast } = useToast();

  const { data: trends = [], isLoading } = useQuery<FashionTrend[]>({
    queryKey: ["/api/trends"],
  });

  const { mutate: generateTrends, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/trends/generate");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trends"] });
      toast({
        title: "Success",
        description: "Generated new fashion trends",
      });
    },
  });

  const { mutate: deleteTrend } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/trends/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trends"] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fashion Trends & Insights</h1>
        <Button
          onClick={() => generateTrends()}
          disabled={isGenerating}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          Refresh Trends
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trends.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center text-muted-foreground">
              No trends available. Click the refresh button to generate some!
            </CardContent>
          </Card>
        ) : (
          trends.map((trend) => (
            <Card key={trend.id} className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteTrend(trend.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardHeader>
                <CardTitle className="text-lg">{trend.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {trend.imageUrl && (
                  <img
                    src={trend.imageUrl}
                    alt={trend.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{trend.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {trend.category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {trend.season}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valid until: {format(new Date(trend.validTo), "MMM d, yyyy")}
                  </p>
                  {trend.source && (
                    <p className="text-xs text-muted-foreground">
                      Source: {trend.source}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
