export const rangeMap = (
  value: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

export const colorMap = (value: number, x1: number, y1: number) =>
  ((value - x1) * 255) / (y1 - x1);
