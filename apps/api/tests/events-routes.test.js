const request = require("supertest");

jest.mock("axios");
jest.mock("../models/Event", () => {
  const MockEvent = jest.fn();
  MockEvent.find = jest.fn();
  MockEvent.findById = jest.fn();
  return MockEvent;
});

const axios = require("axios");
const Event = require("../models/Event");
const app = require("../app");
const { USER_ID, OTHER_ID, authHeader, castError } = require("./helpers");

const validBody = {
  title: "Beach cleanup",
  location: "Tel Aviv beach",
  description: "Bring gloves",
  starts_at: "2026-08-01T10:00:00.000Z",
  ends_at: "2026-08-01T13:00:00.000Z"
};

const geometry = { type: "Point", coordinates: [34.78, 32.08] };

const geocodeSuccess = () =>
  axios.get.mockResolvedValue({ data: { features: [{ geometry }] } });

const geocodeEmpty = () =>
  axios.get.mockResolvedValue({ data: { features: [] } });

const eventDoc = overrides => ({
  _id: "e1",
  creator: USER_ID,
  ...validBody,
  coords: geometry,
  attendees: [],
  save: jest.fn().mockResolvedValue(true),
  deleteOne: jest.fn().mockResolvedValue(true),
  ...overrides
});

beforeEach(() => jest.clearAllMocks());

describe("GET /api/events", () => {
  it("lists events sorted with creator info", async () => {
    const sort = jest.fn().mockResolvedValue([eventDoc()]);
    Event.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({ sort })
    });

    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("500s on a database error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Event.find.mockImplementation(() => {
      throw new Error("db down");
    });
    const res = await request(app).get("/api/events");
    expect(res.status).toBe(500);
  });
});

describe("POST /api/events", () => {
  it("requires auth", async () => {
    const res = await request(app).post("/api/events").send(validBody);
    expect(res.status).toBe(401);
  });

  it.each([
    ["title", { ...validBody, title: "" }],
    ["location", { ...validBody, location: "" }],
    ["description", { ...validBody, description: "" }],
    ["starts_at", { ...validBody, starts_at: "not-a-date" }],
    ["ends_at", { ...validBody, ends_at: "13-01-2026" }]
  ])("rejects an invalid %s", async (_field, body) => {
    const res = await request(app)
      .post("/api/events")
      .set(authHeader())
      .send(body);
    expect(res.status).toBe(400);
  });

  it("geocodes the location and creates the event", async () => {
    geocodeSuccess();
    let created;
    Event.mockImplementation(function (data) {
      Object.assign(this, data);
      created = this;
      this.save = jest.fn().mockResolvedValue({ _id: "e1", ...data });
    });

    const res = await request(app)
      .post("/api/events")
      .set(authHeader())
      .send(validBody);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe("e1");
    expect(created.coords).toEqual(geometry);
    expect(created.creator).toBe(USER_ID);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(validBody.location))
    );
  });

  it("400s when the address cannot be geocoded", async () => {
    geocodeEmpty();
    const res = await request(app)
      .post("/api/events")
      .set(authHeader())
      .send(validBody);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Could not locate this address");
  });

  it("500s when the geocoding service fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error("mapbox down"));
    const res = await request(app)
      .post("/api/events")
      .set(authHeader())
      .send(validBody);
    expect(res.status).toBe(500);
  });
});

describe("GET /api/events/:id", () => {
  it("returns an event", async () => {
    Event.findById.mockResolvedValue(eventDoc());
    const res = await request(app).get("/api/events/e1");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(validBody.title);
  });

  it("404s when missing", async () => {
    Event.findById.mockResolvedValue(null);
    const res = await request(app).get("/api/events/e1");
    expect(res.status).toBe(404);
  });

  it("404s on a malformed id", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Event.findById.mockRejectedValue(castError());
    const res = await request(app).get("/api/events/nope");
    expect(res.status).toBe(404);
  });

  it("500s on other errors", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Event.findById.mockRejectedValue(new Error("db down"));
    const res = await request(app).get("/api/events/e1");
    expect(res.status).toBe(500);
  });
});

