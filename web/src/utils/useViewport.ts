import { useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Viewport } from "react-leaflet";

import useQuery from "./useQuery";
import { toQuery } from "./query";

function viewportToString(viewport: Viewport): string {
  if (!viewport || !viewport.center || !viewport.zoom) return "";
  return `@${viewport.center[0].toString()},${viewport.center[1].toString()},${viewport.zoom.toString()}z`;
}

function stringToViewport(str: string): Viewport | null {
  if (!str) return null;

  const matchResult = str.match(/@(.*?),(.*?),(.*?)z/);
  if (!matchResult) return null;

  const [, lat, lng, zoom] = matchResult;

  const viewport = {
    center: [parseFloat(lat), parseFloat(lng)],
    zoom: parseFloat(zoom),
  } as Viewport;

  return viewport;
}

function useViewport() {
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();

  const viewport = (query.v && stringToViewport(query.v)) || {
    center: [38.5548225, 135.8920016] as [number, number],
    zoom: 6,
  };

  const handleViewportChange = useCallback(
    (viewport: Viewport) => {
      if (viewport.zoom && viewport.zoom >= 19) {
        viewport.zoom = 19;
      }

      const newQuery = { ...query, v: viewportToString(viewport) };
      history.push(`${location.pathname}?${toQuery(newQuery)}`);
    },
    [query, location, history]
  );

  return [viewport, handleViewportChange] as [
    Viewport,
    (viewport: Viewport) => void
  ];
}

export default useViewport;
