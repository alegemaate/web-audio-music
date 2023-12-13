import React from "react";
import { Link } from "gatsby";
import {
  AppBar,
  IconButton,
  makeStyles,
  MenuItem,
  Toolbar,
  Typography,
  Menu,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { SyncDisabledRounded, SyncRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const AppTopBar: React.FC<{
  toggleDrawer: () => void;
  onDisconnect: () => void;
  onConnect: () => void;
  url?: string;
}> = ({ toggleDrawer, url, onDisconnect, onConnect }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const classes = useStyles();

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = () => {
    onDisconnect();
    handleClose();
  };

  const handleConnect = () => {
    onConnect();
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        <Link
          to="/web-audio-music/"
          className={classes.title}
          style={{ textDecoration: "none", color: "white" }}
        >
          <Typography variant="h6">Allan's Web Music</Typography>
        </Link>
        {url && (
          <>
            <IconButton color="inherit" onClick={handleOpen}>
              <SyncRounded />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
            </Menu>
          </>
        )}
        {!url && (
          <>
            <IconButton color="inherit" onClick={handleOpen}>
              <SyncDisabledRounded />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleConnect}>Connect</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
