import React, { useState, useEffect } from "react";
import { Button, Container, TextField } from "@material-ui/core";
import { useApi } from "./Api";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
const useStyles = makeStyles({
  root: {
    "& > *": {
      margin: "10px"
    }
  }
});
declare var location: any;
export default function Settings() {
  const { root } = useStyles();
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const useInput = (initial: string) => {
    const [value, set] = useState(initial);

    return {
      value,
      onChange: (e: any) => set(e.target.value)
    };
  };
  const node = useInput(localStorage.destination || "");
  const pin = useInput(localStorage.pin || "");
  const save = () => {
    if (!/^(wss|ws):\/\//.test(node.value) && node.value != "") return;
    if (!/^\d{4}$/.test(pin.value)) return;
    setLoading(true);
    localStorage.destination = node.value;
    localStorage.pin = pin.value;
    history.replace("/");
    location.reload();
  };

  return (
    <Container maxWidth="sm" className={root}>
      <h1>設定</h1>
      <TextField
        label="ノード接続先"
        fullWidth={true}
        placeholder="d1pzlh6wq0egn8.cloudfront.net"
        {...node}
      />
      <TextField
        label="PIN"
        fullWidth={true}
        placeholder="この値はブラウザ内に保存されます。共有PCでのご利用時はご注意ください。"
        {...pin}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth={true}
        onClick={save}
        disabled={loading}
      >
        保存して接続しなおす
      </Button>
    </Container>
  );
}
