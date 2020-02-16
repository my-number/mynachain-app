import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';


export default function Appbar() {
  return (
      <AppBar position="static">
      <Toolbar>
      <Typography variant="h6">
      Mynachain
    </Typography>
      </Toolbar>
      </AppBar>
  );
}
