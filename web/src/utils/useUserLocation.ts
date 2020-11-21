import { useState } from "react";

function useUserLocation() {
  const [userLocation, setUserLocation] = useState(
    null as [number, number] | null
  );

  function requestUserLocation(onSuccess?: () => void) {
    let startPos;
    let geoOptions = {
      timeout: 10 * 1000,
    };

    let geoSuccess = function (position: {
      coords: { latitude: number; longitude: number };
    }) {
      startPos = position;
      setUserLocation([startPos.coords.latitude, startPos.coords.longitude]);
      if (onSuccess) onSuccess();
    };
    let geoError = function (error: { code: number }) {
      console.error(
        "Error occurred. Error code: " + error.code,
        ({
          "0": "unknown error",
          "1": "permission denied",
          "2": "position unavailable (error response from location provider)",
          "3": "timed out",
        } as any)["" + error.code]
      );
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  return [userLocation, requestUserLocation] as [
    [number, number] | null,
    (onSuccess?: () => void) => void
  ];
}

export default useUserLocation;
