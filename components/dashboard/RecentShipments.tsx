import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const shipments = [
  {
    trackingId: "Tracking ID",
    recipient: "1",
    status: "231",
    status2: "2315",
    location: "0422",
    delivery: "0 800 11",
    responsibility: "800 %",
  },
  {
    trackingId: "MeningwakA",
    recipient: "1",
    status: "275",
    status2: "2315",
    location: "0018",
    delivery: "0 800 17",
    responsibility: "",
  },
  {
    trackingId: "Pretty MeningwakA",
    recipient: "100M",
    status: "265",
    status2: "8811",
    location: "0037",
    delivery: "1 800 12",
    responsibility: "400 %",
  },
  {
    trackingId: "Myshfield Post Pesata",
    recipient: "7533",
    status: "247",
    status2: "2845",
    location: "8007",
    delivery: "1 800 12",
    responsibility: "400 %",
  },
];

export function RecentShipments() {
  return (
    <Card className="bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Recent Shipments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-[hsl(var(--border))]">
              <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Tracking ID</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Recipient</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Status</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Status</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Location</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Expected Delivery</TableHead>
              <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Responsibility</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment, index) => (
              <TableRow key={index} className="border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/30">
                <TableCell className="font-medium text-[hsl(var(--foreground))]">{shipment.trackingId}</TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))]">{shipment.recipient}</TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))]">{shipment.status}</TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))]">{shipment.status2}</TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))]">{shipment.location}</TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))]">{shipment.delivery}</TableCell>
                <TableCell className="text-[hsl(var(--muted-foreground))]">{shipment.responsibility}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
