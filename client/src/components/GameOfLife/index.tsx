import * as React from "react";

const SIM_SPEED = 500;

// Custom mod
export const modulo = (m: number, n: number): number => {
  if (m >= 0) {
    return m % n;
  }
  return (n - Math.abs(m % n)) % n;
};

export const GameOfLife: React.FC<{
  width: number;
  height: number;
  paused: boolean;
  cellSize: number;
  onChange?: (arr: number[][]) => void;
}> = ({ width, height, paused, cellSize, onChange }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const cellRef = React.useRef<number[][]>([]);
  const cellTempRef = React.useRef<number[][]>([]);

  // Create array
  React.useEffect(() => {
    cellRef.current.length = 0;
    cellTempRef.current.length = 0;

    for (let i = 0; i < height; i += 1) {
      cellRef.current.push(new Array(width).fill(0));
      cellTempRef.current.push(new Array(width).fill(0));
    }
  }, [width, height]);

  React.useEffect(() => {
    const render = () => {
      if (!canvasRef.current) {
        return;
      }

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, width * cellSize, height * cellSize);

      // Draw cells
      ctx.beginPath();
      ctx.rect(0, 0, width * cellSize, height * cellSize);
      ctx.stroke();

      ctx.beginPath();
      for (let x = 0; x < cellRef.current.length; x++) {
        for (let y = 0; y < cellRef.current[x].length; y++) {
          if (cellRef.current[x][y] === 1) {
            ctx.rect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
      ctx.fill();

      // Setup draw
      return requestAnimationFrame(render);
    };

    const requestId = render();

    return () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };
  }, [canvasRef, width, height, cellSize]);

  React.useEffect(() => {
    const simulate = () => {
      if (paused) {
        return;
      }

      // Clear temp map
      cellTempRef.current.forEach((arr) => arr.fill(0));

      const height = cellRef.current.length;
      const width = cellRef.current[0]?.length ?? 0;

      for (let i = 0; i < width; i++) {
        for (let t = 0; t < height; t++) {
          // Number of neighbouring cells
          const neighbours =
            cellRef.current[modulo(i + 1, height)][t] +
            cellRef.current[modulo(i - 1, height)][t] +
            cellRef.current[i][modulo(t + 1, width)] +
            cellRef.current[i][modulo(t - 1, width)] +
            cellRef.current[modulo(i + 1, height)][modulo(t + 1, width)] +
            cellRef.current[modulo(i - 1, height)][modulo(t - 1, width)] +
            cellRef.current[modulo(i - 1, height)][modulo(t + 1, width)] +
            cellRef.current[modulo(i + 1, height)][modulo(t - 1, width)];

          // Dies from overpop or underpop
          if (neighbours < 2 || neighbours > 3) {
            cellTempRef.current[i][t] = 0;
          }
          // Is born
          else if (neighbours === 3) {
            cellTempRef.current[i][t] = 1;
          }
          // Stays the same
          else if (neighbours === 2) {
            cellTempRef.current[i][t] = cellRef.current[i][t];
          }
        }
      }

      // Copy temp map to real map
      cellRef.current = [...cellTempRef.current.map((arr) => [...arr])];

      onChange?.(cellRef.current);
    };

    const interval = setInterval(simulate, SIM_SPEED);

    return () => {
      clearInterval(interval);
    };
  }, [paused, onChange]);

  const handleClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!canvasRef.current) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    console.log("x: " + x + " y: " + y);

    if (typeof cellRef.current[x]?.[y] === "number") {
      if (event.button === 0) {
        cellRef.current[x][y] = 1;
      } else {
        cellRef.current[x][y] = 0;
      }
    }
  };

  return (
    <canvas
      tabIndex={0}
      onMouseDown={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      width={width * cellSize}
      height={height * cellSize}
      ref={canvasRef}
    />
  );
};
