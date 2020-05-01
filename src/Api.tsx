import React, { useState, useEffect, useContext } from "react";

import { ApiPromise, WsProvider } from "@polkadot/api";

interface Props {
  children: React.ReactNode;
}
export interface ApiProps {
  api: ApiPromise;
  isApiConnected: boolean;
  isReady: boolean;
}
let api: ApiPromise;
const ApiContext = React.createContext({} as ApiProps);

export { api };
export default function Api({
  children
}: Props): React.ReactElement<Props> | null {
  const [isReady, setIsReady] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect((): void => {
    const provider = new WsProvider(
      localStorage.destination ||
        "ws://ec2-3-87-10-167.compute-1.amazonaws.com:9944"
    );
    api = new ApiPromise({
      provider,
      types: {
        "types::AccountId": "u64",
        "types::Account": {
          cert: "Vec<u8>",
          id: "types::AccountId",
          nonce: "u64"
        },
        "types::Balance": "u64",
        "types::SignedData": {
          tbs: "Tx",
          signature: "types::Signature",
          id: "types::AccountId"
        },
        "types::Signature": "Vec<u8>",
        Tx: {
          _enum: {
            CreateAccount: "TxCreateAccount",
            Send: "TxSend",
            Mint: "TxMint",
            Other: null
          }
        },
        TxCreateAccount: {
          cert: "Vec<u8>",
          nonce: "uNonce"
        },
        TxSend: {
          to: "types::AccountId",
          amount: "types::Balance",
          nonce: "uNonce"
        },
        TxMint: {
          amount: "types::Balance",
          nonce: "uNonce"
        },
        uNonce: "u64"
      }
    });

    api.on("connected", (): void => setIsApiConnected(true));
    api.on("disconnected", (): void => setIsApiConnected(false));
    api.on("ready", (): void => {
      setIsReady(true);
    });
    setIsInitialized(true);
  }, []);
  if (!isInitialized) {
    return null;
  }
  return (
    <ApiContext.Provider value={{ api, isApiConnected, isReady }}>
      {children}
    </ApiContext.Provider>
  );
}
export function useApi(): ApiProps {
  return useContext(ApiContext);
}
