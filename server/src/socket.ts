import { Server, Socket } from "socket.io";

export const registerShipmentSocket = (socket: Socket, io: Server) => {
  // Client subscribes to a specific shipment
  socket.on("shipment:join", (trackingId: string) => {
    socket.join(trackingId);
    console.log(`📦 Client ${socket.id} joined shipment ${trackingId}`);
  });

  // Delivery agent updates location
  socket.on("shipment:updateLocation", (data: { trackingId: string; latitude: number; longitude: number }) => {
    console.log("📍 Location update:", data);

    // Send update only to clients in that shipment's room
    io.to(data.trackingId).emit("shipment:locationUpdate", data);
  });
};
