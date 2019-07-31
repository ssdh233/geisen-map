import { useState, Dispatch, SetStateAction } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import { Viewport } from "react-leaflet";

import SearchBar from "./SearchBar";
import GameCenterInfo from "./GameCenterInfo";
import AboutSide from "./AboutSide";
import { Filter, GameCenter } from "../types";
import { NAME_MAP, intializeFilter } from "../constants/game";

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
    overflow: "auto"
  },
  checkboxes: {
    paddingLeft: 16
  },
  searchArea: {
    padding: 8,
    marginBottom: 8
  },
});

interface Props {
  gameCenterId: string;
  gameCenterData: GameCenter | null;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  setViewport: Dispatch<SetStateAction<Viewport>>;
}

function MainSide(props: Props) {
  const [open, setOpen] = useState(true);
  const [aboutSideOpen, setAboutSideOpen] = useState(false);

  const classes = useStyles();

  const FilterCheckBox = ({ gameName }: { gameName: string }) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={props.filter[gameName]}
          onChange={() =>
            props.setFilter(filter => ({
              ...filter,
              [gameName]: !filter[gameName]
            }))
          }
          value={gameName}
          color="primary"
        />
      }
      label={NAME_MAP[gameName]}
    />
  );

  const hasSomthingSelected = Object.keys(props.filter).some(gameName => props.filter[gameName]);
  return (
    <div style={{ border: "5px solid red" }}>
      {!open && (
        <button className={classes.openButton} onClick={() => setOpen(true)}>
          <ArrowRightIcon />
        </button>
      )}
      <Drawer
        anchor="left"
        open={open}
        variant="persistent"
        PaperProps={{
          style: {
            overflowY: "visible",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)"
          }
        }}
      >
        <button className={classes.closeButton} onClick={() => setOpen(false)}>
          <ArrowLeftIcon />
        </button>
        <div className={classes.sideContainer}>
          <div className={classes.searchArea}>
            <SearchBar
              onSearch={viewport => props.setViewport(viewport)}
              onMenuButtonClick={() => setAboutSideOpen(true)}
            />
            <FormGroup row className={classes.checkboxes}>
              <FormControl component="fieldset">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hasSomthingSelected}
                        onChange={() => props.setFilter(intializeFilter(!hasSomthingSelected))}
                        value="selectAll"
                        color="primary"
                      />
                    }
                    label={hasSomthingSelected ? "すべて解除" : "すべて選択"}
                  />
                  {Object.keys(NAME_MAP).map(gameName => <FilterCheckBox key={gameName} gameName={gameName} />)}
                </FormGroup>
              </FormControl>
            </FormGroup>
          </div>
          <Divider />
          {props.gameCenterData && <GameCenterInfo data={props.gameCenterData} />}
          <AboutSide open={aboutSideOpen} onDrawerClose={() => setAboutSideOpen(false)} />
        </div>
      </Drawer>
    </div>
  );
}

export default MainSide;
