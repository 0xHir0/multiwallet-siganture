import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import '../scss/loading.scss'
export function Loading() {
  return (
    <Box  >
      <CircularProgress/>Loading...
    </Box>
  );
}