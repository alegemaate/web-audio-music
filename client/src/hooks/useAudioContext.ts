import * as React from "react";

export const useAudioContext = () => {
  const [context] = React.useState(() =>
    typeof AudioContext === "function" ? new AudioContext() : null
  );
  const [gain] = React.useState(() => {
    if (!context) {
      return null;
    }
    const gain = context.createGain();
    gain.gain.value = 1.0;
    gain.connect(context.destination);
    return gain;
  });
  const [analyser] = React.useState(() => {
    if (!context || !gain) {
      return null;
    }
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    gain.connect(analyser);
    return analyser;
  });

  React.useEffect(() => {
    return () => {
      context?.close();
    };
  }, [context]);

  return { context, analyser, gain };
};
