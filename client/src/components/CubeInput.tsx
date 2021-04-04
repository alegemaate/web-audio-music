import React from "react";

export type AccelParams = {
  alpha: number;
  beta: number;
  gamma: number;
};

const PI_360 = Math.PI / 360;

const getTransform = (x: number, y: number, z: number): string =>
  `translate3d(0px, 0px, -150px) rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;

export const CubeInput: React.FC<{
  size: number;
  onChange: (x: number, y: number, z: number) => void;
}> = ({ size, onChange }) => {
  const [dragging, setDragging] = React.useState(false);

  const boardRef = React.useRef<HTMLDivElement>(null);
  const rotationX = React.useRef(0);
  const rotationY = React.useRef(0);
  const rotationZ = React.useRef(0);

  const mouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    dragging: boolean
  ) => {
    if (!dragging || !boardRef.current) {
      return;
    }

    // Get coordinates
    const rotateX = rotationX.current - event.movementY;
    const absX = Math.abs(rotateX % 360);
    const rotateY =
      absX > 90 && absX < 270
        ? rotationY.current - event.movementX
        : rotationY.current + event.movementX;

    // Set point value
    rotationX.current = rotateX;
    rotationY.current = rotateY;

    // Set transform
    boardRef.current.style.transform = getTransform(
      rotationX.current,
      rotationY.current,
      rotationZ.current
    );

    onChange(
      Math.abs(Math.sin(rotationX.current * PI_360)),
      Math.abs(Math.sin(rotationY.current * PI_360)),
      Math.abs(Math.sin(rotationZ.current * PI_360))
    );
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setDragging(true);
    mouseMove(event, true);
  };

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!boardRef.current) {
      return;
    }

    rotationZ.current += event.deltaY;

    // Set transform
    boardRef.current.style.transform = getTransform(
      rotationX.current,
      rotationY.current,
      rotationZ.current
    );

    onChange(
      Math.abs(Math.sin(rotationX.current * PI_360)),
      Math.abs(Math.sin(rotationY.current * PI_360)),
      Math.abs(Math.sin(rotationZ.current * PI_360))
    );
  };

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        perspective: 1000,
        margin: "50px auto",
      }}
    >
      <div
        ref={boardRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          transformStyle: "preserve-3d",
          transform:
            "translate3d(0px, 0px, -150px) rotateX(0) rotateY(0) rotateZ(0)",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={(event) => mouseMove(event, dragging)}
        onWheel={handleScroll}
      >
        <div
          style={{
            transform: `translate3d(0, 0, ${
              size / 2
            }px) rotate3d(0, 1, 0, 0deg)`,
            width: size,
            height: size,
            position: "absolute",
            backgroundColor: "rgba(255,0,0,0.5)",
          }}
        >
          Front
        </div>
        <div
          style={{
            transform: `translate3d(${
              size / 2
            }px, 0, 0) rotate3d(0, 1, 0, 90deg)`,
            width: size,
            height: size,
            position: "absolute",
            backgroundColor: "rgba(255,0,0,0.5)",
          }}
        >
          Right
        </div>
        <div
          style={{
            transform: `translate3d(0, 0, -${
              size / 2
            }px) rotate3d(0, 1, 0, 180deg)`,
            width: size,
            height: size,
            position: "absolute",
            backgroundColor: "rgba(255,255,0,0.5)",
          }}
        >
          Back
        </div>
        <div
          style={{
            transform: `translate3d(-${
              size / 2
            }px, 0, 0) rotate3d(0, 1, 0, -90deg)`,
            width: size,
            height: size,
            position: "absolute",
            backgroundColor: "rgba(0,255,0,0.5)",
          }}
        >
          Left
        </div>
        <div
          style={{
            transform: `translate3d(0, -${
              size / 2
            }px, 0) rotate3d(1, 0, 0, 90deg)`,
            width: size,
            height: size,
            position: "absolute",
            backgroundColor: "rgba(0,255,255,0.5)",
          }}
        >
          Top
        </div>
        <div
          style={{
            transform: `translate3d(0, ${
              size / 2
            }px, 0) rotate3d(1, 0, 0, -90deg)`,
            width: size,
            height: size,
            position: "absolute",
            backgroundColor: "rgba(0,0,255,0.5)",
          }}
        >
          Bottom
        </div>
      </div>
    </div>
  );
};
