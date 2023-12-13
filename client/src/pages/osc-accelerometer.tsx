import React from "react";

import { type WsArgs, Layout } from "../components/Layout";
import { type AccelParams, AccelPad } from "../components/AccelPad";
import { Seo } from "../components/Seo";
import { Typography } from "@material-ui/core";

const OscAccelerometer: React.FC<{
  onTransmit: (args: WsArgs) => void;
}> = ({ onTransmit }) => {
  const handleChange = (msg: AccelParams) => {
    onTransmit({
      address: "/chuck/oscnote/accel",
      args: [msg.alpha, msg.beta, msg.gamma],
    });
  };

  const handleClick = (msg: "off" | "on") => {
    onTransmit({
      address: "/chuck/oscnote/tap",
      args: [msg],
    });
  };

  return (
    <Layout>
      <Typography variant="h1">OSC Accelerometer Controller</Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        WIP - Requires server running on localhost:8888
      </Typography>
      <AccelPad onClick={handleClick} onChange={handleChange} />
    </Layout>
  );
};

export default OscAccelerometer;

export const Head = (): JSX.Element => (
  <Seo
    title="OSC Accelerometer Controller"
    description="WIP - Accelerometer Controlled OSC Synthesizer Controller"
  />
);
