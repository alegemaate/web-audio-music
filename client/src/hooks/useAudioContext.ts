import * as React from "react";

window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;

export const useAudioContext = () => {
  const [context] = React.useState(new AudioContext());

  React.useEffect(() => {
    return () => {
      context.close();
    };
  }, [context]);

  return context;
};
