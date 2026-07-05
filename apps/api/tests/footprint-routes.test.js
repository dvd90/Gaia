const request = require("supertest");
const app = require("../app");

describe("GET /api/footprint/:country_id", () => {
  it("returns the Earths value for a known country code", async () => {
    const res = await request(app).get("/api/footprint/1");
    expect(res.status).toBe(200);
    expect(res.body.countryName).toBe("Armenia");
    expect(typeof res.body.earths).toBe("number");
  });

  it("404s for an unknown country code", async () => {
    const res = await request(app).get("/api/footprint/999999");
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("No country with this code");
  });

  it("404s for a non-numeric country code instead of crashing", async () => {
    const res = await request(app).get("/api/footprint/abc");
    expect(res.status).toBe(404);
  });
});
