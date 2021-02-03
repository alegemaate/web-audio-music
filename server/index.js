//--------------------------------------------------
//  Bi-Directional OSC messaging Websocket <-> UDP
//--------------------------------------------------
const osc = require("osc");
const WebSocket = require("ws");

const getIPAddresses = function () {
  const os = require("os"),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

  for (let deviceName in interfaces) {
    const addresses = interfaces[deviceName];

    for (let i = 0; i < addresses.length; i++) {
      const addressInfo = addresses[i];

      if (addressInfo.family === "IPv4" && !addressInfo.internal) {
        ipAddresses.push(addressInfo.address);
      }
    }
  }

  return ipAddresses;
};

const udp = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 7400,
  remoteAddress: "127.0.0.1",
  remotePort: 7500,
});

udp.on("ready", function () {
  const ipAddresses = getIPAddresses();
  console.log("Listening for OSC over UDP.");
  ipAddresses.forEach(function (address) {
    console.log(" Host:", address + ", Port:", udp.options.localPort);
  });
  console.log(
    "Broadcasting OSC over UDP to",
    udp.options.remoteAddress + ", Port:",
    udp.options.remotePort
  );
});

udp.open();

const wss = new WebSocket.Server({
  port: 8081,
});

wss.on("connection", function (socket) {
  console.log("A Web Socket connection has been established!");
  const socketPort = new osc.WebSocketPort({
    socket,
  });

  new osc.Relay(udp, socketPort, {
    raw: true,
  });
});
