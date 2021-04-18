import React from "react";
import { Box, Container, makeStyles } from "@material-ui/core";

import { ConnectForm } from "./ConnectForm";
import { AppDrawer } from "./AppDrawer";
import { AppTopBar } from "./AppTopBar";

export type WsArgs = {
  address: string;
  args: (number | string)[];
};

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

export const Layout: React.FC = ({ children }) => {
  const [client, setClient] = React.useState<WebSocket | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [connectOpen, setConnectOpen] = React.useState(false);

  const classes = useStyles();

  const toggleDrawer = () => {
    setDrawerOpen((open) => !open);
  };

  const handleDisconnect = () => {
    if (client) {
      client.close();
    }
    setClient(null);
  };

  const connectWebsocket = (url: string) => {
    setLoading(true);
    setError("");

    if (!/^wss:[\w]*\/\/./u.exec(url)) {
      setError("Invalid wss string");
      setLoading(false);
      return;
    }

    const ws = new WebSocket(url);

    ws.onopen = (connection) => {
      console.log("WebSocket Client Connected", connection);
      setLoading(false);
      setClient(ws);
      setConnectOpen(false);
      window.localStorage.setItem("wssurl", url);
    };

    ws.onerror = (error) => {
      console.log("Connection Error: ", error);
      setLoading(false);
      setError("Connection failed");
    };

    ws.onclose = () => {
      console.log("Connection Closed");
      handleDisconnect();
    };

    ws.onmessage = (message) => {
      if (message.type === "utf8") {
        console.log("Received: '" + message.data + "'");
      }
    };
  };

  const playNote = (args: WsArgs) => {
    if (client) {
      console.log("Playing note ", args);
      client.send(JSON.stringify(args));
    }
  };

  return (
    <div className={classes.root} style={{ userSelect: "none" }}>
      <AppTopBar
        onConnect={() => setConnectOpen(true)}
        onDisconnect={handleDisconnect}
        toggleDrawer={toggleDrawer}
        url={client?.url}
      />
      <AppDrawer open={drawerOpen} toggle={toggleDrawer} />
      <ConnectForm
        loading={loading}
        onSubmit={connectWebsocket}
        open={connectOpen}
        error={error}
        onClose={() => setConnectOpen(false)}
      />
      <Container maxWidth="md">
        <Box maxWidth="md" mt={4}>
          {children}
        </Box>
      </Container>
    </div>
  );
};
