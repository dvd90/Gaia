import {
  computeScore,
  EATER_OPTIONS,
  FLIGHT_OPTIONS,
  TRANSPORT_OPTIONS
} from "./quiz";

describe("computeScore", () => {
  it("adds lifestyle modifiers to the country baseline", () => {
    expect(computeScore(1.5, 0.2, 0.1, 0.2)).toBe("2.00");
  });

  it("truncates (not rounds) to 2 decimals like the original app", () => {
    expect(computeScore(1.999, 0, 0, 0)).toBe("1.99");
  });

  it("supports negative modifiers (vegan, no flights)", () => {
    expect(computeScore(1.5, -0.2, -0.2, 0)).toBe("1.10");
  });
});

describe("quiz options", () => {
  it("expose [label, modifier] pairs", () => {
    for (const options of [EATER_OPTIONS, FLIGHT_OPTIONS, TRANSPORT_OPTIONS]) {
      for (const [label, value] of options) {
        expect(typeof label).toBe("string");
        expect(typeof value).toBe("number");
      }
    }
  });
});
