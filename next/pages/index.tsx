import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { Viewport } from "react-leaflet";
import Snackbar from "@material-ui/core/Snackbar";
import getConfig from "next/config";
import { Filter, GameCenterGeoInfo, GameCenter } from "../types";

const { publicRuntimeConfig } = getConfig();
const { API_URL } = publicRuntimeConfig;

const MainSide = dynamic(() => import("../components/MainSide"), {
  ssr: false
});

const Map = dynamic(() => import("../components/Map"), {
  ssr: false
});

interface Prop {
  gamecenters: GameCenterGeoInfo[];
}

function IndexPage(props: Prop) {
  const [viewport, setViewport] = useState({
    center: [38.5548225, 135.8920016],
    zoom: 6
  } as Viewport);

  const [gameCenterId, setGameCenterId] = useState("");
  const [gameCenterData, setGameCenterData] = useState(
    null as GameCenter | null
  );
  const [filter, setFilter] = useState({
    taiko: true,
    popn: true
  } as Filter);

  console.log(viewport.center, viewport.zoom);

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

  console.log("rendered marks:", gamecenters.length);
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.css"
        />
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
        onChangeViewport={viewport => setViewport(viewport)}
        gamecenters={gamecenters}
        onMarkerClick={id => setGameCenterId(id)}
      />
      <MainSide
        gameCenterId={gameCenterId}
        gameCenterData={gameCenterData}
        filter={filter}
        setFilter={setFilter}
        setViewport={setViewport}
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        open={Boolean(viewport.zoom && viewport.zoom < 10)}
        message={<span>ズームインしてゲームセンターの情報を表示する</span>}
      />
    </div>
  );
}

function filterGamecenters(
  gamecenters: GameCenterGeoInfo[],
  filter: Filter
): GameCenterGeoInfo[] {
  return gamecenters.filter(gamecenter => {
    return gamecenter.games.some(game => filter[game]);
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

IndexPage.getInitialProps = async function() {
  console.log({ API_URL });
  const res = await fetch(`${API_URL}/gamecenters`);
  const data = await res.json();

  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    gamecenters: data
  };
};

export default IndexPage;
