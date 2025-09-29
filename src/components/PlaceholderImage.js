import React from 'react';
import { Box, Typography } from '@mui/material';

const PlaceholderImage = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'grey.50',
      p: 2
    }}
  >
    <Box
      sx={{
        width: '60%',
        mb: 2,
        opacity: 0.6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box
        component="img"
        src="/placeholder-book.svg"
        alt="Book placeholder"
        sx={{
          width: '100%',
          height: 'auto',
          filter: 'grayscale(1)'
        }}
      />
      <Typography 
        variant="caption" 
        sx={{ 
          mt: 1,
          color: 'text.secondary',
          textAlign: 'center'
        }}
      >
        Image not available
      </Typography>
    </Box>
  </Box>
);

export default PlaceholderImage;