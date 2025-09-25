"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(0, "Quantity must be 0 or more"),
  threshold: z.number().min(1, "Threshold must be at least 1"),
  warehouse: z.string().min(1, "Warehouse is required"),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  threshold: number;
  warehouse?: {
    name: string;
  };
  lowStock: boolean;
}

interface Warehouse {
  _id: string;
  name: string;
  location: string;
  capacity: number;
  currentCapacity: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: { name: "", quantity: 0, threshold: 10, warehouse: "" },
  });

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/inventory", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Failed to load inventory");
    }
  }, []);

  const fetchWarehouses = useCallback(async () => {
    try {
      console.log("Fetching warehouses...");
      const res = await fetch("/api/warehouses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Warehouses API response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log("Warehouses API error:", errorText);
        
        if (res.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (res.status === 403) {
          throw new Error("Access denied. Insufficient permissions.");
        } else {
          throw new Error(`Failed to fetch warehouses: ${res.status} ${res.statusText}`);
        }
      }
      
      const data = await res.json();
      console.log("Fetched warehouses data:", data);
      setWarehouses(data);
    } catch (err: unknown) {
      console.error("Error fetching warehouses:", err);
      toast.error(`Error fetching warehouses: ${(err as Error).message}`);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    fetchWarehouses();
  }, [fetchItems, fetchWarehouses]);

  const onSubmit = async (data: ItemFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      toast.success(`${data.name} added successfully`);
      form.reset();
      fetchItems();
      setIsModalOpen(false); // Close modal after successful creation
    } catch (err: unknown) {
      console.error("Error adding inventory item:", err);
      toast.error(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      toast.success(" Item removed successfully");
      fetchItems();
    } catch (err: unknown) {
      toast.error(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800 text-white w-full sm:w-auto">
                <span className="sm:hidden">Add New Item</span>
                <span className="hidden sm:inline">Add Item</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 shadow-xl z-50">
              <DialogHeader className="border-b border-gray-200 pb-4">
                <DialogTitle className="text-xl font-semibold text-gray-900">Add New Inventory Item</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Fill in the details to add a new item to inventory</p>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter item name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e)=>field.onChange(Number(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter quantity"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="threshold" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Threshold</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e)=>field.onChange(Number(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter minimum stock threshold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="warehouse" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Warehouse</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select warehouse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg">
                          {warehouses.length > 0 ? (
                            warehouses.map((warehouse) => (
                              <SelectItem key={warehouse._id} value={warehouse._id}>
                                {warehouse.name} - {warehouse.location}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              No warehouses available
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </span>
                    ) : "Add Item"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 bg-gray-50">
                  <TableHead className="font-semibold text-gray-900 min-w-[120px]">Name</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[80px]">Quantity</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[80px] hidden sm:table-cell">Threshold</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[100px] hidden md:table-cell">Warehouse</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[100px]">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                    <TableCell className="text-gray-700">{item.quantity}</TableCell>
                    <TableCell className="text-gray-700 hidden sm:table-cell">{item.threshold}</TableCell>
                    <TableCell className="text-gray-700 hidden md:table-cell">{item.warehouse?.name || "N/A"}</TableCell>
                    <TableCell>
                      {item.lowStock ? (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          In Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => deleteItem(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No inventory items found. Add your first item to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
