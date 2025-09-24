"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "In Transit", value: 425, category: "transit" },
  { name: "In Transit", value: 380, category: "transit2" },
  { name: "Debit", value: 320, category: "debit" },
  { name: "Pending", value: 280, category: "pending" },
  { name: "Performed", value: 350, category: "performed" },
  { name: "Completes", value: 300, category: "completes" },
  { name: "Recard", value: 450, category: "recard" },
];

const colors = {
  transit: "hsl(var(--chart-blue))",
  transit2: "hsl(var(--chart-orange))",
  debit: "hsl(var(--chart-blue))",
  pending: "hsl(var(--chart-orange))",
  performed: "hsl(var(--chart-blue))",
  completes: "hsl(var(--chart-orange))",
  recard: "hsl(var(--chart-blue))",
};

export function ShipmentChart() {
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
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.category as keyof typeof colors]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
