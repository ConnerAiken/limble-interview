import { expect } from "chai";
import { initializeServer } from "../../server.js";
import supertest from "supertest";

describe("Default Routes", () => {
  it("should return success when the app is running", async () => {
    const app = await initializeServer();

    return supertest(app)
      .get("/api/unknown-route")
      .expect(501)
      .then((response) => {
        expect(response.body.message).to.include(
          "The API route you are attempting to access has not been implemented",
        );
        expect(response.body.data.length).to.equal(0);
      });
  });
});
