const express = require("express");
const http = require("http");
import { Server } from "socket.io";
const cors = require("cors");
const dotenv = require("dotenv");
import connectDB from "./utils/db";
import shipmentRoutes from "./routes/shipments";
import { registerShipmentSocket } from "./socket";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/shipments", shipmentRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Register socket logic
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);
  registerShipmentSocket(socket, io);
  
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
