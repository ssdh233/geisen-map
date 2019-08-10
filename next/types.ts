export type Info = {
  infoType: string; // TODO Enum
  text: string;
  url: string;
  sourceId: string;
  updateTime: Date;
};

export type NormalizedAddress = {
  regionId: string;
  fullAddress: string;
  build: string;
  number: string;
  region: string;
  town: string;
};

export type GameCenter = {
  geo: Geo;
  name: string;
  address: NormalizedAddress;
  infos: Info[];
  games: {
    name: string; // Enum?
    infos: Info[];
  }[];
};

export type GameCenterGeoInfo = {
  _id: string;
  geo: Geo;
  name: string;
  games: string[]; // TODO Enum?
};

export type Geo = {
  lat: number;
  lng: number;
};

export type Filter = { [game: string]: boolean };
