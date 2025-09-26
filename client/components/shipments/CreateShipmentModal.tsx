"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const createShipmentSchema = z.object({
  description: z.string().min(1, "Description is required"),
  currentLocation: z.string().min(1, "Current location is required"),
  weight: z.string().min(1, "Weight is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  status: z.enum(["pending", "in-transit", "out-for-delivery", "delivered"]),
  senderName: z.string().min(1, "Sender name is required"),
  senderContact: z.string().min(1, "Sender contact is required"),
  senderAddress: z.string().min(1, "Sender address is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientContact: z.string().min(1, "Recipient contact is required"),
  recipientAddress: z.string().min(1, "Recipient address is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  expectedDate: z.string().min(1, "Expected delivery date is required"),
});

type CreateShipmentFormData = z.infer<typeof createShipmentSchema>;

interface CreateShipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShipmentCreated: () => void;
}

export function CreateShipmentModal({
  open,
  onOpenChange,
  onShipmentCreated,
}: CreateShipmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateShipmentFormData>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      description: "",
      currentLocation: "",
      weight: "",
      dimensions: "",
      status: "pending",
      senderName: "",
      senderContact: "",
      senderAddress: "",
      recipientName: "",
      recipientContact: "",
      recipientAddress: "",
      pickupDate: new Date().toISOString().split('T')[0],
      expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: CreateShipmentFormData) => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          weight: parseFloat(data.weight),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error details:", errorData);
        
        // Show more specific error message
        if (errorData.message && errorData.message.includes('validation')) {
          toast.error(`Validation Error: ${errorData.message}`);
        } else if (errorData.missingFields) {
          toast.error(`Missing required fields: ${errorData.missingFields.join(', ')}`);
        } else {
          toast.error(errorData.error || "Failed to create shipment");
        }
        throw new Error(errorData.error || "Failed to create shipment");
      }

      const newShipment = await response.json();
      toast.success(`Shipment created successfully! Tracking ID: ${newShipment.trackingId}`);
      
      form.reset();
      onOpenChange(false);
      onShipmentCreated();
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create shipment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Create New Shipment</DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the details below to create a new shipment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shipment Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Shipment Details</h3>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Description</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Electronics Package, Documents, etc." 
                          className="bg-white border-gray-300 focus:border-blue-500" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Current Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Distribution Center, Warehouse, etc." 
                          className="bg-white border-gray-300 focus:border-blue-500" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="2.5" 
                            className="bg-white border-gray-300 focus:border-blue-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Dimensions</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="30x20x15 cm" 
                            className="bg-white border-gray-300 focus:border-blue-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-transit">In Transit</SelectItem>
                          <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Pickup Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="bg-white border-gray-300 focus:border-blue-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expectedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Expected Delivery</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="bg-white border-gray-300 focus:border-blue-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Sender & Recipient Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Sender Details</h3>
                
                <FormField
                  control={form.control}
                  name="senderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Sender Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Smith" 
                          className="bg-white border-gray-300 focus:border-blue-500" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="senderContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Sender Contact</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1-555-0101" 
                          className="bg-white border-gray-300 focus:border-blue-500" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="senderAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Sender Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="123 Main St, New York, NY 10001" 
                          className="bg-white border-gray-300 focus:border-blue-500 min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h3 className="font-medium text-gray-900 pt-2">Recipient Details</h3>
                
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Recipient Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Alice Johnson" 
                          className="bg-white border-gray-300 focus:border-blue-500" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipientContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Recipient Contact</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1-555-0102" 
                          className="bg-white border-gray-300 focus:border-blue-500" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipientAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Recipient Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="456 Oak Ave, Los Angeles, CA 90210" 
                          className="bg-white border-gray-300 focus:border-blue-500 min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? "Creating..." : "Create Shipment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}