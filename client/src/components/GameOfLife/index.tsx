import * as React from "react";

// Custom mod
const modulo = (m: number, n: number): number => {
  if (m >= 0) {
    return m % n;
  }
  return (n - Math.abs(m % n)) % n;
};

const simulate = (last: number[][]): number[][] => {
  const height = last.length;
  const width = last[0]?.length ?? 0;

  // Create temp map
  const temp: number[][] = [];

  for (let i = 0; i < height; i += 1) {
    temp.push(new Array(width).fill(0));
  }

  for (let i = 0; i < width; i++) {
    for (let t = 0; t < height; t++) {
      // Number of neighbouring cells
      const neighbours =
        last[modulo(i + 1, height)][t] +
        last[modulo(i - 1, height)][t] +
        last[i][modulo(t + 1, width)] +
        last[i][modulo(t - 1, width)] +
        last[modulo(i + 1, height)][modulo(t + 1, width)] +
        last[modulo(i - 1, height)][modulo(t - 1, width)] +
        last[modulo(i - 1, height)][modulo(t + 1, width)] +
        last[modulo(i + 1, height)][modulo(t - 1, width)];

      // Dies from overpop or underpop
      if (neighbours < 2 || neighbours > 3) {
        temp[i][t] = 0;
      }
      // Is born
      else if (neighbours === 3) {
        temp[i][t] = 1;
      }
      // Stays the same
      else if (neighbours === 2) {
        temp[i][t] = last[i][t];
      }
    }
  }

  return temp;
};

export const GameOfLife: React.FC<{
  width: number;
  height: number;
  cellSize: number;
  onChange?: (arr: number[]) => void;
  speed: number;
  shouldSim?: boolean;
  goBack?: boolean;
  step: number;
}> = ({
  width,
  height,
  cellSize,
  onChange,
  speed,
  shouldSim = true,
  goBack = false,
  step,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const cellRef = React.useRef<number[][]>([]);
  const cellLastRef = React.useRef<number[][]>([]);
  const scanRef = React.useRef(0);

  // Create array
  React.useEffect(() => {
    cellRef.current.length = 0;
    cellLastRef.current.length = 0;

    for (let i = 0; i < height; i += 1) {
      cellRef.current.push(new Array(width).fill(0));
      cellLastRef.current.push(new Array(width).fill(0));
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

      for (let x = 0; x < cellRef.current.length; x++) {
        for (let y = 0; y < cellRef.current[x].length; y++) {
          ctx.beginPath();

          if (x === scanRef.current) {
            ctx.fillStyle = "rgb(255,0,0)";
          } else {
            ctx.fillStyle = "rgb(0,0,0)";
          }

          if (cellRef.current[x][y] === 1) {
            ctx.rect(x * cellSize, y * cellSize, cellSize, cellSize);
          }

          ctx.fill();
        }
      }

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
    const sequence = () => {
      // One step
      if (scanRef.current % width === 0) {
        scanRef.current = 0;
        if (shouldSim) {
          cellLastRef.current = [...cellRef.current.map((arr) => [...arr])];
          cellRef.current = simulate(cellRef.current);
        }
        if (goBack) {
          cellRef.current = [...cellLastRef.current.map((arr) => [...arr])];
        }
      }

      onChange?.(cellRef.current[scanRef.current] ?? []);
    };

    if (step !== scanRef.current) {
      scanRef.current = step;
      sequence();
    }
  }, [onChange, width, speed, shouldSim, goBack, step]);

  const handleClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!canvasRef.current) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

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
