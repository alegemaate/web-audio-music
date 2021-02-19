import React from "react";
import { WsArgs } from "./App";
import { RouteComponentProps } from "@reach/router";
import { AccelPad, AccelParams } from "./AccelPad";

export const Accelerometer: React.FC<
  RouteComponentProps & {
    onTransmit: (args: WsArgs) => void;
  }
> = ({ onTransmit }) => {
  const handleChange = (msg: AccelParams) => {
    onTransmit({
      address: "/chuck/oscnote/accel",
      args: [msg.alpha, msg.beta, msg.gamma],
    });
  };

  const handleClick = (msg: "on" | "off") => {
    onTransmit({
      address: "/chuck/oscnote/tap",
      args: [msg],
    });
  };

  return <AccelPad onClick={handleClick} onChange={handleChange} />;
};
