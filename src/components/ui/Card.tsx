'use client';

import React from 'react';
import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card';
import { styled } from '@mui/material/styles';

export interface CustomCardProps extends MuiCardProps {
  interactive?: boolean;
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'interactive',
})<CustomCardProps>(({ theme, interactive }) => ({
  borderRadius: 16,
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  ...(interactive && {
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: theme.shadows[6],
    },
  }),
}));

export default function Card({ interactive = false, ...props }: CustomCardProps) {
  return <StyledCard interactive={interactive} {...props} />;
}
