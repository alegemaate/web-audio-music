import * as React from "react";

export const useAudioContext = () => {
  const [context] = React.useState(() => new AudioContext());
  const [gain] = React.useState(() => {
    const gain = context.createGain();
    gain.gain.value = 1.0;
    gain.connect(context.destination);
    return gain;
  });
  const [analyser] = React.useState(() => {
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    gain.connect(analyser);
    return analyser;
  });

  React.useEffect(() => {
    return () => {
      context.close();
    };
  }, [context]);

  return { context, analyser, gain };
};
