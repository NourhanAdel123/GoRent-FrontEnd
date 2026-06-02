'use client';

import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#222',
    transition: 'all 0.2s ease-in-out',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderWidth: '2px',
    },
  },
}));

export default function Input(props: TextFieldProps) {
  return <StyledTextField variant="outlined" fullWidth {...props} />;
}
