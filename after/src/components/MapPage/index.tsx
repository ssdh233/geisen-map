import React, { useState, useEffect } from "react";
import { Viewport } from "react-leaflet";
import Snackbar from "@material-ui/core/Snackbar";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { DrawerState } from "../../components/MyDrawer";
import { Filter, GameCenterGeoInfo, GameCenter } from "../../types";
import { viewportToString, stringToViewport } from "../../utils/viewport";
import { filterToString, stringToFilter } from "../../utils/filter";
import { toQuery, parseQuery } from "../../utils/query";
import Map from "../../components/Map";

type Prop = {
  gamecenters: GameCenterGeoInfo[];
  location: any; // TODO
  history: any; // TODO
};

// TODO
const API_URL = "http://192.168.1.6:4000";

const defaultViewport = {
  center: [38.5548225, 135.8920016],
  zoom: 6
} as Viewport;

function MapPage(props: Prop) {
  const { v: viewportQuery, f: filterQuery } = parseQuery(props.location.search);
  const viewport = stringToViewport(viewportQuery as string) || defaultViewport;
  const filter = stringToFilter(filterQuery as string);

  const [gameCenterData, setGameCenterData] = useState(null as GameCenter | null);
  const [spGameCenterInfoDrawerState, setSpGameCenterInfoDrawerState] = useState("closed" as DrawerState);

  // hide filter if there is gameCenterId on query
  const [filterExpanded, setFilterExpanded] = useState(true);
  const isSP = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // on PC, the filter should be expanded by default; on SP it shouldn't
    setFilterExpanded(!isSP);
  }, [isSP]);

  const filteredGamecenters = filterGamecenters(props.gamecenters, filter);
  const gamecenters = getVisibleGamecenters(filteredGamecenters, viewport);

  function handleChangeGameCenter(gameCenterId: string | null): void {
    const newQuery = toQuery({ ...parseQuery(props.location.search), g: gameCenterId });
    props.history.push(`/?${newQuery}`);
  }

  function handleChangeViewport(viewport: Viewport): void {
    const viewportStr = viewportToString(viewport);
    const newQuery = toQuery({ ...parseQuery(props.location.search), v: viewportStr });
    props.history.push(`/?${newQuery}`);
  }

  function handleChangeFilter(filter: Filter): void {
    const filterStr = filterToString(filter);
    const newQuery = toQuery({ ...parseQuery(props.location.search), f: filterStr });
    props.history.push(`/?${newQuery}`);
  }

  return (
    <div>
      <Head>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.css" />
      </Head>
      <style jsx global>
        {`
          h1,
          h2,
          h3 {
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
      <Map
        gameCenterId={gameCenterId as string}
        viewport={viewport}
        onChangeViewport={handleChangeViewport}
        gamecenters={gamecenters}
        onMarkerClick={id => handleChangeGameCenter(id)}
        onMarkerUnselect={() => handleChangeGameCenter(null)}
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        style={{ bottom: 50, zIndex: 1000 }}
        open={Boolean(viewport.zoom && viewport.zoom < 10)}
        message={<span>ズームインしてゲームセンターの情報を表示する</span>}
      />
    </div>
  );
}

function filterGamecenters(gamecenters: GameCenterGeoInfo[], filter: Filter): GameCenterGeoInfo[] {
  return gamecenters.filter(gamecenter => {
    return gamecenter.games.some(game => filter[game]);
  });
}

function getVisibleGamecenters(gamecenters: GameCenterGeoInfo[], viewport: Viewport): GameCenterGeoInfo[] {
  if (!viewport.center || !viewport.zoom) return [];
  if (viewport.zoom && viewport.zoom < 10) return [];
  const [lat, lng] = viewport.center;
  const rangeRadio = 2 ** viewport.zoom;
  let latRange = 2 ** 10 / rangeRadio;
  let lngRnage = 2 ** 10 / rangeRadio;

  let filtered = gamecenters;

  while (filtered.length > 300) {
    filtered = gamecenters.filter(({ geo }) => {
      return Math.abs(geo.lat - lat) < latRange && Math.abs(geo.lng - lng) < lngRnage;
    });

    latRange /= 2;
    lngRnage /= 2;
  }

  return filtered;
}

MapPage.getInitialProps = async function() {
  const res = await fetch(`${API_URL}/gamecenters`);
  const data = await res.json();

  return {
    gamecenters: data
  };
};

export default MapPage;
