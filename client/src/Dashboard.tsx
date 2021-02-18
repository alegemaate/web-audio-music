import React from "react";
import "fontsource-roboto";
import { Link, RouteComponentProps } from "@reach/router";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import "./libs/fulltilt";

import Landscape from "./images/landscape.jpg";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export const Dashboard: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={1}>
      <Grid xs={6} item>
        <Link to="/bloom" style={{ textDecoration: "none" }}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={Landscape}
                title="Bloom"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Bloom
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Interactive Bloom clone inspired by Bryan Eno
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      </Grid>
      <Grid xs={6} item>
        <Link to="/accel" style={{ textDecoration: "none" }}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={Landscape}
                title="Axis Controller"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Axis Control
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Axis controller for iPhone
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      </Grid>
    </Grid>
  );
};
