import React, { useState, useEffect } from "react";

import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListSubheader,
  Container,
} from "@material-ui/core";
import CardIcon from "@material-ui/icons/CreditCard";
import { useApi } from "./Api";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getReaders, Reader, currentCard } from "./rpc";

export default function Home() {
  const { api } = useApi();
  const history = useHistory();
  const { addToast } = useToasts();
  const [readers, setReaders] = useState<Reader[]>([]);
  const openReader = async (r: Reader) => {
    try {
      const card = await r.open();
      currentCard.fd = card.fd;
      addToast(
        `Successfully opened reader ${r.name} as descriptor ${card.fd}!`,
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
    } catch (e) {
      addToast(`Opening reader failed: ${e.toString()}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  const getCardStatus = async () => {
    try {
      const result = await currentCard.getStatus();
      console.log(result);
      addToast(`Please see console`, {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (e) {
      addToast(`Error occured: ${e.toString()}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  useEffect(() => {
    getReaders().then(
      (r) => {
        setReaders(r);
      },
      (e) => {
        addToast(`Daemon is not started.`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    );
  }, []);
  return (
    <Container>
      <h1>Levia</h1>
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            利用可能なカードリーダー
          </ListSubheader>
        }
      >
        {readers.map((r) => (
          <ListItem
            button
            key={r.name}
            onClick={() => {
              openReader(r);
            }}
          >
            <ListItemIcon>
              <CardIcon />
            </ListItemIcon>
            <ListItemText primary={r.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
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
      </List>
      <Divider />
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Explore / Inspect
          </ListSubheader>
        }
      >
        <ListItem button>Under Construction</ListItem>
      </List>
      <Divider />
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            デバッグ
          </ListSubheader>
        }
      >
        <ListItem button onClick={() => getCardStatus()}>
          カードステータスを取得
        </ListItem>
      </List>
    </Container>
  );
}
