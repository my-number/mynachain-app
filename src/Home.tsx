import React, { useState, useEffect } from "react";

import { List, ListItem, ListSubheader, Container } from "@material-ui/core";
import { useHistory } from "react-router-dom";

export default function Home() {
  const history = useHistory();
  return (
    <Container>
      <h1>Levia</h1>

      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            What will you do next?
          </ListSubheader>
        }
      >
        <ListItem button onClick={() => history.push("/newaccount")}>
          新しいアカウントを作成
        </ListItem>
        <ListItem button onClick={() => history.push("/mint")}>
          残高を発行
        </ListItem>
        <ListItem button onClick={() => history.push("/Send")}>
          送金
        </ListItem>
        <ListItem button onClick={() => history.push("/vote")}>
          投票
        </ListItem>
      </List>
    </Container>
  );
}
