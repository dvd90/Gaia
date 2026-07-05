import { Link, Navigate } from "react-router-dom";
import planetLogo from "../images/planet_cons.png";

const QuizResult = () => {
  const score = localStorage.getItem("score");

  if (!score) return <Navigate to="/quiz" replace />;

  return (
    <section className="quiz-result">
      <h1>Your yearly footprint</h1>
      <p className="quiz-result-sub">
        If everyone lived like you, we would need…
      </p>
      <div className="quiz-result-score">
        <span className="quiz-result-number">{score}</span>
        <img src={planetLogo} alt="planets" />
      </div>
      <p className="quiz-result-caption">planet Earths every year</p>
      <blockquote className="hero-quote">
        “Any change, even the smallest, is important.”
      </blockquote>
      <div className="form-actions">
        <Link className="btn btn-primary btn-big" to="/register">
          Join the movement
        </Link>
        <Link className="btn btn-ghost" to="/">
          Back
        </Link>
      </div>
    </section>
  );
};

export default QuizResult;
