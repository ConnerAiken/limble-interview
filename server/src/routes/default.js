import express from "express";

const router = express.Router();

/**
 * @api {GET} /* Unimplemented API route
 * @apiName UnimplementedRoute
 * @apiPermission none
 * @apiGroup General
 *
 * @apiError (501) {string} message The error message indicating the API route has not been implemented
 * @apiError (501) {object[]} data An empty array
 * @apiErrorExample {json} Unimplemented API route:
 * {
 *   "message": "The API route you are attempting to access has not been implemented",
 *   "data": []
 * }
 */

router.get("*", function (req, res) {
  res.status(501).send({
    message: "The API route you are attempting to access has not been implemented",
    data: [],
  });
});

export default router;
