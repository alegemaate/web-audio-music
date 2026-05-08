"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Drawer,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  List,
  Toolbar,
  Box,
} from "@mui/material";

import { MODULES } from "../constants/modules";

export const DRAWER_WIDTH = 240;

const DrawerContents: React.FC<{ onNavigate?: () => void }> = ({
  onNavigate,
}) => {
  const pathname = usePathname();
  return (
    <Box sx={{ overflow: "auto" }}>
      <List>
        {MODULES.map((item) => {
          const selected =
            item.link === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.link);
          return (
            <Link
              key={item.link}
              href={item.link}
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={onNavigate}
            >
              <ListItemButton selected={selected}>
                <ListItemIcon sx={{ color: "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </Link>
          );
        })}
      </List>
    </Box>
  );
};

export const AppDrawer: React.FC<{ open: boolean; toggle: () => void }> = ({
  open,
  toggle,
}) => (
  <>
    {/* Mobile: temporary drawer */}
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={toggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
    >
      <DrawerContents onNavigate={toggle} />
    </Drawer>

    {/* Desktop: permanent drawer */}
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        },
      }}
      open
    >
      <Toolbar />
      <DrawerContents />
    </Drawer>
  </>
);
