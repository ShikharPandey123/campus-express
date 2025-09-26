import { Server, Socket } from "socket.io";

export const registerShipmentSocket = (socket: Socket, io: Server) => {
  // Listen for location updates from delivery agent
  socket.on("shipment:updateLocation", (data) => {
    console.log("📍 Location update:", data);

    // Broadcast location to all clients subscribed to this shipment
    io.emit(`shipment:${data.trackingId}:location`, data);
  });
};
