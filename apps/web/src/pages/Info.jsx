import { Link } from "react-router-dom";

const steps = [
  {
    emoji: "🎯",
    title: "Choose a challenge",
    text: "Pick from Waste, Energy or Transport challenges created by the community."
  },
  {
    emoji: "💪",
    title: "Complete it",
    text: "Do the thing! Every completed challenge earns you Gaia points."
  },
  {
    emoji: "🌍",
    title: "Become part of the community",
    text: "Change the way you see Gaia — join events and inspire others."
  }
];

const Info = () => (
  <section className="info">
    <div className="info-header">
      <h1>Make a change, one challenge at a time.</h1>
      <p>
        Gaia is a community of like-minded people with the goal of reducing our
        day-to-day footprint. Let's be responsible and respect Gaia.
      </p>
    </div>
    <div className="info-steps">
      {steps.map((step, i) => (
        <div className="info-step" key={step.title}>
          <div className="info-step-emoji">{step.emoji}</div>
          <h2>
            {i + 1}. {step.title}
          </h2>
          <p>{step.text}</p>
        </div>
      ))}
    </div>
    <div className="info-cta">
      <p>First, find out how big your footprint actually is:</p>
      <Link className="btn btn-primary btn-big" to="/quiz">
        Start your journey
      </Link>
    </div>
  </section>
);

export default Info;
