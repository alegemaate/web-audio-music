/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import { colorMap, rangeMap } from "../helpers/helpers";
import GyroNorm from "gyronorm";
import { Box, Button, Card, CardContent, Typography } from "@material-ui/core";
import { Error } from "@material-ui/icons";

const DOT_SIZE = 100;

export interface AccelParams {
  alpha: number;
  beta: number;
  gamma: number;
}

export const AccelPad: React.FC<{
  onChange?: (args: AccelParams) => void;
  onClick?: (status: "off" | "on") => void;
}> = ({ onChange, onClick }) => {
  const [hasMotionDevice, setHasMotionDevice] = React.useState(false);
  const [error, setError] = React.useState("");
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const boardRef = React.useRef<HTMLDivElement>(null);
  const dotRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (boardRef.current) {
      setSize({
        width: boardRef.current.clientWidth,
        height: boardRef.current.clientHeight,
      });
    }
  }, [boardRef]);

  const initMotion = () => {
    setHasMotionDevice(true);
    const gn = new GyroNorm();

    gn.init({ frequency: 50 })
      .then(() => {
        gn.start((data) => {
          if (dotRef.current) {
            const { alpha, beta, gamma } = data.do;

            dotRef.current.style.left = `${
              rangeMap(gamma, -90, 90, 0, size.width) - DOT_SIZE / 2
            }px`;

            dotRef.current.style.top = `${
              rangeMap(beta, -90, 90, 0, size.height) - DOT_SIZE / 2
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

            onChange?.({ alpha, beta, gamma });
          }
        });
      })
      .catch(() => {
        setHasMotionDevice(false);
        setError("This browser does not support device motion");
      });
  };

  const motionAccess = () => {
    // @ts-expect-error - typescript doesn't know about this
    if (!DeviceMotionEvent.requestPermission) {
      initMotion();
    }

    // @ts-expect-error - typescript doesn't know about this
    DeviceMotionEvent.requestPermission?.().then((response) => {
      if (response === "granted") {
        initMotion();
      }
    });
  };

  return (
    <Card>
      {!hasMotionDevice && (
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
