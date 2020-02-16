import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Home";
import NewAccount from "./NewAccount"
import Appbar from './Appbar'
import { useApi } from "./Api";
import Loader from "./Loader";

export default function Router() {
  const { isReady } = useApi();

  return (
    <>
      {isReady && (
        <BrowserRouter>
          <Appbar />
          <Route path="/" exact component={Home} />
          <Route path="/newAccount" component={NewAccount} />
        </BrowserRouter>
      )}
      {!isReady && <Loader />}
    </>
  );
}
