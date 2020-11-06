import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import cx from "../utils/classname";
import { NAME_MAP } from "../constants/game";
import { GameCenter, Filter } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  gamecenterData: GameCenter;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      zIndex: 500,
      overflowY: "scroll",
    },
    dialogHeader: {
      position: "relative",
    },
    toolBar: {
      justifyContent: "space-between",
    },
    dialogBody: {
      display: "flex",
      flexDirection: "column",
      padding: 20,
    },
    checkbox: {
      minHeight: 32,
      color: "lightgrey",
    },
    hasGame: {
      color: "black",
    },
  })
);

function CheckInDialog(props: Props) {
  const classes = useStyles();

  const [filter, setFilter] = useState<Filter>(
    Object.keys(NAME_MAP).reduce((acc, cur) => {
      acc[cur] = false;
      return acc;
    }, {} as Filter)
  );

  function onCheckIn() {
    console.log(filter);
  }

  return (
    <Dialog
      open={props.open}
      fullScreen
      onClose={props.onClose}
      TransitionComponent={Transition}
      classes={{
        paper: classes.dialog,
      }}
    >
      <AppBar className={classes.dialogHeader}>
        <Toolbar className={classes.toolBar}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Button autoFocus color="inherit" onClick={onCheckIn}>
            Check In
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.dialogBody}>
        <span>どのゲームをプレイしに来たんですか？</span>
        {Object.keys(NAME_MAP).map((gameName) => {
          const hasGame = props.gamecenterData.games.find(
            (x) => x.name === NAME_MAP[gameName]
          );
          return (
            <FormControlLabel
              key={gameName}
              className={cx(classes.checkbox, hasGame && classes.hasGame)}
              control={
                <Checkbox
                  value={gameName}
                  color="primary"
                  checked={filter[gameName]}
                  onChange={() => {
                    setFilter((filter) => ({
                      ...filter,
                      [gameName]: !filter[gameName],
                    }));
                  }}
                />
              }
              label={NAME_MAP[gameName]}
            />
          );
        })}
      </div>
    </Dialog>
  );
}

export default CheckInDialog;
