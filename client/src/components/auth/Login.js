import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import gaiaLogo from "../../images/GAIA-logo.png";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    console.log("SUCCESS");
    const newUser = {
      email,
      password
    };
    console.log(newUser);
  };

  return (
    <Fragment>
      <section className="login">
        <div className="landing-logo">
          <img className="landing-logo-img" src={gaiaLogo} />
        </div>
        <div className="header-title">Login</div>
        <form
          noValidate
          autoComplete="off"
          className="login-form"
          onSubmit={e => onSubmit(e)}
        >
          <TextField
            id="standard-basic"
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={e => onChange(e)}
          />
          <TextField
            id="standard-basic"
            label="Password"
            id="standard-password-input"
            autoComplete="current-password"
            type="password"
            name="password"
            minLength="6"
            value={password}
            onChange={e => onChange(e)}
          />
          {/* Need to connect buttons */}
          <div className="landing-btns quiz-btn">
            <Button type="submit" className="radiant-green-btn">
              Login
            </Button>
            <Link to="/">
              <Button className="radiant-purple-btn">Back</Button>
            </Link>
          </div>
        </form>
      </section>
    </Fragment>
  );
};

export default Login;
