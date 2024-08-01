import express from "express";
import defaultRoutes from "./routes/default.js";
import metricsRoutes from "./routes/metrics.js";
import healthCheckRoutes from "./routes/health-check.js";
import compression from "compression";

export async function initializeServer() {
  const app = express();

  // Enable g-zip compression since we are serving large JSON payloads, caching is done within the router level
  app.use(compression());

  // Add our routes
  app.use("/api/health-check", healthCheckRoutes);
  app.use("/api/metrics", metricsRoutes);
  app.use("*", defaultRoutes);

  return app;
}
