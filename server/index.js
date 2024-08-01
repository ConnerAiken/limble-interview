import { connectDatabase } from "./src/db.js";
import { initializeServer } from "./src/server.js";
import logger from "./src/logger.js";

const port = process.env.API_PORT || 3000;

async function main() {
  // Intentionally do not catch errors here, so that the process will crash and restart
  await connectDatabase();

  const app = await initializeServer();

  app.listen(port, "0.0.0.0", () => {
    logger.info(`App listening on ${port}.`);
  });
}

await main();
