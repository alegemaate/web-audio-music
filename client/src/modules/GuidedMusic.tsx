import { Button, Card } from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { LivingSynth } from "../components/LivingSynth";
import { Oscilloscope } from "../components/Oscilloscope";

export const GuidedMusic: React.FC<RouteComponentProps> = () => {
  const [fmSynth, setFmSynth] = React.useState<LivingSynth | null>(null);

  const startSynth = () => {
    if (!fmSynth) {
      const synth = new LivingSynth();
      synth.start();
      setFmSynth(synth);
      return;
    }

    // Set phase ratio
    fmSynth.start();
  };

  return (
    <Card>
      <Button onClick={startSynth}>{fmSynth ? "Restart" : "Start"}</Button>
      <Oscilloscope analyser={fmSynth?.getAnalyser()} />
    </Card>
  );
};
