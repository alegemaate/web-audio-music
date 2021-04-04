import React from "react";

export const DotDraw: React.FC<{
  samples: number;
  height: number;
  points: Float32Array;
  onChange: (points: Float32Array) => void;
}> = ({ samples, height, points, onChange }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const [drawing, setDrawing] = React.useState(false);
  const [canvasWidth, setCanvasWidth] = React.useState(0);

  React.useEffect(() => {
    if (parentRef.current) {
      setCanvasWidth(parentRef.current.clientWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentRef]);

  React.useEffect(() => {
    // Do draw
    const render = () => {
      if (!ref.current) {
        return;
      }
      const ctx = ref.current.getContext("2d");
      if (!ctx) {
        return;
      }

      // Get size
      const { height, width } = ref.current;

      // Clear
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Draw center line
      ctx.strokeStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw blocks
      const radius = canvasWidth / samples / 2;
      let x = radius;

      points.forEach((val, index) => {
        const y = height / 2 - val * (height / 2);

        // Draw stroke
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, height / 2);
        ctx.stroke();

        // Draw ellipse
        ctx.beginPath();
        ctx.fillStyle = `rgba(${(index * 255) / points.length},${
          val * 255
        },255,1)`;
        ctx.ellipse(x, y, radius / 2, radius / 2, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Incr x
        x += radius * 2;
      });

      return requestAnimationFrame(render);
    };

    const requestId = render();

    return () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };
  }, [canvasWidth, points, samples, height]);

  const updatePoints = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    drawing: boolean
  ) => {
    if (!drawing) {
      return;
    }

    // Get coordinates, and map to pts domain
    const bounding = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(
      (event.clientX - bounding.x) * (samples / canvasWidth)
    );
    const clickPos = event.clientY - bounding.y;
    const y = -((2 * clickPos) / height - 1);

    // Set point value
    const pts = points.copyWithin(0, 0);
    if (typeof pts[x] === "number") {
      pts[x] = y;
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    onChange(points);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    setDrawing(true);
    updatePoints(event, true);
  };

  return (
    <div ref={parentRef} style={{ width: "100%" }}>
      <canvas
        width={canvasWidth}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={(event) => updatePoints(event, drawing)}
        ref={ref}
      />
    </div>
  );
};
