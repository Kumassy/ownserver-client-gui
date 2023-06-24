import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { FormProps } from '../types';

export const FormNotFound: React.FC<FormProps> = ({ handleBack, handleNext }) => {
  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: 1 },
        }}
      >
        <Typography sx={{ mt: 4, mb: 2 }} variant="h3" component="div">
          Not Yet Implemented
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          onClick={handleBack}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />

        <Button
          onClick={handleNext}
          disabled={true}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  )
}
