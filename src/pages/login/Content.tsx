import * as React from 'react';
import { Typography, Box } from '@mui/material';

const Content: React.FC = () => (
  <Box sx={{ maxWidth: 400, mx: 'auto' }}>
    <Typography variant="h5" gutterBottom>
      Welcome to Our Platform
    </Typography>
    <Typography variant="body1">
      Collaborate, commit, and track your progress with ease. Sign in with GitHub to get started.
    </Typography>
  </Box>
);

export default Content;
