import { areParamsValid } from "./../../utils.js";
import { expect } from "chai";

describe("Utility functions", () => {
  describe("Parameter Validation", () => {
    describe("GET /metrics/*?completed=1&location_ids=1,2,3&worker_ids=4,5,6", () => {
      it("should return success true and message 'Params are valid' when all query parameters are valid", async () => {
        const input = {
          query: {
            completed: "1",
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
        expect(output.message).to.contain("The completed query string param must be an integer");
      });

      it("should accept 1 and 0", async () => {
        let output;

        output = areParamsValid({
          query: {
            completed: "1",
          },
        });

        expect(output.success).to.equal(true);

        output = areParamsValid({
          query: {
            completed: "0",
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
