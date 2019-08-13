import { Filter } from "../types";

import { NAME_MAP } from "../constants/game";

const ALL_FILTER_QUERY_STRING = Object.keys(NAME_MAP)
  .sort()
  .join(",");

export function stringToFilter(str: string): Filter {
  const filter = {} as Filter;

  if (!str || str === "all") {
    Object.keys(NAME_MAP).forEach(key => {
      filter[key] = true;
    });
  } else if (str === "none") {
    Object.keys(NAME_MAP).forEach(key => {
      filter[key] = false;
    });
  } else {
    const keys = str.split(",");
    Object.keys(NAME_MAP).forEach(key => {
      filter[key] = keys.includes(key);
    });
  }

  return filter;
}

export function filterToString(filter: Filter): string {
  const filterStr = Object.keys(filter)
    .filter(key => filter[key])
    .sort()
    .join(",");

  if (!filterStr) {
    return "none";
  }

  if (filterStr === ALL_FILTER_QUERY_STRING) {
    return "all";
  }

  return filterStr;
}
