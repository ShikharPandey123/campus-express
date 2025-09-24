"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Transit A", value: 35, color: "hsl(var(--chart-blue))" },
  { name: "Warehouse A", value: 25, color: "hsl(var(--chart-orange))" },
  { name: "In Transit B", value: 40, color: "hsl(var(--chart-green))" },
];

export function LocationChart() {
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
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
