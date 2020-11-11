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
import debounce from "../utils/debounce";
import useFilter from "../utils/useFilter";
import useViewport from "../utils/useViewport";
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

  function handleHomeButtonClick() {
    if (props.userLocation) {
      setViewport({ center: props.userLocation, zoom: 14 });
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

  useEffect(() => {
    props.requestUserLocation(() => {
      const id = setInterval(() => props.requestUserLocation(), 3000);
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
        className={classes.mapRoot}
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
        {getVisibleGamecenters(
          filterGamecenters(gamecenters, filter),
          viewport
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
