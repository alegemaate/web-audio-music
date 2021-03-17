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

export const GuidedMusic: React.FC<RouteComponentProps> = () => {
  const [fmSynth, setFmSynth] = React.useState<Controller | null>(null);
  const context = useAudioContext();

  const startSynth = () => {
    if (!fmSynth) {
      const synth = new Controller(context);
      synth.start();
      setFmSynth(synth);
      return;
    }

    // Set synth
    fmSynth.start();
  };

  return (
    <Card>
      <Button onClick={startSynth}>{fmSynth ? "Restart" : "Start"}</Button>
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
    </Card>
  );
};
