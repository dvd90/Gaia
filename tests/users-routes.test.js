const request = require("supertest");

jest.mock("../models/User", () => {
  const MockUser = jest.fn();
  MockUser.findOne = jest.fn();
  MockUser.findById = jest.fn();
  return MockUser;
});

const User = require("../models/User");
const app = require("../app");
const { USER_ID, authHeader } = require("./helpers");

const validBody = {
  name: "Dana",
  email: "dana@example.com",
  password: "secret123",
  address: "Tel Aviv",
  planet_consuption: "2.5"
};

beforeEach(() => jest.clearAllMocks());

describe("POST /api/users (register)", () => {
  it.each([
    ["name", { ...validBody, name: "" }],
    ["address", { ...validBody, address: "" }],
    ["email", { ...validBody, email: "not-an-email" }],
    ["password", { ...validBody, password: "short" }]
  ])("rejects an invalid %s", async (_field, body) => {
    const res = await request(app).post("/api/users").send(body);
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("rejects an already registered email", async () => {
    User.findOne.mockResolvedValue({ _id: "existing" });
    const res = await request(app).post("/api/users").send(validBody);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("User already exist");
  });

  it("creates the user with a hashed password and returns a JWT", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    User.findOne.mockResolvedValue(null);
    let created;
    User.mockImplementation(function (data) {
      Object.assign(this, data);
      this.id = USER_ID;
      this.save = jest.fn().mockResolvedValue(this);
      created = this;
    });

    const res = await request(app).post("/api/users").send(validBody);

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(created.save).toHaveBeenCalled();
    // password must be hashed, avatar auto-assigned
    expect(created.password).not.toBe(validBody.password);
    expect(created.password).toMatch(/^\$2/);
    expect(created.avatar).toContain("gravatar.com");
    expect(created.planet_consuption).toBe("2.5");
  });

  it("maps a duplicate-key race to a 400", async () => {
    User.findOne.mockResolvedValue(null);
    User.mockImplementation(function (data) {
      Object.assign(this, data);
      this.id = USER_ID;
      this.save = jest.fn().mockRejectedValue(
        Object.assign(new Error("dup"), { code: 11000 })
      );
    });
    const res = await request(app).post("/api/users").send(validBody);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("User already exist");
  });

  it("500s on an unexpected error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    User.findOne.mockRejectedValue(new Error("db down"));
    const res = await request(app).post("/api/users").send(validBody);
    expect(res.status).toBe(500);
  });
});

describe("PUT /api/users (update profile)", () => {
  const existingUser = overrides => ({
    _id: USER_ID,
    name: "Old Name",
    email: "old@example.com",
    avatar: "old-avatar",
    address: "Old Town",
    save: jest.fn().mockResolvedValue(true),
    toObject() {
      const { save, toObject, ...rest } = this;
      return { ...rest, password: "hash" };
    },
    ...overrides
  });

  it("requires auth", async () => {
    const res = await request(app).put("/api/users").send({ name: "X" });
    expect(res.status).toBe(401);
  });

  it("rejects an invalid email", async () => {
    const res = await request(app)
      .put("/api/users")
      .set(authHeader())
      .send({ email: "bad" });
    expect(res.status).toBe(400);
  });

  it("404s when the user does not exist", async () => {
    User.findById.mockResolvedValue(null);
    const res = await request(app)
      .put("/api/users")
      .set(authHeader())
      .send({ name: "X" });
    expect(res.status).toBe(404);
  });

  it("updates name and address without touching email", async () => {
    const user = existingUser();
    User.findById.mockResolvedValue(user);

    const res = await request(app)
      .put("/api/users")
      .set(authHeader())
      .send({ name: "New Name", address: "New City" });

    expect(res.status).toBe(200);
    expect(user.name).toBe("New Name");
    expect(user.address).toBe("New City");
    expect(User.findOne).not.toHaveBeenCalled();
    expect(res.body.password).toBeUndefined();
  });

  it("updates the email and avatar when the new email is free", async () => {
    const user = existingUser();
    User.findById.mockResolvedValue(user);
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/users")
      .set(authHeader())
      .send({ email: "new@example.com" });

    expect(res.status).toBe(200);
    expect(user.email).toBe("new@example.com");
    expect(user.avatar).toContain("gravatar.com");
  });

  it("rejects an email already used by another account", async () => {
    User.findById.mockResolvedValue(existingUser());
    User.findOne.mockResolvedValue({ _id: "someone-else" });

    const res = await request(app)
      .put("/api/users")
      .set(authHeader())
      .send({ email: "taken@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Email already in use");
  });

  it("skips the uniqueness check when the email is unchanged", async () => {
    const user = existingUser();
    User.findById.mockResolvedValue(user);

    const res = await request(app)
      .put("/api/users")
      .set(authHeader())
      .send({ email: "old@example.com" });

    expect(res.status).toBe(200);
    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("maps a duplicate-key race on save to a 400", async () => {
    const user = existingUser({
      save: jest
        .fn()
        .mockRejectedValue(Object.assign(new Error("dup"), { code: 11000 }))
    });
    User.findById.mockResolvedValue(user);
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/users")
      .set(authHeader())
      .send({ email: "new@example.com" });
    expect(res.status).toBe(400);
  });

  it("500s on an unexpected error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    User.findById.mockRejectedValue(new Error("db down"));
    const res = await request(app)
      .put("/api/users")
      .set(authHeader())
      .send({ name: "X" });
    expect(res.status).toBe(500);
  });
});
