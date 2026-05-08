"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7c5cff" },
    secondary: { main: "#5ad1c8" },
    background: {
      default: "#15151a",
      paper: "#1d1d24",
    },
  },
  shape: { borderRadius: 8 },
  typography: {
    h1: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.1rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: 16,
          "&:has(.MuiCardActionArea-root), &:has(> .MuiCardMedia-root), &:has(> .MuiCardContent-root)":
            { padding: 0 },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1d1d24",
          backgroundImage: "none",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
  },
});
