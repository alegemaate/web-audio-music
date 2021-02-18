//--------------------------------------------------
//  Bi-Directional OSC messaging Websocket <-> UDP
//--------------------------------------------------
const osc = require("osc");
const WebSocket = require("ws");

const WS_PORT = 8080;

// Create UDP Server
const udp = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 7400,
  remoteAddress: "127.0.0.1",
  remotePort: 7500,
});

// Tell us when ready
udp.on("ready", function () {
  console.log("UDP Ready");
});

// Open udp port
udp.open();

// Create websocket server
const wss = new WebSocket.Server({
  port: WS_PORT,
});

// On ready
wss.on("listening", () => {
  console.log(`Web socket listening on port ${WS_PORT}`);
});

// New websocket connection
wss.on("connection", (socket) => {
  console.log("A Web Socket connection has been established!");

  // Relay to UDP
  socket.on("message", (message) => {
    const msg = JSON.parse(message);
    if (
      msg instanceof Object &&
      msg.args instanceof Array &&
      typeof msg.address === "string"
    ) {
      udp.send(msg);
    } else {
      console.log("An invalid message was sent ", msg);
    }
  });
});

// Connection closed
wss.on("close", () => {
  console.log("A Web Socket connection has been closed!");
});
