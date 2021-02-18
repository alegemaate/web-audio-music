import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@material-ui/core";
import React from "react";

export const ConnectForm: React.FC<{
  onSubmit: (url: string) => void;
  loading: boolean;
  open: boolean;
  error: string;
}> = ({ onSubmit, loading, open, error }) => {
  const [url, setUrl] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setUrl(event.target.value);
  };

  const handleSubmit = () => {
    console.log(url);
    onSubmit(url);
  };

  React.useEffect(() => {
    const lsUrl = window.localStorage.getItem("wssurl");

    if (typeof lsUrl === "string") {
      setUrl(lsUrl);
    }
  }, []);

  return (
    <Dialog open={open}>
      <DialogTitle>Connect to OSC Controller</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To start using osc controller you will have to provide a websocket url
          to connect to.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          type="text"
          value={url}
          onChange={handleChange}
          placeholder="wss://..."
          label="Websocket URL"
          id="url"
          fullWidth
          disabled={loading}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" disabled={loading} onClick={handleSubmit}>
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
};
