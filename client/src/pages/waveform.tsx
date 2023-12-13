import React from "react";
import {
  Button,
  Card,
  CardActions,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@material-ui/core";

import { Oscilloscope } from "../components/Oscilloscope";
import { DotDraw } from "../components/DotDraw";
import { useAudioContext } from "../hooks/useAudioContext";
import { AdditiveSynth } from "../components/AdditiveSynth";
import { Layout } from "../components/Layout";
import { Seo } from "../components/Seo";

const CANVAS_HEIGHT = 300;
const DEFAULT_SAMPLES = 20;

const getFourierPreset = (
  type: "cosine" | "rectified" | "sawtooth" | "square" | "triangle",
  size: number,
) => {
  const real = new Float32Array(size);
  const imag = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    switch (type) {
      case "square":
        if (i > 0) {
          real[i] = (2 / (i * Math.PI)) * Math.sin((i * Math.PI) / 2);
        }
        break;
      case "triangle":
        if (i > 0) {
          real[i] = 4 / (i * Math.PI) ** 2;
        }
        break;
      case "sawtooth":
        if (i > 0) {
          imag[i] = 1 / (i * Math.PI);
        }
        break;
      case "rectified":
        if (i === 0) {
          real[i] = 2 / Math.PI;
        } else {
          real[i] = -4 / (Math.PI * (4 * Math.PI ** 2 - 1));
        }
        break;
      case "cosine":
        if (i === 0) {
          real[i] = 2 / Math.PI;
        } else if (i === 1) {
          real[i] = 1;
        }
        break;
      default:
        break;
    }
  }

  return { real, imag };
};

const WaveformDraw: React.FC = () => {
  const { context, analyser, gain } = useAudioContext();

  const [points, setPoints] = React.useState(() => ({
    real: new Float32Array(DEFAULT_SAMPLES),
    imag: new Float32Array(DEFAULT_SAMPLES),
  }));
  const [synth, _setSynth] = React.useState(() =>
    context && gain ? new AdditiveSynth(context, gain) : null,
  );
  const [freq, setFreq] = React.useState(440);

  React.useEffect(() => {
    if (!synth) {
      return;
    }

    synth.setPoints(points);
    synth.play(freq);
  }, [points, freq, synth]);

  const stopNote = () => {
    if (!synth) {
      return;
    }

    synth.stop();
  };

  const reset = () => {
    setPoints({
      real: new Float32Array(points.real.length),
      imag: new Float32Array(points.real.length),
    });
  };

  const startSynth = () => {
    if (!context || !synth) {
      return;
    }

    if (context.state === "suspended") {
      context.resume().catch(console.error);
    }

    synth.play(freq);
  };

  return (
    <Layout>
      <Typography variant="h1">Additive Synthesizer Waveform Draw</Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        Draw a waveform and watch the oscilloscope!
      </Typography>
      <Card>
        <Typography variant="h5">Real Component</Typography>
        <DotDraw
          height={CANVAS_HEIGHT}
          samples={points.real.length}
          points={points.real}
          onChange={(real) => {
            setPoints({ ...points, real });
          }}
        />
        <Typography variant="h5">Imaginary Component</Typography>
        <DotDraw
          height={CANVAS_HEIGHT}
          samples={points.imag.length}
          points={points.imag}
          onChange={(imag) => {
            setPoints({ ...points, imag });
          }}
        />
        <Oscilloscope analyser={analyser} />
        <CardActions>
          <Button
            onClick={startSynth}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Start
          </Button>

          <Button
            onClick={stopNote}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Stop
          </Button>

          <Button onClick={reset} variant="outlined" color="primary" fullWidth>
            Reset
          </Button>
        </CardActions>
        <CardActions>
          <Typography variant="body2">Frequency</Typography>
          <Slider
            value={freq}
            onChange={(_event, value) => {
              if (typeof value === "number") {
                setFreq(value);
              }
            }}
            max={2000}
            min={40}
            step={1}
            valueLabelDisplay="auto"
          />
        </CardActions>
        <CardActions>
          <Typography variant="body2">Samples</Typography>
          <Slider
            value={points.real.length}
            onChange={(_event, value) => {
              if (typeof value === "number") {
                if (points.real.length > value) {
                  const real = points.real.slice(0, value);
                  const imag = points.imag.slice(0, value);
                  setPoints({
                    real,
                    imag,
                  });
                } else {
                  const real = new Float32Array(value);
                  const imag = new Float32Array(value);
                  points.real.forEach((val, i) => (real[i] = val));
                  points.imag.forEach((val, i) => (imag[i] = val));
                  setPoints({
                    real,
                    imag,
                  });
                }
              }
            }}
            max={50}
            min={2}
            step={1}
            valueLabelDisplay="auto"
          />
        </CardActions>
        <CardActions>
          <Select
            variant="outlined"
            style={{ marginBottom: 16 }}
            onChange={(event) => {
              const type = event.target.value as
                | "cosine"
                | "rectified"
                | "sawtooth"
                | "square"
                | "triangle";
              setPoints(getFourierPreset(type, points.real.length));
            }}
            defaultValue=""
            fullWidth
            placeholder="Select a preset"
            color="primary"
          >
            <MenuItem value="" disabled>
              Select a preset
            </MenuItem>
            <MenuItem value="square">Square</MenuItem>
            <MenuItem value="triangle">Triangle</MenuItem>
            <MenuItem value="sawtooth">Sawtooth</MenuItem>
            <MenuItem value="rectified">Rectified</MenuItem>
            <MenuItem value="cosine">Cosine</MenuItem>
          </Select>
        </CardActions>
      </Card>
    </Layout>
  );
};

export default WaveformDraw;

export const Head = (): JSX.Element => (
  <Seo title="Waveform Draw" description="Draw a waveform!" />
);
