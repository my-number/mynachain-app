import React from 'react';
import { Box, Grommet } from 'grommet';

import Api from "./Api";
import Router from "./Router";

const theme = {
  global: {
    colors: {
      brand: '#228BE6',
    }
  },
};

const App = () => {
  return (
    <Grommet theme={theme}>
      <Api>
        <Router />
      </Api>
    </Grommet>
  );
}

export default App;
