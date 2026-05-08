"use client";

import * as React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { Error } from "@mui/icons-material";

import { colorMap, rangeMap } from "../helpers/helpers";

const DOT_SIZE = 100;

export interface AccelParams {
  alpha: number;
  beta: number;
  gamma: number;
}

type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"denied" | "granted">;
};

export const AccelPad: React.FC<{
  onChange?: (args: AccelParams) => void;
  onClick?: (status: "off" | "on") => void;
}> = ({ onChange, onClick }) => {
  const [listening, setListening] = React.useState(false);
  const [error, setError] = React.useState("");
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const boardRef = React.useRef<HTMLDivElement>(null);
  const dotRef = React.useRef<HTMLDivElement>(null);

  const onChangeRef = React.useRef(onChange);
  const sizeRef = React.useRef(size);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  React.useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  React.useEffect(() => {
    if (boardRef.current) {
      setSize({
        width: boardRef.current.clientWidth,
        height: boardRef.current.clientHeight,
      });
    }
  }, []);

  React.useEffect(() => {
    if (!listening) return undefined;

    const handler = (event: DeviceOrientationEvent) => {
      if (!dotRef.current) return;
      const alpha = event.alpha ?? 0;
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;
      const { width, height } = sizeRef.current;

      dotRef.current.style.left = `${
        rangeMap(gamma, -90, 90, 0, width) - DOT_SIZE / 2
      }px`;
      dotRef.current.style.top = `${
        rangeMap(beta, -90, 90, 0, height) - DOT_SIZE / 2
      }px`;
      dotRef.current.style.backgroundColor = `rgb(255,${colorMap(
        beta,
        -180,
        180,
      )},${colorMap(gamma, -90, 90)})`;
      dotRef.current.style.borderRadius = `${rangeMap(
        alpha,
        0,
        360,
        0,
        50,
      )}%`;

      onChangeRef.current?.({ alpha, beta, gamma });
    };

    window.addEventListener("deviceorientation", handler);
    return () => {
      window.removeEventListener("deviceorientation", handler);
    };
  }, [listening]);

  const motionAccess = () => {
    setError("");
    if (typeof DeviceOrientationEvent === "undefined") {
      setError("This browser does not support device orientation");
      return;
    }

    const evt = DeviceOrientationEvent as IOSDeviceOrientationEvent;
    if (typeof evt.requestPermission !== "function") {
      setListening(true);
      return;
    }

    evt.requestPermission()
      .then((response) => {
        if (response === "granted") {
          setListening(true);
        } else {
          setError(
            "Motion permission denied. Enable it in Settings → Safari → Motion & Orientation Access.",
          );
        }
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Could not request motion permission");
      });
  };

  return (
    <Card>
      {!listening && (
        <CardContent>
          <Button
            onClick={motionAccess}
            variant="outlined"
            color="primary"
            fullWidth
          >
            No motion device detected. Click to request access
          </Button>

          {error && (
            <Box>
              <Error color="error" />
              <Typography gutterBottom variant="caption">
                {error}
              </Typography>
            </Box>
          )}
        </CardContent>
      )}
      <div
        ref={boardRef}
        style={{
          width: "100%",
          height: "300px",
          position: "relative",
          overflow: "hidden",
          margin: "0 auto",
          backgroundColor: "#CCC",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          touchAction: "none",
        }}
      >
        <div
          ref={dotRef}
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            backgroundColor: "rgba(0, 0, 0 ,0)",
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "50%",
            transition: "all 0.04s",
          }}
        />
        <div
          onTouchStart={() => onClick?.("on")}
          onTouchEnd={() => onClick?.("off")}
          style={{
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0)",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </Card>
  );
};
