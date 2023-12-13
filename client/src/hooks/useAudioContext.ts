import * as React from "react";

export const useAudioContext = (): {
  context: AudioContext | null;
  analyser: AnalyserNode | null;
  gain: GainNode | null;
} => {
  const [context] = React.useState(() =>
    typeof AudioContext === "function" ? new AudioContext() : null,
  );
  const [gain] = React.useState(() => {
    if (!context) {
      return null;
    }
    const g = context.createGain();
    g.gain.value = 1.0;
    g.connect(context.destination);
    return g;
  });
  const [analyser] = React.useState(() => {
    if (!context || !gain) {
      return null;
    }
    const a = context.createAnalyser();
    a.fftSize = 256;
    gain.connect(a);
    return a;
  });

  React.useEffect(
    () => () => {
      context?.close().catch(console.error);
    },
    [context],
  );

  return { context, analyser, gain };
};
