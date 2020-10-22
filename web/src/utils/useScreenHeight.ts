import { useState, useEffect } from "react";

function useScreenHeight() {
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    setScreenHeight(window.innerHeight);
  }, []);

  return screenHeight;
}

export default useScreenHeight;
