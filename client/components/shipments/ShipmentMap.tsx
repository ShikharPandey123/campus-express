"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";

const shipmentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1048/1048313.png",
  iconSize: [32, 32],
});

interface Shipment {
  _id: string;
  trackingId: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | string;
  status: string;
}

// Sample location mapping - you can expand this
const locationCoordinates: { [key: string]: [number, number] } = {
  "Downtown": [28.6139, 77.209],
  "Industrial District": [28.5355, 77.391],
  "Main Warehouse": [28.7041, 77.1025],
  "Secondary Warehouse": [28.4595, 77.0266],
  "in-transit": [28.6139, 77.209], // Default location for in-transit
  "delivery-center": [28.6129, 77.2295],
};

export default function ShipmentMap() {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");

    fetch("/api/shipments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setShipments(data));

    socket.on("shipmentUpdated", (updatedShipment: Shipment) => {
      setShipments((prev) =>
        prev.map((s) => (s._id === updatedShipment._id ? updatedShipment : s))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MapContainer
      center={[28.6139, 77.209]} // Default: New Delhi
      zoom={5}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shipments
        .map((shipment) => {
          // Get coordinates based on currentLocation type
          let coordinates: [number, number] | null = null;
          
          if (typeof shipment.currentLocation === 'object' && 
              shipment.currentLocation.latitude && 
              shipment.currentLocation.longitude) {
            // If currentLocation is an object with coordinates
            coordinates = [
              shipment.currentLocation.latitude,
              shipment.currentLocation.longitude
            ];
          } else if (typeof shipment.currentLocation === 'string') {
            // If currentLocation is a string, map it to coordinates
            coordinates = locationCoordinates[shipment.currentLocation] || null;
          }
          
          return coordinates ? { ...shipment, coordinates } : null;
        })
        .filter((item): item is Shipment & { coordinates: [number, number] } => item !== null)
        .map((shipment) => (
        <Marker
          key={shipment._id}
          position={shipment.coordinates}
          icon={shipmentIcon}
        >
          <Popup>
            <strong>{shipment.trackingId}</strong>
            <br />
            Status: {shipment.status}
            <br />
            Location: {typeof shipment.currentLocation === 'string' 
              ? shipment.currentLocation 
              : `${shipment.currentLocation.latitude}, ${shipment.currentLocation.longitude}`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
