export type Info = {
  infoType: string; // TODO Enum
  text: string;
  url: string;
  sourceId: string;
  updateTime: Date;
};

export type NormalizedAddress = {
  prefecture: string;
  city: string;
  ward: string;
  town: string;
  number: string;
  build: string;
  fullAddress: string;
};

export type GameCenter = {
  _id: string;
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
  description: string;
  games: string[]; // TODO Enum?
};

export type Geo = {
  lat: number;
  lng: number;
  zoom?: number;
};

export type Filter = { [game: string]: boolean };
