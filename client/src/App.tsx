import React from "react";

import osc from "osc";

import { Bloom } from "./Bloom";
console.log(osc);

export type WsArgs = {
  address: string;
  args: (number | string)[];
};

function App() {
  const [port, setPort] = React.useState<any>(null);

  React.useEffect(() => {
    const port = new osc.WebSocketPort({
      url: "ws://localhost:8081",
    });

    if (port) {
      port.on("message", function (oscMessage: any) {
        console.log(oscMessage);
        console.log("message", oscMessage);
      });

      port.open();

      setPort(port);
    }
  }, []);
  const playNote = (args: WsArgs) => {
    console.log("Playing note ", args);

    try {
      if (port) {
        port.send(args);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <p>Controllers</p>

      <Bloom onClick={playNote} />
    </div>
  );
}

export default App;
