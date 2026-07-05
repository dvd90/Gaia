import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import gaiaLogo from "../images/GAIA-logo.png";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero">
      <div className="hero-content">
        <img className="hero-logo" src={gaiaLogo} alt="Gaia" />
        <h1 className="hero-title">
          Save our planet.
          <br />
          <span>Reduce your footprint.</span>
        </h1>
        <p className="hero-sub">
          Join eco-challenges, meet your community at local events and watch
          your impact grow — one small change at a time.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link className="btn btn-primary btn-big" to="/dashboard">
              Go to my dashboard
            </Link>
          ) : (
            <>
              <Link className="btn btn-primary btn-big" to="/info">
                Be part of the change
              </Link>
              <Link className="btn btn-outline btn-big" to="/login">
                Login
              </Link>
            </>
          )}
        </div>
        <blockquote className="hero-quote">
          “The question that will decide our destiny is not whether we shall
          expand into space. It is: shall we be one species or a million?”
          <cite>— Freeman Dyson</cite>
        </blockquote>
      </div>
    </section>
  );
};

export default Landing;
