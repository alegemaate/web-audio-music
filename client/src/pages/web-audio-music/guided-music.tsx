import React from "react";
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  Typography,
  CardActions,
  Slider,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@material-ui/core";

import { Controller } from "../../components/LivingSynth/Controller";
import { Oscilloscope } from "../../components/Oscilloscope";
import { SCALES } from "../../components/LivingSynth/scales";
import { useAudioContext } from "../../hooks/useAudioContext";
import { GameOfLife } from "../../components/GameOfLife";
import { CubeInput } from "../../components/CubeInput";
import { DotDraw } from "../../components/DotDraw";
import { SetInterval } from "../../helpers/SetInterval";
import { Layout } from "../../components/Layout";

const GuidedMusic: React.FC = () => {
  const { context, analyser, gain } = useAudioContext();

  const [fmSynth, setFmSynth] = React.useState<Controller | null>(null);
  const [speed, setSpeed] = React.useState(100);
  const [points, setPoints] = React.useState(() => ({
    real: new Float32Array(20),
    imag: new Float32Array(20),
  }));
  const [shouldSimSynth, setShouldSimSynth] = React.useState(false);
  const [stepBackSynth, setStepBackSynth] = React.useState(false);
  const [shouldSimDrum, setShouldSimDrum] = React.useState(false);
  const [stepBackDrum, setStepBackDrum] = React.useState(false);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const int = new SetInterval((elapsed) => {
      setStep(Math.floor((elapsed / speed) % 8));
    });

    int.start();

    return () => {
      int.stop();
    };
  }, [speed]);

  const startSynth = () => {
    if (!fmSynth) {
      if (context.state === "suspended") {
        context.resume();
      }

      setFmSynth(new Controller(context, gain));
    } else {
      console.log("stopping");
      fmSynth.stop();
    }
  };

  const handleCube1State = (x: number, y: number, z: number) => {
    if (!fmSynth) {
      return;
    }

    fmSynth.paramChange(x, y, z);
  };

  const handleCube2State = (x: number, y: number, z: number) => {
    if (!fmSynth) {
      return;
    }

    fmSynth.paramChange2(x, y, z);
  };

  return (
    <Layout>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item lg={6} md={6} sm={6}>
          <Card>
            <Button onClick={startSynth}>{fmSynth ? "Stop" : "Start"}</Button>

            <CardContent>
              <Typography variant="h5">Speed</Typography>
            </CardContent>
            <Slider
              value={speed}
              onChange={(_event, value) => {
                if (typeof value === "number") {
                  setSpeed(value);
                }
              }}
              max={1000}
              min={0}
              step={1}
            />

            <CardContent>
              <Typography variant="h5">Poly Vol</Typography>
            </CardContent>
            <Slider
              defaultValue={0.1}
              onChange={(_event, value) => {
                if (typeof value === "number") {
                  fmSynth?.setPolyVol(value);
                }
              }}
              max={1}
              min={0}
              step={0.01}
            />

            <CardContent>
              <Typography variant="h5">Mono Vol</Typography>
            </CardContent>
            <Slider
              defaultValue={0.1}
              onChange={(_event, value) => {
                if (typeof value === "number") {
                  fmSynth?.setMonoVol(value);
                }
              }}
              max={1}
              min={0}
              step={0.01}
            />

            <CardContent>
              <Typography variant="h5">Drum Vol</Typography>
            </CardContent>
            <Slider
              defaultValue={0.1}
              onChange={(_event, value) => {
                if (typeof value === "number") {
                  fmSynth?.setDrumVol(value);
                }
              }}
              max={1}
              min={0}
              step={0.01}
            />

            <CardContent>
              <Typography variant="h5">Drum Dist</Typography>
            </CardContent>
            <Slider
              defaultValue={0.0}
              onChange={(_event, value) => {
                if (typeof value === "number") {
                  fmSynth?.setDrumDist(value);
                }
              }}
              max={1}
              min={0}
              step={0.01}
            />

            <CardContent>
              <Typography variant="h5">Poly Dist</Typography>
            </CardContent>
            <Slider
              defaultValue={0.0}
              onChange={(_event, value) => {
                if (typeof value === "number") {
                  fmSynth?.setPolyDist(value);
                }
              }}
              max={1}
              min={0}
              step={0.01}
            />
          </Card>
        </Grid>

        <Grid item lg={6} md={6} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Visualizer</Typography>
            </CardContent>
            <Oscilloscope analyser={analyser} />
            <CardContent>
              <Typography variant="h5">Scale</Typography>
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
                {Object.keys(SCALES).map((key) => (
                  <MenuItem value={key} key={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </CardActions>
          </Card>
        </Grid>

        <Grid item lg={6} md={6} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Synth Sequencer</Typography>
              <Typography variant="body2">Click to add point</Typography>
              <GameOfLife
                speed={speed}
                width={8}
                height={8}
                cellSize={30}
                step={step}
                onChange={(arr) => {
                  if (fmSynth) {
                    fmSynth.evolve(arr);
                  }
                }}
                shouldSim={shouldSimSynth}
                goBack={stepBackSynth}
              />
            </CardContent>
            <CardActions>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={shouldSimSynth}
                    onChange={(_event: unknown, value: boolean) =>
                      setShouldSimSynth(value)
                    }
                  />
                }
                label="Step Forward"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stepBackSynth}
                    onChange={(_event: unknown, value: boolean) =>
                      setStepBackSynth(value)
                    }
                  />
                }
                label="Step Back"
              />
            </CardActions>
          </Card>
        </Grid>
        <Grid item lg={6} md={6} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Drum Sequencer</Typography>
              <Typography variant="body2">Click to add point</Typography>
              <GameOfLife
                speed={speed}
                width={8}
                height={8}
                cellSize={30}
                step={step}
                shouldSim={shouldSimDrum}
                onChange={(arr) => {
                  if (fmSynth) {
                    fmSynth.drums(arr);
                  }
                }}
                goBack={stepBackDrum}
              />
            </CardContent>
            <CardActions>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={shouldSimDrum}
                    onChange={(_event: unknown, value: boolean) =>
                      setShouldSimDrum(value)
                    }
                  />
                }
                label="Step Forward"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stepBackDrum}
                    onChange={(_event: unknown, value: boolean) =>
                      setStepBackDrum(value)
                    }
                  />
                }
                label="Step Back"
              />
            </CardActions>
          </Card>
        </Grid>

        <Grid item lg={6} md={12} sm={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Poly Synth Real</Typography>
              <Typography variant="body2">Click and drag to change!</Typography>
            </CardContent>
            <DotDraw
              height={200}
              samples={points.imag.length}
              points={points.imag}
              onChange={(imag) => {
                setPoints({ ...points, imag });
                fmSynth?.setPoints({ ...points, imag });
              }}
            />
          </Card>
        </Grid>
        <Grid item lg={6} md={12} sm={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Poly Synth Imaginary</Typography>
              <Typography variant="body2">Click and drag to change!</Typography>
            </CardContent>
            <DotDraw
              height={200}
              samples={points.real.length}
              points={points.real}
              onChange={(real) => {
                setPoints({ ...points, real });
                fmSynth?.setPoints({ ...points, real });
              }}
            />
          </Card>
        </Grid>
        <Grid item lg={6} md={6} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Lead ADSR</Typography>
              <Typography variant="body2">Double click to reset</Typography>
            </CardContent>
            <CubeInput size={150} onChange={handleCube1State} />
          </Card>
        </Grid>
        <Grid item lg={6} md={6} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Lead Timbre</Typography>
              <Typography variant="body2">Double click to reset</Typography>
            </CardContent>
            <CubeInput size={150} onChange={handleCube2State} />
          </Card>
        </Grid>

        <Grid item lg={6} md={12} sm={12}>
          <Card>
            <CardContent id="recording-list">
              <Typography variant="h5">Recordings</Typography>
              <Typography variant="body2">
                Recordings will appear here after you click stop.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default GuidedMusic;
