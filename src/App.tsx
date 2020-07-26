import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { toast } from "react-toastify";
// @ts-ignore
import useOnlineStatus from "@rehooks/online-status";
import Homepage from "./components/pages/homepage";
import LogInfoPage from "./components/pages/log-info-page";
import "react-toastify/dist/ReactToastify.min.css";
import "./App.scss";

toast.configure({
  position: "bottom-center",
  autoClose: 4000,
  limit: 3,
});

function App() {
  const [isPreviouslyOffline, setPreviouslyOffline] = useState(false);
  const onlineStatus = useOnlineStatus();

  useEffect(() => {
    if (!onlineStatus && !isPreviouslyOffline) {
      toast.error("You are currently using this app in offline mode.");
      setPreviouslyOffline(true);
    } else if (onlineStatus && isPreviouslyOffline) {
      toast.success("Connection has been restored.");
      setPreviouslyOffline(false);
    }
  }, [onlineStatus, isPreviouslyOffline]);

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
