import React, { useState, useEffect } from 'react';

import { Button } from '@material-ui/core';
import { useApi } from './Api';
import { useHistory } from 'react-router-dom'
export default function Home() {
  const { api } = useApi();
  const history = useHistory()

  return (
    <section>
      <h1>Mynachain</h1>
      <Button variant="contained" color="primary" onClick={() => history.push("/newaccount")}>Create an Account</Button>
      <Button variant="contained" color="primary" onClick={() => history.push("/mint")}>Mint</Button>
      <Button variant="contained" color="primary" onClick={() => history.push("/send")}>Send</Button>
    </section>
  )
}
