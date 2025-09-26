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
  };
  status: string;
}

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
      {shipments.map((shipment) => (
        <Marker
          key={shipment._id}
          position={[
            shipment.currentLocation.latitude,
            shipment.currentLocation.longitude,
          ]}
          icon={shipmentIcon}
        >
          <Popup>
            <strong>{shipment.trackingId}</strong>
            <br />
            Status: {shipment.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
