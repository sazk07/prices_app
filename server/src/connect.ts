#!/usr/bin/env node

import app from "./app.js";
import { createServer } from "node:http";

const HOST = process.env["HOSTNAME"] || "127.0.0.1";
const normalizePort = (val: string): number => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    throw new Error(`${val} is not a number`);
  }
  if (port < 0) {
    throw new Error(`${val} is negative`);
  }
  return port;
};
const PORT = normalizePort(process.env["PORT"] || "3000");
const server = createServer(app);
server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  if (error.code === "EACCES") {
    console.error(`Port ${PORT} requires elevated privileges`);
    process.exit(1);
  }
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
  // TODO: handle error instead of throwing
  throw error;
});
server.listen(PORT, HOST);
server.on("listening", () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
