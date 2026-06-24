import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import app from "./app.js";
import initializeSocket from "./socket/socket.js";

dotenv.config({ path: "../.env" });

connectDB()
  .then(() => {
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      },
    });

    initializeSocket(io);

    server.listen(process.env.PORT || 3000, () => {
      console.log(
        `✅ Server is running on http://localhost:${
          process.env.PORT || 3000
        }`
      );
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });