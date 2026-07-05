const request = require("supertest");
const app = require("../app");
const { notFound, errorHandler } = require("../middleware/errorHandlers");

describe("app", () => {
  it("responds on the root route", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("GAIA");
  });

  it("exposes a health endpoint for deployment healthchecks", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("returns a JSON 404 for unknown routes", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ msg: "Route not found" });
  });
});

describe("error handlers", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("notFound sends a 404 JSON body", () => {
    const res = mockRes();
    notFound({}, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Route not found" });
  });

  it("errorHandler sends a 500 JSON body and logs the error", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const res = mockRes();
    errorHandler(new Error("boom"), {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: "Server Error" });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
