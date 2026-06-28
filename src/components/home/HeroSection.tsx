"use client";

import React from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import FilterBar from './FilterBar';
import { PropertyFilters } from "@/types/property";

interface HeroSectionProps {
  filters: PropertyFilters;
  onFilterChange: (key: keyof PropertyFilters, value: unknown) => void;
  onSearch: () => void;
}

export default function HeroSection({ filters, onFilterChange, onSearch }: HeroSectionProps) {
  return (
    <div
      className="relative w-full min-h-[600px] flex flex-col items-center justify-center bg-cover bg-center py-16"
      style={{ backgroundImage: 'url("/hero-section.jpg")' }}
    >
      {/* Gradient overlay tied to the theme's primary color (one direction,
          fading from primary to transparent). Adapts automatically between
          light/dark mode since it reads theme.palette.primary.main at render time. */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.55)} 0%, ${alpha(
            theme.palette.primary.dark,
            0.35
          )} 100%)`,
        })}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl px-4 text-center mt-12 gap-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md">
          تصفح المنازل، الشقق <br className="hidden md:block" /> والعقارات بكل سهولة
        </h1>

        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onSearch={onSearch}
        />
      </div>
    </div>
  );
}