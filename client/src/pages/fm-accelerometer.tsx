import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Slider,
  Typography,
} from "@material-ui/core";
import { VolumeUp, Waves } from "@material-ui/icons";

import { AccelPad, type AccelParams } from "../components/AccelPad";
import { rangeMap } from "../helpers/helpers";
import { useAudioContext } from "../hooks/useAudioContext";
import { Layout } from "../components/Layout";
import { Seo } from "../components/Seo";

const MAX_GAIN_1 = 10000;
const MAX_GAIN_2 = 1000;
const MAX_FREQUENCY_1 = 1000;
const MAX_FREQUENCY_2 = 20;

const FmAccelerometer: React.FC = () => {
  const { context, gain } = useAudioContext();

  const [mod1, setMod1] = React.useState<OscillatorNode | null>(null);
  const [mod2, setMod2] = React.useState<OscillatorNode | null>(null);
  const [gain1, setGain1] = React.useState<GainNode | null>(null);
  const [gain2, setGain2] = React.useState<GainNode | null>(null);
  const [freq1Val, setFreq1Val] = React.useState(440);
  const [freq2Val, setFreq2Val] = React.useState(440);
  const [gain1Val, setGain1Val] = React.useState(3000);
  const [gain2Val, setGain2Val] = React.useState(3000);

  const startSynth = () => {
    if (!context || !gain) {
      return;
    }

    // Create audio context
    if (context.state === "suspended") {
      context.resume().catch(console.error);
    }

    // Instantiating
    const osc1 = context.createOscillator(); // Modulator 1
    const osc2 = context.createOscillator(); // Modulator 2
    const carrier = context.createOscillator(); // Carrier
    carrier.type = "sine";

    // Setting frequencies
    osc1.frequency.value = freq1Val;
    osc2.frequency.value = freq2Val;
    osc1.type = "sawtooth";
    osc2.type = "square";
    carrier.frequency.value = 440;

    // Modulation depth
    const osc1Gain = context.createGain();
    osc1Gain.gain.value = gain1Val;
    const osc2Gain = context.createGain();
    osc2Gain.gain.value = gain2Val;
    const mainGain = context.createGain();
    mainGain.gain.value = 0.5;

    // Wiring everything up
    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    osc1Gain.connect(carrier.frequency);
    osc2Gain.connect(osc1.frequency);
    carrier.connect(mainGain);
    mainGain.connect(gain);

    // Start making sound
    osc1.start();
    osc2.start();
    carrier.start();

    setMod1(osc1);
    setGain1(osc1Gain);
    setMod2(osc2);
    setGain2(osc2Gain);
  };

  const handleFreq1Change = (_event: unknown, value: number[] | number) => {
    if (mod1 && typeof value === "number") {
      mod1.frequency.value = value;
      setFreq1Val(mod1.frequency.value);
    }
  };

  const handleFreq2Change = (_event: unknown, value: number[] | number) => {
    if (mod2 && typeof value === "number") {
      mod2.frequency.value = value;
      setFreq2Val(mod2.frequency.value);
    }
  };

  const handleGain1Change = (_event: unknown, value: number[] | number) => {
    if (gain1 && typeof value === "number") {
      gain1.gain.value = value;
      setGain1Val(gain1.gain.value);
    }
  };

  const handleGain2Change = (_event: unknown, value: number[] | number) => {
    if (gain2 && typeof value === "number") {
      gain2.gain.value = value;
      setGain2Val(gain2.gain.value);
    }
  };

  const handleAccel = (value: AccelParams) => {
    if (mod1) {
      mod1.frequency.value = rangeMap(value.gamma, -90, 90, 0, MAX_FREQUENCY_1);
      setFreq1Val(mod1.frequency.value);
    }
    if (gain1) {
      gain1.gain.value = rangeMap(value.beta, -90, 90, 0, MAX_GAIN_1);
      setGain1Val(gain1.gain.value);
    }
    if (mod2) {
      mod2.frequency.value = rangeMap(value.alpha, 0, 360, 0, MAX_FREQUENCY_2);
      setFreq2Val(mod2.frequency.value);
    }
  };

  return (
    <Layout>
      <Typography variant="h1">FM Accelerometer</Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        Device orientation controlled FM synthesizer.
      </Typography>
      <Card>
        <CardContent>
          {!mod1 && (
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
            {mod1 && (
              <>
                <Waves />
                <Slider
                  value={freq1Val}
                  onChange={handleFreq1Change}
                  max={MAX_FREQUENCY_1}
                  min={0}
                  step={1}
                />
              </>
            )}
            {gain1 && (
              <>
                <VolumeUp />
                <Slider
                  value={gain1Val}
                  onChange={handleGain1Change}
                  max={MAX_GAIN_1}
                  min={0}
                  step={1}
                />
              </>
            )}
          </div>
          <div style={{ width: "100%" }}>
            {mod2 && (
              <>
                <Waves />
                <Slider
                  value={freq2Val}
                  onChange={handleFreq2Change}
                  max={MAX_FREQUENCY_2}
                  min={0}
                  step={1}
                />
              </>
            )}
            {gain2 && (
              <>
                <VolumeUp />
                <Slider
                  value={gain2Val}
                  onChange={handleGain2Change}
                  max={MAX_GAIN_2}
                  min={0}
                  step={1}
                />
              </>
            )}
          </div>
        </CardActions>
      </Card>
      {mod1 && <AccelPad onChange={handleAccel} />}
    </Layout>
  );
};

export default FmAccelerometer;

export const Head = (): JSX.Element => (
  <Seo
    title="FM Accelerometer"
    description="Accelerometer Controlled FM Synthesizer"
  />
);
