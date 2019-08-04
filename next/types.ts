export type Info = {
  infoType: string; // TODO Enum
  text: string;
  url: string;
  sourceId: string;
  updateTime: Date;
};

export type GameCenter = {
  name: string;
  infos: Info[];
  games: { name: string; infos: Info[] }[];
};

export type GameCenterGeoInfo = {
  id: string;
  geo: Geo;
  name: string;
  games: string[]; // TODO Enum?
};

export type Geo = {
  lat: number;
  lng: number;
};

export type Filter = { [game: string]: boolean };
