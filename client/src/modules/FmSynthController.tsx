import React from "react";
import * as yup from "yup";
import { RouteComponentProps } from "@reach/router";
import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Slider,
  Typography,
  InputLabel,
  CardActions,
  TextField,
} from "@material-ui/core";

import { FmPreset, FmSynth, FM_INSTRUMENTS } from "../components/FmSynth";
import { rangeMap } from "../helpers/helpers";
import { Oscilloscope } from "../components/Oscilloscope";

export const FmSynthController: React.FC<RouteComponentProps> = () => {
  const [fmSynth, setFmSynth] = React.useState<FmSynth | null>(null);
  const [preset, setPreset] = React.useState<FmPreset>(FM_INSTRUMENTS[0]);
  const [copied, setCopied] = React.useState(false);
  const [presetText, setPresetText] = React.useState("");
  const [presetError, setPresetError] = React.useState("");

  const playNote = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!fmSynth) {
      setFmSynth(new FmSynth());
      return;
    }
    fmSynth.changeInstrument(preset);
    const bounding = event.currentTarget.getBoundingClientRect();
    const freq = rangeMap(
      event.clientX - bounding.x,
      0,
      bounding.width,
      50,
      2000
    );
    fmSynth.play(freq);
  };

  const stopNote = () => {
    if (!fmSynth) {
      return;
    }

    fmSynth.stop();
  };

  const reset = () => {
    setPreset(FM_INSTRUMENTS[0]);
  };

  const copyPreset = async () => {
    await navigator.clipboard.writeText(btoa(JSON.stringify(preset)));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const handlePresetChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setPresetText(event.target.value);
  };

  const loadPreset = () => {
    try {
      const parsed = JSON.parse(atob(presetText));

      const opSchema = yup
        .object({
          type: yup
            .mixed<"sawtooth" | "sine" | "square" | "triangle">()
            .oneOf(["sawtooth", "sine", "square", "triangle"])
            .required(),
          dest: yup
            .mixed<"op1" | "op2" | "out" | "blackhole">()
            .oneOf(["op1", "op2", "out", "blackhole"])
            .required(),
          ratio: yup.number().required(),
          feedback: yup.number().required(),
          level: yup.number().required(),
          adsr: yup
            .object({
              attackLevel: yup.number().required(),
              attackTime: yup.number().required(),
              decayLevel: yup.number().required(),
              decayTime: yup.number().required(),
              sustainLevel: yup.number().required(),
              sustainTime: yup.number().required(),
              releaseLevel: yup.number().required(),
              releaseTime: yup.number().required(),
            })
            .required(),
        })
        .required();

      const schema = yup
        .object({
          gain: yup.number().required(),
          op1: opSchema,
          op2: opSchema,
        })
        .required();

      const res = schema.validateSync(parsed);
      setPreset(res);
    } catch (e) {
      setPresetError("Invalid preset");
    }
    setTimeout(() => {
      setPresetError("");
    }, 1000);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid xs={6} item>
          <OpPreset op="op1" preset={preset} setPreset={setPreset} />
        </Grid>
        <Grid xs={6} item>
          <OpPreset op="op2" preset={preset} setPreset={setPreset} />
        </Grid>

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

              <Button
                onClick={reset}
                variant="outlined"
                color="primary"
                fullWidth
              >
                Reset
              </Button>
            </CardActions>
            <Oscilloscope analyser={fmSynth?.getAnalyser()} />
          </Card>
        </Grid>

        <Grid xs={12} item>
          <Card>
            <CardContent>
              <Typography variant="h5">Presets</Typography>
            </CardContent>
            <CardActions>
              <Select
                variant="outlined"
                style={{ marginBottom: 16 }}
                onChange={(event) => {
                  if (typeof event.target.value === "number") {
                    setPreset(FM_INSTRUMENTS[event.target.value]);
                  }
                }}
                defaultValue={0}
                fullWidth
                placeholder="Select a preset"
                color="primary"
              >
                <MenuItem value={-1} disabled>
                  Select a preset
                </MenuItem>
                {FM_INSTRUMENTS.map((preset, index) => (
                  <MenuItem value={index} key={index}>
                    {preset.name ?? `Preset ${index}`}
                  </MenuItem>
                ))}
              </Select>
            </CardActions>
          </Card>
        </Grid>

        <Grid xs={12} item>
          <Card>
            <CardContent>
              <Typography variant="h5">Share</Typography>
            </CardContent>
            <CardActions>
              <Button
                onClick={copyPreset}
                variant="outlined"
                color={copied ? "secondary" : "primary"}
                fullWidth
              >
                {copied ? "Copied!" : "Copy preset"}
              </Button>
            </CardActions>
            <CardActions>
              <TextField
                variant="outlined"
                color="primary"
                fullWidth
                type="text"
                onChange={handlePresetChange}
              />
              <Button
                onClick={loadPreset}
                variant="outlined"
                fullWidth
                color={presetError ? "secondary" : "primary"}
              >
                {presetError ? presetError : "Load Preset"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

const OpPreset: React.FC<{
  op: "op1" | "op2";
  preset: FmPreset;
  setPreset: React.Dispatch<React.SetStateAction<FmPreset>>;
}> = ({ preset, setPreset, op }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {op === "op1" ? "Operator 1" : "Operator 2"}
        </Typography>

        <InputLabel>Wave Type</InputLabel>
        <Select
          style={{ marginBottom: 16 }}
          value={preset[op].type}
          onChange={(
            event: React.ChangeEvent<{
              value: unknown;
            }>
          ) => {
            const type = event.target.value as
              | "sawtooth"
              | "sine"
              | "square"
              | "triangle";
            setPreset({ ...preset, [op]: { ...preset[op], type } });
          }}
          fullWidth
        >
          <MenuItem value="sine">Sine</MenuItem>
          <MenuItem value="sawtooth">Sawtooth</MenuItem>
          <MenuItem value="triangle">Triangle</MenuItem>
          <MenuItem value="square">Square</MenuItem>
        </Select>

        <InputLabel>Destination</InputLabel>
        <Select
          style={{ marginBottom: 16 }}
          value={preset[op].dest}
          onChange={(
            event: React.ChangeEvent<{
              value: unknown;
            }>
          ) => {
            const dest = event.target.value as
              | "op1"
              | "op2"
              | "out"
              | "blackhole";
            setPreset({ ...preset, [op]: { ...preset[op], dest } });
          }}
          fullWidth
        >
          {op === "op2" && <MenuItem value="op1">Operator 1</MenuItem>}
          {op === "op1" && <MenuItem value="op2">Operator 2</MenuItem>}
          <MenuItem value="out">Output</MenuItem>
          <MenuItem value="blackhole">Blackhole</MenuItem>
        </Select>

        <InputLabel>Level</InputLabel>
        <Slider
          valueLabelDisplay="auto"
          value={preset[op].level}
          onChange={(_event: unknown, value: number | number[]) => {
            if (typeof value === "number") {
              setPreset({ ...preset, [op]: { ...preset[op], level: value } });
            }
          }}
          max={10000}
          min={0}
          step={1}
        />

        <InputLabel>Level (Fine)</InputLabel>
        <Slider
          valueLabelDisplay="auto"
          value={preset[op].level}
          onChange={(_event: unknown, value: number | number[]) => {
            if (typeof value === "number") {
              setPreset({ ...preset, [op]: { ...preset[op], level: value } });
            }
          }}
          max={1}
          min={0}
          step={0.01}
        />

        <InputLabel>Ratio</InputLabel>
        <Slider
          valueLabelDisplay="auto"
          value={preset[op].ratio}
          onChange={(_event: unknown, value: number | number[]) => {
            if (typeof value === "number") {
              setPreset({ ...preset, [op]: { ...preset[op], ratio: value } });
            }
          }}
          max={10}
          min={0}
          step={0.01}
        />

        <InputLabel>Feedback (Does not work on some browsers)</InputLabel>
        <Slider
          valueLabelDisplay="auto"
          value={preset[op].feedback}
          onChange={(_event: unknown, value: number | number[]) => {
            if (typeof value === "number") {
              setPreset({
                ...preset,
                [op]: { ...preset[op], feedback: value },
              });
            }
          }}
          max={2000}
          min={0}
          step={1}
        />

        <Typography variant="h5" gutterBottom>
          ADSR
        </Typography>

        <Grid container spacing={1}>
          <Grid xs={6} item>
            <InputLabel>Attack Time</InputLabel>
            <Slider
              valueLabelDisplay="auto"
              value={preset[op].adsr.attackTime}
              onChange={(_event: unknown, value: number | number[]) => {
                if (typeof value === "number") {
                  setPreset({
                    ...preset,
                    [op]: {
                      ...preset[op],
                      adsr: { ...preset[op].adsr, attackTime: value },
                    },
                  });
                }
              }}
              max={5}
              min={0}
              step={0.1}
            />
          </Grid>
          <Grid xs={6} item>
            <InputLabel>Attack Level</InputLabel>
            <Slider
              valueLabelDisplay="auto"
              value={preset[op].adsr.attackLevel}
              onChange={(_event: unknown, value: number | number[]) => {
                if (typeof value === "number") {
                  setPreset({
                    ...preset,
                    [op]: {
                      ...preset[op],
                      adsr: { ...preset[op].adsr, attackLevel: value },
                    },
                  });
                }
              }}
              max={1.0}
              min={0}
              step={0.01}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid xs={6} item>
            <InputLabel>Decay Time</InputLabel>
            <Slider
              valueLabelDisplay="auto"
              value={preset[op].adsr.decayTime}
              onChange={(_event: unknown, value: number | number[]) => {
                if (typeof value === "number") {
                  setPreset({
                    ...preset,
                    [op]: {
                      ...preset[op],
                      adsr: { ...preset[op].adsr, decayTime: value },
                    },
                  });
                }
              }}
              max={5}
              min={0}
              step={0.1}
            />
          </Grid>
          <Grid xs={6} item>
            <InputLabel>Decay Level</InputLabel>
            <Slider
              valueLabelDisplay="auto"
              value={preset[op].adsr.decayLevel}
              onChange={(_event: unknown, value: number | number[]) => {
                if (typeof value === "number") {
                  setPreset({
                    ...preset,
                    [op]: {
                      ...preset[op],
                      adsr: { ...preset[op].adsr, decayLevel: value },
                    },
                  });
                }
              }}
              max={1.0}
              min={0}
              step={0.01}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid xs={6} item>
            <InputLabel>Sustain Time</InputLabel>
            <Slider
              valueLabelDisplay="auto"
              value={preset[op].adsr.sustainTime}
              onChange={(_event: unknown, value: number | number[]) => {
                if (typeof value === "number") {
                  setPreset({
                    ...preset,
                    [op]: {
                      ...preset[op],
                      adsr: { ...preset[op].adsr, sustainTime: value },
                    },
                  });
                }
              }}
              max={5}
              min={0}
              step={0.1}
            />
          </Grid>
          <Grid xs={6} item>
            <InputLabel>Sustain Level</InputLabel>
            <Slider
              valueLabelDisplay="auto"
              value={preset[op].adsr.sustainLevel}
              onChange={(_event: unknown, value: number | number[]) => {
                if (typeof value === "number") {
                  setPreset({
                    ...preset,
                    [op]: {
                      ...preset[op],
                      adsr: { ...preset[op].adsr, sustainLevel: value },
                    },
                  });
                }
              }}
              max={1.0}
              min={0}
              step={0.01}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid xs={6} item>
            <InputLabel>Release Time</InputLabel>
            <Slider
              valueLabelDisplay="auto"
              value={preset[op].adsr.releaseTime}
              onChange={(_event: unknown, value: number | number[]) => {
                if (typeof value === "number") {
                  setPreset({
                    ...preset,
                    [op]: {
                      ...preset[op],
                      adsr: { ...preset[op].adsr, releaseTime: value },
                    },
                  });
                }
              }}
              max={5}
              min={0}
              step={0.1}
            />
          </Grid>
          <Grid xs={6} item>
            <InputLabel>Release Level</InputLabel>
            <Slider
              valueLabelDisplay="auto"
              value={preset[op].adsr.releaseLevel}
              onChange={(_event: unknown, value: number | number[]) => {
                if (typeof value === "number") {
                  setPreset({
                    ...preset,
                    [op]: {
                      ...preset[op],
                      adsr: { ...preset[op].adsr, releaseLevel: value },
                    },
                  });
                }
              }}
              max={1.0}
              min={0}
              step={0.01}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
