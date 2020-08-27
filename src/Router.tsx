import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import NewAccount from "./NewAccount";
import Mint from "./Mint";
import Send from "./Send";
import Vote from "./Vote";
import Detail from "./Detail";
import NextTerm from "./NextTerm";
import Settings from "./Settings";
import Appbar from "./Appbar";
import { useApi } from "./Api";
import Loader from "./Loader";

export default function Router() {
  const { isReady } = useApi();
  //const isReady = true;

  function ReadyRoute({ children, component, ...rest }: any) {
    return <Route component={isReady ? component : Loader} {...rest} />;
  }

  return (
    <>
      <BrowserRouter>
        <Appbar />
        <Switch>
          <ReadyRoute path="/" exact component={Home} />
          <ReadyRoute path="/newAccount" component={NewAccount} />
          <ReadyRoute path="/mint" component={Mint} />
          <ReadyRoute path="/send" component={Send} />
          <ReadyRoute path="/vote" component={Vote} />
          <ReadyRoute path="/next-term" component={NextTerm} />
          <ReadyRoute path="/detail/:id" component={Detail} />
          <Route path="/settings" component={Settings} />
        </Switch>
      </BrowserRouter>
    </>
  );
}
