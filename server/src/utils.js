import logger from "./logger.js";

/**
 * Constructs the filtering conditions for a SQL query based on the request parameters.
 * @param {object} req - The request object.
 * @returns {string} The SQL conditions.
 */
export const constructFilteringConditions = (req) => {
  let sqlConditions = ``;

  if (req.query?.completed !== undefined) {
    sqlConditions += ` AND t.completed = :completed `;
  }
  if (req.query?.location_ids !== undefined) {
    sqlConditions += ` AND t.id IN (:location_ids) `;
  }
  if (req.query?.worker_ids !== undefined) {
    sqlConditions += ` AND lt.id IN (:worker_ids) `;
  }

  return sqlConditions;
};

/**
 * Checks if the request parameters are valid.
 * @param {object} req - The request object.
 * @returns {object} An object indicating the success and message.
 */
export const areParamsValid = (req) => {
  let errorMessage = "";

  if (
    req.query?.completed !== undefined &&
    req.query.completed !== "true" &&
    req.query.completed !== "false"
  ) {
    errorMessage = "The completed query string param must be a boolean";
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
