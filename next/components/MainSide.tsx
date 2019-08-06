import { useState, Dispatch, SetStateAction } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Divider from "@material-ui/core/Divider";
import { Viewport } from "react-leaflet";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import MyDrawer, { DrawerState } from "./MyDrawer";
import SearchBar from "./SearchBar";
import GameCenterInfo from "./GameCenterInfo";
import AboutSide from "./AboutSide";
import { Filter, GameCenter } from "../types";
import GameFilter from "./GameFilter";

const toggleStyle = {
  color: "rgba(0, 0, 0, 0.54)",
  width: 23,
  height: 48,
  cursor: "pointer",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderLeft: "1px solid #D4D4D4",
  boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.3)",
  display: "flex",
  justifyContent: "center"
};

const useStyles = makeStyles({
  closeButton: {
    ...toggleStyle,
    position: "absolute",
    right: 0,
    top: 8,
    transform: "translateX(100%)"
  },
  openButton: {
    ...toggleStyle,
    position: "absolute",
    zIndex: 1000,
    left: 0,
    top: 8
  },
  sideContainer: {
    height: "100%",
    overflow: "auto",
    width: 400
  },
  searchBarContainer: {
    padding: 8
  },
  // sp styles
  "@media (max-width: 768px)": {
    sideContainer: {
      width: "100%"
    }
  },
  spContainer: {
    zIndex: 1200,
    width: "100%",
    position: "fixed"
  }
});

type Props = {
  gameCenterId: string;
  gameCenterData: GameCenter | null;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  filterExpanded: boolean;
  setFilterExpanded: Dispatch<SetStateAction<boolean>>;
  setViewport: Dispatch<SetStateAction<Viewport>>;
  spGameCenterInfoDrawerState: DrawerState;
  onChangeSpGameCenterInfoDrawerState: (drawerState: DrawerState) => void;
};

function MainSide(props: Props) {
  const [pcDrawerOpen, setPcDrawerOpen] = useState(true);
  const [aboutSideOpen, setAboutSideOpen] = useState(false);

  const classes = useStyles();
  const isSP = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {!isSP && (
        <div>
          {!pcDrawerOpen && (
            <button id="openButton" className={classes.openButton} onClick={() => setPcDrawerOpen(true)}>
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
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)"
              }
            }}
          >
            <button className={classes.closeButton} onClick={() => setPcDrawerOpen(false)}>
              <ArrowLeftIcon />
            </button>
            <div className={classes.sideContainer}>
              <div className={classes.searchBarContainer}>
                <SearchBar
                  onSearch={viewport => props.setViewport(viewport)}
                  onMenuButtonClick={() => setAboutSideOpen(true)}
                />
              </div>
              <GameFilter
                expanded={props.filterExpanded}
                onChangeExpanded={props.setFilterExpanded}
                filter={props.filter}
                onChange={props.setFilter}
              />
              <Divider />
              {props.gameCenterData && <GameCenterInfo data={props.gameCenterData} />}
              <AboutSide open={aboutSideOpen} onDrawerClose={() => setAboutSideOpen(false)} />
            </div>
          </Drawer>
        </div>
      )}
      {isSP && (
        <div className={classes.spContainer}>
          <div className={classes.searchBarContainer}>
            <SearchBar
              onSearch={viewport => props.setViewport(viewport)}
              onMenuButtonClick={() => setAboutSideOpen(true)}
            />
            <AboutSide open={aboutSideOpen} onDrawerClose={() => setAboutSideOpen(false)} />
          </div>
          
          <Drawer variant="permanent" anchor="bottom" open={true}>
            <GameFilter
              expanded={props.filterExpanded}
              onChangeExpanded={props.setFilterExpanded}
              filter={props.filter}
              onChange={props.setFilter}
              expandedIconState={!props.filterExpanded}
            />
          </Drawer>
          {props.gameCenterData && (
            <MyDrawer
              drawerState={props.spGameCenterInfoDrawerState}
              onChangeDrawerState={props.onChangeSpGameCenterInfoDrawerState}
            >
              <GameCenterInfo data={props.gameCenterData} />
            </MyDrawer>
          )}
        </div>
      )}
    </>
  );
}

export default MainSide;
