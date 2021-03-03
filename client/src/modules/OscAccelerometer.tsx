import React from "react";
import { RouteComponentProps } from "@reach/router";

import { WsArgs } from "../App";
import { AccelPad, AccelParams } from "../components/AccelPad";

export const OscAccelerometer: React.FC<
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
