import * as React from "react";

export const Oscilloscope: React.FC<{
  analyser: AnalyserNode | null;
}> = ({ analyser }) => {
  const oscRef = React.useRef<HTMLCanvasElement>(null);
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    if (parentRef.current) {
      setWidth(parentRef.current.clientWidth);
    }
  }, [parentRef]);

  React.useEffect(() => {
    const render = (): number => {
      if (!oscRef.current) {
        return 0;
      }

      const ctx = oscRef.current.getContext("2d");
      if (!ctx) {
        return 0;
      }

      // Setup draw
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(0, 0, oscRef.current.width, oscRef.current.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.beginPath();

      if (!analyser) {
        ctx.moveTo(0, oscRef.current.height / 2);
        ctx.lineTo(oscRef.current.width, oscRef.current.height / 2);
        ctx.stroke();
        return 0;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      const sliceWidth = Number(oscRef.current.width) / bufferLength;
      let x = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * oscRef.current.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }
      ctx.lineTo(oscRef.current.width, oscRef.current.height / 2);
      ctx.stroke();
      return requestAnimationFrame(render);
    };

    const requestId = render();

    return () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };
  }, [analyser, oscRef, width]);

  return (
    <div ref={parentRef} style={{ width: "100%" }}>
      <canvas width={width} height={150} ref={oscRef} />
    </div>
  );
};
