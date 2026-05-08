"use client";

import * as React from "react";
import Link from "next/link";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { DRAWER_WIDTH } from "./AppDrawer";

export const AppTopBar: React.FC<{
  toggleDrawer: () => void;
}> = ({ toggleDrawer }) => (
  <AppBar
    position="fixed"
    sx={{
      width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
      ml: { md: `${DRAWER_WIDTH}px` },
    }}
  >
    <Toolbar>
      <IconButton
        edge="start"
        sx={{ mr: 2, display: { md: "none" } }}
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </IconButton>
      <Link
        href="/"
        style={{
          flexGrow: 1,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Typography variant="h6">Allan&apos;s Web Music</Typography>
      </Link>
    </Toolbar>
  </AppBar>
);
