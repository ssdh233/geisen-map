import { ReactNode, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

import MyDrawer, { MY_DRAWER_TRANSFORM_TABLE } from "./MyDrawer";
import { DrawerState } from "./index";

type Props = {
  drawerState: DrawerState;
  onChangeDrawerState: (drawerState: DrawerState) => void;
  children: ReactNode;
};

function getNextDrawerState(drawerState: DrawerState): DrawerState {
  return {
    open: "open",
    halfOpen: "open",
    closed: "halfOpen"
  }[drawerState] as DrawerState;
}

function getPrevDrawerState(drawerState: DrawerState): DrawerState {
  return {
    open: "halfOpen",
    halfOpen: "closed",
    closed: "closed"
  }[drawerState] as DrawerState;
}

function MyDrawerContainer(props: Props) {
  const refObj = useRef({ startY: 0, isDragging: false });
  const paperRef = useRef() as any;

  const { drawerState, ...rest } = props;

  useEffect(() => {
    function handleBodyTouchStart(event: TouchEvent) {
      // 0.3 is just an temporary solution. better to get it somewhere(like paperRef)
      const isInDraggingAreaWhenHalfOpen = (window.innerHeight - event.touches[0].clientY) / window.innerHeight < 0.3;
      if (drawerState === "open" || (drawerState === "halfOpen" && isInDraggingAreaWhenHalfOpen)) {
        refObj.current.startY = window.innerHeight - event.touches[0].clientY;
        refObj.current.isDragging = true;
      }
    }

    function handleBodyTouchMove(event: TouchEvent) {
      if (refObj.current.isDragging) {
        event.preventDefault();

        const currentY = window.innerHeight - event.touches[0].clientY;
        const dy = currentY - refObj.current.startY;

        const transform = `${MY_DRAWER_TRANSFORM_TABLE[drawerState]} translate(0, ${-1 * dy}px)`;
        const drawerStyle = paperRef.current.style;
        drawerStyle.webkitTransform = transform;
        drawerStyle.transform = transform;
        drawerStyle.transition = "";
        drawerStyle.transitionDuration = "";
      }
    }

    function handleBodyTouchEnd(event: TouchEvent) {
      if (refObj.current.isDragging) {
        const currentY = window.innerHeight - event.changedTouches[0].clientY;
        const dy = currentY - refObj.current.startY;

        if (dy > 100) {
          props.onChangeDrawerState(getNextDrawerState(drawerState));
        } else if (dy < -100) {
          props.onChangeDrawerState(getPrevDrawerState(drawerState));
        }

        const drawerStyle = paperRef.current.style;
        drawerStyle.webkitTransform = "";
        drawerStyle.transform = "";
        drawerStyle.transition = "transform";
        drawerStyle.transitionDuration = "150ms";

        refObj.current.isDragging = false;
      }
    }

    document.body.addEventListener("touchstart", handleBodyTouchStart);
    document.body.addEventListener("touchmove", handleBodyTouchMove, { passive: false });
    document.body.addEventListener("touchend", handleBodyTouchEnd);

    return () => {
      document.body.removeEventListener("touchstart", handleBodyTouchStart);
      // @ts-ignore
      document.body.removeEventListener("touchmove", handleBodyTouchMove, { passive: false });
      document.body.removeEventListener("touchend", handleBodyTouchEnd);
    };
    // it's very very very important to put drawerState here. otherwise function like handleBodyTouchStart
    // will not be updated when drawerState is changed.
  }, [drawerState]);

  const handlePaperRef = useCallback(instance => {
    paperRef.current = ReactDOM.findDOMNode(instance);
  }, []);

  return (
    <MyDrawer
      PaperProps={{
        ref: handlePaperRef
      }}
      drawerState={drawerState}
      onClose={() => props.onChangeDrawerState("closed")}
      {...rest}
    >
      {props.children}
    </MyDrawer>
  );
}

export default MyDrawerContainer;
