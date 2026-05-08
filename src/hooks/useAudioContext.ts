import * as React from "react";

interface AudioGraph {
  context: AudioContext | null;
  gain: GainNode | null;
  analyser: AnalyserNode | null;
}

const EMPTY: AudioGraph = { context: null, gain: null, analyser: null };

export const useAudioContext = (): AudioGraph => {
  const [graph, setGraph] = React.useState<AudioGraph | null>(null);

  React.useEffect(() => {
    if (typeof AudioContext === "undefined") {
      return undefined;
    }

    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.value = 1.0;
    gain.connect(context.destination);

    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    gain.connect(analyser);

    setGraph({ context, gain, analyser });

    return () => {
      gain.disconnect();
      analyser.disconnect();
      if (context.state !== "closed") {
        context.close().catch(console.error);
      }
    };
  }, []);

  return graph ?? EMPTY;
};
