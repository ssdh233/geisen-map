import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  Map,
  TileLayer,
  Popup,
  ZoomControl,
  CircleMarker,
} from "react-leaflet";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import MyLocationButton from "@material-ui/icons/MyLocation";

import useQuery from "../utils/useQuery";
import { toQuery } from "../utils/query";
import MyMarker from "../components/MyMarker";
import { GameCenterGeoInfo, Filter } from "../types";
import cx from "../utils/classname";
import debounce from "../utils/debounce";
import useFilter from "../utils/useFilter";
import useViewport from "../utils/useViewport";
import { DrawerState } from "../components/MyDrawer";

const { REACT_APP_API_URL } = process.env;

const useStyles = makeStyles({
  homeButton: {
    position: "absolute",
    zIndex: 1001,
    bottom: 72,
    right: 24,
    backgroundColor: "white",
  },
  homeButtonPC: {
    position: "absolute",
    right: 12,
    bottom: 100,
    zIndex: 1001,
    padding: 0,
    backgroundColor: "white",
    width: 30,
    height: 30,
    minHeight: 30,
    borderRadius: 5,
  },
});

type Props = {
  onChangeFilterExpanded: (state: boolean) => void;
  onChangeSpDrawerState: (state: DrawerState) => void;
};

function MyMap(props: Props) {
  const query = useQuery();
  const history = useHistory();
  const isSP = useMediaQuery("(max-width:768px)");

  const [filter] = useFilter();
  const [viewport, setViewport] = useViewport();

  const [gamecenters, setGamecenters] = useState([] as GameCenterGeoInfo[]);

  useEffect(() => {
    async function myFunc() {
      const res = await fetch(`${REACT_APP_API_URL}/gamecenters`);
      const data = await res.json();

      setGamecenters(data);
    }

    myFunc();
  }, [setGamecenters]);

  const [userLocation, setUserLocation] = useState(
    null as [number, number] | null
  );

  function handleHomeButtonClick() {
    if (userLocation) {
      setViewport({ center: userLocation, zoom: 14 });
    } else {
      // TODO tell user to set permission
    }
  }

  function handleMapClick() {
    if (!isSP) {
      props.onChangeFilterExpanded(true);
    }
    props.onChangeSpDrawerState("closed");

    // waiting for animation
    setTimeout(() => history.push(`/?${toQuery(query)}`), 150);
  }

  function requestUserLocation(onSuccess?: () => void) {
    let startPos;
    let geoOptions = {
      timeout: 10 * 1000,
    };

    let geoSuccess = function (position: {
      coords: { latitude: number; longitude: number };
    }) {
      startPos = position;
      setUserLocation([startPos.coords.latitude, startPos.coords.longitude]);
      if (onSuccess) onSuccess();
    };
    let geoError = function (error: { code: number }) {
      console.error(
        "Error occurred. Error code: " + error.code,
        ({
          "0": "unknown error",
          "1": "permission denied",
          "2": "position unavailable (error response from location provider)",
          "3": "timed out",
        } as any)["" + error.code]
      );
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  useEffect(() => {
    requestUserLocation(() => {
      const id = setInterval(() => requestUserLocation(), 3000);
      return () => clearInterval(id);
    });
  }, []);
  const classes = useStyles();

  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.css"
        />
      </Helmet>
      <Map
        viewport={viewport}
        onViewportChange={debounce(setViewport, 100)}
        zoomControl={false}
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!isSP && <ZoomControl position="bottomright" />}
        {filterGamecenters(gamecenters, filter).map(({ _id, geo, name }) => {
          return (
            <MyMarker
              key={_id}
              position={[geo.lat, geo.lng]}
              onClick={() => {
                history.push(`/gamecenter/${_id}?${toQuery(query)}`);
              }}
            >
              <Popup autoPan={false}>{name}</Popup>
            </MyMarker>
          );
        })}
        {userLocation && <CircleMarker center={userLocation} radius={10} />}
        <Fab
          size={isSP ? "large" : "small"}
          className={cx(!isSP && classes.homeButtonPC, classes.homeButton)}
          onClick={handleHomeButtonClick}
        >
          <MyLocationButton fontSize={isSP ? "default" : "small"} />
        </Fab>
      </Map>
    </div>
  );
}

function filterGamecenters(
  gamecenters: GameCenterGeoInfo[],
  filter: Filter
): GameCenterGeoInfo[] {
  return gamecenters.filter((gamecenter) => {
    return gamecenter.games.some((game) => filter[game]);
  });
}

export default MyMap;
