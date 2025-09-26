import { io } from "socket.io-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const socket = io(SERVER_URL, {
  transports: ["websocket"],
});
