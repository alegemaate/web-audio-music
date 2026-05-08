"use client";

import * as React from "react";
import { Box, Container, Toolbar } from "@mui/material";

import { AppDrawer, DRAWER_WIDTH } from "./AppDrawer";
import { AppTopBar } from "./AppTopBar";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((open) => !open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppTopBar toggleDrawer={toggleDrawer} />
      <AppDrawer open={drawerOpen} toggle={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="md">
          <Box sx={{ mt: 4 }}>{children}</Box>
        </Container>
      </Box>
    </Box>
  );
};
