import dynamic from "next/dynamic";
import Head from "next/head";

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

function AnotherPage() {
  const position = [35.6005052, 139.6144797];

  return (
    <div>
      <Head>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.css" />
        <style>
          {
            `.leaflet-container {
              height: 800px;
              width: 1200px;
            }
          `}
        </style>
      </Head>
      Welcome to Another Page!
      {/*
        // @ts-ignore*/}
      <Map center={position} zoom={16}>
        {/*
        // @ts-ignore*/}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/*
        // @ts-ignore*/}
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    </div>
  );
}

export default AnotherPage;
