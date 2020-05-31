import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Homepage from "./components/pages/homepage";
import LogInfoPage from "./components/pages/log-info-page";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/logs" component={LogInfoPage} />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
