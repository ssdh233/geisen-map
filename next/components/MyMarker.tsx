import { useRef, useEffect } from "react";
import { Marker, MarkerProps } from "react-leaflet";

type Props = {
  isOpen: boolean;
  onClick: any;
} & MarkerProps;

function MyMarker(props: Props) {
  const { isOpen, ...rest } = props;

  const markerRef: any = useRef();

  useEffect(() => {
    if (isOpen) {
      markerRef.current.leafletElement.openPopup();
    }
  }, [isOpen]);

  return <Marker ref={markerRef} {...rest} />;
}

export default MyMarker;
