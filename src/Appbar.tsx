import React from 'react';
import { Box } from 'grommet';


export default function Appbar() {
  return (
    <Box
      tag='header'
      direction='row'
      align='center'
      justify='between'
      background='brand'
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
      elevation='medium'
      style={{ zIndex: 1 } as React.CSSProperties}
    >
      mynachain
      </Box>
  );
}
