"use client";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

interface Shipment {
  _id: string;
  sender: string;
  receiver: string;
  origin: string;
  destination: string;
  status: "Pending" | "PickedUp" | "InTransit" | "OutForDelivery" | "Delivered" | "Delayed";
  createdAt: string;
  updatedAt: string;
}

interface ShipmentChartProps {
  shipments: Shipment[];
}

const colors = {
  pending: "hsl(var(--chart-orange))",
  pickedup: "hsl(var(--chart-blue))",
  intransit: "hsl(var(--chart-blue))",
  outfordelivery: "hsl(var(--chart-green))",
  delivered: "hsl(var(--chart-green))",
  delayed: "hsl(var(--chart-red))",
};

export function ShipmentChart({ shipments }: ShipmentChartProps) {
  const chartData = useMemo(() => {
    const statusCounts = shipments.reduce((acc, shipment) => {
      const status = shipment.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts)
      .map(([status, count]) => ({
        name: status === 'pickedup' ? 'Picked Up' : 
              status === 'intransit' ? 'In Transit' : 
              status === 'outfordelivery' ? 'Out for Delivery' : 
              status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        category: status.replace(/\s+/g, '').toLowerCase(),
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
