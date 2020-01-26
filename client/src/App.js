import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./components/layout/Landing";
import "./App.css";

const App = () => (
  <Router>
    <Fragment>
      <Route exact path="/" components={Landing} />
      <Landing />
    </Fragment>
  </Router>
);

export default App;
