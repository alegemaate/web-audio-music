"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import { MODULES } from "@/constants/modules";
import { Layout } from "@/components/Layout";

const Dashboard: React.FC = () => (
  <Layout>
    <Typography variant="h1" sx={{ mb: 1 }}>
      Dashboard
    </Typography>
    <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
      View all modules available on the Web Audio Playground.
    </Typography>
    <Grid container spacing={2}>
      {MODULES.filter((mod) => mod.dashboard).map((mod) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={mod.name}>
          <Link
            href={mod.link}
            style={{ textDecoration: "none", display: "block", height: "100%" }}
          >
            <Card sx={{ height: "100%", display: "flex" }}>
              <CardActionArea
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <Box
                  sx={{
                    height: 96,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, rgba(124,92,255,0.35) 0%, rgba(90,209,200,0.25) 100%)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    color: "#fff",
                    "& svg": { fontSize: 40, opacity: 0.95 },
                  }}
                >
                  {mod.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    sx={{ fontSize: "1.05rem" }}
                  >
                    {mod.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mod.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  </Layout>
);

export default Dashboard;
