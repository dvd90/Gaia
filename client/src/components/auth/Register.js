import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import gaiaLogo from "../../images/GAIA-logo.png";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// PAGE TODO!!!! Still a copy of login

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    address: ""
  });

  const { name, email, password, password2, address } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      console.log("Password do not match");
    } else {
      console.log("SUCCESS");
    }
    const newUser = {
      name,
      email,
      password,
      address
    };
    console.log(newUser);
  };

  return (
    <Fragment>
      <section className="register">
        <div className="register-logo-high">
          <img
            className="landing-logo-img register-logo"
            src={gaiaLogo}
            alt="gaia"
          />
        </div>
        <div className="header-title">Register</div>
        <form
          noValidate
          autoComplete="off"
          className="login-form register-form"
          onSubmit={e => onSubmit(e)}
        >
          <TextField
            id="standard-basic"
            label="Name"
            type="name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
          />
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
          <TextField
            id="standard-basic"
            label="Confirm Password"
            id="standard-password-input"
            autoComplete="current-password"
            type="password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={e => onChange(e)}
          />
          <TextField
            id="standard-basic"
            label="Address"
            type="address"
            name="address"
            value={address}
            onChange={e => onChange(e)}
          />
          {/* Need to connect buttons */}
          <div className="landing-btns">
            <Button type="submit" className="radiant-green-btn">
              Signup
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

export default Register;
