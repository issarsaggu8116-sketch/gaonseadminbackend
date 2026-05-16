import { app } from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

// ✅ Create HTTP server
const server = createServer(app);

// ✅ Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// ✅ Make globally accessible
global.io = io;

// ✅ Socket connection
io.on("connection", (socket) => {
  console.log("⚡ Admin connected:", socket.id);

  // Join city room
  socket.on("joinCity", (cityId) => {
    socket.join(cityId);
    console.log(`📍 Joined city room: ${cityId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Admin disconnected:", socket.id);
  });
});

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Admin Server running on port ${PORT}`);
});
