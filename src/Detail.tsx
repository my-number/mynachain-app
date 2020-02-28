import React, { useState, useEffect } from 'react';
import { Button, Container, TextField } from '@material-ui/core';
import { useApi } from './Api';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    "& > *": {
      margin: "10px"
    }
  }
})

export default function Detail() {
  const { root } = useStyles()
  const { id } = useParams()
  const { api } = useApi()
  const [balance, setBalance] = useState<number | null>(null)
  const [nonce, setNonce] = useState<number | null>(null)
  const [cert, setCert] = useState<string>("Not loaded")
  useEffect(() => {
    api.query.mynaChainModule.balance(id).then((res: any) => {
      setBalance(res.toNumber())
    })
    api.query.mynaChainModule.accounts(id).then((res: any) => {
      setNonce(res.nonce.toNumber())
      setCert(res.cert.toHex())
    })

  }, [id])
  return (
    <Container maxWidth="sm" className={root}>
      <h1>Account ID: {id}</h1>
      <p>
        Balance: {balance || "not loaded"}<br />
        Nonce: {nonce || "not loaded"}
      </p>
      <TextField
        label="Certificate"
        multiline
        rows="6"
        disabled
        variant="filled"
        fullWidth
        value={cert} />
    </Container>
  );

}
