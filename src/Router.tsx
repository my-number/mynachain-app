import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Home";
import NewAccount from "./NewAccount";
import Mint from "./Mint";
import Send from "./Send";
import Detail from "./Detail";
import Appbar from "./Appbar";
import { useApi } from "./Api";
import Loader from "./Loader";

export default function Router() {
  const { isReady } = useApi();
  //const isReady = true;

  return (
    <>
      {isReady && (
        <BrowserRouter>
          <Appbar />
          <Route path="/" exact component={Home} />
          <Route path="/newAccount" component={NewAccount} />
          <Route path="/mint" component={Mint} />
          <Route path="/send" component={Send} />
          <Route path="/detail/:id" component={Detail} />
        </BrowserRouter>
      )}
      {!isReady && <Loader />}
    </>
  );
}