describe("PUT /api/events/:id/join", () => {
  it("adds the caller as an attendee", async () => {
    const doc = eventDoc();
    Event.findById.mockResolvedValue(doc);

    const res = await request(app)
      .put("/api/events/e1/join")
      .set(authHeader());

    expect(res.status).toBe(200);
    expect(doc.attendees).toEqual([{ user: USER_ID }]);
    expect(doc.save).toHaveBeenCalled();
  });

  it("rejects joining twice", async () => {
    const doc = eventDoc({ attendees: [{ user: USER_ID }] });
    Event.findById.mockResolvedValue(doc);

    const res = await request(app)
      .put("/api/events/e1/join")
      .set(authHeader());

    expect(res.status).toBe(400);
    expect(doc.save).not.toHaveBeenCalled();
  });

  it("404s when the event is missing", async () => {
    Event.findById.mockResolvedValue(null);
    const res = await request(app)
      .put("/api/events/e1/join")
      .set(authHeader());
    expect(res.status).toBe(404);
  });

  it("404s on a malformed id", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Event.findById.mockRejectedValue(castError());
    const res = await request(app)
      .put("/api/events/nope/join")
      .set(authHeader());
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/events/:id", () => {
  it("lets the creator delete", async () => {
    const doc = eventDoc();
    Event.findById.mockResolvedValue(doc);

    const res = await request(app).delete("/api/events/e1").set(authHeader());

    expect(res.status).toBe(200);
    expect(doc.deleteOne).toHaveBeenCalled();
  });

  it("blocks non-creators", async () => {
    const doc = eventDoc({ creator: OTHER_ID });
    Event.findById.mockResolvedValue(doc);

    const res = await request(app).delete("/api/events/e1").set(authHeader());

    expect(res.status).toBe(401);
    expect(doc.deleteOne).not.toHaveBeenCalled();
  });

  it("404s when missing", async () => {
    Event.findById.mockResolvedValue(null);
    const res = await request(app).delete("/api/events/e1").set(authHeader());
    expect(res.status).toBe(404);
  });

  it("404s on a malformed id", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Event.findById.mockRejectedValue(castError());
    const res = await request(app)
      .delete("/api/events/nope")
      .set(authHeader());
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/events/:id (edit)", () => {
  it("updates simple fields without re-geocoding", async () => {
    const doc = eventDoc();
    Event.findById.mockResolvedValue(doc);

    const res = await request(app)
      .put("/api/events/e1")
      .set(authHeader())
      .send({ title: "New title", description: "New desc" });

    expect(res.status).toBe(200);
    expect(doc.title).toBe("New title");
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("re-geocodes when the location changes", async () => {
    geocodeSuccess();
    const doc = eventDoc({ coords: { type: "Point", coordinates: [0, 0] } });
    Event.findById.mockResolvedValue(doc);

    const res = await request(app)
      .put("/api/events/e1")
      .set(authHeader())
      .send({ location: "Haifa port" });

    expect(res.status).toBe(200);
    expect(doc.location).toBe("Haifa port");
    expect(doc.coords).toEqual(geometry);
  });

  it("does not re-geocode when the location is unchanged", async () => {
    const doc = eventDoc();
    Event.findById.mockResolvedValue(doc);

    const res = await request(app)
      .put("/api/events/e1")
      .set(authHeader())
      .send({ location: validBody.location });

    expect(res.status).toBe(200);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("400s when the new location cannot be geocoded", async () => {
    geocodeEmpty();
    const doc = eventDoc();
    Event.findById.mockResolvedValue(doc);

    const res = await request(app)
      .put("/api/events/e1")
      .set(authHeader())
      .send({ location: "Nowhere land" });

    expect(res.status).toBe(400);
    expect(doc.save).not.toHaveBeenCalled();
  });

  it("validates optional dates", async () => {
    const res = await request(app)
      .put("/api/events/e1")
      .set(authHeader())
      .send({ starts_at: "not-a-date" });
    expect(res.status).toBe(400);
  });

  it("updates valid dates", async () => {
    const doc = eventDoc();
    Event.findById.mockResolvedValue(doc);
    const res = await request(app)
      .put("/api/events/e1")
      .set(authHeader())
      .send({
        starts_at: "2026-09-01T10:00:00.000Z",
        ends_at: "2026-09-01T12:00:00.000Z"
      });
    expect(res.status).toBe(200);
    expect(doc.starts_at).toBe("2026-09-01T10:00:00.000Z");
  });

  it("blocks non-creators", async () => {
    Event.findById.mockResolvedValue(eventDoc({ creator: OTHER_ID }));
    const res = await request(app)
      .put("/api/events/e1")
      .set(authHeader())
      .send({ title: "hijack" });
    expect(res.status).toBe(401);
  });

  it("404s when missing", async () => {
    Event.findById.mockResolvedValue(null);
    const res = await request(app)
      .put("/api/events/e1")
      .set(authHeader())
      .send({ title: "x" });
    expect(res.status).toBe(404);
  });

  it("404s on a malformed id", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    Event.findById.mockRejectedValue(castError());
    const res = await request(app)
      .put("/api/events/nope")
      .set(authHeader())
      .send({ title: "x" });
    expect(res.status).toBe(404);
  });
});
