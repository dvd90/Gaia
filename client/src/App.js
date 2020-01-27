import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import FormQuiz from "./components/quiz/FormQuiz";
import "./App.css";

const App = () => (
  <Router>
    <Fragment>
      <Route exact path="/" component={Landing} />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/quiz" component={FormQuiz} />
      </Switch>
    </Fragment>
  </Router>
);

export default App;
