import { useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";

import useQuery from "./useQuery";
import { Filter } from "../types";
import { NAME_MAP } from "../constants/game";
import { toQuery } from "./query";

const ALL_FILTER_QUERY_STRING = Object.keys(NAME_MAP).sort().join(",");

export function stringToFilter(str: string): Filter {
  const filter = {} as Filter;

  if (!str || str === "all") {
    Object.keys(NAME_MAP).forEach((key) => {
      filter[key] = true;
    });
  } else if (str === "none") {
    Object.keys(NAME_MAP).forEach((key) => {
      filter[key] = false;
    });
  } else {
    const keys = str.split(",");
    Object.keys(NAME_MAP).forEach((key) => {
      filter[key] = keys.includes(key);
    });
  }

  return filter;
}

function filterToString(filter: Filter): string {
  const filterStr = Object.keys(filter)
    .filter((key) => filter[key])
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

export default function useFilter() {
  const query = useQuery();
  const location = useLocation();
  const history = useHistory();

  const filter = (query.f && stringToFilter(query.f)) || {};

  const setFilter = useCallback((filter: Filter) => {
    const newQuery = { ...query, f: filterToString(filter) };
    history.push(`${location.pathname}?${toQuery(newQuery)}`);
  }, [query, location, history]);

  return [filter, setFilter] as [Filter, (filter: Filter) => void];
}
