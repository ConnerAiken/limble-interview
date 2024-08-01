import expressCache from "cache-express";
import express from "express";
import logger from "../logger.js";
import { areParamsValid } from "../utils.js";
import { getDatabaseConnection } from "../db.js";

const router = express.Router();

// Cache our API request to limit DB queries. If CACHE_TIMEOUT_MINUTES is not set, default to 5 minutes
const cacheTimeout = process.env.CACHE_TIMEOUT_MINUTES
  ? process.env.CACHE_TIMEOUT_MINUTES * 60000
  : 60000 * 5;

/**
 * @api {GET} /metrics/labor_cost_by_worker Get Labor Cost by Worker
 * @apiName GetLaborCostByWorker
 * @apiPermission none
 * @apiGroup Metrics
 *
 * @apiParam {Integer} [completed] Filter by completed tasks
 * @apiParam {String} [location_ids] Filter by location IDs
 * @apiParam {String} [worker_ids] Filter by worker IDs
 * @apiParamExample {json} Parameter Examples:
 * {
 *    api/metrics/labor_cost_by_worker?completed=1&location_ids=1,2,3&worker_ids=4,5,6
 * }
 *
 * @apiSuccess (200) {String} message A message indicating the request was sucessful
 * @apiSuccess (200) {Object[]} data Array of labor costs by location
 * @apiSuccessExample {json} Successful response:
 * {
 * "message": "Fetched labor cost by worker",
 * "data": [
 * {
 * "worker_id": 1,
 * "username": "user1",
 * "labor_cost": 100
 * }
 * ]
 * }
 *
 * @apiError (400) {string} message Error message indicating that the user request was invalid
 * @apiError (400) {Object[]} data Empty array
 * @apiErrorExample {json} Invalid query string parameter:
 * {
 * "message": "The completed query string param must be an integer"
 * "data": []
 * }
 *
 * @apiError (500) {string} message Error message indicating that a server error occurred
 * @apiError (500) {Object[]} data Empty array
 * @apiErrorExample {json} Error querying the database:
 * {
 * "message": "Error querying the DB"
 * "data": []
 * }
 */
router.get(
  "/labor_cost_by_worker",
  // Middleware 1: Cache the response for a set amount of time
  expressCache({
    timeOut: cacheTimeout,
  }),
  // Handle the request
  async (req, res) => {
    const conn = getDatabaseConnection();

    // ============================
    // Input Validation
    // ==========================
    const paramStatus = areParamsValid(req);
    if (!paramStatus.success) {
      return res.status(400).json({
        message: paramStatus.message,
        data: [],
      });
    }

    // ============================
    // SQL Logic
    // ==========================
    const sqlQuery = `
      SELECT
        w.id as worker_id,
        w.username,  
        ROUND(COALESCE(SUM(lt.time_seconds) / 3600 * w.hourly_wage, 0), 2) as labor_cost
      FROM
          workers w
      LEFT JOIN
          logged_time lt ON w.id = lt.worker_id 
      LEFT JOIN 
          tasks t ON lt.task_id = t.id 
      WHERE
          true=true
          ${req.query?.completed !== undefined ? "AND t.completed = :completed" : ""}
          ${req.query?.location_ids !== undefined ? "AND t.location_id IN (:location_ids)" : ""}
          ${req.query?.worker_ids !== undefined ? "AND w.id IN (:worker_ids)" : ""}
      GROUP BY 
          w.id, w.username
      ORDER BY
          w.id ASC;
  `;

    try {
      const results = await conn.query(
        {
          namedPlaceholders: true,
          sql: sqlQuery,
        },
        {
          completed: req.query?.completed ? 1 : 0,
          location_ids: req.query?.location_ids ? req.query.location_ids.split(",") : [],
          worker_ids: req.query?.worker_ids ? req.query.worker_ids.split(",") : [],
        },
      );

      return res.status(200).json({
        message: "Fetched labor cost by worker",
        data: results,
      });
    } catch (e) {
      logger.error("Error querying the DB: ", e);
      return res.status(500).send({
        message: "Error querying the DB",
        data: [],
      });
    }
  },
);

