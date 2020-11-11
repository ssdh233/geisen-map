import React, { ReactNode, useState, useEffect } from "react";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Divider from "@material-ui/core/Divider";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import MyDrawer, { DrawerState } from "./MyDrawer";
import SearchBar from "./SearchBar";
import AboutSide from "./AboutSide";
import GameFilter from "./GameFilter";
import useViewport from "../utils/useViewport";
import useQuery from "../utils/useQuery";
import useFilter from "../utils/useFilter";
import { toQuery } from "../utils/query";

const toggleStyle = {
  color: "rgba(0, 0, 0, 0.54)",
  width: 23,
  height: 48,
  cursor: "pointer",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderLeft: "1px solid #D4D4D4",
  boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.3)",
  display: "flex",
  justifyContent: "center",
};

const useStyles = makeStyles({
  closeButton: {
    ...toggleStyle,
    position: "absolute",
    right: 0,
    top: 8,
    transform: "translateX(100%)",
  },
  openButton: {
    ...toggleStyle,
    position: "absolute",
    zIndex: 210,
    left: 0,
    top: 8,
  },
  sideContainer: {
    height: "100%",
    overflow: "auto",
    width: 400,
  },
  searchBarContainer: {
    padding: 8,
    zIndex: 101,
    position: "relative",
  },
  // sp styles
  "@media (max-width: 768px)": {
    sideContainer: {
      width: "100%",
    },
  },
  spContainer: {
    zIndex: 200,
    width: "100%",
    position: "fixed",
  },
});

type Props = {
  children: ReactNode;
  spDrawerState: DrawerState;
  onChangeSpDrawerState: (state: DrawerState) => void;
  filterExpanded: boolean;
  onChangeFilterExpanded: (state: boolean) => void;
};

function MainSide(props: Props) {
  const query = useQuery();
  const history = useHistory();
  const [, setViewport] = useViewport();
  const [filter, setFilter] = useFilter();
  const [pcDrawerOpen, setPcDrawerOpen] = useState(true);
  const [aboutSideOpen, setAboutSideOpen] = useState(false);

  const classes = useStyles();
  const isSP = useMediaQuery("(max-width: 768px)");

  function handleChangeSpDrawerState(state: DrawerState) {
    props.onChangeSpDrawerState(state);

    if (state === "closed") {
      // waiting for animation
      setTimeout(() => history.push(`/?${toQuery(query)}`), 150);
    }
  }

  return (
    <>
      {!isSP && (
        <div>
          {!pcDrawerOpen && (
            <button
              id="openButton"
              className={classes.openButton}
              onClick={() => setPcDrawerOpen(true)}
            >
              <ArrowRightIcon />
            </button>
          )}
          <Drawer
            anchor="left"
            open={pcDrawerOpen}
            variant="persistent"
            PaperProps={{
              style: {
                overflowY: "visible",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <button
              className={classes.closeButton}
              onClick={() => setPcDrawerOpen(false)}
            >
              <ArrowLeftIcon />
            </button>
            <div className={classes.sideContainer}>
              <div className={classes.searchBarContainer}>
                <SearchBar
                  onSearch={(viewport) => setViewport(viewport)}
                  onMenuButtonClick={() => setAboutSideOpen(true)}
                />
              </div>
              <GameFilter
                expanded={props.filterExpanded}
                onChangeExpanded={props.onChangeFilterExpanded}
                filter={filter}
                onChange={setFilter}
              />
              <Divider />
              {props.children}
              <AboutSide
                open={aboutSideOpen}
                onDrawerClose={() => setAboutSideOpen(false)}
              />
            </div>
          </Drawer>
        </div>
      )}
      {isSP && (
        <>
          <div className={classes.searchBarContainer}>
            <SearchBar
              onSearch={(viewport) => setViewport(viewport)}
              onMenuButtonClick={() => setAboutSideOpen(true)}
            />
            <AboutSide
              open={aboutSideOpen}
              onDrawerClose={() => setAboutSideOpen(false)}
            />
          </div>

          <div className={classes.spContainer}>
            <Drawer variant="permanent" anchor="bottom" open={true}>
              <GameFilter
                expanded={props.filterExpanded}
                onChangeExpanded={props.onChangeFilterExpanded}
                filter={filter}
                onChange={setFilter}
                expandedIconState={!props.filterExpanded}
              />
            </Drawer>
            {props.children && (
              <MyDrawer
                drawerState={props.spDrawerState}
                onChangeDrawerState={handleChangeSpDrawerState}
              >
                {props.children}
              </MyDrawer>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default MainSide;
