import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env.config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("DB_URL =", envVars.DB_URL);
    console.log("MongoDB connected successfully✔");
    server = app.listen(envVars.PORT, () => {
      console.log(`server running at port ${envVars.PORT} 💻`);
    });
  } catch (error) {
    console.log("MongoDB connection failed!!", error);
  }
};

startServer();

process.on("unhandledRejection", (error) => {
  console.log("unhandled rejection detected...! Server shutting down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log("uncaught exception detected...Server shutting down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received...Server shutting down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
