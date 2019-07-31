import { Filter } from "../types";

// TODO share it between front and back
export const NAME_MAP = {
  taiko: "太鼓の達人",
  popn: "ポップンミュージック",
  iidx: "beatmania iidx",
  ddr: "Dance Dance Revolution",
  ddr20: "Dance Dance Revolution A20",
  jubeat: "jubeat",
  dan: "DANCERUSH STARDOM",
  dm: "GITADORA DrumMania",
  gf: "GITADORA GuitarFreaks",
  nostalgia: "ノスタルジア",
  sdvx: "SOUND VOLTEX",
  rb: "REFLEC BEAT",
  museca: "MUSECA",
  danevo: "DanceEvolution"
} as { [gameName: string]: string };

export const intializeFilter = (flag: boolean): Filter => {
  const initialFilter = {} as Filter;
  Object.keys(NAME_MAP).forEach(key => (initialFilter[key] = flag));
  return initialFilter;
};
