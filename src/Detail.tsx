import React, { useState, useEffect } from "react";
import { Button, Container, TextField } from "@material-ui/core";
import { useApi } from "./Api";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
const useStyles = makeStyles({
  root: {
    "& > *": {
      margin: "10px",
    },
  },
});

export default function Detail() {
  const { root } = useStyles();
  const { id } = useParams();
  const { api } = useApi();
  const [balance, setBalance] = useState<number | null>(null);
  const [nonce, setNonce] = useState<number | null>(null);
  const [cert, setCert] = useState<string>("Not loaded");
  const [data, setData] = useState<string>("No data");
  useEffect(() => {
    api.query.mynaChainModule.rawBalance(id).then((res: any) => {
      setBalance(res.toNumber());
    });
    api.query.mynaChainModule.accounts(id).then((res: any) => {
      setNonce(res.nonce.toNumber());
      setCert(res.cert.toHex());
      setData(res.data.toHex());
    });
  }, [id]);
  const x509 = () => {
    window.open("https://lapo.it/asn1js/#" + cert.slice(2));
  };
  return (
    <Container maxWidth="sm" className={root}>
      <h1>Account ID: {id}</h1>
      <p>
        アカウント{id}が所有する金額:{" "}
        {balance + " マイナコイン" || "not loaded"}
      </p>
      <TextField
        label="証明書"
        multiline
        rows="6"
        disabled
        variant="filled"
        fullWidth
        value={cert}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowForwardIcon />}
        onClick={x509}
      >
        証明書の中身を確認する
      </Button>
      <TextField
        label="データ"
        multiline
        rows="6"
        disabled
        variant="filled"
        fullWidth
        value={data}
      />
    </Container>
  );
}
