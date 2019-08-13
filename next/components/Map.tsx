import { useState, useEffect } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Map, TileLayer, Popup, ZoomControl, CircleMarker, Viewport } from "react-leaflet";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import MyLocationButton from "@material-ui/icons/MyLocation";

import MyMarker from "../components/MyMarker";
import { GameCenterGeoInfo } from "../types";
import cx from "../utils/classname";
import debounce from "../utils/debounce";

const useStyles = makeStyles({
  homeButton: {
    position: "absolute",
    zIndex: 1001,
    bottom: 72,
    right: 24,
    backgroundColor: "white"
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
    borderRadius: 5
  }
});

type Props = {
  gameCenterId?: string;
  viewport: Viewport;
  onChangeViewport: (viewport: Viewport) => void;
  onMarkerClick: (gameCenterId: string) => void;
  gamecenters: GameCenterGeoInfo[];
};

// XXX: NO SSR
function MyMap(props: Props) {
  const isSP = useMediaQuery("(max-width:768px)");

  const [userLocation, setUserLocation] = useState(null as [number, number] | null);

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

    let geoSuccess = function(position: { coords: { latitude: number; longitude: number } }) {
      startPos = position;
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

  useEffect(() => {
    requestUserLocation();
    const id = setInterval(() => requestUserLocation(), 3000);
    return () => clearInterval(id);
  }, []);
  const classes = useStyles();

  return (
    <Map viewport={props.viewport} onViewportChange={debounce(handleViewportChange, 100)} zoomControl={false}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!isSP && <ZoomControl position="bottomright" />}
      {props.gamecenters.map(({ _id, geo, name }) => {
        return (
          <MyMarker
            key={_id}
            isOpen={_id === props.gameCenterId}
            position={[geo.lat, geo.lng]}
            onClick={() => props.onMarkerClick(_id)}
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
  );
}

export default MyMap;
