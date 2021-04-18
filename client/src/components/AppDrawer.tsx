import React from "react";
import { Link } from "gatsby";
import {
  Drawer,
  ListItemText,
  makeStyles,
  ListItemIcon,
  ListItem,
  List,
} from "@material-ui/core";

import { MODULES } from "../constants/modules";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
}));

export const AppDrawer: React.FC<{ open: boolean; toggle: () => void }> = ({
  open,
  toggle,
}) => {
  const classes = useStyles();

  return (
    <Drawer anchor="left" open={open} onClose={toggle}>
      <div
        className={classes.list}
        role="presentation"
        onClick={toggle}
        onKeyDown={toggle}
      >
        <List>
          {MODULES.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    </Drawer>
  );
};
