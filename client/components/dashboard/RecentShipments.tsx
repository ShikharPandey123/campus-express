"use client";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

interface RecentShipmentsProps {
  shipments: Shipment[];
}

const getStatusColor = (status: "Pending" | "PickedUp" | "InTransit" | "OutForDelivery" | "Delivered" | "Delayed") => {
  switch (status) {
    case 'Pending':
      return 'orange';
    case 'PickedUp':
    case 'InTransit':
      return 'blue';
    case 'OutForDelivery':
      return 'purple';
    case 'Delivered':
      return 'green';
    case 'Delayed':
      return 'red';
    default:
      return 'gray';
  }
};

export function RecentShipments({ shipments }: RecentShipmentsProps) {
  const recentShipments = useMemo(() => {
    return shipments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10); // Show only the 10 most recent shipments
  }, [shipments]);

  if (recentShipments.length === 0) {
    return (
      <Card className="bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
            Recent Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-[hsl(var(--muted-foreground))]">No shipments found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[hsl(var(--kpi-bg))] border-[hsl(var(--border))]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Recent Shipments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(var(--border))]">
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">ID</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Sender</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Receiver</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Origin</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Destination</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Status</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentShipments.map((shipment) => (
                <TableRow key={shipment._id} className="border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/30">
                  <TableCell className="font-medium text-[hsl(var(--foreground))]">
                    {shipment._id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))]">
                    {shipment.sender}
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))]">
                    {shipment.receiver}
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))]">
                    {shipment.origin}
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))]">
                    {shipment.destination}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`bg-${getStatusColor(shipment.status)}/10 text-${getStatusColor(shipment.status)} hover:bg-${getStatusColor(shipment.status)}/20`}>
                      {shipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))]">
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
