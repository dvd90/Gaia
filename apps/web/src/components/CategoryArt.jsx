export const CATEGORY_META = {
  Waste: { emoji: "♻️", className: "art-waste" },
  Energy: { emoji: "⚡", className: "art-energy" },
  Transport: { emoji: "🚲", className: "art-transport" },
  Event: { emoji: "🌱", className: "art-event" }
};

// Self-contained gradient banner — no external image dependencies
const CategoryArt = ({ category = "Event", size = "card" }) => {
  const meta = CATEGORY_META[category] || CATEGORY_META.Event;
  return (
    <div
      className={`category-art ${meta.className} art-${size}`}
      aria-hidden="true"
    >
      <span>{meta.emoji}</span>
    </div>
  );
};

export default CategoryArt;
