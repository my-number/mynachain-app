import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Backdrop,
  CircularProgress
} from "@material-ui/core";
import { useApi } from "./Api";
import { makeStyles } from "@material-ui/core/styles";
import { Keyring } from "@polkadot/api";
import { useToasts } from "react-toast-notifications";
import { currentCard } from "./rpc";

const keyring = new Keyring({ type: "sr25519" });
const useStyles = makeStyles({
  root: {
    "& > *": {
      margin: "10px"
    }
  },
  backdrop: {
    zIndex: 3,
    color: "#fff"
  }
});

const i2h = (il: number[]) =>
  "0x" + il.map(i => ("0" + i.toString(16)).slice(-2)).join("");
export default function NewAccount() {
  const { api } = useApi();
  const { root, backdrop } = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    try {
      addToast("Retrieving a certificate", {
        appearance: "info",
        autoDismiss: true
      });
      const cert = (await currentCard.getCert()) as number[];
      const forHash: any = api.tx.mynaChainModule.go({
        signature: "0x00",
        id: 0,
        tbs: {
          CreateAccount: {
            cert: i2h(cert),
            nonce: 0
          }
        }
      });

      let hash = forHash.args[0]["tbs"].hash.toHex();
      addToast("Computing a signature", {
        appearance: "info",
        autoDismiss: true
      });
      const sig = (await currentCard.computeSig(
        localStorage.pin as string,
        hash.slice(2)
      )) as number[];
      const submittable = api.tx.mynaChainModule.go({
        signature: i2h(sig),
        id: 0,
        tbs: {
          CreateAccount: {
            cert: i2h(cert),
            nonce: 0
          }
        }
      });
      const alice = keyring.addFromUri("//Alice", { name: "Alice default" });
      addToast("Waiting for the Events", {
        appearance: "info",
        autoDismiss: true
      });
      submittable.signAndSend(alice, e => {
        console.log(e);
        if (e.isCompleted) setLoading(false);
        if (e.events.length == 0) return;
        e.events.forEach((m: any) => {
          const msg = m.event.meta.name.toString();
          addToast(msg, {
            appearance: "success",
            autoDismiss: true
          });
        });
      });
    } catch (e) {
      setLoading(false);
      addToast(e.toString(), {
        appearance: "error",
        autoDismiss: true
      });
    }
  };
  return (
    <>
      <Container maxWidth="sm" className={root}>
        <Button
          variant="contained"
          color="primary"
          fullWidth={true}
          onClick={send}
        >
          アカウント作成
        </Button>
      </Container>
      <Backdrop className={backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
