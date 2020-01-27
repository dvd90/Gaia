import React from "react";
import { Link } from "react-router-dom";
import gaiaLogo from "../../images/GAIA-logo.png";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Login = () => (
  <section className="login">
    <div className="landing-logo">
      <img className="landing-logo-img" src={gaiaLogo} />
    </div>
    <div className="login-header">Login</div>
    <form noValidate autoComplete="off" className="login-form">
      <TextField id="standard-basic" label="Email" />
      <TextField
        id="standard-basic"
        label="Password"
        id="standard-password-input"
        type="password"
        autoComplete="current-password"
      />
      {/* Need to connect buttons */}
      <div className="landing-btns">
        <Button className="radiant-green-btn">Be part of the change</Button>
        <Link to="/">
          <Button className="radiant-purple-btn">Back</Button>
        </Link>
      </div>
    </form>
  </section>
);

export default Login;
