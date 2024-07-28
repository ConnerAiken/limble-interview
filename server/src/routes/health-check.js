import express from "express";

const router = express.Router();

/**
 * @api {GET} /health-check Health check endpoint
 * @apiDescription Health check endpoint to verify the API is running as expected
 * @apiName GetHealthCheck
 * @apiPermission none
 * @apiGroup General
 *
 * @apiSuccess (200) {boolean} running Indicates whether the express server is running, useful for uptime monitoring or paging systems
 * @apiSuccessExample {json} Successful response:
 * {
 *  "running": true
 * }
 */
router.get("/", async (req, res) => {
  res.status(200).json({
    running: true,
  });
});

export default router;
