"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Warehouse {
  _id: string;
  name: string;
  location: string;
  capacity: number;
  currentCapacity: number;
  capacityUsage: number;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", capacity: 0, currentCapacity: 0 });

  const fetchWarehouses = useCallback(async () => {
    try {
      const res = await fetch("/api/warehouses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setWarehouses(data);
    } catch {
      toast.error("Failed to load warehouses");
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const addWarehouse = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/warehouses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add warehouse");
      toast.success(`${form.name} added successfully`);
      setForm({ name: "", location: "", capacity: 0, currentCapacity: 0 });
      fetchWarehouses();
      setIsModalOpen(false);
    } catch (err: unknown) {
      toast.error(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteWarehouse = async (id: string) => {
    try {
      const res = await fetch(`/api/warehouses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete warehouse");
      toast.success("Warehouse removed successfully");
      fetchWarehouses();
    } catch (err: unknown) {
      toast.error(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <DashboardLayout allowedRoles={["Admin", "Manager", "WarehouseStaff"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800 text-white">Add Warehouse</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 shadow-xl z-50">
              <DialogHeader className="border-b border-gray-200 pb-4">
                <DialogTitle className="text-xl font-semibold text-gray-900">Add New Warehouse</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Fill in the details to add a new warehouse</p>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Warehouse Name</label>
                  <Input
                    placeholder="Enter warehouse name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <Input
                    placeholder="Enter location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Capacity</label>
                  <Input
                    type="number"
                    placeholder="Enter total capacity"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Current Capacity</label>
                  <Input
                    type="number"
                    placeholder="Enter current capacity"
                    value={form.currentCapacity}
                    onChange={(e) => setForm({ ...form, currentCapacity: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button 
                  onClick={addWarehouse} 
                  disabled={loading}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </span>
                  ) : "Add Warehouse"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Location</TableHead>
                <TableHead className="font-semibold text-gray-900">Capacity</TableHead>
                <TableHead className="font-semibold text-gray-900">Current</TableHead>
                <TableHead className="font-semibold text-gray-900">Usage</TableHead>
                <TableHead className="font-semibold text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.map((wh) => (
                <TableRow key={wh._id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{wh.name}</TableCell>
                  <TableCell className="text-gray-700">{wh.location}</TableCell>
                  <TableCell className="text-gray-700">{wh.capacity.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-700">{wh.currentCapacity.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress value={wh.capacityUsage} className="w-24 h-2" />
                      <span className="text-sm font-medium text-gray-900 min-w-[45px]">{wh.capacityUsage.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWarehouse(wh._id)}
                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {warehouses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No warehouses found. Add your first warehouse to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
