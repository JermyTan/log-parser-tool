import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import "semantic-ui-css/semantic.min.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import FilterProvider from "./context-providers/FilterProvider";
import PreferencesProvider from "./context-providers/PreferencesProvider";

ReactDOM.render(
  <React.StrictMode>
    <PreferencesProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </PreferencesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
