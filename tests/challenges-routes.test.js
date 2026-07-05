const request = require("supertest");

jest.mock("../models/User", () => {
  const MockUser = jest.fn();
  MockUser.findOne = jest.fn();
  MockUser.findById = jest.fn();
  return MockUser;
});
jest.mock("../models/Challenge", () => {
  const MockChallenge = jest.fn();
  MockChallenge.find = jest.fn();
  MockChallenge.findById = jest.fn();
  return MockChallenge;
});

const User = require("../models/User");
const Challenge = require("../models/Challenge");
const app = require("../app");
const { USER_ID, OTHER_ID, authHeader, castError } = require("./helpers");

const validBody = {
  title: "Zero waste week",
  category: "Waste",
  description: "No single-use plastic for a week",
  gaia_points: 10
};

const challengeDoc = overrides => ({
  _id: "c1",
  creator: USER_ID,
  ...validBody,
  joined_by: [],
  save: jest.fn().mockResolvedValue(true),
  deleteOne: jest.fn().mockResolvedValue(true),
  ...overrides
});

beforeEach(() => jest.clearAllMocks());

describe("GET /api/challenges", () => {
  it("lists challenges sorted with creator info", async () => {
    const list = [challengeDoc()];
    const sort = jest.fn().mockResolvedValue(list);
    Challenge.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({ sort })
    });

    const res = await request(app).get("/api/challenges");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(sort).toHaveBeenCalledWith({ date: -1 });
  });

  it("500s on a database error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Challenge.find.mockImplementation(() => {
      throw new Error("db down");
    });
    const res = await request(app).get("/api/challenges");
    expect(res.status).toBe(500);
  });
});

describe("POST /api/challenges", () => {
  it("requires auth", async () => {
    const res = await request(app).post("/api/challenges").send(validBody);
    expect(res.status).toBe(401);
  });

  it.each([
    ["title", { ...validBody, title: "" }],
    ["category", { ...validBody, category: "" }],
    ["description", { ...validBody, description: "" }],
    ["gaia_points", { ...validBody, gaia_points: 0 }]
  ])("rejects an invalid %s", async (_field, body) => {
    const res = await request(app)
      .post("/api/challenges")
      .set(authHeader())
      .send(body);
    expect(res.status).toBe(400);
  });

  it("creates a challenge owned by the caller", async () => {
    let created;
    Challenge.mockImplementation(function (data) {
      Object.assign(this, data);
      created = this;
      this.save = jest.fn().mockResolvedValue({ _id: "c1", ...data });
    });

    const res = await request(app)
      .post("/api/challenges")
      .set(authHeader())
      .send(validBody);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe("c1");
    expect(created.creator).toBe(USER_ID);
  });

  it("500s when saving fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Challenge.mockImplementation(function () {
      this.save = jest.fn().mockRejectedValue(new Error("db down"));
    });
    const res = await request(app)
      .post("/api/challenges")
      .set(authHeader())
      .send(validBody);
    expect(res.status).toBe(500);
  });
});

describe("GET /api/challenges/:id", () => {
  it("returns a challenge", async () => {
    Challenge.findById.mockResolvedValue(challengeDoc());
    const res = await request(app).get("/api/challenges/c1");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(validBody.title);
  });

  it("404s when missing", async () => {
    Challenge.findById.mockResolvedValue(null);
    const res = await request(app).get("/api/challenges/c1");
    expect(res.status).toBe(404);
  });

  it("404s on a malformed id", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Challenge.findById.mockRejectedValue(castError());
    const res = await request(app).get("/api/challenges/not-an-id");
    expect(res.status).toBe(404);
  });

  it("500s on other errors", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Challenge.findById.mockRejectedValue(new Error("db down"));
    const res = await request(app).get("/api/challenges/c1");
    expect(res.status).toBe(500);
  });
});

