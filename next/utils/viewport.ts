import { Viewport } from "react-leaflet";

export function viewportToString(viewport: Viewport): string {
  if (!viewport || !viewport.center || !viewport.zoom) return "";
  return `@${viewport.center[0].toString()},${viewport.center[1].toString()},${viewport.zoom.toString()}z`;
}

export function stringToViewport(str: string): Viewport | null {
  if (!str) return null;

  const matchResult = str.match(/@(.*?),(.*?),(.*?)z/);
  if (!matchResult) return null;

  const [, lat, lng, zoom] = matchResult;

  const viewport = {
    center: [parseFloat(lat), parseFloat(lng)],
    zoom: parseFloat(zoom)
  } as Viewport;

  return viewport;
}
