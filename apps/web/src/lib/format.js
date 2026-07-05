const UNITS = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["week", 1000 * 60 * 60 * 24 * 7],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60]
];

// "in 3 days" / "2 hours ago" — replaces moment.fromNow()
export const timeFromNow = (date, now = new Date()) => {
  const diff = new Date(date).getTime() - now.getTime();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) {
      return rtf.format(Math.trunc(diff / ms), unit);
    }
  }
  return rtf.format(Math.trunc(diff / 1000), "second");
};

export const isFuture = (date, now = new Date()) =>
  new Date(date).getTime() > now.getTime();

export const formatDate = date =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));

// ISO string → value usable by <input type="datetime-local">
export const toDatetimeLocal = iso => {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};
