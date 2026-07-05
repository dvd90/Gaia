// gaia_points (5–25) rendered as 1–5 leaves — replaces the old star rater
const ImpactMeter = ({ points }) => {
  const filled = Math.max(1, Math.min(5, Math.round(points / 5)));
  return (
    <span
      className="impact"
      role="img"
      aria-label={`Impact ${filled} out of 5`}
      title={`${points} Gaia points`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? "leaf on" : "leaf"}>
          🍃
        </span>
      ))}
    </span>
  );
};

export default ImpactMeter;
