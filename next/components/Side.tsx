import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';

import GameCenterInfo from "./GameCenterInfo";

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
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    marginBottom: 8
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
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

});

interface Props {
  gameCenterId: string;
  gameCenterData: any
}

function Side(props: Props) {
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState({ popn: false, taiko: false });
  const classes = useStyles();

  console.log(setFilters);

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
          <Paper className={classes.root}>
            <IconButton className={classes.iconButton} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <InputBase
              className={classes.input}
              placeholder=""
              inputProps={{ 'aria-label': '' }}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <FormGroup row>
            <FormControl component="fieldset">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={filters.popn} value="popn" />}
                  label="ポップン"
                  color="primary"
                />
                <FormControlLabel
                  control={<Checkbox checked={filters.taiko} value="taiko" />}
                  label="太鼓の達人"
                  color="primary"
                />
              </FormGroup>
            </FormControl>
          </FormGroup>
        </div>
        <Divider />
        <GameCenterInfo data={props.gameCenterData} />
      </Drawer>
    </div>
  );
}

export default Side;