import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Map from "./components/Map";
import MainSide from "./components/MainSide";
import GameCenterInfo from "./components/GameCenterInfo";
import { DrawerState } from "./components/MyDrawer";

import "./base.css";

function App() {
  const isSP = useMediaQuery("(max-width:768px)");

  const [filterExpanded, setFilterExpanded] = useState(!isSP);
  const [spDrawerState, setSpDrawerState] = useState("closed" as DrawerState);

  // TODO this approach will make the filter blink. do something for it
  useEffect(() => {
    setFilterExpanded(!isSP);
  }, [isSP]);

  return (
    <div className="App">
      <Map
        onChangeSpDrawerState={setSpDrawerState}
        onChangeFilterExpanded={setFilterExpanded}
      />
      <MainSide
        filterExpanded={filterExpanded}
        onChangeFilterExpanded={setFilterExpanded}
        spDrawerState={spDrawerState}
        onChangeSpDrawerState={setSpDrawerState}
      >
        <Switch>
          <Route exact path="/">
            <p>Welcome to Geisen Map!</p>
          </Route>
          <Route
            path="/gamecenter/:gamecenterId"
            render={(routeProps) => (
              <GameCenterInfo
                {...routeProps}
                onChangeFilterExapnded={setFilterExpanded}
                onChangeSpDrawerState={setSpDrawerState}
              />
            )}
          ></Route>
        </Switch>
      </MainSide>
    </div>
  );
}

export default () => (
  <Router>
    <App />
  </Router>
);
