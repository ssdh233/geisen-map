import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';

import SearchBar from "./SearchBar";
import GameCenterInfo from "./GameCenterInfo";
import AboutSide from "./AboutSide";

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
}

const useStyles = makeStyles({
  searchArea: {
    padding: 8,
    marginBottom: 8
  },
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
    top: 8,
  },
  checkboxes: {
    paddingLeft: 16
  }
});

interface Props {
  gameCenterId: string;
  gameCenterData: any,
  filter: any,
  setFilter: any,
  setViewport: any
}

function MainSide(props: Props) {
  const [open, setOpen] = useState(true);
  const [aboutSideOpen, setAboutSideOpen] = useState(false);

  const classes = useStyles();

  return (
    <div style={{ border: "5px solid red" }}>
      {!open && <button className={classes.openButton} onClick={() => setOpen(true)}><ArrowRightIcon /></button>}
      <Drawer anchor="left" open={open} variant="persistent" PaperProps={{
        style: {
          overflowY: 'visible',
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)"
        }
      }}>
        <button className={classes.closeButton} onClick={() => setOpen(false)}><ArrowLeftIcon /></button>
        <div className={classes.searchArea}>
          <SearchBar setViewport={props.setViewport} setAboutSideOpen={setAboutSideOpen} />
          <FormGroup row className={classes.checkboxes}>
            <FormControl component="fieldset">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox
                    checked={props.filter.popn}
                    onChange={() => props.setFilter((filter: any) => ({ ...filter, popn: !filter.popn }))}
                    value="popn"
                    color="primary" />
                  }
                  label="ポップン"
                />
                <FormControlLabel
                  control={<Checkbox
                    checked={props.filter.taiko}
                    onChange={() => props.setFilter((filter: any) => ({ ...filter, taiko: !filter.taiko }))}
                    value="taiko"
                    color="primary" />
                  }
                  label="太鼓の達人"
                />
              </FormGroup>
            </FormControl>
          </FormGroup>
        </div>
        <Divider />
        <GameCenterInfo data={props.gameCenterData} />
        <AboutSide open={aboutSideOpen} setAboutSideOpen={setAboutSideOpen} />
      </Drawer>
    </div>
  );
}

export default MainSide;