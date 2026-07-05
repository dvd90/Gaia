const request = require("supertest");
const bcrypt = require("bcryptjs");

jest.mock("../models/User", () => {
  const MockUser = jest.fn();
  MockUser.findOne = jest.fn();
  MockUser.findById = jest.fn();
  return MockUser;
});

const User = require("../models/User");
const app = require("../app");
const { USER_ID, authHeader } = require("./helpers");

const PASSWORD = "secret123";
let passwordHash;

beforeAll(async () => {
  passwordHash = await bcrypt.hash(PASSWORD, 4);
});

beforeEach(() => jest.clearAllMocks());

describe("GET /api/auth", () => {
  it("returns the logged-in user without the password", async () => {
    const me = { _id: USER_ID, name: "Dana", email: "d@x.io" };
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(me) });

    const res = await request(app).get("/api/auth").set(authHeader());

    expect(res.status).toBe(200);
    expect(res.body).toEqual(me);
    expect(User.findById).toHaveBeenCalledWith(USER_ID);
  });

  it("requires a token", async () => {
    const res = await request(app).get("/api/auth");
    expect(res.status).toBe(401);
  });

  it("404s when the user no longer exists", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });
    const res = await request(app).get("/api/auth").set(authHeader());
    expect(res.status).toBe(404);
  });

  it("500s on a database error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    User.findById.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("db down"))
    });
    const res = await request(app).get("/api/auth").set(authHeader());
    expect(res.status).toBe(500);
  });
});

describe("POST /api/auth (login)", () => {
  it("rejects an invalid email", async () => {
    const res = await request(app)
      .post("/api/auth")
      .send({ email: "nope", password: "x" });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("rejects unknown users with a generic message", async () => {
    User.findOne.mockResolvedValue(null);
    const res = await request(app)
      .post("/api/auth")
      .send({ email: "a@b.co", password: PASSWORD });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid Credentials");
  });

  it("rejects a wrong password with the same generic message", async () => {
    User.findOne.mockResolvedValue({ id: USER_ID, password: passwordHash });
    const res = await request(app)
      .post("/api/auth")
      .send({ email: "a@b.co", password: "wrong-password" });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid Credentials");
  });

  it("returns a JWT on valid credentials", async () => {
    User.findOne.mockResolvedValue({ id: USER_ID, password: passwordHash });
    const res = await request(app)
      .post("/api/auth")
      .send({ email: "a@b.co", password: PASSWORD });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");

    // the token must work against a private route
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: USER_ID })
    });
    const me = await request(app)
      .get("/api/auth")
      .set("x-auth-token", res.body.token);
    expect(me.status).toBe(200);
  });

  it("500s on a database error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    User.findOne.mockRejectedValue(new Error("db down"));
    const res = await request(app)
      .post("/api/auth")
      .send({ email: "a@b.co", password: PASSWORD });
    expect(res.status).toBe(500);
  });
});
