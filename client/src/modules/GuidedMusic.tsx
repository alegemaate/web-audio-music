import { RouteComponentProps } from "@reach/router";
import React from "react";
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  Typography,
  CardActions,
} from "@material-ui/core";

import { Controller } from "../components/LivingSynth/Controller";
import { Oscilloscope } from "../components/Oscilloscope";
import { SCALES } from "../components/LivingSynth/scales";
import { useAudioContext } from "../hooks/useAudioContext";
import { GameOfLife } from "../components/GameOfLife";

export const GuidedMusic: React.FC<RouteComponentProps> = () => {
  const context = useAudioContext();

  const [fmSynth, setFmSynth] = React.useState<Controller | null>(null);
  const [paused, setPaused] = React.useState(true);

  const startSynth = () => {
    if (context.state === "suspended") {
      context.resume();
    }

    if (!fmSynth) {
      setFmSynth(new Controller(context));
    }

    setPaused(!paused);
  };

  return (
    <Card>
      <Button onClick={startSynth}>{paused ? "Start" : "Stop"}</Button>
      <Oscilloscope createAnalyser={fmSynth?.createAnalyser.bind(fmSynth)} />
      <CardContent>
        <Typography variant="h5">Configure</Typography>
      </CardContent>
      <CardActions>
        <Select
          variant="outlined"
          style={{ marginBottom: 16 }}
          onChange={(event) => {
            if (typeof event.target.value === "string" && fmSynth) {
              fmSynth.setScale(SCALES[event.target.value]);
            }
          }}
          defaultValue="chromatic"
          fullWidth
          placeholder="Select a scale"
          color="primary"
        >
          <MenuItem value={-1} disabled>
            Select a preset
          </MenuItem>
          {Object.keys(SCALES).map((key, index) => (
            <MenuItem value={key} key={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </CardActions>
      <GameOfLife
        width={12}
        height={12}
        cellSize={50}
        paused={paused}
        onChange={(arr) => {
          if (fmSynth) {
            fmSynth.evolve(arr);
          }
        }}
      />
    </Card>
  );
};
