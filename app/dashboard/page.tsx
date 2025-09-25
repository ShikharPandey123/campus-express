import { Truck, Package, Clock, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { ShipmentChart } from "@/components/dashboard/ShipmentChart";
import { LocationChart } from "@/components/dashboard/LocationChart";
import { RecentShipments } from "@/components/dashboard/RecentShipments";

export default function DashboardPage() {
  return (
    <DashboardLayout allowedRoles={["Admin", "Manager", "WarehouseStaff"]}>
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KPICard title="Out for Delivery" value="1,289" icon={Truck} iconColor="blue" />
          <KPICard title="Pending Pickup" value="354" icon={Package} iconColor="orange" />
          <KPICard title="In Transit" value="127" icon={Clock} iconColor="orange" />
          <KPICard title="Delivered Today" value="278" icon={CheckCircle} iconColor="green" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2">
            <ShipmentChart />
          </div>
          <div className="xl:col-span-1">
            <LocationChart />
          </div>
        </div>
        <RecentShipments />
      </div>
    </DashboardLayout>
  );
}
