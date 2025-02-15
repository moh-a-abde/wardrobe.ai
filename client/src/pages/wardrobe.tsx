import { useQuery, useMutation } from "@tanstack/react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ClothingItem } from "@/components/ClothingItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClothingItemSchema, type ClothingItem as ClothingItemType } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Wardrobe() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertClothingItemSchema),
    defaultValues: {
      name: "",
      type: "",
      color: "",
      season: "",
      occasion: "",
      imageUrl: "",
    },
  });

  const { data: items = [], isLoading } = useQuery<ClothingItemType[]>({
    queryKey: ["/api/clothing"],
  });

  const { mutate: deleteItem } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/clothing/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clothing"] });
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    },
  });

  const { mutate: addItem } = useMutation({
    mutationFn: async (data: typeof insertClothingItemSchema._type) => {
      await apiRequest("POST", "/api/clothing", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clothing"] });
      toast({
        title: "Success",
        description: "Item added successfully",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Wardrobe</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => addItem(data))}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="shirt">Shirt</SelectItem>
                            <SelectItem value="pants">Pants</SelectItem>
                            <SelectItem value="shoes">Shoes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Add similar FormFields for color, season, occasion */}
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Add Item</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ClothingItem
              key={item.id}
              item={item}
              onDelete={deleteItem}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}