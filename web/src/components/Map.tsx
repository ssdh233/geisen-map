import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  Map,
  TileLayer,
  Popup,
  ZoomControl,
  CircleMarker,
  Viewport,
} from "react-leaflet";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import MyLocationButton from "@material-ui/icons/MyLocation";

import useQuery from "../utils/useQuery";
import { toQuery } from "../utils/query";
import MyMarker from "../components/MyMarker";
import { GameCenterGeoInfo, Filter } from "../types";
import cx from "../utils/classname";
import useFilter from "../utils/useFilter";
import { DrawerState } from "../components/MyDrawer";

const { REACT_APP_API_URL } = process.env;

const useStyles = makeStyles({
  homeButton: {
    position: "absolute",
    zIndex: 101,
    bottom: 72,
    right: 24,
    backgroundColor: "white",
  },
  homeButtonPC: {
    position: "absolute",
    right: 12,
    bottom: 100,
    zIndex: 101,
    padding: 0,
    backgroundColor: "white",
    width: 30,
    height: 30,
    minHeight: 30,
    borderRadius: 5,
  },
  mapRoot: {
    zIndex: 100,
  },
});

type Props = {
  viewport: Viewport;
  onChangeViewport: (viewport: Viewport) => void;
  userLocation: [number, number] | null;
  requestUserLocation: (onSuccess?: () => void) => void;
  onChangeFilterExpanded: (state: boolean) => void;
  onChangeSpDrawerState: (state: DrawerState) => void;
};

function MyMap(props: Props) {
  const query = useQuery();
  const history = useHistory();
  const isSP = useMediaQuery("(max-width:768px)");

  const [filter] = useFilter();

  const [gamecenters, setGamecenters] = useState([] as GameCenterGeoInfo[]);

  useEffect(() => {
    async function myFunc() {
      const res = await fetch(`${REACT_APP_API_URL}/gamecenters`);
      const data = await res.json();

      setGamecenters(data);
    }

    myFunc();
  }, [setGamecenters]);

  function handleHomeButtonClick() {
    if (props.userLocation) {
      props.onChangeViewport({ center: props.userLocation, zoom: 14 });
    } else {
      // TODO tell user to set permission
    }
  }

  function handleMapClick() {
    if (!isSP) {
      props.onChangeFilterExpanded(true);
    }
    props.onChangeSpDrawerState("closed");

    // never try to delay this. Delaying state update causes a lot of trouble
    history.push(`/map?${toQuery(query)}`);
  }

  const classes = useStyles();

  const isChanging = useRef<NodeJS.Timeout | undefined>(undefined);
  const requestUserLocationInterval = useRef<NodeJS.Timeout | undefined>(
    undefined
  );
  const handleViewportChange = () => {
    if (isChanging.current) {
      clearTimeout(isChanging.current);
      isChanging.current = undefined;
    }
    stopRequestUserLocation();
  };

  const handleViewportChanged = (viewport: any) => {
    isChanging.current = setTimeout(() => {
      props.onChangeViewport(viewport);
      isChanging.current = undefined;
      startRequestUserLocation();
    }, 100);
  };

  function startRequestUserLocation() {
    stopRequestUserLocation();
    requestUserLocationInterval.current = setInterval(() => {
      props.requestUserLocation();
    }, 3000);
  }

  function stopRequestUserLocation() {
    if (requestUserLocationInterval.current) {
      clearInterval(requestUserLocationInterval.current as any);
      requestUserLocationInterval.current = undefined;
    }
  }

  // changeしてない時：やる
  // change startやめる
  // change end 再開
  useEffect(() => {
    function a() {
      if (document.visibilityState === "visible") {
        startRequestUserLocation();
      } else {
        stopRequestUserLocation();
      }
    }
    document.addEventListener("visibilitychange", a);
    return () => document.removeEventListener("visibilitychange", a);
  }, []);

  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.css"
        />
      </Helmet>
      <Map
        onClick={handleMapClick}
        className={classes.mapRoot}
        viewport={props.viewport}
        onViewportChange={handleViewportChange}
        onViewportChanged={handleViewportChanged}
        zoomControl={false}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!isSP && <ZoomControl position="bottomright" />}
        {getVisibleGamecenters(
          filterGamecenters(gamecenters, filter),
          props.viewport
        ).map(({ _id, geo, name }) => {
          return (
            <MyMarker
              key={_id}
              position={[geo.lat, geo.lng]}
              onClick={() => {
                history.push(`/map/gamecenter/${_id}?${toQuery(query)}`);
              }}
            >
              <Popup autoPan={false}>{name}</Popup>
            </MyMarker>
          );
        })}
        {props.userLocation && (
          <CircleMarker center={props.userLocation} radius={10} />
        )}
      </Map>
      <Fab
        size={isSP ? "large" : "small"}
        className={cx(!isSP && classes.homeButtonPC, classes.homeButton)}
        onClick={handleHomeButtonClick}
      >
        <MyLocationButton fontSize={isSP ? "default" : "small"} />
      </Fab>
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

function getVisibleGamecenters(
  gamecenters: GameCenterGeoInfo[],
  viewport: Viewport
): GameCenterGeoInfo[] {
  if (!viewport.center || !viewport.zoom) return [];
  if (viewport.zoom && viewport.zoom < 10) return [];
  const [lat, lng] = viewport.center;
  const rangeRadio = 2 ** viewport.zoom;
  let latRange = 2 ** 10 / rangeRadio;
  let lngRnage = 2 ** 10 / rangeRadio;

  let filtered = gamecenters;

  while (filtered.length > 300) {
    filtered = gamecenters.filter(({ geo }) => {
      return (
        Math.abs(geo.lat - lat) < latRange && Math.abs(geo.lng - lng) < lngRnage
      );
    });

    latRange /= 2;
    lngRnage /= 2;
  }

  return filtered;
}

export default MyMap;
