import { ReactNode } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { DrawerState } from "./index";
import cx from "../../utils/classname";

export const MY_DRAWER_TRANSFORM_TABLE = {
  closed: "translate(0, 100%)",
  halfOpen: "translate(0, calc(100% - 30vh))",
  open: "translate(0, calc(100% - 100vh))"
};

export type Props = {
  drawerState: DrawerState;
  PaperProps: Object;
  onClose: () => void;
  children: ReactNode;
};

const useStyles = makeStyles({
  drawer: (props: Props) => ({
    overflow: "visible",
    minHeight: "150vh",
    transform: MY_DRAWER_TRANSFORM_TABLE[props.drawerState],
    transition: "transform",
    transitionDuration: "150ms"
  }),
  closeButton: {
    position: "absolute",
    left: 0,
    top: 0
  }
});

function MyDrawer(props: Props) {
  const classes = useStyles(props);
  const { children, drawerState, ...rest } = props;

  return (
    <Drawer classes={{ paper: cx(classes.drawer) }} variant="permanent" anchor="bottom" {...rest}>
      {drawerState === "open" && (
        <IconButton className={classes.closeButton} onClick={() => props.onClose()}>
          <ExpandMoreIcon fontSize="large" />
        </IconButton>
      )}
      {children}
    </Drawer>
  );
}

export default MyDrawer;
