import { Box, Grid } from '@mui/material';
import React from 'react';

// TODO なにこれ？
const JapaneseMonitor: React.FC<{ japanese: string }> = ({ japanese }) => {
  return (
    <Box fontSize={12} px={2} fontFamily='"M PLUS Rounded 1c"' color='#555'>
      <Grid container direction='column' spacing={1}>
        {japanese.split('\n').map((j, index) => (
          <Grid item key={index}>
            {`${index}: ${j}`}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default JapaneseMonitor;
