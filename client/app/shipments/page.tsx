"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Package, Map, Plus } from "lucide-react";
import { CreateShipmentModal } from "@/components/shipments/CreateShipmentModal";

// interface Warehouse {
//   _id: string;
//   name: string;
//   location: string;
// }

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

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchShipments();
  }, []);

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
    toast.info(`Edit shipment: ${shipment.trackingId}`);
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
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "out-for-delivery":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout allowedRoles={["Admin", "Manager", "WarehouseStaff"]}>
      <div className="space-y-4 md:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Shipments
          </h1>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Shipment
            </Button>
            <Button
              onClick={() => router.push('/shipments/tracking')}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
            >
              <Map className="h-4 w-4 mr-2" />
              View Tracking
            </Button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Card className="bg-white border border-gray-300">
            <CardHeader className="bg-gray-100 border-b border-gray-200">
              <CardTitle className="text-xl font-bold text-gray-900">
                All Shipments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table className="bg-white">
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 bg-gray-100">
                      <TableHead className="text-gray-900 font-semibold">
                        Tracking ID
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Description
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Current Location
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Recipient
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Expected Date
                      </TableHead>
                      <TableHead className="text-right text-gray-900 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment) => (
                      <TableRow
                        key={shipment._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <TableCell className="font-semibold text-gray-900">
                          {shipment.trackingId}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-gray-800">
                          {shipment.description}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusBadgeColor(
                              shipment.status
                            )} font-medium border`}
                          >
                            {shipment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-800">
                          {shipment.currentLocation}
                        </TableCell>
                        <TableCell className="text-gray-800">
                          {shipment.recipientName}
                        </TableCell>
                        <TableCell className="text-gray-800">
                          {new Date(shipment.expectedDate).toLocaleDateString()}
                        </TableCell>
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
                        <TableCell
                          colSpan={7}
                          className="text-center py-12 text-gray-600 text-lg"
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <Package className="h-12 w-12 text-gray-400" />
                            <span>
                              No shipments found. Create your first shipment!
                            </span>
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

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {shipments.length === 0 ? (
            <Card className="bg-white border border-gray-300">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Package className="h-16 w-16 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">No shipments found</h3>
                  <p className="text-gray-600">Create your first shipment to get started!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <Card key={shipment._id} className="bg-white border border-gray-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {shipment.trackingId}
                      </CardTitle>
                      <Badge
                        className={`${getStatusBadgeColor(
                          shipment.status
                        )} font-medium border`}
                      >
                        {shipment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Description:</span>
                        <p className="text-sm text-gray-800 mt-1">{shipment.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-sm font-semibold text-gray-700">Location:</span>
                          <p className="text-sm text-gray-800">{shipment.currentLocation}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-700">Recipient:</span>
                          <p className="text-sm text-gray-800">{shipment.recipientName}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Expected:</span>
                        <p className="text-sm text-gray-800">
                          {new Date(shipment.expectedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(shipment)}
                        className="flex-1 border border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(shipment._id)}
                        className="flex-1 border border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateShipmentModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onShipmentCreated={fetchShipments}
      />
    </DashboardLayout>
  );
}
