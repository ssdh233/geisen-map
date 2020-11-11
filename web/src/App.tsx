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
import UserAvatar from "./components/UserAvatar";
import GameCenterInfo from "./components/GameCenterInfo";
import { DrawerState } from "./components/MyDrawer";
import SignInPage from "./components/SignInPage";
import ProfilePage from "./components/ProfilePage";

import "./base.css";
import useUserLocation from "./utils/useUserLocation";

const { REACT_APP_API_URL } = process.env;

export type User = {
  id: string;
  email: string;
  name: string;
  twitterId: string;
  twitterName: string;
  refreshToken: string;
};

function App() {
  const isSP = useMediaQuery("(max-width:768px)");

  const [userLocation, requestUserLocation] = useUserLocation();
  const [filterExpanded, setFilterExpanded] = useState(!isSP);
  const [spDrawerState, setSpDrawerState] = useState("closed" as DrawerState);

  // TODO this approach will make the filter blink. do something for it
  useEffect(() => {
    setFilterExpanded(!isSP);
  }, [isSP]);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // TODO status code thing
    fetch(`${REACT_APP_API_URL}/user`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        setUser(json);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="App">
      <Route exact path="/">
        <Redirect to="/map" />
      </Route>
      <Route path="/map">
        <Map
          userLocation={userLocation}
          requestUserLocation={requestUserLocation}
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
                user={user}
                userLocation={userLocation}
                requestUserLocation={requestUserLocation}
                onChangeFilterExapnded={setFilterExpanded}
                onChangeSpDrawerState={setSpDrawerState}
              />
            )}
          ></Route>
          <Route
            path="/map/profile"
            render={(routerProps) => (
              <ProfilePage
                {...routerProps}
                user={user}
                onChangeSpDrawerState={setSpDrawerState}
              />
            )}
          ></Route>
        </MainSide>
        <UserAvatar user={user} />
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
