import * as mariadb from "mariadb";
import logger from "./logger.js";

// Allow the db conn to be re-used so we don't instantate a new connection pool for every request
let conn;

/**
 * Connects to the database.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 */
export const connectDatabase = async () => {
  logger.info("Connecting to database");

  const db = mariadb.createPool({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE_NAME"],
  });

  conn = await db.getConnection();
};

/**
 * Returns the database connection.
 * @returns {object} The database connection.
 */
export const getDatabaseConnection = () => {
  return conn;
};
