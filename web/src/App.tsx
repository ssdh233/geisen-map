import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Map from "./components/Map";
import MainSide from "./components/MainSide";
import User from "./components/User";
import GameCenterInfo from "./components/GameCenterInfo";
import { DrawerState } from "./components/MyDrawer";
import SignInPage from "./components/SignInPage";

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
      <Route exact path="/">
        <Redirect to="/map" />
      </Route>
      <Route path="/map">
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
          <Route exact path="/map">
            <p>Welcome to Geisen Map!</p>
          </Route>
          <Route
            path="/map/gamecenter/:gamecenterId"
            render={(routeProps) => (
              <GameCenterInfo
                {...routeProps}
                onChangeFilterExapnded={setFilterExpanded}
                onChangeSpDrawerState={setSpDrawerState}
              />
            )}
          ></Route>
        </MainSide>
        <User />
      </Route>
      <Route path="/signin" component={SignInPage}></Route>
    </div>
  );
}

export default () => (
  <Router>
    <Switch>
      <App />
    </Switch>
  </Router>
);
