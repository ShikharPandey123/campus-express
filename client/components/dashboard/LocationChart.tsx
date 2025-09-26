"use client";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

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

interface LocationChartProps {
  shipments: Shipment[];
}

const chartColors = [
  "hsl(var(--chart-blue))",
  "hsl(var(--chart-orange))",
  "hsl(var(--chart-green))",
  "hsl(var(--chart-red))",
  "hsl(var(--chart-purple))",
  "hsl(var(--chart-cyan))",
];

export function LocationChart({ shipments }: LocationChartProps) {
  const chartData = useMemo(() => {
    const locationCounts = shipments.reduce((acc, shipment) => {
      // Use current location or recipient address as the location
      let location = shipment.currentLocation || shipment.recipientAddress || 'Unknown Location';
      
      // Clean up location names for better display
      location = location
        .replace(' Processing Center', '')
        .replace(' Distribution Center', '')
        .replace(' Sorting Facility', '')
        .replace(' Warehouse', '')
        .replace(' Hub', '');
      
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationCounts)
      .map(([location, count], index) => ({
        name: location,
        value: count,
        color: chartColors[index % chartColors.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Limit to top 6 locations for better visibility
  }, [shipments]);

  if (chartData.length === 0) {
    return (
      <Card className="bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
            Packages by Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-[hsl(var(--muted-foreground))]">No location data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Packages by Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="40%"
                cy="50%"
                innerRadius={35}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconSize={10}
                wrapperStyle={{
                  paddingLeft: "20px",
                  fontSize: "12px",
                  lineHeight: "20px"
                }}
                formatter={(value, entry) => (
                  <span 
                    className="text-xs text-[hsl(var(--muted-foreground))] inline-block" 
                    title={value}
                  >
                    {value} ({entry.payload?.value})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
