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
  children,
}: Props): React.ReactElement<Props> | null {
  const [isReady, setIsReady] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect((): void => {
    const provider = new WsProvider(
      localStorage.destination || "wss://mynachain.herokuapp.com"
    );
    api = new ApiPromise({
      provider,
      types: {
        "types::AccountId": "H256",
        "types::Account": {
          cert: "Vec<u8>",
          id: "types::AccountId",
          nonce: "u64",
          data: "Vec<u8>",
          created_at: "types::TermNumber",
        },
        "types::Balance": "i128",
        "types::TermNumber": "u32",
        "types::SignedData": {
          tbs: "Tx",
          signature: "types::Signature",
          id: "types::AccountId",
        },
        "types::Signature": "Vec<u8>",
        Tx: {
          _enum: {
            CreateAccount: "TxCreateAccount",
            Send: "TxSend",
            Mint: "TxMint",
            Vote: "TxVote",
            Write: "TxWrite",
            NextTerm: "TxNextTerm",
            Other: null,
          },
        },
        TxCreateAccount: {
          cert: "Vec<u8>",
          nonce: "Nonce",
        },
        TxSend: {
          to: "types::AccountId",
          amount: "types::Balance",
          nonce: "Nonce",
        },
        TxMint: {
          amount: "types::Balance",
          nonce: "Nonce",
        },
        TxVote: {
          amount: "types::Balance",
          nonce: "Nonce",
        },
        TxWrite: {
          data: "Vec<u8>",
          nonce: "Nonce",
        },
        TxNextTerm: {
          nonce: "Nonce",
        },
        Nonce: "u64",
      },
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