describe("PUT /api/challenges/:id/join", () => {
  it("adds the caller as In Progress", async () => {
    const doc = challengeDoc();
    Challenge.findById.mockResolvedValue(doc);

    const res = await request(app)
      .put("/api/challenges/c1/join")
      .set(authHeader());

    expect(res.status).toBe(200);
    expect(doc.joined_by).toEqual([
      { user: USER_ID, status: "In Progress" }
    ]);
    expect(doc.save).toHaveBeenCalled();
  });

  it("rejects joining twice", async () => {
    const doc = challengeDoc({
      joined_by: [{ user: USER_ID, status: "In Progress" }]
    });
    Challenge.findById.mockResolvedValue(doc);

    const res = await request(app)
      .put("/api/challenges/c1/join")
      .set(authHeader());

    expect(res.status).toBe(400);
    expect(doc.save).not.toHaveBeenCalled();
  });

  it("404s when the challenge is missing", async () => {
    Challenge.findById.mockResolvedValue(null);
    const res = await request(app)
      .put("/api/challenges/c1/join")
      .set(authHeader());
    expect(res.status).toBe(404);
  });

  it("404s on a malformed id", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Challenge.findById.mockRejectedValue(castError());
    const res = await request(app)
      .put("/api/challenges/nope/join")
      .set(authHeader());
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/challenges/:id/completed", () => {
  const joinedDoc = status =>
    challengeDoc({
      gaia_points: 10,
      joined_by: [{ user: USER_ID, status }]
    });
  const userDoc = () => ({
    _id: USER_ID,
    gaia_points: 5,
    save: jest.fn().mockResolvedValue(true)
  });

  it("marks the challenge completed and awards points once", async () => {
    const doc = joinedDoc("In Progress");
    const user = userDoc();
    Challenge.findById.mockResolvedValue(doc);
    User.findById.mockResolvedValue(user);

    const res = await request(app)
      .put("/api/challenges/c1/completed")
      .set(authHeader());

    expect(res.status).toBe(200);
    expect(doc.joined_by[0].status).toBe("Completed");
    expect(user.gaia_points).toBe(15);
    expect(doc.save).toHaveBeenCalled();
    expect(user.save).toHaveBeenCalled();
  });

  it("rejects completing twice (no double points)", async () => {
    const doc = joinedDoc("Completed");
    const user = userDoc();
    Challenge.findById.mockResolvedValue(doc);
    User.findById.mockResolvedValue(user);

    const res = await request(app)
      .put("/api/challenges/c1/completed")
      .set(authHeader());

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Challenge already completed");
    expect(user.gaia_points).toBe(5);
  });

  it("rejects completing a challenge that was never joined", async () => {
    Challenge.findById.mockResolvedValue(challengeDoc());
    User.findById.mockResolvedValue(userDoc());

    const res = await request(app)
      .put("/api/challenges/c1/completed")
      .set(authHeader());

    expect(res.status).toBe(400);
  });

  it("404s when the challenge is missing", async () => {
    Challenge.findById.mockResolvedValue(null);
    User.findById.mockResolvedValue(userDoc());
    const res = await request(app)
      .put("/api/challenges/c1/completed")
      .set(authHeader());
    expect(res.status).toBe(404);
  });

  it("404s when the user is missing", async () => {
    Challenge.findById.mockResolvedValue(challengeDoc());
    User.findById.mockResolvedValue(null);
    const res = await request(app)
      .put("/api/challenges/c1/completed")
      .set(authHeader());
    expect(res.status).toBe(404);
  });

  it("500s on other errors", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Challenge.findById.mockRejectedValue(new Error("db down"));
    User.findById.mockResolvedValue(userDoc());
    const res = await request(app)
      .put("/api/challenges/c1/completed")
      .set(authHeader());
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/challenges/:id", () => {
  it("lets the creator delete", async () => {
    const doc = challengeDoc();
    Challenge.findById.mockResolvedValue(doc);

    const res = await request(app)
      .delete("/api/challenges/c1")
      .set(authHeader());

    expect(res.status).toBe(200);
    expect(doc.deleteOne).toHaveBeenCalled();
  });

  it("blocks non-creators", async () => {
    const doc = challengeDoc({ creator: OTHER_ID });
    Challenge.findById.mockResolvedValue(doc);

    const res = await request(app)
      .delete("/api/challenges/c1")
      .set(authHeader());

    expect(res.status).toBe(401);
    expect(doc.deleteOne).not.toHaveBeenCalled();
  });

  it("404s when missing", async () => {
    Challenge.findById.mockResolvedValue(null);
    const res = await request(app)
      .delete("/api/challenges/c1")
      .set(authHeader());
    expect(res.status).toBe(404);
  });

  it("404s on a malformed id", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Challenge.findById.mockRejectedValue(castError());
    const res = await request(app)
      .delete("/api/challenges/nope")
      .set(authHeader());
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/challenges/:id (edit)", () => {
  it("lets the creator edit all fields", async () => {
    const doc = challengeDoc();
    Challenge.findById.mockResolvedValue(doc);

    const res = await request(app)
      .put("/api/challenges/c1")
      .set(authHeader())
      .send({
        title: "New title",
        category: "Energy",
        description: "New desc",
        gaia_points: 20
      });

    expect(res.status).toBe(200);
    expect(doc.title).toBe("New title");
    expect(doc.category).toBe("Energy");
    expect(doc.description).toBe("New desc");
    expect(doc.gaia_points).toBe(20);
    expect(doc.save).toHaveBeenCalled();
  });

  it("keeps fields not present in the body", async () => {
    const doc = challengeDoc();
    Challenge.findById.mockResolvedValue(doc);

    const res = await request(app)
      .put("/api/challenges/c1")
      .set(authHeader())
      .send({});

    expect(res.status).toBe(200);
    expect(doc.title).toBe(validBody.title);
  });

  it("rejects non-positive gaia_points", async () => {
    const res = await request(app)
      .put("/api/challenges/c1")
      .set(authHeader())
      .send({ gaia_points: -5 });
    expect(res.status).toBe(400);
  });

  it("blocks non-creators", async () => {
    Challenge.findById.mockResolvedValue(challengeDoc({ creator: OTHER_ID }));
    const res = await request(app)
      .put("/api/challenges/c1")
      .set(authHeader())
      .send({ title: "hijack" });
    expect(res.status).toBe(401);
  });

  it("404s when missing", async () => {
    Challenge.findById.mockResolvedValue(null);
    const res = await request(app)
      .put("/api/challenges/c1")
      .set(authHeader())
      .send({ title: "x" });
    expect(res.status).toBe(404);
  });

  it("404s on a malformed id", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Challenge.findById.mockRejectedValue(castError());
    const res = await request(app)
      .put("/api/challenges/nope")
      .set(authHeader())
      .send({ title: "x" });
    expect(res.status).toBe(404);
  });
});
