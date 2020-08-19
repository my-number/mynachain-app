import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { useApi } from "./Api";
import { makeStyles } from "@material-ui/core/styles";
import { Keyring } from "@polkadot/api";
import { useToasts } from "react-toast-notifications";
import { getAuthCert, signWithAuth } from "mynaconnect-lib";
const keyring = new Keyring({ type: "sr25519" });
const useStyles = makeStyles({
  root: {
    "& > *": {
      margin: "10px",
    },
  },
  backdrop: {
    zIndex: 3,
    color: "#fff",
  },
});

const i2h = (il: number[]) =>
  "0x" + il.map((i) => ("0" + i.toString(16)).slice(-2)).join("");
export default function NewAccount() {
  const { api } = useApi();
  const { root, backdrop } = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState("");
  const [cert, setCert] = useState<number[]>([]);
  const getHash = async () => {
    setLoading(true);
    try {
      addToast("Retrieving a certificate", {
        appearance: "info",
        autoDismiss: true,
      });
      const _cert = ((await getAuthCert("Levia - 証明書取得")) as any)
        .cert as number[];
      if (!_cert || cert.length == 0) {
        setLoading(false);
        return;
      }
      setCert(_cert);
      const forHash: any = api.tx.mynaChainModule.go({
        signature: "0x00",
        id: 0,
        tbs: {
          CreateAccount: {
            cert: i2h(cert),
            nonce: 0,
          },
        },
      });

      setHash(forHash.args[0]["tbs"].hash.toHex());
    } catch (e) {
      addToast(e.toString(), {
        appearance: "error",
        autoDismiss: true,
      });
    }
    setLoading(false);
  };
  const send = async () => {
    try {
      setLoading(true);
      addToast("Computing a signature", {
        appearance: "info",
        autoDismiss: true,
      });
      const sig = ((await signWithAuth(
        "Levia - TX署名",
        "3031300d060960864801650304020105000420" + hash.slice(2)
      )) as any).sig as number[];
      const submittable = api.tx.mynaChainModule.go({
        signature: i2h(sig),
        id: 0,
        tbs: {
          CreateAccount: {
            cert: i2h(cert),
            nonce: 0,
          },
        },
      });
      const alice = keyring.addFromUri("//Alice", { name: "Alice default" });
      addToast("Waiting for the Events", {
        appearance: "info",
        autoDismiss: true,
      });
      submittable.signAndSend(alice, (e) => {
        console.log(e);
        if (e.isCompleted) setLoading(false);
        if (e.events.length == 0) return;
        e.events.forEach((m: any) => {
          const msg = m.event.meta.name.toString();
          addToast(msg, {
            appearance: "success",
            autoDismiss: true,
          });
        });
      });
    } catch (e) {
      setLoading(false);
      addToast(e.toString(), {
        appearance: "error",
        autoDismiss: true,
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
          onClick={getHash}
          disabled={!!hash}
        >
          アカウント情報取得
        </Button>

        {hash && (
          <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={send}
          >
            アカウント作成
          </Button>
        )}
      </Container>
      <Backdrop className={backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
