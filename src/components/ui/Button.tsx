'use client';

import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MuiButton)<MuiButtonProps>(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 'bold',
  padding: '10px 24px',
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

export default function Button(props: MuiButtonProps) {
  return <StyledButton {...props} />;
}
