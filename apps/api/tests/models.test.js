const User = require("../models/User");
const Challenge = require("../models/Challenge");
const Event = require("../models/Event");

describe("User model", () => {
  it("requires name, email, password and address", () => {
    const err = new User({}).validateSync();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.address).toBeDefined();
  });

  it("defaults gaia_points to 0 and planet_consuption to '1'", () => {
    const user = new User({
      name: "Dana",
      email: "d@x.io",
      password: "hash",
      address: "TLV"
    });
    expect(user.validateSync()).toBeUndefined();
    expect(user.gaia_points).toBe(0);
    expect(user.planet_consuption).toBe("1");
  });
});

describe("Challenge model", () => {
  const base = {
    title: "T",
    description: "D",
    gaia_points: 5
  };

  it("only accepts known categories", () => {
    const bad = new Challenge({ ...base, category: "Cooking" });
    expect(bad.validateSync().errors.category).toBeDefined();

    const good = new Challenge({ ...base, category: "Energy" });
    expect(good.validateSync()).toBeUndefined();
  });

  it("only accepts known join statuses", () => {
    const challenge = new Challenge({
      ...base,
      category: "Waste",
      joined_by: [{ status: "Almost done" }]
    });
    expect(challenge.validateSync()).toBeDefined();
  });
});

describe("Event model", () => {
  it("requires title, dates, location and description", () => {
    const err = new Event({}).validateSync();
    expect(err.errors.title).toBeDefined();
    expect(err.errors.starts_at).toBeDefined();
    expect(err.errors.ends_at).toBeDefined();
    expect(err.errors.location).toBeDefined();
    expect(err.errors.description).toBeDefined();
  });

  it("accepts a valid event with GeoJSON point coords", () => {
    const event = new Event({
      title: "Cleanup",
      starts_at: new Date(),
      ends_at: new Date(),
      location: "Beach",
      description: "Bring gloves",
      coords: { type: "Point", coordinates: [34.78, 32.08] }
    });
    expect(event.validateSync()).toBeUndefined();
    expect(event.coords.type).toBe("Point");
  });
});
