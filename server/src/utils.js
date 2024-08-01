import logger from "./logger.js";

/**
 * Checks if the request parameters are valid.
 * @param {object} req - The request object.
 * @returns {object} An object indicating the success and message.
 */
export const areParamsValid = (req) => {
  let errorMessage = "";

  if (req.query?.completed !== undefined && req.query.completed !== "1" && req.query.completed !== "0") {
    errorMessage = "The completed query string param must be an integer";
  }
  if (req.query?.location_ids !== undefined && !req.query.location_ids.match(/^(\d+,)*\d+$/)) {
    errorMessage = "The location_ids query string param must be a comma-separated list of integers";
  }
  if (req.query?.worker_ids !== undefined && !req.query.worker_ids.match(/^(\d+,)*\d+$/)) {
    errorMessage = "The worker_ids query string param must be a comma-separated list of integers";
  }

  if (errorMessage) {
    logger.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }

  return {
    success: true,
    message: "Params are valid",
  };
};
