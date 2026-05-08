"use client";

import * as React from "react";
import {
  Button,
  Card,
  CardActions,
  Slider,
  Typography,
} from "@mui/material";
import { Timelapse, Timer } from "@mui/icons-material";

import { Layout } from "@/components/Layout";
import { useAudioContext } from "@/hooks/useAudioContext";
import { rangeMap } from "@/helpers/helpers";

interface ClickHistory {
  x: number;
  y: number;
  time: number;
  index: number;
}

const NOTE_DURATION = 6;

// C major pentatonic spanning ~3 octaves (top of board = highest pitch)
const PENTATONIC_HZ = [
  130.81, 146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63, 392.0, 440.0,
  523.25, 587.33, 659.25, 783.99, 880.0, 1046.5,
];

const ClickDot: React.FC<{
  click: ClickHistory;
  timer: number;
  boardWidth: number;
  maxTime: number;
}> = ({ click, timer, boardWidth, maxTime }) => {
  const timerDiff =
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

const BloomInner: React.FC = () => {
  const { context, gain } = useAudioContext();
  const [clickHistory, setClickHistory] = React.useState<ClickHistory[]>([]);
  const [timer, setTimer] = React.useState(0);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [maxTime, setMaxTime] = React.useState(4);

  const boardRef = React.useRef<HTMLDivElement>(null);
  const fxBusRef = React.useRef<GainNode | null>(null);

  // Build a shared feedback delay so notes leave a trailing shimmer.
  React.useEffect(() => {
    if (!context || !gain) {
      return undefined;
    }
    const bus = context.createGain();
    const delay = context.createDelay(2);
    delay.delayTime.value = 0.55;
    const feedback = context.createGain();
    feedback.gain.value = 0.45;
    const wet = context.createGain();
    wet.gain.value = 0.5;

    bus.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(gain);

    fxBusRef.current = bus;
    return () => {
      bus.disconnect();
      delay.disconnect();
      feedback.disconnect();
      wet.disconnect();
      fxBusRef.current = null;
    };
  }, [context, gain]);

  const playNote = React.useCallback(
    (click: ClickHistory) => {
      if (!context || !gain) {
        return;
      }
      if (context.state === "suspended") {
        context.resume().catch(console.error);
      }

      // y maps to pitch (top of board = highest note in the scale)
      const yNorm = size.height
        ? Math.min(Math.max(click.y / size.height, 0), 1)
        : 0;
      const idx = Math.round((1 - yNorm) * (PENTATONIC_HZ.length - 1));
      const freq = PENTATONIC_HZ[idx];
      const pan = rangeMap(click.x, 0, size.width || 1, -0.8, 0.8);

      const now = context.currentTime;
      const noteGain = context.createGain();
      noteGain.gain.value = 1;
      const panner = context.createStereoPanner();
      panner.pan.value = pan;
      noteGain.connect(panner);
      panner.connect(gain);
      if (fxBusRef.current) {
        panner.connect(fxBusRef.current);
      }

      // Bell-ish additive synth: fundamental + a couple of inharmonic partials,
      // each with its own exponential decay (higher partials decay faster).
      const partials = [
        { mul: 1, level: 0.35, decay: NOTE_DURATION },
        { mul: 2, level: 0.15, decay: NOTE_DURATION * 0.55 },
        { mul: 3.01, level: 0.08, decay: NOTE_DURATION * 0.35 },
        { mul: 4.2, level: 0.05, decay: NOTE_DURATION * 0.22 },
      ];

      const oscs: OscillatorNode[] = [];
      partials.forEach(({ mul, level, decay }) => {
        const osc = context.createOscillator();
        const partialGain = context.createGain();
        osc.type = "sine";
        osc.frequency.value = freq * mul;
        partialGain.gain.setValueAtTime(0, now);
        partialGain.gain.linearRampToValueAtTime(level, now + 0.01);
        partialGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
        osc.connect(partialGain);
        partialGain.connect(noteGain);
        osc.start(now);
        osc.stop(now + decay + 0.05);
        osc.onended = () => {
          osc.disconnect();
          partialGain.disconnect();
        };
        oscs.push(osc);
      });

      // The first partial has the longest decay; clean up the shared nodes
      // only after it finishes so we don't cut off lingering harmonics.
      oscs[0].addEventListener("ended", () => {
        noteGain.disconnect();
        panner.disconnect();
      });
    },
    [context, gain, size],
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      let newTime = timer + 0.1;
      if (newTime > maxTime) {
        newTime = 0;
      }

      clickHistory
        .filter((click) => click.time === newTime)
        .forEach((click) => {
          playNote(click);
        });

      setTimer(newTime);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [playNote, clickHistory, timer, maxTime]);

  React.useEffect(() => {
    if (boardRef.current) {
      setSize({
        width: boardRef.current.clientWidth,
        height: boardRef.current.clientHeight,
      });
    }
  }, [boardRef]);

  const mouseMoved = (event: React.MouseEvent<HTMLDivElement>) => {
    const { nativeEvent } = event;
    const x = nativeEvent.offsetX;
    const y = nativeEvent.offsetY;

    if (boardRef.current) {
      boardRef.current.style.backgroundColor = `rgba(0, ${rangeMap(
        x,
        0,
        size.width,
        0,
        255,
      )}, ${rangeMap(y, 0, size.height, 0, 255)})`;
    }
  };

  const mouseClicked = (event: React.MouseEvent<HTMLDivElement>) => {
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

  const handleMaxTimeChange = (_event: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setMaxTime(value);
    }
  };

  return (
    <>
      <Typography variant="h1">Bloom</Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Tap anywhere on the canvas to spawn a note. Each tap blooms outward
        and fades, layering into a slow ambient drift inspired by Brian Eno&apos;s
        Bloom.
      </Typography>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        Inspired by{" "}
        <a
          href="https://en.wikipedia.org/wiki/Bloom_(software)"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bloom
        </a>{" "}
        (2008) by Brian Eno and Peter Chilvers. This is an unaffiliated
        homage built with the Web Audio API.
      </Typography>
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
          <Typography variant="body1" sx={{ width: "100%" }}>
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
    </>
  );
};

const Bloom: React.FC = () => (
  <Layout>
    <BloomInner />
  </Layout>
);

export default Bloom;
