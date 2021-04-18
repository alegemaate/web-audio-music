import React from "react";

import { Layout, WsArgs } from "../../components/Layout";
import { AccelPad, AccelParams } from "../../components/AccelPad";

const OscAccelerometer: React.FC<{
  onTransmit: (args: WsArgs) => void;
}> = ({ onTransmit }) => {
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

  return (
    <Layout>
      <AccelPad onClick={handleClick} onChange={handleChange} />
    </Layout>
  );
};

export default OscAccelerometer;
