import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import getConfig from "next/config";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import { Viewport } from "react-leaflet";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { DrawerState } from "../components/MyDrawer";
import { Filter, GameCenterGeoInfo, GameCenter } from "../types";
import { viewportToString, stringToViewport } from "../utils/viewport";
import { filterToString, stringToFilter } from "../utils/filter";
import { toQuery } from "../utils/query";

const { publicRuntimeConfig } = getConfig();
const { API_URL } = publicRuntimeConfig;

const MainSide = dynamic(() => import("../components/MainSide"), {
  ssr: false
});

const Map = dynamic(() => import("../components/Map"), {
  ssr: false
});

type Prop = {
  gamecenters: GameCenterGeoInfo[];
};

const defaultViewport = {
  center: [38.5548225, 135.8920016],
  zoom: 6
} as Viewport;

function IndexPage(props: Prop) {
  const router = useRouter();
  const { v: viewportQuery, f: filterQuery } = router.query;
  const viewport = stringToViewport(viewportQuery as string) || defaultViewport;
  const filter = stringToFilter(filterQuery as string);

  const [gameCenterId, setGameCenterId] = useState("");
  const [gameCenterData, setGameCenterData] = useState(null as GameCenter | null);
  const [spGameCenterInfoDrawerState, setSpGameCenterInfoDrawerState] = useState("closed" as DrawerState);

  const [filterExpanded, setFilterExpanded] = useState(false);
  const isSP = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // on PC, the filter should be expanded by default; on SP it shouldn't
    setFilterExpanded(!isSP);
  }, [isSP]);

  const [snackBarOpen, setSnackBarOpen] = useState(true);

  const filteredGamecenters = filterGamecenters(props.gamecenters, filter);
  const gamecenters = getVisibleGamecenters(filteredGamecenters, viewport);

  useEffect(() => {
    async function myFunc() {
      if (gameCenterId) {
        const res = await fetch(`${API_URL}/gamecenter/${gameCenterId}`);
        const data = await res.json();
        setGameCenterData(data);
      }
    }

    myFunc();
  }, [gameCenterId]);

  function handleChangeViewport(viewport: Viewport): void {
    const viewportStr = viewportToString(viewport);
    const newQuery = toQuery({ ...router.query, v: viewportStr });
    router.push(`/?${newQuery}`, `/?${newQuery}`, { shallow: true });
  }

  function handleChangeFilter(filter: Filter): void {
    const filterStr = filterToString(filter);

    const newQuery = toQuery({ ...router.query, f: filterStr });
    router.push(`/?${newQuery}`, `/?${newQuery}`, { shallow: true });
  }

  const hasMoreThanOneFilter =
    Object.keys(filter)
      .map(key => filter[key])
      .filter(isTrue => isTrue).length > 1;

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
        viewport={viewport}
        onChangeViewport={handleChangeViewport}
        gamecenters={gamecenters}
        onMarkerClick={id => {
          setGameCenterId(id);
          setFilterExpanded(false);
          setSpGameCenterInfoDrawerState("halfOpen");
        }}
      />
      <MainSide
        gameCenterId={gameCenterId}
        gameCenterData={gameCenterData}
        spGameCenterInfoDrawerState={spGameCenterInfoDrawerState}
        onChangeSpGameCenterInfoDrawerState={drawerState => {
          setSpGameCenterInfoDrawerState(drawerState);
        }}
        filter={filter}
        filterExpanded={filterExpanded}
        setFilterExpanded={setFilterExpanded}
        onChangeViewport={handleChangeViewport}
        onChangeFilter={handleChangeFilter}
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
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        style={{ bottom: 50 }}
        open={Boolean(viewport.zoom && viewport.zoom >= 10) && hasMoreThanOneFilter && snackBarOpen}
        message={
          <span>
            複数の機種で検索する際、同じゲーセンが違う場所で表示されることがありますのでご了承ください（近い内に改善する予定です）
          </span>
        }
        action={[
          <Button color="secondary" size="small" onClick={() => setSnackBarOpen(false)}>
            閉じる
          </Button>
        ]}
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

IndexPage.getInitialProps = async function() {
  const res = await fetch(`${API_URL}/gamecenters`);
  const data = await res.json();

  return {
    gamecenters: data
  };
};

export default IndexPage;
