import React, { useState, useEffect } from 'react';
import { Button, Container, TextField } from '@material-ui/core';
import { useApi } from './Api';
import { makeStyles } from '@material-ui/core/styles';
import { Keyring } from '@polkadot/api';

const keyring = new Keyring({ type: 'sr25519' });
const useStyles = makeStyles({
  root: {
    "& > *": {
      margin: "10px"
    }
  }
})

export default function NewAccount() {
  const { api } = useApi();
  const { root } = useStyles();

  const useHexInput = (initial: string) => {
    const [value, set] = useState(initial);
    let isHex = /^0x([a-fA-F0-9]{2})*$/.test(value);

    return { value, onChange: (e: any) => set(e.target.value), error: !isHex }
  }
  const useIntInput = (initial: number) => {
    const [value, set] = useState(initial);
    let isNumber = /^[0-9]*$/.test(value.toString());

    return { value, onChange: (e: any) => set(e.target.value), error: !isNumber }
  }

  const sig = useHexInput("");
  const from = useIntInput(0);
  const amount = useIntInput(0);
  const [log, setLog] = useState("");
  const [hash, setHash] = useState("");
  const getHash = () => {
    setLog("")
    try {
      const submittable: any = api.tx.mynaChainModule.go({
        signature: "0x00",
        id: from.value,
        tbs: {
          Mint: {
            amount: amount.value,
            nonce: 0
          }
        }
      });
      setHash(submittable.args[0]["tbs"].hash.toHex())
    } catch (e) {
      setLog(e.toString());
    }
  }
  const send = () => {
    setLog("")
    try {
      const submittable: any = api.tx.mynaChainModule.go({
        signature: sig.value,
        id: from.value,
        tbs: {
          Mint: {
            amount: amount.value,
            nonce: 0
          }
        }
      });
      setHash("")
      const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
      submittable.signAndSend(alice, (e: any) => {
        console.log(e);
        if (e.events.length == 0) return;
        e.events.forEach((m: any) => {
          const msg = m.event.meta.name.toString();
          setLog(msg);
        });
      })
    } catch (e) {
      setLog(e.toString());
    }
  }
  return (
    <Container maxWidth="sm" className={root}>
      <TextField
        label="あなたのアカウント番号"
        fullWidth={true}
        placeholder="整数"
        {...from}
      />
      <TextField
        label="発行数量"
        fullWidth={true}
        placeholder="整数"
        {...amount}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth={true}
        onClick={getHash}
        disabled={from.error || amount.error}
      >カードに渡すハッシュ値を作成</Button>
      <TextField

        label="カードに渡すハッシュ値"
        fullWidth={true}
        placeholder="0x......"
        multiline
        value={hash}
      />

      <TextField

        label="署名"
        fullWidth={true}
        placeholder="0x......"
        multiline
        {...sig}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth={true}
        onClick={send}
        disabled={sig.error}
      >トランザクション送信</Button>
      <TextField
        label="ログ"
        fullWidth={true}
        multiline
        disabled
        value={log}
      />
    </Container>
  )
}
