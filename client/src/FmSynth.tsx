import React from "react";
import { RouteComponentProps } from "@reach/router";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Slider,
} from "@material-ui/core";
import { VolumeUp, Waves } from "@material-ui/icons";
import { AccelPad, AccelParams } from "./AccelPad";
import { rangeMap } from "./helpers";

const MAX_GAIN = 10000;
const MAX_FREQUENCY = 1000;

export const FmSynth: React.FC<RouteComponentProps> = () => {
  const [mod, setMod] = React.useState<OscillatorNode | null>(null);
  const [gain, setGain] = React.useState<GainNode | null>(null);
  const [freq, setFreq] = React.useState(440);
  const [gainVal, setGainVal] = React.useState(3000);
  const [text, setText] = React.useState("Not running");

  const startSynth = () => {
    // Create audio context
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    ctx.resume();

    // Setup
    const out = ctx.destination;

    // Instantiating
    const E = ctx.createOscillator(); // Modulator
    const F = ctx.createOscillator(); // Carrier

    // Setting frequencies
    E.frequency.value = freq;
    F.frequency.value = 440;

    // Modulation depth
    const E_gain = ctx.createGain();
    E_gain.gain.value = gainVal;

    // Wiring everything up
    E.connect(E_gain);
    E_gain.connect(F.frequency);
    F.connect(out);

    // Start making sound
    E.start();
    F.start();

    setText(JSON.stringify(E.start));

    setMod(E);
    setGain(E_gain);
  };

  const handleFreqChange = (_event: unknown, value: number | number[]) => {
    if (mod && typeof value === "number") {
      mod.frequency.value = value;
      setFreq(mod.frequency.value);
    }
  };

  const handleGainChange = (_event: unknown, value: number | number[]) => {
    if (gain && typeof value === "number") {
      gain.gain.value = value;
      setGainVal(gain.gain.value);
    }
  };

  const handleAccel = (value: AccelParams) => {
    if (mod) {
      mod.frequency.value = rangeMap(value.gamma, -90, 90, 0, MAX_FREQUENCY);
      setFreq(mod.frequency.value);
    }
    if (gain) {
      gain.gain.value = rangeMap(value.beta, -90, 90, 0, MAX_GAIN);
      setGainVal(gain.gain.value);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          {text}
          {!mod && (
            <Button
              onClick={startSynth}
              variant="outlined"
              color="primary"
              fullWidth
            >
              Start
            </Button>
          )}
        </CardContent>
        <CardActions>
          {mod && (
            <>
              <Waves />
              <Slider
                value={freq}
                onChange={handleFreqChange}
                max={MAX_FREQUENCY}
                min={0}
                step={1}
              />
            </>
          )}
          {gain && (
            <>
              <VolumeUp />
              <Slider
                value={gainVal}
                onChange={handleGainChange}
                max={MAX_GAIN}
                min={0}
                step={1}
              />
            </>
          )}
        </CardActions>
      </Card>
      <AccelPad onChange={handleAccel} />
    </>
  );
};