/**
 * @api {GET} /metrics/labor_cost_by_location Get Labor Cost by Location
 * @apiName GetLaborCostByLocation
 * @apiPermission none
 * @apiGroup Metrics
 *
 * @apiParam {Integer} [completed] Filter by completed tasks
 * @apiParam {String} [location_ids] Filter by location IDs
 * @apiParam {String} [worker_ids] Filter by worker IDs
 * @apiParamExample {json} Parameter Examples:
 * {
 *    api/metrics/labor_cost_by_location?completed=1&location_ids=1,2,3&worker_ids=4,5,6
 * }
 *
 * @apiSuccess (200) {String} message A message indicating the request was sucessful
 * @apiSuccess (200) {Object[]} data Array of labor costs by location
 * @apiSuccessExample {json} Successful response:
 * {
 * "message": "Fetched labor cost by location",
 * "data": [
 * {
 * "worker_id": 1,
 * "username": "user1",
 * "labor_cost": 100
 * }
 * ]
 * }
 *
 * @apiError (400) {string} message Error message indicating that the user request was invalid
 * @apiError (400) {Object[]} data Empty array
 * @apiErrorExample {json} Invalid query string parameter:
 * {
 * "message": "The completed query string param must be an integer"
 * "data": []
 * }
 *
 * @apiError (500) {string} message Error message indicating that a server error occurred
 * @apiError (500) {Object[]} data Empty array
 * @apiErrorExample {json} Error querying the database:
 * {
 * "message": "Error querying the DB"
 * "data": []
 * }
 */
router.get(
  "/labor_cost_by_location",
  // Middleware 1: Cache the response for a set amount of time
  expressCache({
    timeOut: cacheTimeout,
  }),
  async (req, res) => {
    const conn = getDatabaseConnection();

    // ============================
    // Input Validation
    // ==========================
    const paramStatus = areParamsValid(req);
    if (!paramStatus.success) {
      return res.status(400).json({
        message: paramStatus.message,
        data: [],
      });
    }

    // ============================
    // SQL Logic
    // ==========================
    const sqlQuery = `
             SELECT 
                 l.id AS location_id,
                 l.name AS location_name, 
                 ROUND(COALESCE(SUM(lt.time_seconds) / 3600 * w.hourly_wage, 0), 2) as labor_cost
             FROM 
                 locations l  
             LEFT JOIN 
                 tasks t ON l.id = t.location_id
             LEFT JOIN 
                 logged_time lt ON t.id = lt.task_id
             LEFT JOIN 
                 workers w ON lt.worker_id = w.id 
             WHERE
                 true=true 
                 ${req.query?.completed !== undefined ? "AND t.completed = :completed" : ""}
                 ${req.query?.location_ids !== undefined ? "AND l.id IN (:location_ids)" : ""}
                 ${req.query?.worker_ids !== undefined ? "AND lt.worker_id IN (:worker_ids)" : ""}
             GROUP BY 
                 l.id, l.name
             ORDER BY
                 l.id ASC; 
     `;

    try {
      const results = await conn.query(
        {
          namedPlaceholders: true,
          sql: sqlQuery,
        },
        {
          completed: req.query?.completed ? 1 : 0,
          location_ids: req.query.location_ids ? req.query.location_ids.split(",") : [],
          worker_ids: req.query?.worker_ids ? req.query.worker_ids.split(",") : [],
        },
      );

      return res.status(200).json({
        message: "Fetched labor cost by location",
        data: results,
      });
    } catch (e) {
      logger.error("Error querying the DB: ", e);
      return res.status(500).send({
        message: "Error querying the DB",
        data: [],
      });
    }
  },
);

export default router;
