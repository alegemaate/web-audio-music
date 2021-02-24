import React from "react";
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

import { MODULES } from "./modules";

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
      {MODULES.map((mod) => (
        <Grid xs={6} item key={mod.name}>
          <Link to={mod.link} style={{ textDecoration: "none" }}>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={mod.image}
                  title="Bloom"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {mod.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {mod.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};
