import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom'
const useStyles = makeStyles({
  input: {
    color: "white",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "4px",
    margin: "12px",
    borderRadius: "5px",
  },
  grow: {
    flexGrow: 1
  }
})
export default function Appbar() {
  const classes = useStyles()
  const history = useHistory()
  const [id, setId] = useState(0)
  const search = (e: any) => {
    e.preventDefault()
    history.push("/detail/" + id)
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" onClick={() => { history.push("/") }}>
          Mynachain
        </Typography>
        <div className={classes.grow} />
        <form onSubmit={search}>
          <InputBase className={classes.input} onChange={(e) => { setId(parseInt(e.target.value)) }} id="standard-basic" placeholder="アカウントID" />
        </form>
      </Toolbar>
    </AppBar>
  );
}
