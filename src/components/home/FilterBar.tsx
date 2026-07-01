"use client";

import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { PropertyFilters } from "@/types/property";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PaymentsIcon from '@mui/icons-material/Payments';
import { alpha } from '@mui/material/styles';

interface FilterBarProps {
  filters: PropertyFilters;
  onFilterChange: (key: keyof PropertyFilters, value: unknown) => void;
  onSearch: () => void;
}

function FilterField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: { xs: 1, md: 3 }, py: { xs: 1, md: 1 }, width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: 48,
        height: 48,
        borderRadius: '50%',
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        color: 'primary.main',
        flexShrink: 0
      }}>
        {icon}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5, fontSize: '0.85rem' }}>
          {label}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}

export default function FilterBar({ filters, onFilterChange, onSearch }: FilterBarProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: { xs: 4, md: 10 },
        p: { xs: 2, md: 1 },
        width: '100%',
        maxWidth: '900px',
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? '0 10px 40px rgba(15, 23, 42, 0.18)'
            : '0 10px 40px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 2, md: 0 },
        }}
      >
        <Box sx={{ flex: 1, width: '100%' }}>
          <FilterField icon={<HomeIcon fontSize="small" />} label="نوع العقار">
            <Select
              value={filters.type || ''}
              onChange={(e) => onFilterChange('type', e.target.value)}
              variant="standard"
              disableUnderline
              fullWidth
              displayEmpty
              sx={{ 
                fontSize: '0.95rem', 
                fontWeight: 600, 
                color: filters.type ? 'text.primary' : 'text.secondary'
              }}
            >
              <MenuItem value="">أي نوع</MenuItem>
              <MenuItem value="APARTMENT">شقة</MenuItem>
              <MenuItem value="COMMERCIAL">محل تجاري</MenuItem>
            </Select>
          </FilterField>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1, my: 1.5 }} />
        <Divider orientation="horizontal" flexItem sx={{ display: { xs: 'block', md: 'none' }, width: '100%', my: 0 }} />

        <Box sx={{ flex: 1, width: '100%' }}>
          <FilterField icon={<PaymentsIcon fontSize="small" />} label="نطاق السعر">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
              <InputBase
                type="number"
                placeholder="الأدنى"
                inputProps={{ min: 0 }}
                value={filters.minPrice ?? ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    onFilterChange('minPrice', undefined);
                    return;
                  }
                  const num = Math.max(0, Number(raw));
                  onFilterChange('minPrice', num);
                }}
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  width: '50%',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  '& input[type=number]': { MozAppearance: 'textfield' },
                  '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                }}
              />
              <Typography color="text.disabled" sx={{ fontWeight: 'bold' }}>-</Typography>
              <InputBase
                type="number"
                placeholder="الأقصى"
                inputProps={{ min: 0 }}
                value={filters.maxPrice ?? ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    onFilterChange('maxPrice', undefined);
                    return;
                  }
                  const num = Math.max(0, Number(raw));
                  onFilterChange('maxPrice', num);
                }}
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  width: '50%',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  '& input[type=number]': { MozAppearance: 'textfield' },
                  '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                }}
              />
            </Box>
          </FilterField>
        </Box>

        <Box sx={{ px: { xs: 0, md: 1 }, pt: { xs: 2, md: 0 }, width: { xs: '100%', md: 'auto' } }}>
          <Button
            onClick={onSearch}
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            sx={{
              width: { xs: '100%', md: 'auto' },
              height: { xs: '56px', md: '64px' },
              borderRadius: { xs: 3, md: 10 },
              px: { xs: 4, md: 5 },
              fontWeight: 700,
              fontSize: '1.05rem',
              boxShadow: (theme) => `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              '&:hover': {
                boxShadow: (theme) => `0 10px 25px ${alpha(theme.palette.primary.main, 0.5)}`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            بحث
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}