import express from "express";
import defaultRoutes from "./src/routes/default.js";
import metricsRoutes from "./src/routes/metrics.js";
import healthCheckRoutes from "./src/routes/health-check.js";
import compression from "compression";
import { connectDatabase } from "./src/db.js";
import logger from "./src/logger.js";
const app = express();
const port = process.env.API_PORT || 3000;

async function main() {
  // Intentionally do not catch errors here, so that the process will crash and restart
  await connectDatabase();

  // Enable g-zip compression since we are serving large JSON payloads, caching is done within the router level
  app.use(compression());
  app.use("/api/health-check", healthCheckRoutes);
  app.use("/api/metrics", metricsRoutes);
  app.use("*", defaultRoutes);

  app.listen(port, "0.0.0.0", () => {
    logger.info(`App listening on ${port}.`);
  });
}

await main();
