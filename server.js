import { app } from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";


const server = createServer(app);

// 🔌 SOCKET SERVER
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ NOW assign AFTER creation
global.io = io;

// 🌐 SOCKET CONNECTION
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

server.listen(process.env.PORT, () => {
  console.log(`🚀 Admin Server running on port ${process.env.PORT}`);
});