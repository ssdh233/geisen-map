import React from 'react';
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

type Props = {
  open: boolean;
  onDrawerClose: () => void;
}

function AboutSide(props: Props) {
  return (
    <Drawer open={props.open} onClose={props.onDrawerClose}>
      <img style={{ margin: 20 }} src="/static/logo.png" />
      <Divider />
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem button component="a" href="https://twitter.com/geisen_map">
          <ListItemText primary="Twitter" />
        </ListItem>
        <ListItem
          button
          component="a"
          href="https://github.com/matsumatsu233/geisen-map"
        >
          <ListItemText primary="Github" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default AboutSide;
