"use client";

import * as React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Slider,
  Typography,
} from "@mui/material";
import { VolumeUp, Waves } from "@mui/icons-material";

import { Layout } from "@/components/Layout";
import { AccelPad, type AccelParams } from "@/components/AccelPad";
import { rangeMap } from "@/helpers/helpers";
import { useAudioContext } from "@/hooks/useAudioContext";

const MIN_FREQUENCY = 80;
const MAX_FREQUENCY = 880;
const MAX_DETUNE = 50;
const MAX_GAIN = 0.4;

const OscAccelerometerInner: React.FC = () => {
  const { context, gain } = useAudioContext();

  const [osc, setOsc] = React.useState<OscillatorNode | null>(null);
  const [oscGain, setOscGain] = React.useState<GainNode | null>(null);
  const [freq, setFreq] = React.useState(440);
  const [detune, setDetune] = React.useState(0);
  const [vol, setVol] = React.useState(MAX_GAIN / 2);

  const startSynth = () => {
    if (!context || !gain) {
      return;
    }

    if (context.state === "suspended") {
      context.resume().catch(console.error);
    }

    const newOsc = context.createOscillator();
    newOsc.type = "sawtooth";
    newOsc.frequency.value = freq;
    newOsc.detune.value = detune;

    const newGain = context.createGain();
    newGain.gain.value = vol;

    newOsc.connect(newGain);
    newGain.connect(gain);
    newOsc.start();

    setOsc(newOsc);
    setOscGain(newGain);
  };

  const handleFreq = (_: Event, value: number | number[]) => {
    if (osc && typeof value === "number") {
      osc.frequency.value = value;
      setFreq(value);
    }
  };

  const handleDetune = (_: Event, value: number | number[]) => {
    if (osc && typeof value === "number") {
      osc.detune.value = value;
      setDetune(value);
    }
  };

  const handleVol = (_: Event, value: number | number[]) => {
    if (oscGain && typeof value === "number") {
      oscGain.gain.value = value;
      setVol(value);
    }
  };

  const handleAccel = (value: AccelParams) => {
    if (osc) {
      const f = rangeMap(value.beta, -90, 90, MIN_FREQUENCY, MAX_FREQUENCY);
      osc.frequency.value = f;
      setFreq(f);
      const d = rangeMap(value.gamma, -90, 90, -MAX_DETUNE, MAX_DETUNE);
      osc.detune.value = d;
      setDetune(d);
    }
  };

  const handleClick = (status: "off" | "on") => {
    if (!oscGain || !context) {
      return;
    }
    oscGain.gain.cancelScheduledValues(context.currentTime);
    oscGain.gain.setValueAtTime(oscGain.gain.value, context.currentTime);
    oscGain.gain.linearRampToValueAtTime(
      status === "on" ? vol : 0,
      context.currentTime + 0.05,
    );
  };

  return (
    <>
      <Typography variant="h1">Accelerometer Synth</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Device orientation drives a simple oscillator. Tap the pad to gate the
        sound.
      </Typography>
      <Card>
        <CardContent>
          {!osc && (
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
          <div style={{ width: "100%" }}>
            {osc && (
              <>
                <Waves />
                <Slider
                  value={freq}
                  onChange={handleFreq}
                  min={MIN_FREQUENCY}
                  max={MAX_FREQUENCY}
                  step={1}
                />
                <Waves />
                <Slider
                  value={detune}
                  onChange={handleDetune}
                  min={-MAX_DETUNE}
                  max={MAX_DETUNE}
                  step={1}
                />
                <VolumeUp />
                <Slider
                  value={vol}
                  onChange={handleVol}
                  min={0}
                  max={MAX_GAIN}
                  step={0.01}
                />
              </>
            )}
          </div>
        </CardActions>
      </Card>
      {osc && <AccelPad onChange={handleAccel} onClick={handleClick} />}
    </>
  );
};

const OscAccelerometer: React.FC = () => (
  <Layout>
    <OscAccelerometerInner />
  </Layout>
);

export default OscAccelerometer;
