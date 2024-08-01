import { expect } from "chai";
import { initializeServer } from "../../server.js";
import supertest from "supertest";

describe("Health Check Routes", () => {
  it("should return success when the app is running", async () => {
    const app = await initializeServer();

    return supertest(app)
      .get("/api/health-check")
      .expect(200)
      .then((response) => {
        expect(response.body.running).to.equal(true);
      });
  });
});
