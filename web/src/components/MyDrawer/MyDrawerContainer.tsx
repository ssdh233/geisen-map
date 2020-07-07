import React, { ReactNode, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

import MyDrawer, { MY_DRAWER_TRANSFORM_TABLE } from "./MyDrawer";
import { DrawerState } from "./index";
import useScreenHeight from "../../utils/useScreenHeight";

type Props = {
  drawerState: DrawerState;
  onChangeDrawerState: (drawerState: DrawerState) => void;
  header?: ReactNode;
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
  const screenHeight = useScreenHeight();
  const refObj = useRef({ startY: 0, isDragging: false });
  const drawerBodyRef = useRef() as any;
  const paperRef = useRef() as any;

  const { drawerState, onChangeDrawerState, children, ...rest } = props;

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
      const currentY = window.innerHeight - event.touches[0].clientY;
      const dy = currentY - refObj.current.startY;
      if (refObj.current.isDragging) {
        if (drawerState === "open" && (drawerBodyRef.current.scrollTop > 0 || dy > 0)) {
          refObj.current.startY = window.innerHeight - event.touches[0].clientY;
          refObj.current.isDragging = true;
        } else {
          // XXX: not sure why it causes error
          event.preventDefault();

          const transform = `${MY_DRAWER_TRANSFORM_TABLE(screenHeight)[drawerState]} translate(0, ${-1 * dy}px)`;
          const drawerStyle = paperRef.current.style;
          drawerStyle.webkitTransform = transform;
          drawerStyle.transform = transform;
          drawerStyle.transition = "";
          drawerStyle.transitionDuration = "";
        }
      }
    }

    function handleBodyTouchEnd(event: TouchEvent) {
      const currentY = window.innerHeight - event.changedTouches[0].clientY;
      const dy = currentY - refObj.current.startY;

      if (refObj.current.isDragging) {
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
  }, [drawerBodyRef, drawerState, paperRef, props, screenHeight]);

  const handlePaperRef = useCallback(instance => {
    paperRef.current = ReactDOM.findDOMNode(instance);
  }, [paperRef]);

  return (
    <MyDrawer
      bodyRef={drawerBodyRef}
      PaperProps={{
        ref: handlePaperRef
      }}
      drawerState={drawerState}
      onClose={() => props.onChangeDrawerState("closed")}
      screenHeight={screenHeight}
      {...rest}
    >
      {props.children}
    </MyDrawer>
  );
}

export default MyDrawerContainer;
