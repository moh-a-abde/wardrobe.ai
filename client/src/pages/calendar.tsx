import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Outfit, ScheduledOutfit } from "@shared/schema";

export default function CalendarPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);

  const { data: outfits = [] } = useQuery<Outfit[]>({
    queryKey: ["/api/outfits"],
  });

  const { data: scheduledOutfits = [], isLoading } = useQuery<ScheduledOutfit[]>({
    queryKey: [
      "/api/scheduled-outfits",
      {
        startDate: selectedDate ? startOfMonth(selectedDate) : undefined,
        endDate: selectedDate ? endOfMonth(selectedDate) : undefined,
      },
    ],
    enabled: !!selectedDate,
  });

  const { mutate: scheduleOutfit } = useMutation({
    mutationFn: async (outfitId: number) => {
      if (!selectedDate) return;
      
      await apiRequest("POST", "/api/scheduled-outfits", {
        outfitId,
        date: selectedDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/scheduled-outfits"]
      });
      toast({
        title: "Success",
        description: "Outfit scheduled successfully",
      });
    },
  });

  const { mutate: unscheduleOutfit } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/scheduled-outfits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/scheduled-outfits"]
      });
      toast({
        title: "Success",
        description: "Outfit unscheduled successfully",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getScheduledOutfitForDate = (date: Date) => {
    return scheduledOutfits.find(
      (scheduled) => format(new Date(scheduled.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Outfit Calendar</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                scheduled: (date) => !!getScheduledOutfitForDate(date),
              }}
              modifiersStyles={{
                scheduled: { backgroundColor: "hsl(var(--primary))", color: "white" },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a Date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate && (
              <div className="space-y-4">
                {getScheduledOutfitForDate(selectedDate) ? (
                  <div>
                    <p className="mb-2">Outfit scheduled for this date</p>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        const scheduled = getScheduledOutfitForDate(selectedDate);
                        if (scheduled) {
                          unscheduleOutfit(scheduled.id);
                        }
                      }}
                    >
                      Remove Schedule
                    </Button>
                  </div>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Schedule Outfit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Choose an Outfit</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {outfits.map((outfit) => (
                          <Card
                            key={outfit.id}
                            className={`cursor-pointer transition-colors ${
                              selectedOutfit?.id === outfit.id
                                ? "border-primary"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedOutfit(outfit)}
                          >
                            <CardContent className="p-4">
                              <p className="font-medium">
                                {outfit.occasion.charAt(0).toUpperCase() +
                                  outfit.occasion.slice(1)}{" "}
                                Outfit
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Weather: {outfit.weather}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <Button
                        className="w-full"
                        disabled={!selectedOutfit}
                        onClick={() => {
                          if (selectedOutfit) {
                            scheduleOutfit(selectedOutfit.id);
                          }
                        }}
                      >
                        Schedule Selected Outfit
                      </Button>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
