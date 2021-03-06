import React, { useState, useEffect } from "react";
import { Button, Container, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    "& > *": {
      margin: "10px",
    },
  },
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
      onChange: (e: any) => set(e.target.value),
    };
  };
  const node = useInput(localStorage.destination || "");
  const save = () => {
    if (!/^(wss|ws):\/\//.test(node.value) && node.value != "") return;
    setLoading(true);
    localStorage.destination = node.value;
    history.replace("/");
    location.reload();
  };

  return (
    <Container maxWidth="sm" className={root}>
      <h1>設定</h1>
      <TextField
        label="ノード接続先"
        fullWidth={true}
        placeholder="wss://mynachain.herokuapp.com"
        {...node}
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
