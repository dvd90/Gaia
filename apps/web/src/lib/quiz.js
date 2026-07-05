export const EATER_OPTIONS = [
  ["Meat eater", 0.2],
  ["Vegan", 0],
  ["Vegetarian", -0.2]
];

export const FLIGHT_OPTIONS = [
  ["Never", -0.2],
  ["Between 1 & 3 times", 0.1],
  ["Between 4 & 8 times", 0.2],
  ["More than 8 times", 0.3]
];

export const TRANSPORT_OPTIONS = [
  ["Foot", 0],
  ["Bicycle", 0],
  ["Car", 0.2]
];

// Country baseline (Earths) adjusted by lifestyle answers,
// truncated to 2 decimals — same formula as the original app
export const computeScore = (earths, eater, flights, transportation) => {
  const total = earths + eater + flights + transportation;
  return (Math.floor(total * 100) / 100).toFixed(2);
};
