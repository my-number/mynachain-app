import React, { useState } from "react";
import { AppBar, Toolbar, Typography, InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
const useStyles = makeStyles({
  form: {
    backgroundColor: "rgba(255,255,255,0.1)",
    margin: "12px",
    borderRadius: "5px",
    position: "relative",
    display: "flex"
  },
  input: {
    color: "white",
    marginLeft: "40px"
  },
  icon: {
    pointerEvents: "none",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    marginLeft: "10px"
  },
  grow: {
    flexGrow: 1
  }
});
export default function Appbar() {
  const classes = useStyles();
  const history = useHistory();
  const [id, setId] = useState(0);
  const search = (e: any) => {
    e.preventDefault();
    history.push("/detail/" + id);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          onClick={() => {
            history.push("/");
          }}
        >
          マイナチェーン
        </Typography>
        <div className={classes.grow} />
        <form onSubmit={search} className={classes.form}>
          <div className={classes.icon}>
            <SearchIcon />
          </div>
          <InputBase
            className={classes.input}
            onChange={e => {
              setId(parseInt(e.target.value));
            }}
            id="standard-basic"
            placeholder="アカウントIDで検索"
          />
        </form>
      </Toolbar>
    </AppBar>
  );
}
