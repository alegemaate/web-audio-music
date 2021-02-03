import React from "react";
import { WsArgs } from "./App";

const TIMER_LOOP = 3;
const BOARD_WIDTH = 1900;
const BOARD_HEIGHT = 800;

const rangeMap = (
  value: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

export type ClickHistory = {
  x: number;
  y: number;
  time: number;
  index: number;
};

const ClickDot: React.FC<{ click: ClickHistory; timer: number }> = ({
  click,
  timer,
}) => {
  let timerDiff =
    (Math.sin(((timer - click.time) / (TIMER_LOOP / 2) + 0.5) * Math.PI) + 1) *
    0.5;

  return (
    <div
      style={{
        width: (timerDiff * BOARD_WIDTH) / 3,
        height: (timerDiff * BOARD_WIDTH) / 3,
        backgroundColor: `rgba(0,${click.x / 2},${click.y / 2},${
          timerDiff / 2
        })`,
        position: "absolute",
        top: click.y - (timerDiff * BOARD_WIDTH) / 6,
        left: click.x - (timerDiff * BOARD_WIDTH) / 6,
        borderRadius: "50%",
        transition: "all 0.5s",
      }}
    />
  );
};

export const Bloom: React.FC<{ onClick: (args: WsArgs) => void }> = ({
  onClick,
}) => {
  const [clickHistory, setClickHistory] = React.useState<ClickHistory[]>([]);
  const [timer, setTimer] = React.useState(0);
  const boardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const interval = setInterval(function () {
      let newTime = timer + 0.1;
      if (newTime > TIMER_LOOP) {
        newTime = 0;
      }

      clickHistory
        .filter((click) => click.time === newTime)
        .forEach((click) => playNote(click));

      setTimer(newTime);
    }, 100);

    return () => clearInterval(interval);
  });

  const playNote = (click: ClickHistory) => {
    const freq = rangeMap(click.x, 0, BOARD_WIDTH, 20, 5000);
    const vol = rangeMap(click.y, 0, BOARD_HEIGHT, 0, 1);
    console.log("Playing note ", freq, vol);

    onClick({
      address: "/chuck/oscnote",
      args: [freq, vol, click.index],
    });
  };

  const mouseMoved = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { nativeEvent } = event;
    const x = nativeEvent.offsetX;
    const y = nativeEvent.offsetY;
    console.log(x, y);
    if (boardRef.current) {
      boardRef.current.style.backgroundColor = `rgba(0, ${rangeMap(
        x,
        0,
        BOARD_WIDTH,
        0,
        255
      )}, ${rangeMap(y, 0, BOARD_HEIGHT, 0, 255)})`;
    }
  };

  const mouseClicked = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const { nativeEvent } = event;
    const x = nativeEvent.offsetX;
    const y = nativeEvent.offsetY;

    const newClick: ClickHistory = {
      x,
      y,
      time: timer,
      index: clickHistory.length,
    };

    setClickHistory([...clickHistory, newClick]);
    playNote(newClick);
  };

  const clearHistory = () => {
    setClickHistory([]);
  };

  return (
    <>
      <div
        ref={boardRef}
        style={{
          width: BOARD_WIDTH,
          height: BOARD_HEIGHT,
          position: "relative",
          overflow: "hidden",
          transition: "background-color 0.5s",
          filter: "blur(2px)",
        }}
      >
        {clickHistory.map((click) => (
          <ClickDot key={click.index} click={click} timer={timer} />
        ))}
        <div
          style={{
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0)",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          onMouseMove={mouseMoved}
          onClick={mouseClicked}
        />
      </div>
      <p>Time: {Math.round(timer * 100) / 100}</p>
      <button onClick={clearHistory}>Clear</button>
    </>
  );
};
