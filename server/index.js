import express from "express";
import defaultRoutes from "./src/routes/default.js";  
import { connectDatabase } from "./src/db.js";
import logger from "./src/logger.js";
const app = express();
const port = process.env.API_PORT || 3000;

async function main() {
  // Intentionally do not catch errors here, so that the process will crash and restart
  await connectDatabase();
 
  app.use("/api/health-check", healthCheckRoutes);
  app.use("*", defaultRoutes);

  app.listen(port, "0.0.0.0", () => {
    logger.info(`App listening on ${port}.`);
  });
}

await main();
