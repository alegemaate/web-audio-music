import React from "react";
import { RouteComponentProps } from "@reach/router";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Slider,
} from "@material-ui/core";
import { Waves } from "@material-ui/icons";

export const FmSynth: React.FC<RouteComponentProps> = () => {
  const [mod, setMod] = React.useState<OscillatorNode | null>(null);
  const [freq, setFreq] = React.useState(440);

  const playNote = () => {
    const ctx = new AudioContext();
    const out = ctx.destination;

    // Instantiating
    const E = ctx.createOscillator(); // Modulator
    const F = ctx.createOscillator(); // Carrier

    // Setting frequencies
    E.frequency.value = freq;
    F.frequency.value = 440;

    // Modulation depth
    const E_gain = ctx.createGain();
    E_gain.gain.value = 3000;

    // Wiring everything up
    E.connect(E_gain);
    E_gain.connect(F.frequency);
    F.connect(out);

    // Start making sound
    E.start();
    F.start();

    setMod(E);
  };

  const handleFreqChange = (_event: unknown, value: number | number[]) => {
    if (mod && typeof value === "number") {
      mod.frequency.value = value;
      setFreq(value);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          {!mod && (
            <Button
              onClick={playNote}
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
                max={1000}
                min={10}
                step={1}
              />
            </>
          )}
        </CardActions>
      </Card>
    </>
  );
};
