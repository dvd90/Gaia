import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import countryList from "./countries";

const FormQuiz = () => {
  const [formData, setFormData] = useState({
    country: "",
    eater: "",
    flights: "",
    transportation: ""
  });

  const eaterOptions = ["Meat eater", "Vegan", "Vegetarian"];
  const flightOptions = [
    "Never",
    "Between 1 & 3 times",
    "Between 4 & 8 times",
    "More than 8 times"
  ];
  const transportOptions = ["Foot", "Bicycle", "Car"];

  const { country, eater, flights, transportation } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Fragment>
      <section className="quiz-form-page">
        <div className="header-title header-title-quiz">
          Be part of the change...
          <p className="header-paragraph">
            Please answer these question to find out your average footprint.
          </p>
        </div>
        <form
          noValidate
          autoComplete="off"
          className="login-form quiz-form"
          onSubmit={e => onSubmit(e)}
        >
          <InputLabel id="demo-simple-select-label">
            Where do you live?
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={country}
            name="country"
            onChange={e => onChange(e)}
          >
            {countryList.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <InputLabel id="demo-simple-select-label">Eater?</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={eater}
            name="eater"
            onChange={e => onChange(e)}
          >
            {eaterOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <InputLabel id="demo-simple-select-label">
            How often do you flight per year?
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={flights}
            name="flights"
            onChange={e => onChange(e)}
          >
            {flightOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <InputLabel id="demo-simple-select-label">
            Transportation mode?
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={transportation}
            name="transportation"
            onChange={e => onChange(e)}
          >
            {transportOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {/* <TextField
            id="standard-basic"
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={e => onChange(e)}
          /> */}
          <div className="quiz-btn">
            <Button type="submit" className="radiant-green-btn">
              Submit
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

export default FormQuiz;
