import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: "blue" | "orange" | "green";
}

export function KPICard({ title, value, icon: Icon, iconColor = "blue" }: KPICardProps) {
  const iconColorClasses = {
    blue: "bg-[hsl(var(--chart-blue))] text-white",
    orange: "bg-[hsl(var(--chart-orange))] text-white",
    green: "bg-[hsl(var(--chart-green))] text-white",
  };

  return (
    <Card className="bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))] hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1 truncate">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))]">{value}</p>
          </div>
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 ${iconColorClasses[iconColor]}`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
