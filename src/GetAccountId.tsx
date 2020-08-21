import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";

import { getAuthCert } from "mynaconnect-lib";

const { blake2bHex } = require("blakejs");

export default function GetAccountId({
  onLoad,
}: {
  onLoad: (arg: string) => void;
}) {
  const { addToast } = useToasts();
  const getId = async () => {
    try {
      const _cert = ((await getAuthCert("Levia - 証明書取得")) as any).cert;
      const cert = Buffer.from(_cert);
      const hash = blake2bHex(cert as any, null, 32) as string;
      onLoad("0x" + hash);
    } catch (e) {
      addToast(e.toString(), {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  return (
    <Button variant="contained" color="primary" onClick={getId}>
      アカウントIDを調べる
    </Button>
  );
}
