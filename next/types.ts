export interface Info {
  infoType: string; // TODO Enum
  text: string;
  url: string;
  sourceId: string;
  updateTime: Date;
}

export interface GameCenter {
  name: string;
  infos: Info[];
  games: { name: string; infos: Info[] }[];
}

export interface GameCenterGeoInfo {
  id: string;
  geo: Geo;
  name: string;
  games: string[]; // TODO Enum?
}

export interface Geo {
  lat: number;
  lng: number;
}

export type Filter = { [game: string]: boolean };