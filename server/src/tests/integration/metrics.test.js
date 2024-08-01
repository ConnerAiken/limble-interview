import { initializeServer } from "../../server.js";
import supertest from "supertest";
import { expect } from "chai";
import { connectDatabase } from "../../db.js";

describe("Metrics Routes", async () => {
  // Connect to our test db and initialize the server
  await connectDatabase();
  const app = await initializeServer();

  describe("Labor Cost By Worker", async () => {
    it("should return exactly two workers with no parameters", async () => {
      return supertest(app)
        .get("/api/metrics/labor_cost_by_worker")
        .expect(200)
        .then((response) => {
          expect(response.body.message).to.include("Fetched labor cost by worker");
          expect(response.body.data.length).to.equal(2);
        });
    });
  });
});
