import React from "react";
import { Link } from "gatsby";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { MODULES } from "../constants/modules";
import { Layout } from "../components/Layout";

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const Dashboard: React.FC = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Grid container spacing={1}>
        {MODULES.filter((mod) => mod.dashboard).map((mod) => (
          <Grid xs={6} item key={mod.name}>
            <Link to={mod.link} style={{ textDecoration: "none" }}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={mod.image}
                    title={mod.name}
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
    </Layout>
  );
};

export default Dashboard;
