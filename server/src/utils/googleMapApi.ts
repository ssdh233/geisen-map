type Geo = {
  lat: number;
  lng: number;
}

async function getGeoFromText(text: string): Promise<Geo> {
  const geocodingApiRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(text)}&key=${
    process.env.GOOGLE_MAP_API_KEY
    }`
  ).then(res => res.json());
  console.log(
    "calling google map api: ",
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(text)}&key=${
    process.env.GOOGLE_MAP_API_KEY
    }`
  );
  const geo = geocodingApiRes.results[0] && geocodingApiRes.results[0].geometry.location;
  return geo;
}

export { getGeoFromText }; 