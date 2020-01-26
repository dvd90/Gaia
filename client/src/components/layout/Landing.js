import React from "react";
import gaiaLogo from "../../images/GAIA-logo.png";
import Button from "@material-ui/core/Button";

const Landing = () => {
  return (
    <section className="landing">
      <div className="landing-logo">
        <img className="landing-logo-img" src={gaiaLogo} />
      </div>
      <div className="landing-quotes">
        <p className="quote">
          “The question that will decide our destiny is not whether we shall
          expand into space. It is: shall we be one species or a million? A
          million species will not exhaust the ecological niches that are
          awaiting the arrival of intelligence.”
        </p>
        <p className="quote-author">Freeman Dyson</p>
        <div className="landing-btns">
          <Button className="radiant-green-btn">Be part of the change </Button>
          <Button className="radiant-purple-btn">Login</Button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
