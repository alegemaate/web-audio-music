import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";

import { type FmPreset, FmSynth } from "../components/FmSynth";
import { Layout } from "../components/Layout";
import { rangeMap } from "../helpers/helpers";
import { useAudioContext } from "../hooks/useAudioContext";
import { Seo } from "../components/Seo";

const DEFAULT_PRESET: FmPreset = {
  gain: 1.0,
  op1: {
    ratio: 1,
    dest: "out",
    feedback: 0,
    level: 1.0,
    type: "sine",
    adsr: {
      attackLevel: 1.0,
      attackTime: 0.1,
      decayLevel: 0.8,
      decayTime: 0.1,
      sustainLevel: 0.5,
      sustainTime: 0.2,
      releaseLevel: 0.0,
      releaseTime: 0.3,
    },
  },
  op2: {
    ratio: 1,
    dest: "op1",
    feedback: 0,
    level: 1000.0,
    type: "sine",
    adsr: {
      attackLevel: 1.0,
      attackTime: 0.1,
      decayLevel: 0.8,
      decayTime: 0.1,
      sustainLevel: 0.5,
      sustainTime: 0.2,
      releaseLevel: 0.0,
      releaseTime: 0.3,
    },
  },
};

const Harmonicity: React.FC = () => {
  const { context, gain } = useAudioContext();

  const [fmSynth, _setFmSynth] = React.useState(
    context && gain ? new FmSynth(context, gain) : null,
  );
  const [preset, setPreset] = React.useState<FmPreset>(DEFAULT_PRESET);

  const playNote = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!context || !fmSynth) {
      return;
    }

    if (context.state === "suspended") {
      context.resume().catch(console.error);
    }
    fmSynth.changeInstrument(preset);
    const bounding = event.currentTarget.getBoundingClientRect();
    const freq = rangeMap(
      event.clientX - bounding.x,
      0,
      bounding.width,
      50,
      2000,
    );
    fmSynth.play(freq);
  };

  const stopNote = () => {
    if (!fmSynth) {
      return;
    }

    fmSynth.stop();
  };

  return (
    <Layout>
      <Typography variant="h1">Harmonicity Ratio Controller</Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        Test the harmonicity of two oscillators by changing their ratio.
      </Typography>
      <Grid container spacing={1}>
        <Grid xs={12} item>
          <Card>
            <CardContent>
              <Typography variant="h5">Controller</Typography>
            </CardContent>
            <CardActions>
              <Button
                onMouseDown={playNote}
                onMouseUp={stopNote}
                variant="outlined"
                color="primary"
                fullWidth
              >
                Play
              </Button>

              <Button
                onClick={playNote}
                variant="outlined"
                color="primary"
                fullWidth
              >
                Hold
              </Button>

              <Button
                onClick={stopNote}
                variant="outlined"
                color="primary"
                fullWidth
              >
                Stop
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid xs={12} item>
          <Card>
            <CardContent>
              <Typography variant="h5">Ratios</Typography>
              {preset.op2.ratio % preset.op1.ratio === 0 ? (
                <Typography variant="body1">The ratio is HARMONIC</Typography>
              ) : (
                <Typography variant="body1">The ratio is INHARMONIC</Typography>
              )}
            </CardContent>
            <CardActions>
              <Select
                variant="outlined"
                style={{ marginBottom: 16 }}
                onChange={(event) => {
                  if (typeof event.target.value === "number") {
                    setPreset({
                      ...preset,
                      op1: { ...preset.op1, ratio: event.target.value },
                    });
                  }
                }}
                value={preset.op1.ratio}
                fullWidth
                placeholder="Select a preset"
                color="primary"
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
              </Select>

              <Select
                variant="outlined"
                style={{ marginBottom: 16 }}
                onChange={(event) => {
                  if (typeof event.target.value === "number") {
                    setPreset({
                      ...preset,
                      op2: { ...preset.op1, ratio: event.target.value },
                    });
                  }
                }}
                value={preset.op2.ratio}
                fullWidth
                placeholder="Select a preset"
                color="primary"
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
              </Select>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Harmonicity;

export const Head = (): JSX.Element => (
  <Seo
    title="Harmonicity Ratio Controller"
    description="Test the harmonicity of two oscillators by changing their ratio."
  />
);
