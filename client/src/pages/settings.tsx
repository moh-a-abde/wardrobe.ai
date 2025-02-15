import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPreferencesSchema, type Preferences } from "@shared/schema";
import { z } from "zod";

const styleOptions = [
  { id: "casual", label: "Casual" },
  { id: "formal", label: "Formal" },
  { id: "sporty", label: "Sporty" },
  { id: "vintage", label: "Vintage" },
  { id: "minimalist", label: "Minimalist" },
] as const;

const colorOptions = [
  { id: "neutral", label: "Neutral Tones" },
  { id: "warm", label: "Warm Colors" },
  { id: "cool", label: "Cool Colors" },
  { id: "bright", label: "Bright Colors" },
  { id: "pastel", label: "Pastel Colors" },
] as const;

type StylePreference = typeof styleOptions[number]["id"];
type ColorPreference = typeof colorOptions[number]["id"];

const formSchema = insertPreferencesSchema.extend({
  stylePreferences: z.array(z.enum([styleOptions[0].id, styleOptions[1].id, styleOptions[2].id, styleOptions[3].id, styleOptions[4].id])),
  colorPreferences: z.array(z.enum([colorOptions[0].id, colorOptions[1].id, colorOptions[2].id, colorOptions[3].id, colorOptions[4].id])),
});

type FormValues = z.infer<typeof formSchema>;

export default function Settings() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stylePreferences: [],
      colorPreferences: [],
    },
  });

  const { data: preferences, isLoading } = useQuery<Preferences>({
    queryKey: ["/api/preferences"],
  });

  const { mutate: updatePreferences } = useMutation({
    mutationFn: async (data: FormValues) => {
      await apiRequest("POST", "/api/preferences", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => updatePreferences(data))}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Style Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="stylePreferences"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {styleOptions.map((style) => (
                        <FormField
                          key={style.id}
                          control={form.control}
                          name="stylePreferences"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={style.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(style.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, style.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== style.id)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {style.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Select the styles that best match your preferences
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="colorPreferences"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {colorOptions.map((color) => (
                        <FormField
                          key={color.id}
                          control={form.control}
                          name="colorPreferences"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={color.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(color.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, color.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== color.id)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {color.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Select your preferred color palettes
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Save Preferences
          </Button>
        </form>
      </Form>
    </div>
  );
}