import {
  Button,
  Card,
  CardActions,
  Slider,
  Typography,
} from "@material-ui/core";
import { Timelapse, Timer } from "@material-ui/icons";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { WsArgs } from "../App";
import { rangeMap } from "../helpers/helpers";

export type ClickHistory = {
  x: number;
  y: number;
  time: number;
  index: number;
};

const ClickDot: React.FC<{
  click: ClickHistory;
  timer: number;
  boardWidth: number;
  maxTime: number;
}> = ({ click, timer, boardWidth, maxTime }) => {
  let timerDiff =
    (Math.sin(((timer - click.time) / (maxTime / 2) + 0.5) * Math.PI) + 1) *
    0.5;

  return (
    <div
      style={{
        width: (timerDiff * boardWidth) / 3,
        height: (timerDiff * boardWidth) / 3,
        backgroundColor: `rgba(0,${click.x / 2},${click.y / 2},${
          timerDiff / 2
        })`,
        position: "absolute",
        top: click.y - (timerDiff * boardWidth) / 6,
        left: click.x - (timerDiff * boardWidth) / 6,
        borderRadius: "50%",
        transition: "all 0.5s",
      }}
    />
  );
};

export const OscBloom: React.FC<
  RouteComponentProps & { onTransmit: (args: WsArgs) => void }
> = ({ onTransmit }) => {
  const [clickHistory, setClickHistory] = React.useState<ClickHistory[]>([]);
  const [timer, setTimer] = React.useState(0);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [maxTime, setMaxTime] = React.useState(4);

  const boardRef = React.useRef<HTMLDivElement>(null);

  const playNote = React.useCallback(
    (click: ClickHistory) => {
      const freq = rangeMap(click.x, 0, size.width, 20, 2000);
      const vol = rangeMap(click.y, 0, size.height, 0, 1);
      console.log("Playing note ", freq, vol);

      onTransmit({
        address: "/chuck/oscnote",
        args: [freq, vol, click.index],
      });
    },
    [onTransmit, size]
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      let newTime = timer + 0.1;
      if (newTime > maxTime) {
        newTime = 0;
      }

      clickHistory
        .filter((click) => click.time === newTime)
        .forEach((click) => playNote(click));

      setTimer(newTime);
    }, 100);

    return () => clearInterval(interval);
  }, [playNote, clickHistory, timer, maxTime]);

  React.useEffect(() => {
    if (boardRef.current) {
      setSize({
        width: boardRef.current.clientWidth,
        height: boardRef.current.clientHeight,
      });
    }
  }, [boardRef]);

  const mouseMoved = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { nativeEvent } = event;
    const x = nativeEvent.offsetX;
    const y = nativeEvent.offsetY;

    if (boardRef.current) {
      boardRef.current.style.backgroundColor = `rgba(0, ${rangeMap(
        x,
        0,
        size.width,
        0,
        255
      )}, ${rangeMap(y, 0, size.height, 0, 255)})`;
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

  const handleMaxTimeChange = (_event: unknown, value: number | number[]) => {
    if (typeof value === "number") {
      setMaxTime(value);
    }
  };

  return (
    <Card>
      <div
        ref={boardRef}
        style={{
          width: "100%",
          height: 400,
          position: "relative",
          overflow: "hidden",
          transition: "background-color 0.5s",
        }}
      >
        {clickHistory.map((click) => (
          <ClickDot
            key={click.index}
            click={click}
            timer={timer}
            boardWidth={size.width}
            maxTime={maxTime}
          />
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
      <CardActions>
        <Timer />
        <Typography variant="body1" style={{ width: "100%" }}>
          {Math.round(timer * 100) / 100}/{Math.round(maxTime * 100) / 100}
        </Typography>
        <Timelapse />
        <Slider
          value={maxTime}
          onChange={handleMaxTimeChange}
          max={20}
          min={1}
          step={0.1}
        />
        <Button onClick={clearHistory}>Clear</Button>
      </CardActions>
    </Card>
  );
};
