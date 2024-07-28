import { areParamsValid, constructFilteringConditions } from "../utils.js";
import { expect } from "chai";

describe("Utility functions", () => {
  describe("Dynamic Filtering SQL Conditions", () => {
    it("should return an empty string when no query parameters are passed", async () => {
      const input = {
        query: {},
      };

      const output = constructFilteringConditions(input);
      expect(output).to.equal("");
    });

    it("should return a WHERE condition when query parameters are passed", async () => {
      const input = {
        query: {
          completed: "true",
          location_ids: "1,2,3",
          worker_ids: "4,5,6",
        },
      };

      const output = constructFilteringConditions(input);
      expect(output).to.contain("AND t.completed = :completed");
      expect(output).to.contain("AND l.id IN (:location_ids)");
      expect(output).to.contain("AND w.id IN (:worker_ids)");
    });
  });
  describe("Parameter Validation", () => {
    describe("GET /metrics/*?completed=true&location_ids=1,2,3&worker_ids=4,5,6", () => {
      it("should return success true and message 'Params are valid' when all query parameters are valid", async () => {
        const input = {
          query: {
            completed: "true",
            location_ids: "1,2,3",
            worker_ids: "4,5,6",
          },
        };

        const output = areParamsValid(input);
        expect(output.success).to.equal(true);
        expect(output.message).to.equal("Params are valid");
      });
    });

    describe("GET /metrics/*?completed=", () => {
      it("should catch issues with the completed query string parameter having invalid content", async () => {
        const input = {
          query: {
            completed: "notabool",
          },
        };

        const output = areParamsValid(input);
        expect(output.success).to.equal(false);
        expect(output.message).to.contain("The completed query string param must be a boolean");
      });

      it("should accept true and false", async () => {
        let output;

        output = areParamsValid({
          query: {
            completed: "true",
          },
        });

        expect(output.success).to.equal(true);

        output = areParamsValid({
          query: {
            completed: "false",
          },
        });

        expect(output.success).to.equal(true);
      });
    });

    describe("GET /metrics/*?location_ids=", () => {
      it("should catch issues with the location_ids query string parameter having invalid content", async () => {
        const input = {
          query: {
            location_ids: "notanint",
          },
        };

        const output = areParamsValid(input);
        expect(output.success).to.equal(false);
        expect(output.message).to.contain(
          "The location_ids query string param must be a comma-separated list of integers",
        );
      });

      it("should accept a single integer", async () => {
        const input = {
          query: {
            location_ids: "1",
          },
        };

        const output = areParamsValid(input);
        expect(output.success).to.equal(true);
      });

      it("should accept comma seperated integers", async () => {
        const input = {
          query: {
            location_ids: "1,2,3",
          },
        };

        const output = areParamsValid(input);
        expect(output.success).to.equal(true);
      });
    });

    describe("GET /metrics/*?worker_ids=", () => {
      it("should catch issues with the worker_ids query string parameter having invalid content", async () => {
        const input = {
          query: {
            worker_ids: "notanint",
          },
        };

        const output = areParamsValid(input);
        expect(output.success).to.equal(false);
        expect(output.message).to.contain(
          "The worker_ids query string param must be a comma-separated list of integers",
        );
      });

      it("should accept a single integer", async () => {
        const input = {
          query: {
            worker_ids: "1",
          },
        };

        const output = areParamsValid(input);
        expect(output.success).to.equal(true);
      });

      it("should accept comma seperated integers", async () => {
        const input = {
          query: {
            worker_ids: "1,2,3",
          },
        };

        const output = areParamsValid(input);
        expect(output.success).to.equal(true);
      });
    });
  });
});
