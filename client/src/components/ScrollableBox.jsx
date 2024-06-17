import styled from '@emotion/styled';
import { Box } from '@mui/material';
import React from 'react'

const ScrollableBox = styled(Box)({ // Example max height for scrollable content
    oveflowY:'scroll',
    overflowX:'hidden',
    '::-webkit-scrollbar': {
    width: '5px', // Adjust scrollbar width as needed
  },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: '#888', // Example scrollbar thumb color
    borderRadius: '5px', // Example scrollbar thumb border radius
  },// Enable vertical scrolling
  });

export default ScrollableBox