"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Truck, Package, Clock, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { ShipmentChart } from "@/components/dashboard/ShipmentChart";
import { LocationChart } from "@/components/dashboard/LocationChart";
import { RecentShipments } from "@/components/dashboard/RecentShipments";

interface Shipment {
  _id: string;
  trackingId: string;
  description: string;
  currentLocation: string;
  weight: string;
  dimensions: string;
  status: "pending" | "in-transit" | "out-for-delivery" | "delivered";
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
  updatedAt: string;
}

interface KPIMetrics {
  outForDelivery: number;
  pendingPickup: number;
  inTransit: number;
  deliveredToday: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetrics>({
    outForDelivery: 0,
    pendingPickup: 0,
    inTransit: 0,
    deliveredToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          router.push('/login');
          return;
        }

        const response = await fetch('/api/shipments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch shipments');
        }
        
        const data = await response.json();
        setShipments(data);
        calculateKPIMetrics(data);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [router]);

  const calculateKPIMetrics = (shipmentsData: Shipment[]) => {
    const today = new Date().toDateString();
    
    const metrics = shipmentsData.reduce(
      (acc, shipment) => {
        switch (shipment.status) {
          case 'out-for-delivery':
            acc.outForDelivery += 1;
            break;
          case 'pending':
            acc.pendingPickup += 1;
            break;
          case 'in-transit':
            acc.inTransit += 1;
            break;
          case 'delivered':
            // Check if delivered today
            if (new Date(shipment.updatedAt).toDateString() === today) {
              acc.deliveredToday += 1;
            }
            break;
        }
        return acc;
      },
      { outForDelivery: 0, pendingPickup: 0, inTransit: 0, deliveredToday: 0 }
    );

    setKpiMetrics(metrics);
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["Admin", "Manager", "WarehouseStaff"]}>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))] rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="xl:col-span-2 h-80 bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))] rounded-lg animate-pulse" />
            <div className="xl:col-span-1 h-80 bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))] rounded-lg animate-pulse" />
          </div>
          <div className="h-96 bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))] rounded-lg animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={["Admin", "Manager", "WarehouseStaff"]}>
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KPICard 
            title="Out for Delivery" 
            value={kpiMetrics.outForDelivery.toLocaleString()} 
            icon={Truck} 
            iconColor="blue" 
          />
          <KPICard 
            title="Pending Pickup" 
            value={kpiMetrics.pendingPickup.toLocaleString()} 
            icon={Package} 
            iconColor="orange" 
          />
          <KPICard 
            title="In Transit" 
            value={kpiMetrics.inTransit.toLocaleString()} 
            icon={Clock} 
            iconColor="orange" 
          />
          <KPICard 
            title="Delivered Today" 
            value={kpiMetrics.deliveredToday.toLocaleString()} 
            icon={CheckCircle} 
            iconColor="green" 
          />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2">
            <ShipmentChart shipments={shipments} />
          </div>
          <div className="xl:col-span-1">
            <LocationChart shipments={shipments} />
          </div>
        </div>
        <RecentShipments shipments={shipments} />
      </div>
    </DashboardLayout>
  );
}
