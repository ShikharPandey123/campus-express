"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Package } from "lucide-react";

// Types
interface Warehouse {
  _id: string;
  name: string;
  location: string;
}

interface Shipment {
  _id: string;
  trackingId: string;
  description: string;
  currentLocation: string;
  weight: string;
  dimensions: string;
  status: string;
  warehouse: string;
  senderName: string;
  senderContact: string;
  senderAddress: string;
  recipientName: string;
  recipientContact: string;
  recipientAddress: string;
  pickupDate: string;
  expectedDate: string;
  isDelivered: boolean;
  createdAt: string;
}

const shipmentSchema = z.object({
  trackingId: z.string().min(1, "Tracking ID is required"),
  description: z.string().min(1, "Description is required"),
  currentLocation: z.string().min(1, "Current location is required"),
  weight: z.string().min(1, "Weight is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  status: z.string().min(1, "Status is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  senderName: z.string().min(1, "Sender name is required"),
  senderContact: z.string().min(1, "Sender contact is required"),
  senderAddress: z.string().min(1, "Sender address is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientContact: z.string().min(1, "Recipient contact is required"),
  recipientAddress: z.string().min(1, "Recipient address is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  expectedDate: z.string().min(1, "Expected date is required"),
  isDelivered: z.boolean(),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

export default function ShipmentsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      trackingId: `PKG${Date.now()}`,
      description: "",
      currentLocation: "",
      weight: "",
      dimensions: "",
      status: "",
      warehouse: "",
      senderName: "",
      senderContact: "",
      senderAddress: "",
      recipientName: "",
      recipientContact: "",
      recipientAddress: "",
      pickupDate: "",
      expectedDate: "",
      isDelivered: false,
    },
  });

  // Fetch warehouses and shipments on component mount
  useEffect(() => {
    fetchWarehouses();
    fetchShipments();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/warehouses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWarehouses(data);
      }
    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
    }
  };

  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/shipments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setShipments(data);
      }
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
    }
  };

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    form.reset({
      trackingId: shipment.trackingId,
      description: shipment.description,
      currentLocation: shipment.currentLocation,
      weight: shipment.weight,
      dimensions: shipment.dimensions,
      status: shipment.status,
      warehouse: shipment.warehouse,
      senderName: shipment.senderName,
      senderContact: shipment.senderContact,
      senderAddress: shipment.senderAddress,
      recipientName: shipment.recipientName,
      recipientContact: shipment.recipientContact,
      recipientAddress: shipment.recipientAddress,
      pickupDate: shipment.pickupDate,
      expectedDate: shipment.expectedDate,
      isDelivered: shipment.isDelivered,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/shipments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        toast.success("Shipment deleted successfully");
        fetchShipments();
      } else {
        toast.error("Failed to delete shipment");
      }
    } catch {
      toast.error("Error deleting shipment");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "in-transit": return "bg-blue-100 text-blue-800";
      case "out-for-delivery": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const onSubmit = async (data: ShipmentFormData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingShipment 
        ? `/api/shipments/${editingShipment._id}` 
        : "/api/shipments";
      const method = editingShipment ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to ${editingShipment ? 'update' : 'create'} shipment`);
      }

      toast.success(`Shipment ${editingShipment ? 'updated' : 'created'} successfully.`);
      
      form.reset();
      setEditingShipment(null);
      setDialogOpen(false);
      fetchShipments(); // Refresh the list
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["Admin", "Manager", "WarehouseStaff"]}>
      <div className="space-y-6">
        {/* Shipments List */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shipments</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingShipment(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800 text-white shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Add New Shipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-50 border border-gray-300">
              <DialogHeader className="border-b border-gray-200 pb-4 sticky top-0 bg-white dark:bg-gray-50 z-10">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {editingShipment ? "Edit Shipment" : "Add New Shipment"}
                </DialogTitle>
              </DialogHeader>

        <Form {...form}>
          <form 
            onSubmit={(e) => {
              console.log("Form submitted!");
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }} 
            className="space-y-6 mt-4 p-4"
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              <Card className="xl:col-span-2 bg-white border border-gray-300">
                <CardHeader className="bg-blue-50 border-b border-gray-200">
                  <CardTitle className="text-lg font-bold text-gray-900">Package Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 lg:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="trackingId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-800">Tracking ID</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled 
                              className="bg-gray-100 text-gray-700 border border-gray-300 font-medium h-10" 
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
                          <FormLabel className="text-sm font-semibold text-gray-800">Current Location</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white text-gray-900 border border-gray-300 h-10 font-medium">
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border border-gray-300">
                              {warehouses.map((warehouse) => (
                                <SelectItem 
                                  key={warehouse._id} 
                                  value={warehouse.location}
                                  className="text-gray-900 hover:bg-blue-100 cursor-pointer"
                                >
                                  {warehouse.location}
                                </SelectItem>
                              ))}
                              <SelectItem 
                                value="in-transit"
                                className="text-gray-900 hover:bg-blue-100 cursor-pointer"
                              >
                                In Transit
                              </SelectItem>
                              <SelectItem 
                                value="delivery-center"
                                className="text-gray-900 hover:bg-blue-100 cursor-pointer"
                              >
                                Delivery Center
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-800 dark:text-gray-200">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Package description" 
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-500 min-h-[80px] font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-800 dark:text-gray-200">Weight (kg)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="0.0" 
                              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-500 h-10 font-medium"
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
                          <FormLabel className="text-sm font-semibold text-gray-800 dark:text-gray-200">Dimensions (L x W x H)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., 20 x 15 x 10 cm" 
                              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-500 h-10 font-medium"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600">
                <CardHeader className="bg-green-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <FormField
                    control={form.control}
                    name="warehouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-800 dark:text-gray-200">Warehouse</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-500 h-10 font-medium">
                              <SelectValue placeholder="Select warehouse" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-500">
                            {warehouses.map((warehouse) => (
                              <SelectItem 
                                key={warehouse._id} 
                                value={warehouse._id}
                                className="text-gray-900 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer"
                              >
                                {warehouse.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-800">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white text-gray-900 border border-gray-300 h-10 font-medium">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border border-gray-300">
                            <SelectItem 
                              value="pending"
                              className="text-gray-900 hover:bg-blue-100 cursor-pointer"
                            >
                              Pending Pickup
                            </SelectItem>
                            <SelectItem 
                              value="in-transit"
                              className="text-gray-900 hover:bg-blue-100 cursor-pointer"
                            >
                              In Transit
                            </SelectItem>
                            <SelectItem 
                              value="out-for-delivery"
                              className="text-gray-900 hover:bg-blue-100 cursor-pointer"
                            >
                              Out for Delivery
                            </SelectItem>
                            <SelectItem 
                              value="delivered"
                              className="text-gray-900 hover:bg-blue-100 cursor-pointer"
                            >
                              Delivered
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isDelivered"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 bg-white rounded-lg border border-gray-300">
                        <FormControl>
                          <Checkbox
                            id="delivered"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 border-2 border-gray-400"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel 
                            htmlFor="delivered"
                            className="text-sm font-semibold text-gray-800 cursor-pointer"
                          >
                            Mark as delivered
                          </FormLabel>
                          <p className="text-xs text-gray-600">
                            Check this if the shipment has been delivered
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white border border-gray-300">
                <CardHeader className="bg-orange-100 border-b border-gray-200">
                  <CardTitle className="text-lg font-bold text-gray-900">Sender Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <FormField
                    control={form.control}
                    name="senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-800">Sender Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Sender name" 
                            className="bg-white text-gray-900 border border-gray-300 h-10 font-medium"
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
                        <FormLabel className="text-sm font-semibold text-gray-800">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="+1 (555) 123-4567" 
                            className="bg-white text-gray-900 border border-gray-300 h-10 font-medium"
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
                        <FormLabel className="text-sm font-semibold text-gray-800">Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Sender address" 
                            className="bg-white text-gray-900 border border-gray-300 min-h-[80px] font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-300">
                <CardHeader className="bg-purple-100 border-b border-gray-200">
                  <CardTitle className="text-lg font-bold text-gray-900">Delivery Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <FormField
                    control={form.control}
                    name="recipientContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-800">Contact Number</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="+1 (555) 123-4567" 
                            className="bg-white text-gray-900 border border-gray-300 h-10 font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-800">Delayed</FormLabel>
                    <Input 
                      placeholder="Reason for delay (if any)" 
                      className="bg-white text-gray-900 border border-gray-300 h-10 font-medium"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-300">
                <CardHeader className="bg-green-100 border-b border-gray-200">
                  <CardTitle className="text-lg font-bold text-gray-900">Recipient</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-800">Recipient Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Recipient name" 
                            className="bg-white text-gray-900 border border-gray-300 h-10 font-medium"
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
                        <FormLabel className="text-sm font-semibold text-gray-800">Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Recipient address" 
                            className="bg-white text-gray-900 border border-gray-300 min-h-[80px] font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border border-gray-300">
              <CardHeader className="bg-indigo-100 border-b border-gray-200">
                <CardTitle className="text-lg font-bold text-gray-900">Dates & Times</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-800">Pickup Date/Time</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="datetime-local" 
                            className="bg-white text-gray-900 border border-gray-300 h-10 font-medium"
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
                        <FormLabel className="text-sm font-semibold text-gray-800">Expected Date/Time</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="datetime-local" 
                            className="bg-white text-gray-900 border border-gray-300 h-10 font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditingShipment(null);
                  form.reset();
                }}
                className="px-6 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 font-medium"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold shadow-lg"
              >
                {isLoading ? (editingShipment ? "Updating..." : "Adding...") : (editingShipment ? "Update Shipment" : "Add Shipment")}
              </Button>
            </div>
          </form>
        </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Shipments Table */}
        <Card className="bg-white border border-gray-300">
          <CardHeader className="bg-gray-100 border-b border-gray-200">
            <CardTitle className="text-xl font-bold text-gray-900">All Shipments</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table className="bg-white">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-100">
                    <TableHead className="text-gray-900 font-semibold">Tracking ID</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Description</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Current Location</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Recipient</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Expected Date</TableHead>
                    <TableHead className="text-right text-gray-900 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow 
                      key={shipment._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <TableCell className="font-semibold text-gray-900">{shipment.trackingId}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-gray-800">{shipment.description}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeColor(shipment.status)} font-medium border`}>
                          {shipment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-800">{shipment.currentLocation}</TableCell>
                      <TableCell className="text-gray-800">{shipment.recipientName}</TableCell>
                      <TableCell className="text-gray-800">{new Date(shipment.expectedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(shipment)}
                            className="border border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(shipment._id)}
                            className="border border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {shipments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-600 text-lg">
                        <div className="flex flex-col items-center space-y-2">
                          <Package className="h-12 w-12 text-gray-400" />
                          <span>No shipments found. Create your first shipment!</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
