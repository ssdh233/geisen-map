import { useState, useEffect } from "react";

import {
  Map,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  CircleMarker,
  Viewport
} from "react-leaflet";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import MyLocationButton from "@material-ui/icons/MyLocation";

import { GameCenterGeoInfo } from "../types";
import debounce from "../utils/debounce";

const useStyles = makeStyles({
  homeButton: {
    position: "absolute",
    right: 12,
    bottom: 100,
    zIndex: 1001,
    padding: 0,
    backgroundColor: "white",
    width: 30,
    height: 30,
    minHeight: 30,
    borderRadius: 5
  }
});

interface Props {
  viewport: Viewport;
  onChangeViewport: (viewport: Viewport) => void;
  onMarkerClick: (gameCenterId: string) => void;
  gamecenters: GameCenterGeoInfo[];
}

// XXX: NO SSR
function MyMap(props: Props) {
  const [userLocation, setUserLocation] = useState(null as
    | [number, number]
    | null);

  function handleViewportChange(viewport: Viewport) {
    if (viewport.zoom && viewport.zoom >= 19) {
      viewport.zoom = 19;
    }

    props.onChangeViewport(viewport);
  }

  function handleHomeButtonClick() {
    if (userLocation) {
      props.onChangeViewport({ center: userLocation, zoom: 14 });
    } else {
      // TODO tell user to set permission
    }
  }

  function requestUserLocation() {
    let startPos;
    let geoOptions = {
      timeout: 10 * 1000
    };

    let geoSuccess = function(position: {
      coords: { latitude: number; longitude: number };
    }) {
      startPos = position;
      props.onChangeViewport({
        center: [startPos.coords.latitude, startPos.coords.longitude],
        zoom: 14
      });
      setUserLocation([startPos.coords.latitude, startPos.coords.longitude]);
    };
    let geoError = function(error: { code: number }) {
      console.log("Error occurred. Error code: " + error.code);
      // error.code can be:
      //   0: unknown error
      //   1: permission denied
      //   2: position unavailable (error response from location provider)
      //   3: timed out
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  useEffect(() => requestUserLocation(), []);
  const classes = useStyles();

  return (
    <Map
      viewport={props.viewport}
      onViewportChange={debounce(handleViewportChange, 100)}
      zoomControl={false}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      {props.gamecenters.map(({ id, geo, name }) => {
        return (
          <Marker
            key={id}
            position={[geo.lat, geo.lng]}
            onClick={() => props.onMarkerClick(id)}
          >
            <Popup>{name}</Popup>
          </Marker>
        );
      })}
      {userLocation && <CircleMarker center={userLocation} radius={10} />}
      <Fab
        size="small"
        className={classes.homeButton}
        onClick={handleHomeButtonClick}
      >
        <MyLocationButton fontSize="small" />
      </Fab>
    </Map>
  );
}

export default MyMap;