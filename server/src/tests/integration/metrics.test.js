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

          response.body.data.forEach((worker) => {
            expect(worker).to.have.property("worker_id");
            expect(worker).to.have.property("username");
            expect(worker).to.have.property("labor_cost");
            expect(worker.labor_cost).to.equal("30.00");
          });
        });
    });

    it("should allow filtering of worker ids via GET parameter", async () => {
      return supertest(app)
        .get("/api/metrics/labor_cost_by_worker?worker_ids=1")
        .expect(200)
        .then((response) => {
          expect(response.body.message).to.include("Fetched labor cost by worker");
          expect(response.body.data.length).to.equal(1);
          expect(response.body.data[0]).to.have.property("worker_id");
          expect(response.body.data[0]).to.have.property("username");
          expect(response.body.data[0]).to.have.property("labor_cost");
          expect(response.body.data[0].labor_cost).to.equal("30.00");
        });
    });

    it("should allow filtering of location ids via GET parameter", async () => {
      return supertest(app)
        .get("/api/metrics/labor_cost_by_worker?location_ids=2")
        .expect(200)
        .then((response) => {
          expect(response.body.message).to.include("Fetched labor cost by worker");
          expect(response.body.data.length).to.equal(2);

          response.body.data.forEach((worker) => {
            expect(worker).to.have.property("worker_id");
            expect(worker).to.have.property("username");
            expect(worker).to.have.property("labor_cost");
            expect(worker.labor_cost).to.equal("10.00");
          });
        });
    });

    it("should allow filtering of completed tasks via GET parameter", async () => {
      return supertest(app)
        .get("/api/metrics/labor_cost_by_worker?completed=1")
        .expect(200)
        .then((response) => {
          expect(response.body.message).to.include("Fetched labor cost by worker");
          expect(response.body.data.length).to.equal(2);

          response.body.data.forEach((worker) => {
            expect(worker).to.have.property("worker_id");
            expect(worker).to.have.property("username");
            expect(worker).to.have.property("labor_cost");
            expect(worker.labor_cost).to.equal("20.00");
          });
        });
    });

    it("should handle an invalid completed GET parameter and return a 400", async () => {
      return supertest(app)
        .get(`/api/metrics/labor_cost_by_worker?completed=notanint`)
        .expect(400)
        .then((response) => {
          expect(response.body.message).to.include("The completed query string param must be an integer");
          expect(response.body.data.length).to.equal(0);
        });
    });

    it("should handle an invalid location_ids GET parameter and return a 400", async () => {
      return supertest(app)
        .get(`/api/metrics/labor_cost_by_worker?location_ids=notanint`)
        .expect(400)
        .then((response) => {
          expect(response.body.message).to.include(
            "The location_ids query string param must be a comma-separated list of integers",
          );
          expect(response.body.data.length).to.equal(0);
        });
    });

    it("should handle an invalid worker_ids GET parameter and return a 400", async () => {
      return supertest(app)
        .get(`/api/metrics/labor_cost_by_worker?worker_ids=notanint`)
        .expect(400)
        .then((response) => {
          expect(response.body.message).to.include(
            "The worker_ids query string param must be a comma-separated list of integers",
          );
          expect(response.body.data.length).to.equal(0);
        });
    });
  });

  describe("Labor Cost By Location", async () => {
    it("should return exactly two locations with no parameters", async () => {
      return supertest(app)
        .get("/api/metrics/labor_cost_by_location")
        .expect(200)
        .then((response) => {
          expect(response.body.message).to.include("Fetched labor cost by location");
          expect(response.body.data.length).to.equal(2);

          response.body.data.forEach((location) => {
            expect(location).to.have.property("location_id");
            expect(location).to.have.property("location_name");
            expect(location).to.have.property("labor_cost");
            expect(location.labor_cost).to.equal(location.location_id == 1 ? "40.00" : "20.00");
          });
        });
    });

    it("should allow filtering of worker ids via GET parameter", async () => {
      return supertest(app)
        .get("/api/metrics/labor_cost_by_location?worker_ids=1")
        .expect(200)
        .then((response) => {
          expect(response.body.message).to.include("Fetched labor cost by location");
          expect(response.body.data.length).to.equal(2);

          response.body.data.forEach((location) => {
            expect(location).to.have.property("location_id");
            expect(location).to.have.property("location_name");
            expect(location).to.have.property("labor_cost");
            expect(location.labor_cost).to.equal(location.location_id == 1 ? "20.00" : "10.00");
          });
        });
    });

    it("should allow filtering of location ids via GET parameter", async () => {
      return supertest(app)
        .get("/api/metrics/labor_cost_by_location?location_ids=2")
        .expect(200)
        .then((response) => {
          expect(response.body.message).to.include("Fetched labor cost by location");
          expect(response.body.data.length).to.equal(1);

          response.body.data.forEach((location) => {
            expect(location).to.have.property("location_id");
            expect(location).to.have.property("location_name");
            expect(location).to.have.property("labor_cost");
            expect(location.labor_cost).to.equal("20.00");
          });
        });
    });

    it("should allow filtering of completed tasks via GET parameter", async () => {
      return supertest(app)
        .get("/api/metrics/labor_cost_by_location?completed=1")
        .expect(200)
        .then((response) => {
          expect(response.body.message).to.include("Fetched labor cost by location");
          expect(response.body.data.length).to.equal(1);
          expect(response.body.data[0]).to.have.property("location_id");
          expect(response.body.data[0]).to.have.property("location_name");
          expect(response.body.data[0]).to.have.property("labor_cost");
          expect(response.body.data[0].labor_cost).to.equal("40.00");
        });
    });

    it("should handle an invalid completed GET parameter and return a 400", async () => {
      return supertest(app)
        .get(`/api/metrics/labor_cost_by_location?completed=notanint`)
        .expect(400)
        .then((response) => {
          expect(response.body.message).to.include("The completed query string param must be an integer");
          expect(response.body.data.length).to.equal(0);
        });
    });

    it("should handle an invalid location_ids GET parameter and return a 400", async () => {
      return supertest(app)
        .get(`/api/metrics/labor_cost_by_location?location_ids=notanint`)
        .expect(400)
        .then((response) => {
          expect(response.body.message).to.include(
            "The location_ids query string param must be a comma-separated list of integers",
          );
          expect(response.body.data.length).to.equal(0);
        });
    });

    it("should handle an invalid worker_ids GET parameter and return a 400", async () => {
      return supertest(app)
        .get(`/api/metrics/labor_cost_by_location?worker_ids=notanint`)
        .expect(400)
        .then((response) => {
          expect(response.body.message).to.include(
            "The worker_ids query string param must be a comma-separated list of integers",
          );
          expect(response.body.data.length).to.equal(0);
        });
    });
  });
});
