"use client";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

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
      // Use destination as the location
      const location = shipment.destination || 'Unknown Location';
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
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
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
