"use client";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

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

interface ShipmentChartProps {
  shipments: Shipment[];
}

const colors = {
  pending: "hsl(var(--chart-orange))",
  "in-transit": "hsl(var(--chart-blue))",
  "out-for-delivery": "hsl(var(--chart-purple))",
  delivered: "hsl(var(--chart-green))",
};

export function ShipmentChart({ shipments }: ShipmentChartProps) {
  const chartData = useMemo(() => {
    const statusCounts = shipments.reduce((acc, shipment) => {
      const status = shipment.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts)
      .map(([status, count]) => ({
        name: status === 'in-transit' ? 'In Transit' : 
              status === 'out-for-delivery' ? 'Out for Delivery' : 
              status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        category: status,
      }))
      .sort((a, b) => b.value - a.value);
  }, [shipments]);

  if (chartData.length === 0) {
    return (
      <Card className="bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
            Shipment Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-[hsl(var(--muted-foreground))]">No shipment data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Shipment Status Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[entry.category as keyof typeof colors] || "hsl(var(--chart-blue))"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
