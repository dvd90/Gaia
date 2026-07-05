import { timeFromNow, isFuture, formatDate, toDatetimeLocal } from "./format";

const NOW = new Date("2026-07-05T12:00:00Z");

describe("timeFromNow", () => {
  it("formats future dates", () => {
    expect(timeFromNow("2026-07-08T12:00:00Z", NOW)).toBe("in 3 days");
    expect(timeFromNow("2026-07-05T15:00:00Z", NOW)).toBe("in 3 hours");
    expect(timeFromNow("2027-08-05T12:00:00Z", NOW)).toBe("next year");
  });

  it("formats past dates", () => {
    expect(timeFromNow("2026-07-03T12:00:00Z", NOW)).toBe("2 days ago");
    expect(timeFromNow("2026-07-05T11:30:00Z", NOW)).toBe("30 minutes ago");
  });

  it("falls back to seconds for very close dates", () => {
    expect(timeFromNow("2026-07-05T12:00:10Z", NOW)).toContain("second");
  });
});

describe("isFuture", () => {
  it("detects future and past", () => {
    expect(isFuture("2026-07-06T00:00:00Z", NOW)).toBe(true);
    expect(isFuture("2026-07-04T00:00:00Z", NOW)).toBe(false);
  });
});

describe("formatDate", () => {
  it("renders a readable date", () => {
    const out = formatDate("2026-07-05T12:00:00Z");
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/Jul/);
  });
});

describe("toDatetimeLocal", () => {
  it("produces a value usable by datetime-local inputs", () => {
    const out = toDatetimeLocal("2026-07-05T09:05:00");
    expect(out).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });
});
