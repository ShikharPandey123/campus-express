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

interface RecentShipmentsProps {
  shipments: Shipment[];
}

const getStatusColor = (status: "pending" | "in-transit" | "out-for-delivery" | "delivered") => {
  switch (status) {
    case 'pending':
      return 'orange';
    case 'in-transit':
      return 'blue';
    case 'out-for-delivery':
      return 'purple';
    case 'delivered':
      return 'green';
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
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Tracking ID</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Description</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Sender</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Recipient</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Current Location</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Status</TableHead>
                <TableHead className="text-[hsl(var(--muted-foreground))] font-medium">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentShipments.map((shipment) => (
                <TableRow key={shipment._id} className="border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/30">
                  <TableCell className="font-medium text-[hsl(var(--foreground))]">
                    {shipment.trackingId}
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))] max-w-[150px] truncate">
                    {shipment.description}
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))]">
                    {shipment.senderName}
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))]">
                    {shipment.recipientName}
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))]">
                    {shipment.currentLocation}
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
