import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import ShipmentMap from "@/components/shipments/ShipmentMap";
export default function TrackingPage() {
  return (
    <DashboardLayout allowedRoles={["Admin", "Manager", "WarehouseStaff"]}>
      <h1 className="text-2xl font-bold mb-4">Live Shipment Tracking</h1>
      <ShipmentMap />
    </DashboardLayout>
  );
}
