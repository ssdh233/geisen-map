import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import reactLeaflet from "react-leaflet";
import Fab from '@material-ui/core/Fab';
import MyLocationButton from '@material-ui/icons/MyLocation';
import { makeStyles } from '@material-ui/core/styles';

// import Side from "../components/Side";
const Side = dynamic(() => import("../components/Side"), {
  ssr: false
});

// TODO make it look better
// @ts-ignore
const Map = dynamic(() => import("react-leaflet/lib/Map"), {
  ssr: false
});

// @ts-ignore
const TileLayer = dynamic(() => import("react-leaflet/lib/TileLayer"), {
  ssr: false
});

// @ts-ignore
const Marker = dynamic(() => import("react-leaflet/lib/Marker"), {
  ssr: false
});

// @ts-ignore
const Popup = dynamic(() => import("react-leaflet/lib/Popup"), {
  ssr: false
});

// @ts-ignore
const ZoomControl = dynamic(() => import("react-leaflet/lib/ZoomControl"), {
  ssr: false
});

// @ts-ignore
const CircleMarker = dynamic(() => import("react-leaflet/lib/CircleMarker"), {
  ssr: false
});

interface Prop {
  gamecenters: any[] // TODO
}

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


function IndexPage(props: Prop) {
  const [viewport, setViewport] = useState({ center: [35.6028, 139.6196], zoom: 15 } as reactLeaflet.Viewport);
  const [userLocation, setUserLocation] = useState([] as number[]);
  const [gameCenterId, setGameCenterId] = useState("");
  const [gameCenterData, setGameCenterData] = useState(null);
  const [filter, setFilter] = useState({
    taiko: true,
    popn: true,
  })

  const classes = useStyles();

  function handleViewportChange(viewport: reactLeaflet.Viewport) {
    // @ts-ignore
    if (viewport!.zoom >= 19) {
      viewport.zoom = 19;
    }

    setViewport(viewport)
  }

  function handleHomeButtonClick() {
    if (userLocation.length > 1) {
      //@ts-ignore
      setViewport({ center: userLocation, zoom: 14 });
    } else {
      // TODO tell user to set permission
    }
  }

  function requestUserLocation() {
    let startPos;
    let geoOptions = {
      timeout: 10 * 1000
    }

    let geoSuccess = function (position: any) {
      startPos = position;
      setViewport({ center: [startPos.coords.latitude, startPos.coords.longitude], zoom: 14 });
      setUserLocation([startPos.coords.latitude, startPos.coords.longitude]);
    };
    let geoError = function (error: any) {
      console.log('Error occurred. Error code: ' + error.code);
      // error.code can be:
      //   0: unknown error
      //   1: permission denied
      //   2: position unavailable (error response from location provider)
      //   3: timed out
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  const filteredGamecenters = filterGamecenters(props.gamecenters, filter);
  const gamecenters = getVisibleGamecenters(filteredGamecenters, viewport);

  useEffect(() => {
    async function myFunc() {
      if (gameCenterId) {
        const res = await fetch(`http://localhost:4000/gamecenter/${gameCenterId}`);
        const data = await res.json();
        setGameCenterData(data);
      }
    }

    myFunc();
  }, [gameCenterId]);

  useEffect(() => requestUserLocation(), [])

  console.log("rendered marks:", gamecenters.length);
  return (
    <div>
      <Head>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.css" />
      </Head>
      <style jsx global>{`
          h1, h2, h3 {
            margin: 0;
          }

          ul {
            padding-left: 20px;
          }

          body {
            padding: 0;
            margin: 0;
          }
          .leaflet-container {
            position: absolute;
            width: 100%;
            height: 100%;
          }
        `}
      </style>
      {/*
        // @ts-ignore*/}
      <Map viewport={viewport} onViewportChange={debounce(handleViewportChange, 100)} zoomControl={false}>
        {/*
        // @ts-ignore*/}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/*
        // @ts-ignore*/}
        <ZoomControl position="bottomright" />
        {
          gamecenters.map(({ id, geo, name }) => {
            // @ts-ignore
            return <Marker key={id} position={[geo.lat, geo.lng]} onClick={() => setGameCenterId(id)} >
              <Popup>{name}</Popup>
            </Marker>
          })
        }
        {
          userLocation.length > 1 &&
          // @ts-ignore
          <CircleMarker center={userLocation} radius={10} />
        }
        <Fab size="small" className={classes.homeButton} onClick={handleHomeButtonClick}>
          <MyLocationButton fontSize="small" />
        </Fab>
      </Map>
      <Side gameCenterId={gameCenterId} gameCenterData={gameCenterData} filter={filter} setFilter={setFilter} />
    </div >
  );
}

function debounce(func: any, delay: number) {
  // @ts-ignore
  let inDebounce;
  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments;
    // @ts-ignore
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

function filterGamecenters(gamecenters: any[], filter: any): any[] {
  return gamecenters.filter(gamecenter => {
    return gamecenter.games.some((game: any) => filter[game]);
  });
}

function getVisibleGamecenters(gamecenters: any[], viewport: reactLeaflet.Viewport): any[] {
  // @ts-ignore
  if (viewport.zoom < 10) return [];
  // return gamecenters;
  // @ts-ignore
  const [lat, lng] = viewport.center;
  // @ts-ignore
  const rangeRadio = 2 ** viewport.zoom;
  let latRange = 2 ** 10 / rangeRadio;
  let lngRnage = 2 ** 10 / rangeRadio;

  let filtered = gamecenters;

  while (filtered.length > 500) {
    filtered = gamecenters.filter(({ geo }) => {
      // @ts-ignore*/
      return Math.abs(geo.lat - lat) < (latRange) && Math.abs(geo.lng - lng) < (lngRnage);
    });

    latRange /= 2;
    lngRnage /= 2;
  }

  return filtered;
}

IndexPage.getInitialProps = async function () {
  const res = await fetch("http://localhost:4000/gamecenters");
  const data = await res.json();

  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    gamecenters: data
  };
}

export default IndexPage;
