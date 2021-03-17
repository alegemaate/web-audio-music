import React from "react";
import { RouteComponentProps } from "@reach/router";
import {
  Button,
  Card,
  CardActions,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@material-ui/core";

import { FmPreset, FmSynth } from "../components/FmSynth";
import { Oscilloscope } from "../components/Oscilloscope";
import { DotDraw } from "../components/DotDraw";
import { useAudioContext } from "../hooks/useAudioContext";

const CANVAS_HEIGHT = 300;
const DEFAULT_SAMPLES = 20;

const DEFAULT_PRESET: FmPreset = {
  name: "Basic",
  gain: 0.2,
  op1: {
    dest: "out",
    type: "sine",
    ratio: 1.0,
    feedback: 0.0,
    level: 1.0,
    adsr: {
      attackLevel: 0.0,
      attackTime: 0.0,
      decayLevel: 0.0,
      decayTime: 0.0,
      sustainLevel: 1.0,
      sustainTime: 0.0,
      releaseLevel: 0.0,
      releaseTime: 0.0,
    },
  },
  op2: {
    dest: "blackhole",
    type: "sine",
    ratio: 0.5,
    feedback: 0.0,
    level: 1.0,
    adsr: {
      attackLevel: 0.0,
      attackTime: 0.0,
      decayLevel: 0.0,
      decayTime: 0.0,
      sustainLevel: 0.0,
      sustainTime: 0.0,
      releaseLevel: 0.0,
      releaseTime: 0.0,
    },
  },
};

const getFourierPreset = (
  type: "square" | "triangle" | "sawtooth" | "rectified" | "cosine",
  size: number
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
          real[i] = 4 / Math.pow(i * Math.PI, 2);
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
          real[i] = -4 / (Math.PI * (4 * Math.pow(Math.PI, 2) - 1));
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

export const WaveformDraw: React.FC<RouteComponentProps> = () => {
  const context = useAudioContext();

  const [points, setPoints] = React.useState({
    real: new Float32Array(DEFAULT_SAMPLES),
    imag: new Float32Array(DEFAULT_SAMPLES),
  });
  const [fmSynth] = React.useState<FmSynth>(
    new FmSynth(context, context.destination)
  );
  const [freq, setFreq] = React.useState(440);

  React.useEffect(() => {
    // Update preset with points
    const newPreset: FmPreset = {
      ...DEFAULT_PRESET,
      op1: {
        ...DEFAULT_PRESET.op1,
        type: "custom",
        custom: points,
      },
    };

    if (fmSynth) {
      fmSynth.changeInstrument(newPreset);
      fmSynth.play(freq);
    }
  }, [points, freq, fmSynth]);

  const stopNote = () => {
    fmSynth.stop();
  };

  const reset = () => {
    setPoints({
      real: new Float32Array(points.real.length),
      imag: new Float32Array(points.real.length),
    });
  };

  const startSynth = () => {
    if (context.state === "suspended") {
      context.resume();
    }
    fmSynth.play(freq);
  };

  return (
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
      <Oscilloscope createAnalyser={fmSynth?.createAnalyser.bind(fmSynth)} />
      <CardActions>
        <Button
          onClick={startSynth}
          variant="outlined"
          color="primary"
          fullWidth
        >
          Start
        </Button>

        <Button onClick={stopNote} variant="outlined" color="primary" fullWidth>
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
              | "square"
              | "triangle"
              | "sawtooth"
              | "rectified"
              | "cosine";
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
  );
};
